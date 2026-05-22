import React, { useState } from "react";
import { 
  DollarSign, 
  Plus, 
  ArrowUpRight, 
  Sparkles, 
  TrendingUp, 
  Activity, 
  Scale, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  Calculator
} from "lucide-react";
import { Language, translations } from "../utils/translations";
import { ExpenseItem } from "../types";

interface PaybackProps {
  lang: Language;
  expenses: ExpenseItem[];
  onAddExpense: (expense: ExpenseItem) => void;
}

export default function Payback({ lang, expenses, onAddExpense }: PaybackProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [markupFactor, setMarkupFactor] = useState(4.2); // Interactive ROI coefficient

  // Form states
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<'Equipamentos' | 'Materiais' | 'Logística' | 'TI' | 'Manutenção'>("Materiais");
  const [requester, setRequester] = useState("Dr. Robert Vance");

  const t = translations[lang].payback;

  // Dynamically compute KPIs in real state
  const totalApproved = expenses
    .filter(e => e.status === "Aprovado")
    .reduce((sum, current) => sum + current.amount, 0);

  const totalPending = expenses
    .filter(e => e.status === "Pendente")
    .reduce((sum, current) => sum + current.amount, 0);

  // Projected return based on approved equipment/materials and interactive markup markupFactor slider
  const projectedReturn = totalApproved * markupFactor;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount) return;

    const newExp: ExpenseItem = {
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      description: desc,
      category: category as any,
      amount: Number(amount),
      date: new Date().toLocaleDateString(lang === "PT" ? "pt-BR" : "en-US"),
      status: "Pendente",
      requestedBy: requester
    };

    onAddExpense(newExp);
    
    // Reset Form
    setDesc("");
    setAmount("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium text-slate-100">{t.title}</h2>
          <p className="text-sm text-slate-400 mt-1">{t.sub}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-150 shadow-md cursor-pointer select-none self-start sm:self-auto"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>{t.newExpense}</span>
        </button>
      </div>

      {/* KPI Stats widgets row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Active Investment and capital costs */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{t.kpiTotal}</span>
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <DollarSign className="w-4.5 h-4.5" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-100 font-mono">
              R$ {totalApproved.toLocaleString(lang === "PT" ? "pt-BR" : "en-US", { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold">Insumos bio-tecnológicos licenciados</p>
          </div>
        </div>

        {/* KPI 2: Pending expenditures bills */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{t.kpiPending}</span>
            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <ShieldAlert className="w-4.5 h-4.5" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-100 font-mono">
              R$ {totalPending.toLocaleString(lang === "PT" ? "pt-BR" : "en-US", { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-amber-400 mt-1 font-semibold font-mono">Aguardando auditoria operacional</p>
          </div>
        </div>

        {/* KPI 3: Dynamic Projected ROI and markup */}
        <div className="bg-slate-900/30 border border-emerald-500/15 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{t.kpiProjected}</span>
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <TrendingUp className="w-4.5 h-4.5" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-emerald-400 font-mono animate-pulse">
              R$ {projectedReturn.toLocaleString(lang === "PT" ? "pt-BR" : "en-US", { minimumFractionDigits: 2 })}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono font-bold mt-1 inline-block">
              Fator Multiplicativo: <strong className="text-emerald-400">{markupFactor}x</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Recent exp list left (2 cols) / ROI interactive estimator right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Expenditure log list */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-display font-semibold text-slate-100">{t.expenseTitle}</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                  <th className="py-2.5 px-2">{t.desc}</th>
                  <th className="py-2.5 px-2">Data</th>
                  <th className="py-2.5 px-2 text-center">{t.val}</th>
                  <th className="py-2.5 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-900/10 duration-150 text-xs">
                    <td className="py-3 px-2">
                      <p className="font-semibold text-slate-200">{exp.description}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {exp.category} • ID: {exp.id} • por: {exp.requestedBy}
                      </p>
                    </td>
                    <td className="py-3 px-2 text-slate-400">{exp.date}</td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-slate-200">
                      R$ {exp.amount.toLocaleString(lang === "PT" ? "pt-BR" : "en-US")}
                    </td>
                    <td className="py-3 px-2 text-right font-semibold">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        exp.status === "Aprovado" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" 
                          : exp.status === "Pendente" 
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                          : "bg-red-500/10 text-red-500 border border-red-500/15"
                      }`}>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROI interactive estimator sidebar slider container */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-3xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Calculator className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h4 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-semibold">
                Simulador de Markup Estético
              </h4>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Tratamentos estéticos de alta precisão baseados em nanotecnologia e nanovidros aplicam coeficientes de agregação de valor entre <strong>2.0x e 6.0x</strong> em relação ao custo material do laboratório. Ajuste o controle deslizante abaixo para estimar o retorno.
            </p>

            {/* Slider factor indicator */}
            <div className="space-y-2 p-4 bg-slate-950/60 border border-slate-900 rounded-2xl">
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                <span>Multiplicador (Markup)</span>
                <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                  {markupFactor}x
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                step="0.1"
                value={markupFactor}
                onChange={(e) => setMarkupFactor(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>Mín: 2.0x</span>
                <span>Normal: 4.2x</span>
                <span>Máx: 6.0x</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl shrink-0 mt-4 space-y-1">
            <h5 className="text-xs font-bold text-emerald-400 font-display flex items-center gap-1 leading-none">
              <Sparkles className="w-3.5 h-3.5" /> ROI Estimado sobre Custo
            </h5>
            <p className="text-xs font-semibold text-slate-100 mt-2 font-mono">
              R$ {(totalApproved * markupFactor).toLocaleString(lang === "PT" ? "pt-BR" : "en-US")}
            </p>
            <p className="text-[10px] text-slate-500 leading-normal">
              Coeficiente odontológico calculado com base na média de mercado para facetas de nanovidro cristalino.
            </p>
          </div>
        </div>

      </div>

      {/* Modal popup wizard: Record New technology expenditure cost */}
      {showAddModal && (
        <div className="fixed inset-0 select-none z-[120] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs" onClick={() => setShowAddModal(false)}></div>
          <div className="relative w-full max-w-md bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-900 bg-slate-900/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base font-bold text-white font-display">
                  {t.addExpenseTitle}
                </h4>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-300 font-semibold"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateExpense} className="p-6 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Descrição do Custo / Fatura
                </label>
                <input
                  type="text"
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Ex: Aquisição Bloco Resina Copolímero"
                  className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Cost Amount */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={t.amountPlaceholder}
                    className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 outline-none focus:border-emerald-500/50"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="Materiais">Materiais</option>
                    <option value="Equipamentos">Equipamentos</option>
                    <option value="Logística">Logística</option>
                    <option value="TI">TI</option>
                    <option value="Manutenção">Manutenção</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Solicitado Por
                </label>
                <select
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Dr. Robert Vance">Dr. Robert Vance (Cirurgião Especialista)</option>
                  <option value="Dra. Beatriz Salles">Dra. Beatriz Salles (Clínica-Geral)</option>
                  <option value="Marcus Chen">Marcus Chen (Técnico de Laboratório)</option>
                  <option value="Administrador Geral">Administrador Geral</option>
                </select>
              </div>

              {/* Form buttons */}
              <div className="flex gap-2 pt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Solicitar Auditoria
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
