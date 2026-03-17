import Link from "next/link";

export default function ConfirmacaoPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light">
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="flex flex-col max-w-[600px] w-full items-center text-center">
          {/* Hero visual */}
          <div className="w-full mb-8">
            <div className="w-full h-64 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 relative overflow-hidden">
              {/* Dotted pattern */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, #2f7f33 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-primary text-white rounded-full p-6 shadow-xl shadow-primary/20 mb-4">
                  <span className="material-symbols-outlined text-7xl leading-none" style={{ fontSize: "5rem" }}>
                    check_circle
                  </span>
                </div>
                <div className="h-1 w-12 bg-primary/20 rounded-full" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-4">
            <h1 className="text-slate-900 tracking-tight text-3xl md:text-4xl font-bold leading-tight px-4">
              Candidatura enviada com sucesso!
            </h1>
            <p className="text-slate-600 text-lg font-normal leading-relaxed px-4">
              Boa sorte! Recebemos suas informações e entraremos em contato em breve através do seu e-mail cadastrado.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center gap-6">
            <Link
              href="#"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
            >
              Acompanhar Processo
            </Link>
            <Link
              href="/vagas"
              className="group flex items-center gap-2 text-primary font-medium hover:opacity-80 transition-all underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
            >
              <span>Ver outras vagas</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Footer info */}
          <div className="mt-16 pt-8 border-t border-primary/5 w-full">
            <p className="text-slate-400 text-sm">
              Um e-mail de confirmação foi enviado para você.{" "}
              <br className="hidden sm:block" />
              Dúvidas?{" "}
              <a href="#" className="text-primary hover:underline">
                Entre em contato com o suporte
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-slate-400 text-xs">
        © 2024 BritaRH. Todos os direitos reservados.
      </footer>
    </div>
  );
}
