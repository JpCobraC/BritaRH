import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface MyApplication {
  id: string;
  jobId: string;
  candidateEmail: string;
  score: number;
  createdAt: string;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
  // Remove trailing /api/v1 se houver (o .env.local já inclui)
  .replace(/\/api\/v1\/?$/, "");

export function useMyApplications() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ainda aguardando session
    if (status === "loading") return;

    // Não autenticado — lista vazia, sem spinner
    if (status !== "authenticated" || !session?.accessToken) {
      setApplications([]);
      setLoading(false);
      return;
    }

    const token = session.accessToken as string;
    const url = `${API_BASE}/api/v1/applications/my`;

    console.log("[useMyApplications] GET", url);

    setLoading(true);
    setError(null);

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        console.log("[useMyApplications] response status:", res.status);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json() as Promise<any[]>;
      })
      .then((list) => {
        console.log("[useMyApplications] applications from DB:", list);
        const mapped: MyApplication[] = list.map((d) => ({
          id: d.id,
          jobId: d.job_id,
          candidateEmail: d.candidate_email,
          score: d.score ?? 0,
          createdAt: d.created_at,
        }));
        setApplications(mapped);
      })
      .catch((err) => {
        console.error("[useMyApplications] fetch error:", err);
        setError(err.message);
        setApplications([]);
      })
      .finally(() => setLoading(false));
  }, [status, session?.accessToken]);

  // Retorna também os IDs das vagas para facilitar o check nas páginas
  const appliedJobIds = applications.map((a) => a.jobId);

  return { applications, appliedJobIds, loading, error };
}
