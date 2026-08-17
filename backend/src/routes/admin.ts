import { Hono } from 'hono';
import { Bindings } from '../types/env';

const admin = new Hono<{ Bindings: Bindings }>();

// POST /api/admin/ingest
// Receives an array of chunks (strings) and ingests them into Vectorize
admin.post('/ingest', async (c) => {
  const { chunks, clearIndex = true } = await c.req.json();

  if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
    return c.json({ error: 'Missing or empty chunks array' }, 400);
  }

  // Unfortunately, Vectorize doesn't have an easy "clear all" via the API in one call without deleting the index.
  // But we can just insert over it. If we want to ensure clean state, doing it via wrangler is best, 
  // but here we just insert the chunks.
  
  let inserted = 0;
  
  // Cloudflare AI run accepts an array of texts for embedding
  // But there are limits to how many can be embedded at once. We'll process in batches of 20.
  const BATCH_SIZE = 20;
  
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batchTexts = chunks.slice(i, i + BATCH_SIZE);
    
    // Generate embeddings
    const aiResponse = await c.env.AI.run('@cf/baai/bge-m3', { text: batchTexts });
    const embeddings = aiResponse.data; // Array of arrays of numbers
    
    // Prepare Vectorize vectors
    const vectors = batchTexts.map((text, idx) => ({
      id: `rag_chunk_${Date.now()}_${i + idx}`,
      values: embeddings[idx],
      metadata: { content: text }
    }));
    
    // Insert into Vectorize
    const vecRes = await c.env.VECTORIZE.insert(vectors);
    inserted += vecRes.count || vectors.length;
  }

  return c.json({ success: true, message: `Successfully embedded and inserted ${inserted} chunks into atmik-index-v2.` });
});

export default admin;
