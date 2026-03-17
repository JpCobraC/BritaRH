import Link from "next/link";

const vagas = [
  { id: "1", titulo: "Operador de Britagem", area: "Operações", tipo: "CLT", candidatos: 34, status: "Ativa", encerra: "28/03/2024" },
  { id: "2", titulo: "Técnico de Manutenção Industrial", area: "Manutenção", tipo: "CLT", candidatos: 21, status: "Ativa", encerra: "15/04/2024" },
  { id: "3", titulo: "Geólogo de Campo", area: "Geologia", tipo: "PJ", candidatos: 12, status: "Encerrada", encerra: "01/03/2024" },
  { id: "4", titulo: "Engenheiro de Segurança do Trabalho", area: "Segurança", tipo: "CLT", candidatos: 8, status: "Ativa", encerra: "20/04/2024" },
  { id: "5", titulo: "Auxiliar Administrativo", area: "Administrativo", tipo: "CLT", candidatos: 47, status: "Encerrada", encerra: "10/02/2024" },
  { id: "6", titulo: "Operador de Escavadeira", area: "Operações", tipo: "CLT", candidatos: 0, status: "Rascunho", encerra: "—" },
];

const statusColors: Record<string, string> = {
  Ativa: "bg-green-100 text-green-700",
  Encerrada: "bg-slate-100 text-slate-500",
  Rascunho: "bg-amber-100 text-amber-700",
};

export default function VagasAdminPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vagas</h1>
          <p className="text-slate-500 text-sm mt-1">{vagas.length} vagas no total</p>
        </div>
        <Link
          href="/admin/vagas/nova"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Nova Vaga
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["Todas", "Ativas", "Encerradas", "Rascunhos"].map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              f === "Todas"
                ? "bg-primary text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-primary/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {vagas.map((vaga) => (
          <div key={vaga.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate">{vaga.titulo}</h3>
                <p className="text-xs text-slate-500 mt-1">{vaga.area} · {vaga.tipo}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${statusColors[vaga.status]}`}>
                {vaga.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">people</span>
                {vaga.candidatos} candidatos
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                {vaga.encerra}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <Link
                href={`/admin/vagas/${vaga.id}/candidatos`}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-primary border border-primary/30 rounded-lg text-xs font-semibold hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">people</span>
                Candidatos
              </Link>
              <Link
                href={`/admin/vagas/${vaga.id}/editar`}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
