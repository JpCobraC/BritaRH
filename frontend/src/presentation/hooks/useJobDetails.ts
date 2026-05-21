import { useState, useEffect, useCallback } from "react";
import { Job } from "../../domain/entities/Job";
import { ApiJobRepository } from "../../data/repositories/ApiJobRepository";
import { GetJobDetailsUseCase } from "../../domain/usecases/GetJobDetailsUseCase";

export function useJobDetails(jobId: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobDetails = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const jobRepository = new ApiJobRepository();
      const usecase = new GetJobDetailsUseCase(jobRepository);
      const result = await usecase.execute(jobId);
      setJob(result);
    } catch (err: any) {
      console.error(`Failed to load job details for ${jobId}:`, err);
      setError(err.message || "Erro ao carregar detalhes da vaga.");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  return {
    job,
    loading,
    error,
    refetch: fetchJobDetails,
  };
}
