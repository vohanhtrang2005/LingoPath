import { useCallback, useEffect, useState } from 'react';
import { contentApi } from '../utils/contentApi';
import type { DocumentChunk } from '../types/chunk';

type Notice = {tone: 'success' | 'error';text: string;} | null;

export function useDocumentChunks(documentId: string) {
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [busyChunkId, setBusyChunkId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await contentApi.getDocumentChunks(documentId);
      setChunks(Array.isArray(result) ? result : []);
    } catch {
      setChunks([]);
      setError('Could not load chunks.');
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    void load();
  }, [load]);

  const generate = useCallback(async () => {
    setGenerating(true);
    setNotice(null);
    try {
      await contentApi.generateChunkPlan(documentId);
      await load();
      setNotice({ tone: 'success', text: 'Chunk plan generated successfully.' });
    } catch {
      setNotice({ tone: 'error', text: 'Could not generate the chunk plan.' });
    } finally {
      setGenerating(false);
    }
  }, [documentId, load]);

  const review = useCallback(
    async (chunkId: string, decision: 'approve' | 'reject') => {
      setBusyChunkId(chunkId);
      setNotice(null);
      try {
        const updated =
        decision === 'approve' ?
        await contentApi.approveChunk(documentId, chunkId) :
        await contentApi.rejectChunk(documentId, chunkId);

        setChunks((prev) =>
        prev.map((chunk) =>
        chunk.id === chunkId ?
        {
          ...chunk,
          ...updated,
          status: updated?.status ?? (decision === 'approve' ? 'APPROVED' : 'REJECTED')
        } :
        chunk
        )
        );
        setNotice({
          tone: 'success',
          text: decision === 'approve' ? 'Chunk approved successfully.' : 'Chunk rejected successfully.'
        });
      } catch {
        setNotice({
          tone: 'error',
          text:
          decision === 'approve' ?
          'Could not approve this chunk.' :
          'Could not reject this chunk.'
        });
      } finally {
        setBusyChunkId(null);
      }
    },
    [documentId]
  );

  return {
    chunks,
    loading,
    error,
    generating,
    busyChunkId,
    notice,
    setNotice,
    reload: load,
    generate,
    review
  };
}