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
    const birth_date = formData.get("birth_date") as string;

    try {
      // 1. Registro no Backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          cpf, 
          birth_date,
          role: "recruiter" // Forçado para recrutador
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erro ao cadastrar recrutador");
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
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 transform transition-all">
        
        {/* Header Section */}
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
            <BriefcaseIcon className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">BritaRH Recrutador</h2>
          <p className="text-slate-500 mt-1">
            Encontre os melhores talentos para sua empresa
          </p>
        </div>

        <div className="px-8 pb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Seu nome ou nome da empresa"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">CPF</label>
                <input
                  name="cpf"
                  type="text"
                  required
                  value={cpf}
                  onChange={(e) => setCpf(maskCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nascimento</label>
                <input
                  name="birth_date"
                  type="text"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(maskDate(e.target.value))}
                  placeholder="DD/MM/AAAA"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail Corporativo</label>
              <input
                name="email"
                type="email"
                required
                placeholder="nome@empresa.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-70"
            >
              {loading ? "Cadastrando..." : "Criar conta de Recrutador"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Já tem uma conta?{" "}
              <Link href="/" className="text-blue-600 font-bold hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
