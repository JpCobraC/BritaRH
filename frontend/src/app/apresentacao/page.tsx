"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

type TabId = "projeto" | "fluxos" | "arquitetura" | "deploy";

export default function ApresentacaoPage() {
  const [activeTab, setActiveTab] = useState<TabId>("projeto");

  // Diário de bordo data
  const timelineEvents = [
    {
      date: "Março 2026",
      title: "Concepção & Planejamento",
      desc: "Análise dos gargalos nos processos de R&S da Britasul. Definição da stack tecnológica e requisitos da 35ª META do CEFET-MG.",
      icon: "lightbulb",
    },
    {
      date: "Abril 2026",
      title: "Modelagem e Clean Architecture",
      desc: "Modelagem do banco de dados PostgreSQL e estruturação do monorepo seguindo os princípios de Clean Architecture no backend.",
      icon: "architecture",
    },
    {
      date: "Maio 2026",
      title: "Desenvolvimento Core & Auth",
      desc: "Implementação da autenticação segura via Google OAuth (NextAuth.js v5) e integração de rotas protegidas por JWT no backend FastAPI.",
      icon: "security",
    },
    {
      date: "Junho 2026",
      title: "Fluxo de Candidatura & Testes",
      desc: "Construção do formulário passo a passo (Wizard) do candidato, upload de currículo em PDF via MinIO/S3 e testes automatizados com Pytest (>85%).",
      icon: "fact_check",
    },
    {
      date: "Junho 2026 (Atual)",
      title: "Deploy e Domínio Online",
      desc: "Implantação em produção (Vercel + Railway + S3) com domínio público online e documentação de apresentação final.",
      icon: "rocket_launch",
      active: true,
    },
  ];

  // Steps data
  const candidateSteps = [
    {
      step: "1",
      title: "Autenticação",
      desc: "O candidato entra de forma rápida e segura com sua Conta Google.",
      icon: "login",
    },
    {
      step: "2",
      title: "Seleção de Vaga",
      desc: "Exploração de vagas disponíveis com busca por área e cidade.",
      icon: "search",
    },
    {
      step: "3",
      title: "Formulário de Perfil",
      desc: "Preenchimento de dados pessoais de contato e experiência.",
      icon: "assignment_ind",
    },
    {
      step: "4",
      title: "Teste Técnico",
      desc: "Questionário com questões configuradas pelo RH para avaliar o perfil técnico.",
      icon: "quiz",
    },
    {
      step: "5",
      title: "Envio de Currículo",
      desc: "Envio do arquivo PDF que é armazenado de forma segura em cloud storage.",
      icon: "upload_file",
    },
  ];

  const recruiterSteps = [
    {
      step: "1",
      title: "Painel Admin",
      desc: "Acesso restrito para e-mails cadastrados na whitelist de recrutadores.",
      icon: "admin_panel_settings",
    },
    {
      step: "2",
      title: "Cadastro de Vagas",
      desc: "Criação de vagas especificando requisitos e o teste correspondente.",
      icon: "post_add",
    },
    {
      step: "3",
      title: "Triagem Inteligente",
      desc: "Visualização das candidaturas ordenadas de forma decrescente pela nota do teste.",
      icon: "sort",
    },
    {
      step: "4",
      title: "Contratação & Purge",
      desc: "Fechamento automático da vaga com exclusão permanente (hard-delete) dos dados dos candidatos.",
      icon: "delete_sweep",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-[#0c120d] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Header />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-green-500/10 text-primary dark:text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <span className="material-symbols-outlined text-sm">school</span>
            35ª META · CEFET-MG · 2026
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Brita<span className="text-primary dark:text-green-400">RH</span>
          </h1>
          <p className="text-lg text-slate-650 dark:text-slate-400 max-w-2xl mx-auto">
            Plataforma de recrutamento e seleção integrada com testes de conhecimento técnico. Desenvolvida sob demanda para a **Britasul** seguindo boas práticas de engenharia de software e privacidade de dados.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-[#253326] mb-10 overflow-x-auto pb-px scrollbar-none">
          <button
            onClick={() => setActiveTab("projeto")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === "projeto"
                ? "border-primary text-primary dark:border-green-400 dark:text-green-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">info</span>
            O Projeto (META 2026)
          </button>
          <button
            onClick={() => setActiveTab("fluxos")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === "fluxos"
                ? "border-primary text-primary dark:border-green-400 dark:text-green-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">swap_calls</span>
            Fluxos & Telas
          </button>
          <button
            onClick={() => setActiveTab("arquitetura")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === "arquitetura"
                ? "border-primary text-primary dark:border-green-400 dark:text-green-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">schema</span>
            Arquitetura & Código
          </button>
          <button
            onClick={() => setActiveTab("deploy")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === "deploy"
                ? "border-primary text-primary dark:border-green-400 dark:text-green-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">cloud_sync</span>
            Deploy & Domínio Online
          </button>
        </div>

        {/* Tab 1: O Projeto */}
        {activeTab === "projeto" && (
          <div className="space-y-12 animate-fadeIn">
            {/* Meta info card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white dark:bg-[#152016] border border-slate-250/50 dark:border-[#253326] rounded-2xl flex items-start gap-4">
                <span className="material-symbols-outlined text-primary dark:text-green-400 text-3xl">category</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Categoria META</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Ciências Exatas / Engenharias e Ciência Aplicada / Inovação Tecnológica.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-[#152016] border border-slate-250/50 dark:border-[#253326] rounded-2xl flex items-start gap-4">
                <span className="material-symbols-outlined text-primary dark:text-green-400 text-3xl">groups</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Público-Alvo</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Candidatos em busca de recolocação e equipe de Recursos Humanos da Britasul.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-[#152016] border border-slate-250/50 dark:border-[#253326] rounded-2xl flex items-start gap-4">
                <span className="material-symbols-outlined text-primary dark:text-green-400 text-3xl">gavel</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Privacidade (LGPD)</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Exclusão definitiva permanente dos dados do candidato ao encerramento dos processos seletivos.
                  </p>
                </div>
              </div>
            </div>

            {/* Intro and Pitch */}
            <div className="bg-white dark:bg-[#152016] border border-slate-250/50 dark:border-[#253326] rounded-3xl p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Apresentação do Problema e Solução</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-650 dark:text-slate-350 space-y-4">
                <p>
                  O processo tradicional de recrutamento e seleção na indústria frequentemente sofre com a falta de centralização e digitalização: currículos impressos, triagens manuais exaustivas, aplicação desconectada de testes lógicos ou técnicos e risco de passivos relativos à LGPD pelo armazenamento indevido de dados pessoais.
                </p>
                <p>
                  O **BritaRH** surge como uma plataforma web de onboarding e testes acoplados. Ele unifica em um fluxo dinâmico o cadastro do candidato, o teste de conhecimento customizado da vaga e o envio do currículo. Ao final, a equipe de RH conta com uma ordenação automatizada de candidatos, facilitando a decisão e excluindo com segurança as informações ao encerramento do edital.
                </p>
              </div>
            </div>

            {/* Diário de Bordo Timeline */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                Diário de Bordo — Histórico do Projeto
              </h2>
              <div className="relative border-l border-slate-250 dark:border-[#253326] ml-6 md:ml-32 space-y-10">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="relative pl-8 md:pl-10">
                    {/* Date label side */}
                    <div className="absolute -left-[145px] top-1.5 hidden md:block text-right w-28 text-sm font-semibold text-slate-450 dark:text-slate-500">
                      {event.date}
                    </div>

                    {/* Timeline line dot with icon */}
                    <span className={`absolute -left-5 top-0 size-10 rounded-full flex items-center justify-center border shadow-sm transition-all duration-300 ${
                      event.active 
                        ? "bg-primary border-primary text-white animate-pulse" 
                        : "bg-white dark:bg-[#152016] border-slate-250 dark:border-[#253326] text-slate-450 dark:text-slate-400"
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">{event.icon}</span>
                    </span>

                    {/* Content Box */}
                    <div className="bg-white dark:bg-[#152016] border border-slate-250/50 dark:border-[#253326] p-6 rounded-2xl hover:border-primary/20 dark:hover:border-green-500/20 transition-all shadow-sm">
                      <span className="inline-block md:hidden text-xs font-bold text-primary dark:text-green-400 mb-1">{event.date}</span>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{event.title}</h3>
                      <p className="text-sm text-slate-650 dark:text-slate-450 leading-relaxed">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Fluxos e Funcionalidades */}
        {activeTab === "fluxos" && (
          <div className="space-y-12 animate-fadeIn">
            {/* Candidate Flow */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="size-10 bg-primary/10 dark:bg-green-500/10 text-primary dark:text-green-400 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Fluxo do Candidato</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {candidateSteps.map((step, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#152016] border border-slate-250/50 dark:border-[#253326] p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-slate-350 dark:text-slate-650">PASSO 0{step.step}</span>
                        <span className="material-symbols-outlined text-primary dark:text-green-400">{step.icon}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiter Flow */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="size-10 bg-primary/10 dark:bg-green-500/10 text-primary dark:text-green-400 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined">supervisor_account</span>
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Fluxo do Recrutador</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {recruiterSteps.map((step, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#152016] border border-slate-250/50 dark:border-[#253326] p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-slate-350 dark:text-slate-650">PASSO 0{step.step}</span>
                        <span className="material-symbols-outlined text-primary dark:text-green-400">{step.icon}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features callout */}
            <div className="p-8 bg-gradient-to-br from-green-50/50 to-emerald-50/20 dark:from-[#111c12] dark:to-[#0c120d] border border-green-100 dark:border-green-950/30 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Conformidade e Segurança como Prioridade</h3>
                <p className="text-slate-650 dark:text-slate-350 text-sm leading-relaxed mb-4">
                  O BritaRH foi desenhado com foco absoluto em segurança. Os currículos em PDF nunca são gravados no banco de dados, mas sim enviados para um bucket Object Storage via URLs pré-assinadas. Além disso, a aplicação realiza a exclusão forçada (Hard Delete) de todas as informações pessoais do candidato assim que uma vaga é finalizada, reduzindo a superfície de risco de vazamento de dados.
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-green-500 text-sm">verified_user</span> Criptografia JWT</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-green-500 text-sm">verified_user</span> GDPR & LGPD Ready</span>
                </div>
              </div>
              <div className="relative h-48 bg-slate-100 dark:bg-[#152016] rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-[#253326] p-4 text-center">
                <div>
                  <span className="material-symbols-outlined text-primary dark:text-green-400 text-5xl mb-2 animate-bounce">database</span>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Purgador Automático de Dados</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mt-1">Ao fechar uma vaga, os dados pessoais associados são permanentemente deletados do banco e do bucket de arquivos.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Arquitetura & Código */}
        {activeTab === "arquitetura" && (
          <div className="space-y-12 animate-fadeIn">
            {/* Tech stack grid */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Stack Tecnológica de Alta Performance</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {[
                  { name: "Next.js 14", detail: "Frontend SSR & App Router", icon: "widgets" },
                  { name: "FastAPI", detail: "Backend assíncrono modular", icon: "api" },
                  { name: "PostgreSQL", detail: "Banco relacional robusto", icon: "database" },
                  { name: "MinIO / S3", detail: "Armazenamento de objetos", icon: "folder_shared" },
                  { name: "NextAuth.js v5", detail: "Google OAuth integrada", icon: "vpn_key" },
                  { name: "Alembic", detail: "Migrations versionadas", icon: "settings_backup_restore" },
                ].map((tech, idx) => (
                  <div key={idx} className="p-4 bg-white dark:bg-[#152016] border border-slate-250/50 dark:border-[#253326] rounded-2xl text-center">
                    <span className="material-symbols-outlined text-primary dark:text-green-400 text-3xl mb-2">{tech.icon}</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{tech.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">{tech.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean Architecture Section */}
            <div className="bg-white dark:bg-[#152016] border border-slate-250/50 dark:border-[#253326] rounded-3xl p-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Clean Architecture no Backend</h3>
              <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed mb-6">
                O backend do BritaRH foi escrito em Python estruturando o código em camadas isoladas para manter alta testabilidade e independência de frameworks externos:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-[#0c120d] border border-slate-200 dark:border-[#253326] rounded-xl">
                  <h4 className="font-bold text-primary dark:text-green-400 mb-2">1. Domínio (Domain)</h4>
                  <p className="text-slate-500 dark:text-slate-400">Entidades puras de negócio (`models/`) que não conhecem o ORM ou banco diretamente.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#0c120d] border border-slate-200 dark:border-[#253326] rounded-xl">
                  <h4 className="font-bold text-primary dark:text-green-400 mb-2">2. Casos de Uso (Usecases)</h4>
                  <p className="text-slate-500 dark:text-slate-400">Regras e lógica da aplicação (`services/`) orchestrando os dados sem contato direto com banco.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#0c120d] border border-slate-200 dark:border-[#253326] rounded-xl">
                  <h4 className="font-bold text-primary dark:text-green-400 mb-2">3. Adaptadores (Adapters)</h4>
                  <p className="text-slate-500 dark:text-slate-400">Mapeamento e conversão de dados (`schemas/` Pydantic) estruturando requisições e respostas.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#0c120d] border border-slate-200 dark:border-[#253326] rounded-xl">
                  <h4 className="font-bold text-primary dark:text-green-400 mb-2">4. Infraestrutura (Infra)</h4>
                  <p className="text-slate-500 dark:text-slate-400">Configurações de banco, servidores S3/MinIO e segurança (`core/` e `alembic/`).</p>
                </div>
              </div>
            </div>

            {/* DB Model details */}
            <div className="bg-white dark:bg-[#152016] border border-slate-250/50 dark:border-[#253326] rounded-3xl p-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Modelagem do Banco de Dados</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-[#253326] text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Tabela</th>
                      <th className="py-3 px-4">Campos Principais</th>
                      <th className="py-3 px-4">Relacionamentos</th>
                      <th className="py-3 px-4">Propósito</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#202c21]">
                    <tr>
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">users</td>
                      <td className="py-4 px-4 text-xs font-mono text-slate-500">id, name, email, cpf, birth_date, role</td>
                      <td className="py-4 px-4 text-slate-500">1:N com applications</td>
                      <td className="py-4 px-4 text-xs">Armazena dados de autenticação e perfis.</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">jobs</td>
                      <td className="py-4 px-4 text-xs font-mono text-slate-500">id, title, area, description, status, workplace, schedule</td>
                      <td className="py-4 px-4 text-slate-500">1:N com questions/applications</td>
                      <td className="py-4 px-4 text-xs">Vagas cadastradas pelo RH.</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">questions</td>
                      <td className="py-4 px-4 text-xs font-mono text-slate-500">id, job_id, text, options (JSON), correct_index</td>
                      <td className="py-4 px-4 text-slate-500">N:1 com jobs</td>
                      <td className="py-4 px-4 text-xs">Perguntas vinculadas aos testes das vagas.</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">applications</td>
                      <td className="py-4 px-4 text-xs font-mono text-slate-500">id, job_id, user_id, score, resume_url, created_at</td>
                      <td className="py-4 px-4 text-slate-500">N:1 com jobs e users</td>
                      <td className="py-4 px-4 text-xs">Candidaturas realizadas por candidatos.</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">recruiter_whitelist</td>
                      <td className="py-4 px-4 text-xs font-mono text-slate-500">id, email</td>
                      <td className="py-4 px-4 text-slate-500">Nenhum</td>
                      <td className="py-4 px-4 text-xs">E-mails de recrutadores autorizados.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Guia de Deploy & Domínio */}
        {activeTab === "deploy" && (
          <div className="space-y-12 animate-fadeIn">
            {/* Online domains card */}
            <div className="p-8 bg-gradient-to-br from-green-50/50 to-emerald-50/20 dark:from-[#111c12] dark:to-[#0c120d] border border-green-150/40 dark:border-green-950/30 rounded-3xl text-center">
              <span className="material-symbols-outlined text-primary dark:text-green-400 text-4xl mb-2">language</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Acesso Online do BritaRH</h2>
              <p className="text-sm text-slate-650 dark:text-slate-450 max-w-lg mx-auto mb-6">
                O projeto está estruturado para deploy contínuo em produção. Com o domínio online, candidatos podem realizar testes e se candidatar remotamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://britarh.vercel.app" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all text-sm shadow-md shadow-primary/10 inline-flex items-center gap-2 justify-center"
                >
                  <span className="material-symbols-outlined text-lg">open_in_new</span>
                  Acessar Plataforma (Frontend)
                </a>
                <a 
                  href="https://britarh-backend-production.up.railway.app/docs" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3 bg-white dark:bg-[#152016] text-slate-700 dark:text-slate-350 font-bold rounded-xl border border-slate-200 dark:border-[#253326] hover:bg-slate-50 dark:hover:bg-[#1c2a1e] transition-all text-sm inline-flex items-center gap-2 justify-center"
                >
                  <span className="material-symbols-outlined text-lg">api</span>
                  Documentação Swagger (Backend)
                </a>
              </div>
            </div>

            {/* Quick Deploy Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#152016] border border-slate-250/50 dark:border-[#253326] rounded-3xl p-8">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary dark:text-green-400">check_circle</span>
                  Configurações do Google Cloud
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Para que a autenticação OAuth 2.0 do Google funcione na URL online, as seguintes rotas devem estar autorizadas no console do Google:
                </p>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 dark:bg-[#0c120d] rounded-xl border border-slate-200 dark:border-[#253326]">
                    <div className="text-[10px] font-black text-slate-405 dark:text-slate-500 mb-1">ORIGEM JAVASCRIPT AUTORIZADA</div>
                    <code className="text-xs text-slate-800 dark:text-slate-200 select-all font-mono break-all">https://britarh.vercel.app</code>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-[#0c120d] rounded-xl border border-slate-200 dark:border-[#253326]">
                    <div className="text-[10px] font-black text-slate-405 dark:text-slate-500 mb-1">URI DE REDIRECIONAMENTO AUTORIZADO</div>
                    <code className="text-xs text-slate-800 dark:text-slate-200 select-all font-mono break-all">https://britarh.vercel.app/api/auth/callback/google</code>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#152016] border border-slate-250/50 dark:border-[#253326] rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary dark:text-green-400">info_i</span>
                    Variáveis do Frontend (Vercel)
                  </h3>
                  <ul className="space-y-3 text-xs text-slate-650 dark:text-slate-400">
                    <li className="flex justify-between border-b border-slate-100 dark:border-[#202c21] pb-1.5">
                      <span className="font-semibold font-mono text-[11px]">NEXTAUTH_SECRET</span>
                      <span className="text-slate-550 italic">Chave forte de 32+ chars</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 dark:border-[#202c21] pb-1.5">
                      <span className="font-semibold font-mono text-[11px]">NEXTAUTH_URL</span>
                      <span className="text-slate-550 font-mono text-[11px]">https://britarh.vercel.app</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 dark:border-[#202c21] pb-1.5">
                      <span className="font-semibold font-mono text-[11px]">NEXT_PUBLIC_API_URL</span>
                      <span className="text-slate-550 font-mono text-[11px]">https://britarh-backend-production.up.railway.app/api/v1</span>
                    </li>
                    <li className="flex justify-between pb-1.5">
                      <span className="font-semibold font-mono text-[11px]">GOOGLE_CLIENT_ID</span>
                      <span className="text-slate-550 italic">Gerado no Google Console</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-[#253326] mt-4">
                  <p className="text-[11px] text-slate-450 dark:text-slate-500 leading-normal flex items-start gap-1">
                    <span className="material-symbols-outlined text-xs mt-0.5">help_outline</span>
                    Instruções completas detalhadas sobre o apontamento de domínios DNS e buckets S3 estão disponíveis no arquivo `infra/DEPLOY.md` no código fonte do projeto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
