import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE_URL } from '../api/client';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

interface VoiceMessage {
  type: 'transcription' | 'text_stream' | 'tts_audio' | 'generation_done' | 'error';
  text?: string;
  audioBase64?: string;
  index?: number;
  message?: string;
}

export function useVoiceChat(userId: string, lang: string = 'hi') {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiText, setAiText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundQueueRef = useRef<Audio.Sound[]>([]);
  const isPlayingRef = useRef(false);

  // Initialize WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const wsUrl = API_BASE_URL.replace('http', 'ws') + '/voice-chat';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data) as VoiceMessage;
        
        switch (data.type) {
          case 'transcription':
            setTranscription(data.text || '');
            setAiText(''); // Clear previous AI text
            break;
          case 'text_stream':
            setAiText((prev) => prev + data.text);
            break;
          case 'tts_audio':
            if (data.audioBase64) {
              await queueAudioPlayback(data.audioBase64);
            }
            break;
          case 'generation_done':
            // Generation finished
            break;
          case 'error':
            setError(data.message || 'Unknown server error');
            break;
        }
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Auto reconnect could be implemented here
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
      setError("Connection lost");
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
      stopAllAudio();
    };
  }, [connectWebSocket]);

  const queueAudioPlayback = async (base64Audio: string) => {
    try {
      const uri = FileSystem.cacheDirectory + `temp_audio_${Date.now()}.wav`;
      await FileSystem.writeAsStringAsync(uri, base64Audio, { encoding: FileSystem.EncodingType.Base64 });
      
      const { sound } = await Audio.Sound.createAsync({ uri });
      soundQueueRef.current.push(sound);
      
      playNextAudio();
    } catch (err) {
      console.error("Failed to queue audio", err);
    }
  };

  const playNextAudio = async () => {
    if (isPlayingRef.current || soundQueueRef.current.length === 0) return;
    
    isPlayingRef.current = true;
    const sound = soundQueueRef.current.shift();
    
    if (sound) {
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
          isPlayingRef.current = false;
          playNextAudio();
        }
      });
      await sound.playAsync();
    }
  };

  const stopAllAudio = async () => {
    for (const sound of soundQueueRef.current) {
      await sound.unloadAsync();
    }
    soundQueueRef.current = [];
    isPlayingRef.current = false;
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      stopAllAudio(); // Stop AI if speaking
    } catch (err) {
      console.error('Failed to start recording', err);
      setError('Recording failed');
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;
    
    setIsRecording(false);
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      
      if (uri && wsRef.current?.readyState === WebSocket.OPEN) {
        // Read file as base64
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        
        wsRef.current.send(JSON.stringify({
          type: 'audio_chunk',
          userId,
          lang,
          audioBase64: base64
        }));
      }
      recordingRef.current = null;
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  return {
    isConnected,
    isRecording,
    transcription,
    aiText,
    error,
    startRecording,
    stopRecording,
    reconnect: connectWebSocket
  };
}
