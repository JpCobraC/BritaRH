"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { UserIcon, GoogleIcon, BriefcaseIcon } from "@/components/icons";
import Link from "next/link";
import { maskCPF, maskDate } from "@/utils/masks";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
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
      if (mode === "register") {
        // Fluxo de Cadastro via API Backend (Candidate por padrão)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, cpf, birth_date, role: "candidate" }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Erro ao cadastrar");
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

      window.location.href = "/vagas";
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-4">
            <h1 className="text-3xl font-black text-green-600">B.</h1>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">BritaRH</h2>
          <p className="text-slate-500 mt-1">
            {mode === "login" ? "Acesse sua conta" : "Cadastre-se para encontrar vagas"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 pb-6">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === "login" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === "register" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Cadastrar
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
              <input
                name="email"
                type="email"
                required
                placeholder="exemplo@vaga.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all disabled:opacity-70"
            >
              {loading ? "Processando..." : mode === "login" ? "Entrar na plataforma" : "Criar minha conta"}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium">Ou continue com</span>
              </div>
            </div>

            <button
              onClick={() => signIn("google", { callbackUrl: "/vagas" })}
              className="w-full py-3 border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-semibold text-slate-700 shadow-sm"
            >
              <GoogleIcon className="w-5 h-5" />
              Google
            </button>

            <div className="mt-6 text-center pt-2">
              <Link
                href="/recrutador/cadastro"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 transition-colors py-2 px-4 rounded-lg bg-slate-50 hover:bg-green-50/50"
              >
                <BriefcaseIcon className="w-4 h-4" />
                <span>É um recrutador? <strong>Cadastre-se aqui</strong></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
