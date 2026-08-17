const fs = require('fs');
const path = require('path');

const RAG_FILE = path.join(__dirname, '../../rag.md');
const API_URL = 'https://atmik-ai-backend.swatantra-backend.workers.dev/api/admin/ingest';

async function ingest() {
  console.log('Reading rag.md...');
  const content = fs.readFileSync(RAG_FILE, 'utf-8');

  // Intelligent Chunking
  // Split by Sections and Principles to keep context whole
  // But also split by large paragraphs if a section is too long
  console.log('Chunking document...');
  
  const rawChunks = content.split(/\n(?=### |## |> |\*\*\w+\*\*)/);
  const finalChunks = [];
  
  let currentChunk = "";
  
  for (const part of rawChunks) {
    if ((currentChunk.length + part.length) > 1000) {
      if (currentChunk.trim()) {
        finalChunks.push(currentChunk.trim());
      }
      currentChunk = part;
    } else {
      currentChunk += "\n" + part;
    }
  }
  
  if (currentChunk.trim()) {
    finalChunks.push(currentChunk.trim());
  }

  console.log(`Created ${finalChunks.length} logical chunks.`);
  console.log('Sample chunk:', finalChunks[0].substring(0, 100) + '...');
  
  console.log('Sending to ingestion endpoint...');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chunks: finalChunks })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Ingestion Success:', data.message);
    } else {
      console.error('❌ Ingestion Error:', data);
    }
  } catch (error) {
    console.error('❌ Fetch failed:', error);
  }
}

ingest();
