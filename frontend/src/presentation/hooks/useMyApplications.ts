import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ApiApplicationRepository } from "../../data/repositories/ApiApplicationRepository";
import { Application } from "../../domain/entities/Application";

export function useMyApplications() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    if (status !== "authenticated" || !session?.accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const repository = new ApiApplicationRepository();
      const list = await repository.listMyApplications(session.accessToken as string);
      setApplications(list);
    } catch (err: any) {
      console.error("Error loading my applications:", err);
      setError(err.message || "Erro ao carregar candidaturas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [status, session?.accessToken]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
  };
}
