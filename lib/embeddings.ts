// lib/embeddings.ts
// Simple text chunker — no external API needed
// Full-text search is handled by Supabase PostgreSQL built-in

/**
 * Chunk a large text into overlapping segments for better retrieval.
 * chunkSize: max chars per chunk
 * overlap:   chars shared between consecutive chunks
 */
export function chunkText(text: string, chunkSize = 600, overlap = 100): string[] {
  // First try to split on natural paragraph/sentence boundaries
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 30);

  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    if ((current + '\n' + para).length <= chunkSize) {
      current = current ? current + '\n' + para : para;
    } else {
      if (current) chunks.push(current.trim());
      // If single paragraph is too long, split by characters with overlap
      if (para.length > chunkSize) {
        let start = 0;
        while (start < para.length) {
          const end = Math.min(start + chunkSize, para.length);
          chunks.push(para.slice(start, end).trim());
          start += chunkSize - overlap;
        }
        current = '';
      } else {
        current = para;
      }
    }
  }

  if (current) chunks.push(current.trim());

  return chunks.filter(c => c.length > 30);
}
