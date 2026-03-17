import Link from "next/link";

const metrics = [
  { icon: "work", label: "Vagas Ativas", value: "12", color: "bg-blue-50 text-blue-600", trend: "+2 essa semana" },
  { icon: "people", label: "Candidatos", value: "284", color: "bg-purple-50 text-purple-600", trend: "+47 esse mês" },
  { icon: "schedule", label: "Em Análise", value: "63", color: "bg-amber-50 text-amber-600", trend: "23% do total" },
  { icon: "check_circle", label: "Contratados", value: "18", color: "bg-green-50 text-green-600", trend: "+3 esse mês" },
];

const vagas = [
  { id: "1", titulo: "Operador de Britagem", candidatos: 34, status: "Ativa", encerra: "28/03/2024" },
  { id: "2", titulo: "Técnico de Manutenção Industrial", candidatos: 21, status: "Ativa", encerra: "15/04/2024" },
  { id: "3", titulo: "Geólogo de Campo", candidatos: 12, status: "Encerrada", encerra: "01/03/2024" },
  { id: "4", titulo: "Engenheiro de Segurança", candidatos: 8, status: "Rascunho", encerra: "—" },
];

const statusColors: Record<string, string> = {
  Ativa: "bg-green-100 text-green-700",
  Encerrada: "bg-slate-100 text-slate-500",
  Rascunho: "bg-amber-100 text-amber-700",
};

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Painel de Controle</h1>
          <p className="text-slate-500 text-sm mt-1">Bem-vindo de volta, Ricardo 👋</p>
        </div>
        <Link
          href="/admin/vagas/nova"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Nova Vaga
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className={`size-10 rounded-xl flex items-center justify-center mb-3 ${m.color.split(" ")[0]}`}>
              <span className={`material-symbols-outlined ${m.color.split(" ")[1]}`}>{m.icon}</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{m.value}</p>
            <p className="text-sm font-medium text-slate-600 mt-1">{m.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{m.trend}</p>
          </div>
        ))}
      </div>

      {/* Vagas Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Vagas Recentes</h2>
          <Link href="/admin/vagas" className="text-primary text-sm font-medium hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Vaga</th>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Candidatos</th>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Encerra</th>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vagas.map((vaga) => (
                <tr key={vaga.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{vaga.titulo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="material-symbols-outlined text-base text-slate-400">people</span>
                      {vaga.candidatos}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[vaga.status]}`}>
                      {vaga.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{vaga.encerra}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/vagas/${vaga.id}/candidatos`}
                        className="flex items-center gap-1 px-3 py-1.5 text-primary border border-primary/30 rounded-lg text-xs font-semibold hover:bg-primary/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">people</span>
                        Ver Candidatos
                      </Link>
                      <Link
                        href={`/admin/vagas/${vaga.id}/editar`}
                        className="flex items-center gap-1 px-3 py-1.5 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
