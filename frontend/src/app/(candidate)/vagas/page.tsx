"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useJobs } from "@/presentation/hooks/useJobs";

export default function VagasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { jobs, loading, error } = useJobs();

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("Todas as cidades");

  useEffect(() => {
    if (session?.user?.role === "recruiter") {
      router.push("/dashboard");
    }
  }, [session, router]);

  const locations = useMemo(() => {
    const list = new Set<string>();
    jobs.forEach((j) => {
      if (j.workplace) {
        list.add(j.workplace);
      }
    });
    return Array.from(list);
  }, [jobs]);

  const filteredVagas = useMemo(() => {
    return jobs.filter((vaga) => {
      const matchesSearch = 
        vaga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vaga.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaga.area.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = 
        locationFilter === "Todas as cidades" || 
        vaga.workplace === locationFilter;

      return matchesSearch && matchesLocation;
    });
  }, [jobs, searchTerm, locationFilter]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background-light">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium">Buscando oportunidades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background-light px-6 text-center">
        <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
        <h2 className="text-xl font-bold text-slate-800">Ops, algo deu errado!</h2>
        <p className="text-slate-600 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-10 lg:py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span className="material-symbols-outlined text-sm">work</span>
              {filteredVagas.length} vagas encontradas
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Vagas BritaRH Mineração
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Oportunidades em mineração, operações industriais e engenharia.
            </p>
          </div>

          {/* Search */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                placeholder="Buscar vagas por cargo, área..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">location_on</span>
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-9 pr-8 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-600 appearance-none cursor-pointer w-full sm:w-auto min-w-[200px]"
              >
                <option>Todas as cidades</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredVagas.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              Nenhuma vaga encontrada com os filtros atuais.
            </div>
          ) : (
            filteredVagas.map((vaga) => (
            <div
              key={vaga.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">precision_manufacturing</span>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    {vaga.area}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mt-3 group-hover:text-primary transition-colors">
                  {vaga.title}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5 font-medium">BritaRH Mineração</p>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed line-clamp-2">{vaga.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                    {vaga.area}
                  </span>
                  {vaga.contractType && (
                    <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                      {vaga.contractType}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">location_on</span>
                      {vaga.workplace}
                    </span>
                    {vaga.contractType && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">badge</span>
                        {vaga.contractType}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-slate-700">{vaga.schedule}</span>
                </div>

                <Link
                  href={`/candidatura/${vaga.id}/perfil`}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
                >
                  Candidatar-se
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}
