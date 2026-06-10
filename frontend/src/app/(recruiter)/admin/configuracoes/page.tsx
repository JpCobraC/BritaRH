"use client";

import { useTheme } from "@/presentation/contexts/ThemeContext";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const options = [
    {
      id: "system" as const,
      label: "Padrão do Sistema",
      icon: "desktop_windows",
      description: "Detecta e aplica automaticamente o tema de acordo com as preferências do seu dispositivo.",
    },
    {
      id: "light" as const,
      label: "Tema Claro",
      icon: "light_mode",
      description: "Interface com visual claro e cores suaves, ideal para ambientes bem iluminados.",
    },
    {
      id: "dark" as const,
      label: "Tema Escuro",
      icon: "dark_mode",
      description: "Interface com tons escuros, proporcionando maior conforto visual em ambientes com pouca luz.",
    },
  ];

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Configurações</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Customize suas preferências visuais do painel</p>
      </div>

      <div className="bg-white dark:bg-[#1a251b] rounded-2xl border border-slate-100 dark:border-[#253326] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary dark:text-green-400">
            <span className="material-symbols-outlined">palette</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Aparência do Painel</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Escolha o tema visual que melhor se adapta a você</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {options.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-48 transition-all hover:shadow-md ${
                  isSelected
                    ? "border-primary bg-primary/5 dark:border-green-500 dark:bg-green-500/10 ring-1 ring-primary/25"
                    : "border-slate-100 bg-white hover:border-slate-200 dark:border-[#253326] dark:bg-[#152016] dark:hover:border-[#2f3f30]"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className={`material-symbols-outlined text-2xl ${
                    isSelected ? "text-primary dark:text-green-400" : "text-slate-400 dark:text-slate-500"
                  }`}>
                    {opt.icon}
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-primary dark:text-green-400 text-xl">
                      check_circle
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-base leading-tight mb-1">
                    {opt.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-3">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
