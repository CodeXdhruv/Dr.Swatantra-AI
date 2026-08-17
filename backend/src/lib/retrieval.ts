import { Bindings } from '../types/env';

export async function retrieveContext(env: Bindings, query: string, lang: string = 'en'): Promise<string> {
  // 1. Embed query using @cf/baai/bge-m3
  const aiResponse = await env.AI.run('@cf/baai/bge-m3', { text: [query] });
  const embeddedQuery = aiResponse.data[0];

  // 2. Query atmik-index-v2 (topK: 8)
  const vectorResults = await env.VECTORIZE.query(embeddedQuery, { topK: 8, returnMetadata: true });
  
  if (vectorResults.matches.length === 0) {
    return "No relevant context found.";
  }

  const rawMatches = vectorResults.matches.map(m => m.metadata?.content as string).filter(Boolean);

  // 3. Rerank results against `query` using @cf/baai/bge-reranker-base, keep top 3-4
  try {
    const rerankResponse = await env.AI.run('@cf/baai/bge-reranker-base', {
      query,
      documents: rawMatches
    });
    
    // Cloudflare reranker response format usually includes scores sorted.
    // Assuming sorted array of objects with `text` or `document` and `score`.
    const sortedDocs = rerankResponse.sort((a: any, b: any) => b.score - a.score);
    const topMatches = sortedDocs.slice(0, 4).map((d: any) => rawMatches[d.index] || d.text);
    
    return topMatches.join('\n\n');
  } catch (error) {
    console.error("Reranking failed, returning raw matches", error);
    // Fallback to top 4 raw matches
    return rawMatches.slice(0, 4).join('\n\n');
  }
}
