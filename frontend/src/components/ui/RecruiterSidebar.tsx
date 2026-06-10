"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Painel", icon: "dashboard" },
  { href: "/admin/vagas", label: "Vagas", icon: "work" },
  { href: "/admin/vagas/nova", label: "Nova Vaga", icon: "add_circle" },
  { href: "/admin/configuracoes", label: "Configurações", icon: "settings" },
];

interface RecruiterSidebarProps {
  onClose?: () => void;
}

export default function RecruiterSidebar({ onClose }: RecruiterSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 h-full bg-primary dark:bg-[#152717] text-white flex flex-col shrink-0 transition-colors duration-200 border-r border-white/5 shadow-xl lg:shadow-none">
      
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white">architecture</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">BritaRH</h1>
            <p className="text-xs text-white/70 font-medium">Recruiter Portal</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden size-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
            title="Fechar Menu"
          >
            <span className="material-symbols-outlined text-white">close</span>
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 mt-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white/15 border-l-4 border-white font-semibold text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="p-4 mt-auto border-t border-white/10 dark:border-white/5">
        <div className="flex items-center gap-3 px-2">
          <div className="size-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white">person</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate leading-tight">{session?.user?.name || "Recrutador"}</p>
            <p className="text-xs text-white/60 truncate mt-0.5">{session?.user?.email || "RH"}</p>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="material-symbols-outlined text-white/60 cursor-pointer hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
            title="Sair"
          >
            logout
          </button>
        </div>
      </div>
    </aside>
  );
}
