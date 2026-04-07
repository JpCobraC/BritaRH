"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface JobRecruiter {
  id: string;
  title: string;
  area: string;
  workplace?: string;
  status: "open" | "closed";
  created_at: string;
  applicant_count: number;
}

interface Application {
  id: string;
  candidate_email: string;
  profile_data: any;
  score: number;
  message?: string;
  resume_url: string;
  created_at: string;
}

export default function RecruiterDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobRecruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobRecruiter | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (session?.user?.role !== "recruiter") {
      router.push("/vagas");
    } else {
      fetchJobs();
    }
  }, [session, status, router]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recruiter/jobs`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.ok ? await res.json() : [];
        setJobs(data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobs(jobs.map(j => j.id === jobId ? { ...j, status: newStatus as any } : j));
        if (selectedJob?.id === jobId) {
          setSelectedJob({ ...selectedJob, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const viewApplications = async (job: JobRecruiter) => {
    setSelectedJob(job);
    setLoadingApps(true);
    setApplications([]);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recruiter/jobs/${job.id}/applications`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoadingApps(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Simulado */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-primary">BritaRH</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Recrutador</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold transition-all">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </button>
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl transition-all font-medium">
            <span className="material-symbols-outlined">logout</span>
            Sair
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Painel de Gestão</h1>
            <p className="text-slate-500 text-sm">Gerencie suas vagas e candidaturas em um só lugar.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Suas Vagas</h2>
            {jobs.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
                Nenhuma vaga criada ainda.
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className={`bg-white rounded-2xl border ${selectedJob?.id === job.id ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-slate-100'} p-6 transition-all`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`size-2 rounded-full ${job.status === 'open' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${job.status === 'open' ? 'text-green-600' : 'text-slate-400'}`}>
                          {job.status === 'open' ? 'Vaga Ativa' : 'Vaga Fechada'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                      <p className="text-slate-500 text-sm">{job.area} • {job.workplace || 'Remoto'}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center min-w-[80px]">
                        <p className="text-xl font-black text-slate-900">{job.applicant_count}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Candidatos</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <button 
                      onClick={() => viewApplications(job)}
                      className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm px-4 py-2 rounded-lg bg-primary/5 hover:bg-primary/10"
                    >
                      Ver Candidatos
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                    
                    <button 
                      onClick={() => toggleJobStatus(job.id, job.status)}
                      className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg border transition-all ${
                        job.status === 'open' 
                        ? 'border-red-200 text-red-600 hover:bg-red-50' 
                        : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {job.status === 'open' ? 'do_not_disturb_on' : 'check_circle'}
                      </span>
                      {job.status === 'open' ? 'Encerrar Vaga' : 'Reabrir Vaga'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Applications View */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Candidaturas</h2>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm min-h-[500px] flex flex-col overflow-hidden">
              {!selectedJob ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <span className="material-symbols-outlined text-6xl mb-4 opacity-20">contacts</span>
                  <p className="font-medium">Selecione uma vaga para ver os candidatos</p>
                </div>
              ) : (
                <>
                  <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 truncate">{selectedJob.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{applications.length} interessados até o momento</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loadingApps ? (
                      <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : applications.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <p className="text-sm">Nenhum candidato ainda.</p>
                      </div>
                    ) : (
                      applications.map(app => (
                        <div key={app.id} className="p-4 rounded-2xl border border-slate-100 hover:border-primary/30 transition-all bg-white shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-slate-800 leading-tight">{app.profile_data.full_name}</p>
                              <p className="text-xs text-slate-500">{app.candidate_email}</p>
                            </div>
                            <div className={`px-2 py-1 rounded-lg text-xs font-black ${
                              app.score >= 80 ? 'bg-green-100 text-green-700' :
                              app.score >= 50 ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {app.score}%
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
                            <a 
                              href={`${process.env.NEXT_PUBLIC_API_URL}/storage/download/${app.resume_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-bold transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">description</span>
                              Currículo
                            </a>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl text-[10px] font-bold transition-all">
                              <span className="material-symbols-outlined text-sm">send</span>
                              Contatar
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
