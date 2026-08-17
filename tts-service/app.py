from fastapi import FastAPI, Response
from pydantic import BaseModel
import wave
import io
import os
from piper.voice import PiperVoice

app = FastAPI()

# Models directory (relative for local testing)
EN_MODEL_PATH = "models/en_US-lessac-medium.onnx"
HI_MODEL_PATH = "models/hi_IN-priyamvada-medium.onnx"

print("Loading Piper Models...")
en_voice = PiperVoice.load(EN_MODEL_PATH) if os.path.exists(EN_MODEL_PATH) else None
hi_voice = PiperVoice.load(HI_MODEL_PATH) if os.path.exists(HI_MODEL_PATH) else None
print("Models loaded successfully!")

class TTSRequest(BaseModel):
    inputs: str
    language: str = "hi"
    emotion: str = "neutral"

@app.post("/speech/v1/tts")
def tts(req: TTSRequest):
    # Select voice based on language
    voice = hi_voice if req.language == "hi" else en_voice
    
    if not voice:
        return {"error": f"Voice for language '{req.language}' not loaded."}, 500

    # Piper doesn't natively support dynamic pitch/speed at synthesis time in the simple API, 
    # but the ONNX model is highly optimized for natural speech.
    
    wav_io = io.BytesIO()
    
    # Synthesize speech to WAV format
    with wave.open(wav_io, "wb") as wav_file:
        voice.synthesize(req.inputs, wav_file)
        
    # Return audio bytes
    return Response(content=wav_io.getvalue(), media_type="audio/wav")

@app.get("/health")
def health():
    return {"status": "ok", "en_loaded": en_voice is not None, "hi_loaded": hi_voice is not None}
