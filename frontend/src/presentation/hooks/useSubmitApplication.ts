import { useState } from "react";
import { ApiApplicationRepository } from "../../data/repositories/ApiApplicationRepository";
import { SubmitApplicationUseCase } from "../../domain/usecases/SubmitApplicationUseCase";

export function useSubmitApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (
    jobId: string,
    candidateEmail: string,
    profileData: {
      fullName: string;
      email: string;
      phone: string;
      linkedinUrl?: string;
      portfolioUrl?: string;
      summary?: string;
    },
    score: number,
    file: File,
    message?: string
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const applicationRepository = new ApiApplicationRepository();
      const usecase = new SubmitApplicationUseCase(applicationRepository);
      const result = await usecase.execute(
        jobId,
        candidateEmail,
        profileData,
        score,
        file,
        message
      );
      setSuccess(true);
      return result;
    } catch (err: any) {
      console.error("Failed to submit candidacy in hook:", err);
      setError(err.message || "Erro ao enviar candidatura.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submit,
    loading,
    error,
    success,
  };
}
