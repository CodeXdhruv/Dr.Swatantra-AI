import { Hono } from 'hono';
import { Bindings } from '../types/env';

const migrate = new Hono<{ Bindings: Bindings }>();

// Simple markdown chunker by headings
function chunkMarkdown(text: string): string[] {
  const chunks: string[] = [];
  const lines = text.split('\n');
  let currentChunk = '';
  
  for (const line of lines) {
    if (line.startsWith('#') || line.startsWith('---')) {
      if (currentChunk.trim().length > 100) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = line + '\n';
    } else {
      currentChunk += line + '\n';
    }
  }
  if (currentChunk.trim().length > 100) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

// POST /api/migrate/vectorize
migrate.post('/vectorize', async (c) => {
  try {
    const body = await c.req.text();
    if (!body) {
      return c.json({ error: 'No body provided' }, 400);
    }

    const chunks = chunkMarkdown(body);
    let insertedCount = 0;

    // Process in batches of 5 to avoid CF limits
    for (let i = 0; i < chunks.length; i += 5) {
      const batch = chunks.slice(i, i + 5);
      
      const aiResponse = await c.env.AI.run('@cf/baai/bge-m3', { text: batch });
      
      const vectors = batch.map((chunkText, idx) => ({
        id: crypto.randomUUID(),
        values: aiResponse.data[idx],
        metadata: { content: chunkText }
      }));

      await c.env.VECTORIZE.insert(vectors);
      insertedCount += vectors.length;
    }

    return c.json({ 
      success: true, 
      message: 'Migration complete',
      chunksProcessed: chunks.length,
      insertedCount
    });

  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default migrate;
