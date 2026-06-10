"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { BriefcaseIcon, GoogleIcon } from "@/components/icons";
import Link from "next/link";
import { maskCPF, maskDate } from "@/utils/masks";

export default function RecruiterRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const cpf = formData.get("cpf") as string;
    const rawBirthDate = formData.get("birth_date") as string;
    const company_name = formData.get("company_name") as string;

    // Converte "DD/MM/AAAA" para "AAAA-MM-DD" para o Pydantic do backend
    const parts = rawBirthDate.split("/");
    const birth_date = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : rawBirthDate;

    try {
      // Cadastro via API Backend
      const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const apiBaseUrl = rawUrl.replace(/\/api\/v1\/?$/, "");
      const res = await fetch(`${apiBaseUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, cpf, birth_date, role: "recruiter", company_name }),
      });

      if (!res.ok) {
        let errorMsg = "Erro ao cadastrar recrutador. Verifique seus dados.";
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
          // Fallback se a API não retornar JSON válido
        }
        throw new Error(errorMsg);
      }

      // 2. Login automático
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.status === 401 || result?.error) {
        throw new Error("Erro ao realizar login automático após cadastro. Tente entrar manualmente.");
      }

      // 3. Redirecionamento para o painel de recrutador
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-background-dark flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-[#1a251b] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-[#253326] transform transition-all">
        
        {/* Header Section */}
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-950/20 rounded-2xl mb-4">
            <BriefcaseIcon className="text-blue-600 dark:text-blue-400 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">BritaRH Recrutador</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Encontre os melhores talentos para sua empresa
          </p>
        </div>

        <div className="px-8 pb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Seu nome ou nome da empresa"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#253326] bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#253326] bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#253326] bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">E-mail Corporativo</label>
              <input
                name="email"
                type="email"
                required
                placeholder="nome@empresa.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#253326] bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Senha</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#253326] bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all disabled:opacity-70"
            >
              {loading ? "Cadastrando..." : "Criar conta de Recrutador"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Já tem uma conta?{" "}
              <Link href="/" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
