"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"candidate" | "recruiter">("candidate");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background-light flex">
      {/* Left Panel – Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl">eco</span>
          <span className="text-2xl font-bold tracking-tight">BritaRH</span>
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Encontre os melhores talentos para a sua empresa
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Plataforma inteligente de recrutamento e seleção. Conectamos candidatos qualificados às melhores oportunidades.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "speed", label: "Processo ágil", desc: "Seleção rápida e eficiente" },
              { icon: "verified", label: "Candidatos qualificados", desc: "Triagem inteligente" },
              { icon: "analytics", label: "Dados em tempo real", desc: "Acompanhe métricas" },
              { icon: "diversity_3", label: "Diversidade", desc: "Recrutamento inclusivo" },
            ].map((feat) => (
              <div key={feat.label} className="bg-white/10 rounded-xl p-4">
                <span className="material-symbols-outlined text-2xl mb-2 block">{feat.icon}</span>
                <p className="font-semibold text-sm">{feat.label}</p>
                <p className="text-white/70 text-xs">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/50 text-sm">© 2024 BritaRH. Todos os direitos reservados.</p>
      </div>

      {/* Right Panel – Login */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl">eco</span>
            <span className="text-xl font-bold">BritaRH</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">Bem-vindo de volta</h1>
            <p className="text-slate-500 mt-1">Acesse sua conta para continuar</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("candidate")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "candidate"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className="material-symbols-outlined text-base">person</span>
              Sou Candidato
            </button>
            <button
              onClick={() => setActiveTab("recruiter")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "recruiter"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className="material-symbols-outlined text-base">business_center</span>
              Sou Recrutador
            </button>
          </div>

          {/* Google OAuth */}
          <button
            onClick={() => {
              if (activeTab === "candidate") router.push("/vagas");
              else router.push("/admin");
            }}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border-2 border-slate-200 rounded-xl bg-white hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold text-slate-700 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>

          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-sm font-medium">ou</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* E-mail login */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (activeTab === "candidate") router.push("/vagas");
                else router.push("/admin");
              }}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-primary/20"
            >
              Entrar
            </button>
          </div>

          <p className="text-center text-slate-500 text-sm">
            Não tem conta?{" "}
            <a href="#" className="text-primary font-semibold hover:underline">
              Cadastre-se gratuitamente
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
