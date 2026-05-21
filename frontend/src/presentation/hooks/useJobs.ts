import { useState, useEffect } from "react";
import { Job } from "../../domain/entities/Job";
import { ApiJobRepository } from "../../data/repositories/ApiJobRepository";
import { GetJobsUseCase } from "../../domain/usecases/GetJobsUseCase";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobRepository = new ApiJobRepository();
      const usecase = new GetJobsUseCase(jobRepository);
      const result = await usecase.execute();
      setJobs(result.items);
    } catch (err: any) {
      console.error("Failed to load jobs in hook:", err);
      setError(err.message || "Erro ao carregar vagas. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
    refetch: fetchJobs,
  };
}
