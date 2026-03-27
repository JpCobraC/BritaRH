import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  // Se já autenticado, redireciona para vagas
  if (session) {
    redirect("/vagas");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md flex flex-col items-center gap-6">
        {/* Logo / Título */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold text-green-700">BritaRH</h1>
          <p className="text-gray-500 text-sm text-center">
            Sistema de Recrutamento e Seleção da Britasul
          </p>
        </div>

        {/* Divisor */}
        <div className="w-full border-t border-gray-100" />

        {/* Botão Google */}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/vagas" });
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors"
          >
            {/* Google icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.1H42V20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.2-11.3-7.7l-6.5 5C9.6 39.7 16.3 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.3l6.2 5.2C40.7 35.8 44 30.3 44 24c0-1.3-.1-2.6-.4-3.9z"
              />
            </svg>
            Entrar com Google
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center">
          Acesso restrito a colaboradores e candidatos convidados.
        </p>
      </div>
    </main>
  );
}
