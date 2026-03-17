import Link from "next/link";

const vagas = [
  {
    id: "1",
    titulo: "Operador de Britagem",
    empresa: "BritaRH Mineração",
    local: "Belo Horizonte, MG",
    tipo: "CLT",
    salario: "R$ 2.800 – R$ 3.500",
    nivel: "Operacional",
    descricao: "Responsável pela operação de equipamentos de britagem, controle de qualidade do material processado e manutenção preventiva de máquinas.",
    tags: ["Britagem", "Operação Industrial", "Mineração"],
    vagas: 3,
  },
  {
    id: "2",
    titulo: "Técnico de Manutenção Industrial",
    empresa: "BritaRH Mineração",
    local: "Contagem, MG",
    tipo: "CLT",
    salario: "R$ 3.800 – R$ 5.200",
    nivel: "Técnico",
    descricao: "Realizará manutenção preventiva e corretiva em equipamentos industriais, análise de falhas e elaboração de relatórios técnicos.",
    tags: ["Manutenção", "Elétrica", "Hidráulica"],
    vagas: 2,
  },
  {
    id: "3",
    titulo: "Geólogo de Campo",
    empresa: "BritaRH Mineração",
    local: "Itabira, MG",
    tipo: "CLT",
    salario: "R$ 6.000 – R$ 8.500",
    nivel: "Sênior",
    descricao: "Execução de levantamentos geológicos, análise de amostras, elaboração de laudos técnicos e suporte às operações de lavra.",
    tags: ["Geologia", "Mineração", "Campo"],
    vagas: 1,
  },
  {
    id: "4",
    titulo: "Engenheiro de Segurança do Trabalho",
    empresa: "BritaRH Mineração",
    local: "Belo Horizonte, MG",
    tipo: "CLT",
    salario: "R$ 7.500 – R$ 10.000",
    nivel: "Pleno",
    descricao: "Desenvolvimento e implementação de programas de segurança, treinamentos, análise de riscos e gestão de EPI.",
    tags: ["Segurança", "CREA", "NR", "Engenharia"],
    vagas: 1,
  },
];

const nivelColors: Record<string, string> = {
  Operacional: "bg-blue-100 text-blue-700",
  Técnico: "bg-amber-100 text-amber-700",
  Sênior: "bg-purple-100 text-purple-700",
  Pleno: "bg-green-100 text-green-700",
};

export default function VagasPage() {
  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-10 lg:py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span className="material-symbols-outlined text-sm">work</span>
              {vagas.length} vagas abertas
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Vagas BritaRH Mineração
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Oportunidades em mineração, operações industriais e engenharia.
            </p>
          </div>

          {/* Search */}
          <div className="mt-6 flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                placeholder="Buscar vagas por cargo, área..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">location_on</span>
              <select className="pl-9 pr-8 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-600 appearance-none cursor-pointer">
                <option>Todas as cidades</option>
                <option>Belo Horizonte, MG</option>
                <option>Contagem, MG</option>
                <option>Itabira, MG</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {vagas.map((vaga) => (
            <div
              key={vaga.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">precision_manufacturing</span>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${nivelColors[vaga.nivel] ?? "bg-slate-100 text-slate-600"}`}>
                  {vaga.nivel}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mt-3 group-hover:text-primary transition-colors">
                {vaga.titulo}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">{vaga.empresa}</p>

              <p className="text-sm text-slate-600 mt-3 leading-relaxed line-clamp-2">{vaga.descricao}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {vaga.tags.map((tag) => (
                  <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    {vaga.local}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">badge</span>
                    {vaga.tipo}
                  </span>
                </div>
                <span className="font-semibold text-slate-700">{vaga.salario}</span>
              </div>

              <Link
                href={`/candidatura/${vaga.id}/perfil`}
                className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
              >
                Candidatar-se
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
