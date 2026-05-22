import React, { useState } from "react";
import { 
  Users, 
  Settings, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  Percent, 
  Skull, 
  Bot, 
  Smile, 
  BrainCircuit,
  CornerDownRight,
  ArrowUpRight
} from "lucide-react";
import { Language, translations } from "../utils/translations";
import { Patient } from "../types";

interface DashboardProps {
  lang: Language;
  onNavigate: (tabId: string) => void;
  patients: Patient[];
  geminiConfigured: boolean;
}

export default function Dashboard({ lang, onNavigate, patients, geminiConfigured }: DashboardProps) {
  const [quickAIVal, setQuickAIVal] = useState("");
  const [quickAIAnswer, setQuickAIAnswer] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const t = translations[lang].dashboard;

  // Derive clinical metrics from patients array
  const criticalCount = patients.filter(p => p.status === "Crítico").length;
  const inProgressCount = patients.filter(p => p.status === "Em Andamento").length;

  const handleQuickAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAIVal.trim() || loadingAI) return;
    setLoadingAI(true);
    setQuickAIAnswer("");
    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: quickAIVal }],
          context: { type: "Análise Rápida de Painel", stats: { criticalCount, inProgressCount } },
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setQuickAIAnswer(data.text);
      } else {
        setQuickAIAnswer(data.error || "Ocorreu um erro ao consultar o assistente de IA.");
      }
    } catch (err: any) {
      setQuickAIAnswer("Erro de conexão ao servidor.");
    } finally {
      setLoadingAI(false);
    }
  };

  const systemsGrid = [
    {
      id: "clinics",
      title: translations[lang].sidebar.clinics,
      desc: t.crmDesc,
      icon: Smile,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20 text-emerald-400"
    },
    {
      id: "laboratory",
      title: translations[lang].sidebar.labs,
      desc: t.stockDesc,
      icon: TrendingUp,
      color: "from-teal-500/20 to-cyan-500/10 border-teal-500/20 text-teal-400"
    },
    {
      id: "staff",
      title: translations[lang].sidebar.staff,
      desc: t.teamDesc,
      icon: Users,
      color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/20 text-indigo-400"
    },
    {
      id: "payback",
      title: translations[lang].sidebar.payback,
      desc: t.analyticsDesc,
      icon: Percent,
      color: "from-purple-500/20 to-pink-500/10 border-purple-500/20 text-purple-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Prime Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-900/40 border border-slate-900 rounded-3xl gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">
            Nanoglass Intranet Central
          </span>
          <h2 className="text-3xl font-display font-semibold tracking-tight text-white mt-1">
            {t.welcome} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Dr. Administrator</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">{t.roleAdmin}</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl animate-pulse">
          <Activity className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <p className="text-slate-300 font-medium">Bioluminescence Calibration</p>
            <p className="text-emerald-400 font-mono font-bold">100% Biocompatível</p>
          </div>
        </div>
      </div>

      {/* Telemetry Indicator Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Processing rate */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{t.processingRate}</span>
            <span className="p-2 rounded-xl bg-teal-500/15 text-teal-400">
              <Percent className="w-4.5 h-4.5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">98.4%</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">+1.2% {lang === "PT" ? "hoje" : "today"}</span>
            </div>
            {/* Custom high end visual indicator glass bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 w-[98.4%]"></div>
            </div>
          </div>
        </div>

        {/* Metric 2: Critical biological cases */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{t.criticalCases}</span>
            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Skull className="w-4.5 h-4.5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">{criticalCount}</span>
              <span className="text-xs text-slate-400">{lang === "PT" ? "Casos Biológicos" : "Biological Cases"}</span>
            </div>
            <p className="text-[10px] text-amber-400 font-semibold font-mono mt-3 uppercase tracking-wider transition-all">
              ⚠️ {criticalCount > 0 ? "Atenção clínica requerida" : "Estabilidade tecidual total"}
            </p>
          </div>
        </div>

        {/* Metric 3: AI Tool Status */}
        <div className="bg-slate-900/30 border border-emerald-500/10 p-6 rounded-2xl space-y-4 shadow-[0_0_15px_rgba(16,185,129,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{t.aiStatus}</span>
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Bot className="w-4.5 h-4.5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-display">
                {geminiConfigured ? "GEMINI v3.5-FLASH" : "GEMINI OFFLINE"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${geminiConfigured ? "bg-emerald-400 animate-ping" : "bg-red-500"}`}></span>
              <span className="text-xs text-slate-400">
                {geminiConfigured ? t.aiOnline : t.aiOff}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Systems Access Panel Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase">{t.quickAccess}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemsGrid.map((system) => {
            const Icon = system.icon;
            return (
              <button
                key={system.id}
                id={`quick-access-${system.id}`}
                onClick={() => onNavigate(system.id)}
                className={`p-5 rounded-2xl bg-gradient-to-br ${system.color} border text-left flex flex-col justify-between h-40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm group`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className="w-6 h-6" />
                  <ArrowUpRight className="w-4.5 h-4.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300" />
                </div>
                <div className="mt-4">
                  <h4 className="text-base font-bold text-white leading-snug">{system.title}</h4>
                  <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{system.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Analytics / AI Interactive Aesthetic Planner & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Mini quick AI Diagnostic consultations box */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-display font-medium text-slate-100">{t.treatmentAnalysis}</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Consulte a IA Biomédica integrada em tempo real. Obtenha estimativas rápidas sobre biocompatibilidade, estresse de fresagem e indicações prostéticas.
            </p>
          </div>

          <form onSubmit={handleQuickAISubmit} className="mt-4 space-y-3">
            <textarea
              value={quickAIVal}
              onChange={(e) => setQuickAIVal(e.target.value)}
              placeholder={t.aiAskPlaceholder}
              rows={3}
              className="w-full text-sm bg-slate-950/60 border border-slate-800 focus:border-emerald-500/50 p-4 rounded-xl resize-none text-slate-100 focus:outline-none placeholder-slate-600 font-sans"
            />
            <button
              type="submit"
              disabled={loadingAI || !quickAIVal.trim()}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {loadingAI ? "Processando recomendação biológica..." : "Analisar Estética Dental"}
            </button>
          </form>

          {quickAIAnswer && (
            <div className="mt-4 p-4 bg-slate-950/80 border border-emerald-500/10 rounded-2xl max-h-40 overflow-y-auto">
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono tracking-wider uppercase mb-1">
                <Bot className="w-3.5 h-3.5 shrink-0" />
                <span>Laudo Clínico Preliminar</span>
              </div>
              <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{quickAIAnswer}</p>
            </div>
          )}
        </div>

        {/* Live System Logging Activity Feed */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-medium text-slate-100">{t.recentActivity}</h3>
            <button 
              onClick={() => onNavigate("clinics")}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 group"
            >
              <span>{t.viewAll}</span>
              <CornerDownRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {patients.slice(0, 4).map((p) => (
              <div key={p.id} className="p-4 bg-slate-950/40 border border-slate-900 hover:border-slate-800/80 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-200">{p.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">#{p.id}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{p.procedure}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    p.status === "Crítico" 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                      : p.status === "Em Andamento" 
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : p.status === "Agendado"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {p.status}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">{p.lastDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
