"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { maskCPF, maskDate } from "@/utils/masks";
import { BriefcaseIcon } from "@/components/icons";

function CompletarCadastroForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const initialName = searchParams.get("name") || "";
  
  const [name, setName] = useState(initialName);
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validações básicas no lado do cliente
    if (cpf.replace(/\D/g, "").length !== 11) {
      setError("Por favor, insira um CPF válido.");
      setLoading(false);
      return;
    }

    if (birthDate.length !== 10) {
      setError("Por favor, insira uma data de nascimento válida.");
      setLoading(false);
      return;
    }

    // Converte "DD/MM/AAAA" para "AAAA-MM-DD" para o Pydantic do backend
    const parts = birthDate.split("/");
    const formattedBirthDate = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : birthDate;

    // Calcula idade para validação prévia de 14 anos
    try {
      const birth = new Date(formattedBirthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age < 14) {
        setError("A idade mínima para cadastro é de 14 anos.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Data de nascimento inválida.");
      setLoading(false);
      return;
    }

    try {
      const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const apiBaseUrl = rawUrl.replace(/\/api\/v1\/?$/, "");

      // 1. Consulta o backend para pegar a role correta (recrutador se tiver na whitelist, candidato por padrão)
      const checkRes = await fetch(`${apiBaseUrl}/api/v1/auth/check?email=${encodeURIComponent(email)}`);
      let role = "candidate";
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        role = checkData.role;
      }

      // 2. Registra o usuário no backend com uma senha aleatória segura
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const res = await fetch(`${apiBaseUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: randomPassword,
          name,
          cpf,
          birth_date: formattedBirthDate,
          role,
        }),
      });

      if (!res.ok) {
        let errorMsg = "Erro ao concluir o cadastro. Verifique seus dados.";
        try {
          const data = await res.json();
          if (data && data.detail) {
            if (typeof data.detail === "string") {
              errorMsg = data.detail;
            } else if (Array.isArray(data.detail)) {
              errorMsg = data.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ");
            }
          }
        } catch {}
        throw new Error(errorMsg);
      }

      // 3. Completa o Login via Google OAuth e redireciona para a página apropriada
      const callbackUrl = role === "recruiter" ? "/dashboard" : "/vagas";
      await signIn("google", { callbackUrl });
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-background-dark flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-[#1a251b] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-[#253326] transform transition-all">
        {/* Header Section */}
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 dark:bg-green-950/20 rounded-2xl mb-4 text-green-600 dark:text-green-400">
            <span className="material-symbols-outlined text-4xl">account_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Concluir Cadastro</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Falta pouco! Insira seus dados para ativar sua conta.
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
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#253326] bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-400 dark:text-slate-500 mb-1">E-mail (Confirmado via Google)</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-[#253326] bg-slate-50 dark:bg-[#152016]/50 text-slate-400 dark:text-slate-500 cursor-not-allowed outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">CPF</label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={(e) => setCpf(maskCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#253326] bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nascimento</label>
                <input
                  type="text"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(maskDate(e.target.value))}
                  placeholder="DD/MM/AAAA"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#253326] bg-slate-50 dark:bg-[#152016] text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-none transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando dados...
                </>
              ) : (
                "Finalizar e Entrar"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function CompletarCadastroPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex items-center justify-center transition-colors duration-200">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    }>
      <CompletarCadastroForm />
    </Suspense>
  );
}
