import { Hono } from 'hono';
import { upgradeWebSocket } from 'hono/cloudflare-workers';
import { Bindings } from '../types/env';
import { retrieveContext } from '../lib/retrieval';
import { getSystemPrompt } from '../lib/prompts';
import { synthesize } from '../lib/tts';

const voice = new Hono<{ Bindings: Bindings }>();

// GET /api/voice-chat
// WebSocket endpoint for real-time voice streaming
voice.get('/', upgradeWebSocket((c) => {
  return {
    onMessage: async (event, ws) => {
      try {
        const data = JSON.parse(event.data as string);
        
        // Client sends full audio chunk after local VAD detection
        if (data.type === 'audio_chunk' && data.audioBase64) {
          const { userId, lang = 'hi' } = data;
          
          // Decode Base64 audio to Uint8Array for Whisper
          const audioBuffer = Uint8Array.from(atob(data.audioBase64), c => c.charCodeAt(0));

          // 1. STT: Transcribe audio using Whisper
          const whisperResponse = await c.env.AI.run('@cf/openai/whisper-large-v3-turbo', {
            audio: [...audioBuffer]
          });
          const transcribedText = whisperResponse.text;

          // Send transcription back to UI for display
          ws.send(JSON.stringify({ type: 'transcription', text: transcribedText }));

          // 2. Fetch Summary & Retrieve Context
          const { results } = await c.env.DB.prepare('SELECT currentSummary FROM ChatSession WHERE userId = ?').bind(userId).all();
          const currentSummary = (results[0] as any)?.currentSummary || "No previous context.";
          
          const context = await retrieveContext(c.env, transcribedText, lang);
          const systemPrompt = getSystemPrompt(context, currentSummary, lang);

          // 3. Stream LLM (Llama 3.1)
          const aiStream: any = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: transcribedText }
            ],
            stream: true
          });

          let currentSentence = "";
          let fullResponse = "";
          let chunkIndex = 0;

          // 4. Sentence Buffering & TTS Streaming
          for await (const chunk of aiStream) {
            if (chunk.response) {
              const textChunk = chunk.response;
              currentSentence += textChunk;
              fullResponse += textChunk;

              // Send live text to client
              ws.send(JSON.stringify({ type: 'text_stream', text: textChunk }));

              // Check for sentence boundaries
              if (/[.?!]\s/.test(currentSentence) || /[.?!]$/.test(currentSentence) || /\n/.test(currentSentence)) {
                let sentenceToSpeak = currentSentence.trim();
                currentSentence = ""; 

                // Extract emotion tag if present in this sentence
                let emotionTag = 'neutral';
                const emotionMatch = sentenceToSpeak.match(/\[emotion:\s*(.*?)\]/i);
                if (emotionMatch) {
                  emotionTag = emotionMatch[1];
                  sentenceToSpeak = sentenceToSpeak.replace(emotionMatch[0], '').trim();
                }

                if (sentenceToSpeak.length > 2) {
                  // Fire TTS asynchronously, but wait for result to send in order
                  const audioBase64 = await synthesize(c.env, sentenceToSpeak, emotionTag, lang);
                  if (audioBase64) {
                    ws.send(JSON.stringify({ 
                      type: 'tts_audio', 
                      index: chunkIndex++, 
                      audioBase64 
                    }));
                  }
                }
              }
            }
          }

          // Process leftover text
          if (currentSentence.trim().length > 2) {
            let sentenceToSpeak = currentSentence.trim();
            let emotionTag = 'neutral';
            const emotionMatch = sentenceToSpeak.match(/\[emotion:\s*(.*?)\]/i);
            if (emotionMatch) {
              emotionTag = emotionMatch[1];
              sentenceToSpeak = sentenceToSpeak.replace(emotionMatch[0], '').trim();
            }

            const audioBase64 = await synthesize(c.env, sentenceToSpeak, emotionTag, lang);
            if (audioBase64) {
              ws.send(JSON.stringify({ type: 'tts_audio', index: chunkIndex++, audioBase64 }));
            }
          }

          ws.send(JSON.stringify({ type: 'generation_done' }));

          // 5. Background Summary Update
          c.executionCtx.waitUntil((async () => {
            try {
              const summaryResponse: any = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
                messages: [
                  { role: "system", content: "Summarize the ongoing conversation in two short sentences." },
                  { role: "user", content: `Old Summary: ${currentSummary}\nUser said: ${transcribedText}\nAI replied: ${fullResponse}\nNew Summary:` }
                ]
              });
              const newSummary = summaryResponse.response;
              await c.env.DB.prepare('INSERT INTO ChatSession (id, userId, currentSummary, updatedAt) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET currentSummary = excluded.currentSummary, updatedAt = excluded.updatedAt')
                .bind(userId, userId, newSummary, new Date().toISOString())
                .run();
            } catch (err) {
              console.error("Summary update failed:", err);
            }
          })());
        }
      } catch (e: any) {
        console.error("WebSocket Error:", e);
        ws.send(JSON.stringify({ type: 'error', message: e.message }));
      }
    },
    onClose: () => {
      console.log('WebSocket closed');
    }
  }
}));

export default voice;
