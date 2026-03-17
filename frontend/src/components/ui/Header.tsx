import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-6 py-4 lg:px-20 bg-white">
      <Link href="/vagas" className="flex items-center gap-3 text-primary">
        <span className="material-symbols-outlined text-3xl">eco</span>
        <h1 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">
          BritaRH
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        <button className="text-slate-600 flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
          <span className="material-symbols-outlined text-base">help</span>
          Ajuda
        </button>
        <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <span className="material-symbols-outlined text-base">account_circle</span>
          Minha Conta
        </button>
      </div>
    </header>
  );
}
