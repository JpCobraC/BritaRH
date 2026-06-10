"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserIcon, GoogleIcon, BriefcaseIcon } from "@/components/icons";
import Link from "next/link";
import { maskCPF, maskDate } from "@/utils/masks";
import { useTheme } from "@/presentation/contexts/ThemeContext";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if ((session.user as any).role === "recruiter") {
        router.push("/dashboard");
      } else {
        router.push("/vagas");
      }
    }
  }, [session, status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const cpf = formData.get("cpf") as string;
    const rawBirthDate = formData.get("birth_date") as string | null;

    // Converte "DD/MM/AAAA" para "AAAA-MM-DD" para o Pydantic do backend (só no cadastro)
    let birth_date: string | null = null;
    if (rawBirthDate) {
      const parts = rawBirthDate.split("/");
      birth_date = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : rawBirthDate;
    }

    try {
      if (mode === "register") {
        // Fluxo de Cadastro via API Backend (Candidate por padrão)
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const apiBaseUrl = rawUrl.replace(/\/api\/v1\/?$/, "");
        const res = await fetch(`${apiBaseUrl}/api/v1/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, cpf, birth_date, role: "candidate" }),
        });

        if (!res.ok) {
          let errorMsg = "Erro ao cadastrar. Verifique seus dados.";
          try {
            const data = await res.json();
            if (data && data.detail) {
              if (typeof data.detail === "string") {
                errorMsg = data.detail;
              } else if (Array.isArray(data.detail)) {
                errorMsg = data.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ");
              } else if (typeof data.detail === "object") {
                errorMsg = JSON.stringify(data.detail);
              }
            }
          } catch {
            // Se falhar o parse (ex: 500 Internal Server Error em HTML), mantém erro genérico
          }
          throw new Error(errorMsg);
        }
      }

      // Login automático após cadastro ou login direto
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.status === 401 || result?.error) {
        throw new Error("E-mail ou senha inválidos.");
      }

      if (email === "recrutador@britarh.com.br") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/vagas";
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-background-dark flex items-center justify-center p-4 transition-colors duration-200 relative">
      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="size-10 rounded-xl bg-white dark:bg-[#1a251b] border border-slate-200 dark:border-[#253326] flex items-center justify-center hover:bg-slate-50 dark:hover:bg-[#152016] text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
          title={theme === "dark" ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
        >
          <span className="material-symbols-outlined text-lg">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-[#1a251b] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-[#253326] transform transition-all">
        
        {/* Header Section */}
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 dark:bg-green-950/20 rounded-2xl mb-4">
            <h1 className="text-3xl font-black text-green-600 dark:text-green-400">B.</h1>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">BritaRH</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {mode === "login" ? "Acesse sua conta" : "Cadastre-se para encontrar vagas"}
          </p>
          <Link href="/vagas" className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary dark:text-green-400 hover:text-primary/80 dark:hover:text-green-300 transition-colors bg-primary/5 dark:bg-green-500/10 px-4 py-2 rounded-lg">
            <span className="material-symbols-outlined text-[18px]">search</span>
            Explorar vagas sem cadastro
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 pb-6">
          <div className="flex bg-slate-100 dark:bg-[#152016] p-1 rounded-xl">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === "login" ? "bg-white dark:bg-[#1a251b] text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === "register" ? "bg-white dark:bg-[#1a251b] text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Cadastrar
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-[#253326] focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">CPF</label>
                    <input
                      name="cpf"
                      type="text"
                      required
                      value={cpf}
                      onChange={(e) => setCpf(maskCPF(e.target.value))}
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-[#253326] focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nascimento</label>
                    <input
                      name="birth_date"
                      type="text"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(maskDate(e.target.value))}
                      placeholder="DD/MM/AAAA"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-[#253326] focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
              <input
                name="email"
                type="email"
                required
                placeholder="exemplo@vaga.com"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-[#253326] focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Senha</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-[#253326] focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-none transition-all disabled:opacity-70"
            >
              {loading ? "Processando..." : mode === "login" ? "Entrar na plataforma" : "Criar minha conta"}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-[#253326]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#1a251b] px-3 text-slate-400 dark:text-slate-500 font-medium">Ou continue com</span>
              </div>
            </div>

            <button
              onClick={() => signIn("google", { callbackUrl: "/vagas" })}
              className="w-full py-3 bg-white dark:bg-[#1a251b] border border-slate-200 dark:border-[#253326] rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-[#152016] transition-all font-semibold text-slate-700 dark:text-slate-300 shadow-sm"
            >
              <GoogleIcon className="w-5 h-5" />
              Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
