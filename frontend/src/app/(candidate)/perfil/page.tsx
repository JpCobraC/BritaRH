"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redireciona para o login se não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Meu Perfil</h1>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-6 border-b border-slate-100 pb-8 mb-8">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-4xl font-bold">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{session?.user?.name || "Usuário"}</h2>
              <p className="text-slate-500">{session?.user?.email}</p>
              <div className="mt-3 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Conta Ativa
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1">Nome Completo</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                  {session?.user?.name || "Não informado"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1">E-mail</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                  {session?.user?.email || "Não informado"}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Minhas Candidaturas</h3>
              <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">work_history</span>
                <p className="text-slate-600 font-medium">Você ainda não se candidatou a nenhuma vaga.</p>
                <p className="text-slate-400 text-sm mt-1">Explore as vagas disponíveis e dê o próximo passo na sua carreira.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
