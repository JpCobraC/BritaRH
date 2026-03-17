"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Painel", icon: "dashboard" },
  { href: "/admin/vagas", label: "Vagas", icon: "work" },
  { href: "/admin/vagas/nova", label: "Nova Vaga", icon: "add_circle" },
];

export default function RecruiterSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-primary text-white flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white">architecture</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">BritaRH</h1>
          <p className="text-xs text-white/70">Recruiter Portal</p>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-white/15 border-l-4 border-white"
                  : "hover:bg-white/10"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="size-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-white">person</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Ricardo Silva</p>
            <p className="text-xs text-white/60 truncate">Gestor de RH</p>
          </div>
          <span className="material-symbols-outlined text-white/60 cursor-pointer hover:text-white">
            logout
          </span>
        </div>
      </div>
    </aside>
  );
}
