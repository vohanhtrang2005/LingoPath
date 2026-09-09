import { useCallback, useEffect, useRef, useState } from "react";
import { contentApi } from "../../../api/contentApi";
import type {
  ChunkGenerationJob,
  SourceChunk
} from "../../../types/content";

type Notice = { tone: "success" | "error"; text: string } | null;

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

const POLL_INTERVAL_MS = 5000;

export function useDocumentChunks(documentId: string) {
  const [chunks, setChunks] = useState<SourceChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<ChunkGenerationJob | null>(null);
  const [generating, setGenerating] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const pollingJobId = useRef<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contentApi.getDocumentChunks(documentId);
      setChunks(Array.isArray(response.data) ? response.data : []);
    } catch {
      setChunks([]);
      setError("Could not load chunks.");
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const jobId = job?.jobId;
    if (!jobId) {
      pollingJobId.current = null;
      return;
    }

    pollingJobId.current = jobId;
    let cancelled = false;
    let timer: number | undefined;

    const poll = async () => {
      try {
        const response = await contentApi.getChunkGenerationJob(jobId);
        const nextJob = response.data;
        if (cancelled || pollingJobId.current !== jobId) return;
        setJob(nextJob);

        if (nextJob.status === "SUCCEEDED") {
          await load();
          if (!cancelled && pollingJobId.current === jobId) {
            pollingJobId.current = null;
            setGenerating(false);
            setNotice({ tone: "success", text: "Chunk plan generated successfully." });
          }
        } else if (nextJob.status === "FAILED") {
          pollingJobId.current = null;
          setGenerating(false);
          setNotice({
            tone: "error",
            text: nextJob.errorMessage || "Chunk generation failed."
          });
        } else {
          timer = window.setTimeout(() => void poll(), POLL_INTERVAL_MS);
        }
      } catch {
        if (!cancelled) {
          pollingJobId.current = null;
          setGenerating(false);
          setNotice({ tone: "error", text: "Could not check chunk generation status." });
        }
      }
    };

    void poll();

    return () => {
      cancelled = true;
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
      if (pollingJobId.current === jobId) {
        pollingJobId.current = null;
      }
    };
  }, [job?.jobId, job?.status, load]);

  const generate = useCallback(async (feedback?: string) => {
    if (generating) return;
    const normalizedFeedback = typeof feedback === "string" ? feedback.trim() : undefined;
    setGenerating(true);
    setNotice(null);
    try {
      const response = job?.status === "FAILED" && !normalizedFeedback
        ? await contentApi.retryChunkGenerationJob(job.jobId)
        : await contentApi.createChunkGenerationJob(documentId, normalizedFeedback);
      setJob(response.data);
    } catch (error) {
      setGenerating(false);
      setNotice({
        tone: "error",
        text: errorMessage(error, "Could not start chunk generation.")
      });
    }
  }, [documentId, generating, job]);

  const approvePlan = useCallback(async () => {
    setReviewing(true);
    setNotice(null);
    try {
      const response = await contentApi.approveChunkPlan(documentId);
      setChunks(response.data);
      setNotice({ tone: "success", text: "The complete chunk plan was approved." });
    } catch (error) {
      setNotice({
        tone: "error",
        text: errorMessage(error, "Could not approve the chunk plan.")
      });
    } finally {
      setReviewing(false);
    }
  }, [documentId]);

  const rejectAndRegenerate = useCallback(
    async (reason: string) => {
      setReviewing(true);
      setNotice(null);
      try {
        const rejected = await contentApi.rejectChunkPlan(documentId, reason);
        setChunks(rejected.data);
        setReviewing(false);
        await generate(reason);
      } catch (error) {
        setReviewing(false);
        setNotice({
          tone: "error",
          text: errorMessage(error, "Could not reject and regenerate the chunk plan.")
        });
      }
    },
    [documentId, generate]
  );

  return {
    chunks,
    loading,
    error,
    job,
    generating,
    reviewing,
    notice,
    setNotice,
    reload: load,
    generate,
    approvePlan,
    rejectAndRegenerate
  };
}
