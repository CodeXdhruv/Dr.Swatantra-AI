import { Bindings } from '../types/env';
import { Buffer } from 'node:buffer';

export async function synthesize(env: Bindings, text: string, emotionTag: string = 'neutral', lang: string = 'en'): Promise<string | null> {
  try {
    if (!env.TTS_ENDPOINT) {
      console.warn("TTS_ENDPOINT not configured");
      return null;
    }

    // Assuming a generic JSON POST API like Sarvam/Parler
    const ttsResponse = await fetch(env.TTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${env.TTS_API_KEY}` if needed
      },
      body: JSON.stringify({
        inputs: text,
        language: lang,
        emotion: emotionTag.replace('[emotion: ', '').replace(']', '').trim()
      })
    });

    if (ttsResponse.ok) {
      const audioBuffer = await ttsResponse.arrayBuffer();
      return Buffer.from(audioBuffer).toString('base64');
    } else {
      console.error("TTS Error:", await ttsResponse.text());
      return null;
    }
  } catch (err) {
    console.error("TTS Exception:", err);
    return null;
  }
}
