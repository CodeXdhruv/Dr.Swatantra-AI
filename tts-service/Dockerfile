FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required by piper and python audio libraries
RUN apt-get update && apt-get install -y wget curl

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create models directory and download Piper models
RUN mkdir -p models

# Download English Model
RUN wget -qO models/en_US-lessac-medium.onnx https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/lessac/medium/en_US-lessac-medium.onnx && \
    wget -qO models/en_US-lessac-medium.onnx.json https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json

# Download Hindi Model (Priyamvada - Female)
RUN wget -qO models/hi_IN-priyamvada-medium.onnx https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/hi/hi_IN/priyamvada/medium/hi_IN-priyamvada-medium.onnx && \
    wget -qO models/hi_IN-priyamvada-medium.onnx.json https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/hi/hi_IN/priyamvada/medium/hi_IN-priyamvada-medium.onnx.json

# Copy application code
COPY app.py .

# Expose port
EXPOSE 8000

# Start FastAPI application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
