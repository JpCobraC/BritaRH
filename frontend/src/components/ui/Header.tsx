"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/presentation/contexts/ThemeContext";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 dark:border-[#253326] px-6 py-4 lg:px-20 bg-white dark:bg-[#1a251b] transition-colors duration-200">
      <Link href="/vagas" className="flex items-center gap-3 text-primary dark:text-green-400">
        <span className="material-symbols-outlined text-3xl">eco</span>
        <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
          BritaRH
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="size-9 rounded-lg border border-slate-200 dark:border-[#253326] flex items-center justify-center hover:bg-slate-50 dark:hover:bg-[#152016] text-slate-600 dark:text-slate-300 transition-colors"
          title={theme === "dark" ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
        >
          <span className="material-symbols-outlined text-[18px]">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        <Link href="/ajuda" className="text-slate-600 dark:text-slate-300 flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-[#152016] transition-colors">
          <span className="material-symbols-outlined text-base">help</span>
          Ajuda
        </Link>
        {session ? (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 dark:bg-green-500/10 text-primary dark:text-green-400 hover:bg-primary/20 dark:hover:bg-green-500/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base">account_circle</span>
              {session.user?.name ? session.user.name.split(' ')[0] : "Minha Conta"}
              <span className={`material-symbols-outlined text-base transition-transform ${isMenuOpen ? "rotate-180" : ""}`}>
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a251b] rounded-xl shadow-lg border border-slate-100 dark:border-[#253326] overflow-hidden z-50">
                <div className="py-2">
                  <Link 
                    href="/perfil" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#152016] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Meu Perfil
                  </Link>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link 
            href="/"
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Entrar / Cadastrar
          </Link>
        )}
      </div>
    </header>
  );
}
