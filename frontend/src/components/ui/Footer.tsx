import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-8 text-center text-slate-400 text-xs border-t border-slate-100 dark:border-[#253326] bg-white dark:bg-[#1a251b] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © 2026 BritaRH. Todos os direitos reservados.
        </div>
        <div className="flex gap-6">
          <Link href="/apresentacao" className="hover:text-primary dark:hover:text-green-400 transition-colors">
            Apresentação META 2026
          </Link>
          <Link href="/ajuda" className="hover:text-primary dark:hover:text-green-400 transition-colors">
            Ajuda
          </Link>
          <a href="https://github.com/JpCobraC/BritaRH" target="_blank" rel="noreferrer" className="hover:text-primary dark:hover:text-green-400 transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
