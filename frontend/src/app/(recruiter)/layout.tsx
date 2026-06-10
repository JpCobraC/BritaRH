"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import RecruiterSidebar from "@/components/ui/RecruiterSidebar";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o menu lateral automaticamente quando mudar de página (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Sidebar - Desktop & Mobile Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <RecruiterSidebar onClose={() => setIsOpen(false)} />
      </div>

      {/* Backdrop (Fundo escuro ao abrir o menu no mobile) */}
      {isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-primary dark:bg-[#152717] text-white flex items-center justify-between px-6 border-b border-white/10 dark:border-white/5 shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">architecture</span>
            <span className="font-bold tracking-tight text-lg">BritaRH</span>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="size-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors"
            title="Abrir Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
