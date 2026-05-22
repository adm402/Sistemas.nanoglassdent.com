import React, { useState } from "react";
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Workflow, 
  Truck, 
  ShoppingBag, 
  Eye, 
  Layers,
  Activity,
  Smile,
  Cog
} from "lucide-react";
import { Language, translations } from "../utils/translations";
import { InventoryItem, LabOrder } from "../types";

interface LaboratoryProps {
  lang: Language;
  materials: InventoryItem[];
  labOrders: LabOrder[];
  onOrderMaterial: (id: string) => void;
  onAddLabOrder: (order: LabOrder) => void;
}

export default function Laboratory({ lang, materials, labOrders, onOrderMaterial, onAddLabOrder }: LaboratoryProps) {
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  
  // New Order Form states
  const [patientName, setPatientName] = useState("");
  const [prosthesisType, setProsthesisType] = useState("Coroa Nanovidro");
  const [material, setMaterial] = useState("Cristal Nanovidro");
  const [shade, setShade] = useState("A1");
  const [priority, setPriority] = useState<'Alta' | 'Normal' | 'Urgente'>("Normal");
  const [technician, setTechnician] = useState("Marcus Chen");
  const [delivery, setDelivery] = useState("4 dias");

  const t = translations[lang].labs;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newOrd: LabOrder = {
      id: `LAB-${Math.floor(100 + Math.random() * 900)}`,
      patientName,
      prosthesisType,
      material,
      shade,
      status: "Recebido",
      priority,
      technician,
      estimatedDelivery: delivery
    };

    onAddLabOrder(newOrd);
    
    // Reset Form
    setPatientName("");
    setProsthesisType("Coroa Nanovidro");
    setShade("A1");
    setPriority("Normal");
    setShowAddOrderModal(false);
  };

  const shadeGuides = ["A1", "A2", "A3", "B1", "B2", "C1", "C2", "D2", "D3", "OM1", "OM2"];

  return (
    <div className="space-y-6">
      
      {/* Clinician Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium text-slate-100">{t.title}</h2>
          <p className="text-sm text-slate-400 mt-1">{t.sub}</p>
        </div>
        <button
          onClick={() => setShowAddOrderModal(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-150 shadow-md cursor-pointer select-none self-start sm:self-auto"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>{t.newOrder}</span>
        </button>
      </div>

      {/* Materials Matrix / Alerts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Inventory Matrix Table */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-display font-semibold text-slate-100">Matriz de Insumos</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                  <th className="py-2.5 px-2">{t.material}</th>
                  <th className="py-2.5 px-2 text-center">{t.quantity}</th>
                  <th className="py-2.5 px-2">{t.status}</th>
                  <th className="py-2.5 px-2 text-right">{t.addOrder}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-900/20 duration-150">
                    <td className="py-4 px-2">
                      <p className="font-semibold text-slate-200 text-sm">{m.name}</p>
                      <p className="text-[10px] text-slate-500">{m.category} • ID: {m.id}</p>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="font-mono font-bold text-slate-100 text-sm">
                        {m.quantity}
                      </span>
                      <span className="text-slate-500 text-xs ml-1">{m.unit}</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                        m.status === "Crítico"
                          ? "bg-red-500/10 text-red-400 border border-red-500/15 animate-pulse"
                          : m.status === "Alerta"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          m.status === "Crítico" ? "bg-red-400" : m.status === "Alerta" ? "bg-amber-400" : "bg-emerald-400"
                        }`} />
                        {m.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button
                        onClick={() => onOrderMaterial(m.id)}
                        className="p-1 px-3 bg-slate-900 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/30 text-xs font-mono rounded-lg transition-colors cursor-pointer text-slate-400"
                      >
                        + {t.autoOrder}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Warning Indicator Sidebar card */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-3xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
              <h4 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-semibold">
                {t.stockAlerts}
              </h4>
            </div>

            <div className="space-y-3">
              {materials.filter(m => m.status !== "Ideal").map((m) => (
                <div key={m.id} className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-200">{m.name}</p>
                      <p className="text-[10px] text-slate-500">{m.retailer}</p>
                    </div>
                    <span className="text-[10px] font-mono text-red-400 font-bold uppercase shrink-0">
                      Qtd Min: {m.minStock}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1.5">
                    <span className="text-slate-400">Estoque atual: <strong className="text-slate-200">{m.quantity} {m.unit}</strong></span>
                    <button
                      onClick={() => onOrderMaterial(m.id)}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono font-bold uppercase underline"
                    >
                      Repor Insumo
                    </button>
                  </div>
                </div>
              ))}
              {materials.filter(m => m.status !== "Ideal").length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500 font-mono">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                  Todos os insumos estão em níveis adequados.
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl shrink-0 mt-4">
            <h5 className="text-xs font-bold text-emerald-400 font-display flex items-center gap-1.5 leading-none">
              <Cog className="w-3.5 h-3.5" /> Auto-Restoque Inteligente
            </h5>
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              O sistema monitora o estoque clínico via satélite e efetua despacho autônomo com distribuidores credenciados quando os insumos atingem limite crítico.
            </p>
          </div>
        </div>

      </div>

      {/* Production pipeline progress chart / logs */}
      <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-display font-medium text-slate-100">{t.logisticsTitle}</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Escala Biomimética Ativa: <strong className="text-emerald-400">Coroas & Inlays</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                <th className="py-2 px-3">Código / Prótese</th>
                <th className="py-2 px-3">Paciente</th>
                <th className="py-2 px-3">Escala de Cor</th>
                <th className="py-2 px-3">Responsável</th>
                <th className="py-2 px-3">Status de Produção</th>
                <th className="py-2 px-3 text-right">Prioridade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/30">
              {labOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-900/10 duration-150 text-xs">
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-200">{ord.prosthesisType}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{ord.id}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-semibold">{ord.patientName}</td>
                  <td className="py-3 px-3">
                    <span className="inline-block bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                      {ord.shade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{ord.technician}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] bg-slate-900 border border-emerald-500/10 text-emerald-400 rounded-md">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      {ord.status}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-2 font-mono">({ord.estimatedDelivery})</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      ord.priority === "Urgente"
                        ? "bg-red-500/10 text-red-400"
                        : ord.priority === "Alta"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-slate-900 text-slate-400"
                    }`}>
                      {ord.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal popup wizard: Add new laboratory dispatch project */}
      {showAddOrderModal && (
        <div className="fixed inset-0 select-none z-[120] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs" onClick={() => setShowAddOrderModal(false)}></div>
          <div className="relative w-full max-w-md bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-900 bg-slate-900/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base font-bold text-white font-display">
                  {translations[lang].labs.logisticsTitle}
                </h4>
              </div>
              <button 
                onClick={() => setShowAddOrderModal(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-300 font-semibold"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Nome do Paciente
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Ex: Clara Albuquerque"
                  className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Tipo de Prótese Estética
                </label>
                <select
                  value={prosthesisType}
                  onChange={(e) => setProsthesisType(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Coroa Nanovidro Cristal">Coroa Nanovidro Cristal</option>
                  <option value="Lente de Contato Cerâmica">Lente de Contato Cerâmica</option>
                  <option value="Fixação Pivot Titanium">Fixação Pivot Titanium</option>
                  <option value="Inlay Biomimético Zircônia">Inlay Biomimético Zircônia</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Tooth shade selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    {t.shadeGuide}
                  </label>
                  <select
                    value={shade}
                    onChange={(e) => setShade(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500/50"
                  >
                    {shadeGuides.map((sh) => (
                      <option key={sh} value={sh}>{sh}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    {t.priority}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Dentist Responsible */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Laboratorista Responsável
                  </label>
                  <select
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 focus:outline-none"
                  >
                    <option value="Marcus Chen">Marcus Chen (Téc. Principal)</option>
                    <option value="Dr. Robert Vance">Dr. Robert Vance</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Estimativa de Entrega
                  </label>
                  <input
                    type="text"
                    required
                    value={delivery}
                    onChange={(e) => setDelivery(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 outline-none"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex gap-2 pt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddOrderModal(false)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Confirmar Encomenda
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
