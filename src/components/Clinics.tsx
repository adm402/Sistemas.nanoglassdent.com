import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Sparkles, 
  Calendar, 
  FileEdit, 
  FolderClosed, 
  ArrowRight, 
  Scale, 
  Smile, 
  Activity,
  HeartPulse,
  UserCheck
} from "lucide-react";
import { Language, translations } from "../utils/translations";
import { Patient } from "../types";

interface ClinicsProps {
  lang: Language;
  patients: Patient[];
  onAddPatient: (patient: Patient) => void;
  onSelectPatientForAI: (context: any) => void;
}

export default function Clinics({ lang, patients, onAddPatient, onSelectPatientForAI }: ClinicsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);

  // Form states
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(30);
  const [newGender, setNewGender] = useState("Feminino");
  const [newProcedure, setNewProcedure] = useState("Lente de Contato Ultra-Slim");
  const [newProgress, setNewProgress] = useState(85);
  const [newStatus, setNewStatus] = useState<'Concluído' | 'Em Andamento' | 'Crítico' | 'Agendado'>("Em Andamento");
  const [newDentist, setNewDentist] = useState("Dra. Beatriz Salles");
  const [newNotes, setNewNotes] = useState("");

  const t = translations[lang].clinics;

  // Filter patients based on query
  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.procedure.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term)
    );
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newPat: Patient = {
      id: `P${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName,
      age: Number(newAge),
      gender: newGender,
      procedure: newProcedure,
      status: newStatus,
      progress: Number(newProgress),
      dentist: newDentist,
      lastDate: new Date().toLocaleDateString(lang === "PT" ? "pt-BR" : "en-US"),
      notes: newNotes || "Nenhum histórico adicional documentado."
    };

    onAddPatient(newPat);
    setSelectedPatient(newPat);
    
    // Reset Form
    setNewName("");
    setNewAge(30);
    setNewProcedure("Lente de Contato Ultra-Slim");
    setNewProgress(85);
    setNewStatus("Em Andamento");
    setNewNotes("");
    setShowAddModal(false);
  };

  const scheduleList = [
    { time: "08:30", patient: "Claudio Viana", desk: "Gabinete 3", procedure: "Instalação Coroa Nanovidro A1" },
    { time: "10:00", patient: "Mariana Mendes", desk: "Gabinete 1", procedure: "Análise Estética Crystalline" },
    { time: "13:30", patient: "Estevan Lima", desk: "Gabinete 2", procedure: "Enxerto Ósseo Regenerativo" },
    { time: "16:00", patient: "Dra. Salles", desk: "Cirurgia Prótese", procedure: "Implante Total de Titânio" }
  ];

  return (
    <div className="space-y-6">
      {/* Clinician Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium text-slate-100">{t.title}</h2>
          <p className="text-sm text-slate-400 mt-1">{t.sub}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-150 shadow-md cursor-pointer select-none grow-0 self-start sm:self-auto"
          id="btn-new-patient"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>{t.newPatient}</span>
        </button>
      </div>

      {/* Main Grid: left clinical list / right detail focus & agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Patients lists panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Lookup index filter */}
          <div className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <Search className="w-5 h-5 text-slate-500 shrink-0 ml-1" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 bg-transparent border-none text-sm text-slate-200 outline-none focus:ring-0 placeholder-slate-500 font-sans"
            />
          </div>

          {/* Records database table layout */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-[10px] uppercase tracking-wider text-slate-500 font-mono bg-slate-950/20">
                    <th className="py-4 px-5">{t.patientId} / {t.name}</th>
                    <th className="py-4 px-4">{t.procedure}</th>
                    <th className="py-4 px-4">{t.biostatus}</th>
                    <th className="py-4 px-4 text-center">{t.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`group hover:bg-slate-900/40 transition-colors duration-150 cursor-pointer ${
                        selectedPatient?.id === patient.id ? "bg-emerald-500/5 border-l-2 border-emerald-500" : ""
                      }`}
                    >
                      {/* ID / Name */}
                      <td className="py-4 px-5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-200 text-sm group-hover:text-emerald-400 duration-150">
                              {patient.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 mt-1 inline-block">
                            ID: {patient.id} • {patient.age}a • ({patient.gender === "Feminino" ? "F" : "M"})
                          </span>
                        </div>
                      </td>

                      {/* Procedure */}
                      <td className="py-4 px-4">
                        <span className="text-xs text-slate-300 font-medium leading-relaxed block max-w-[160px] truncate">
                          {patient.procedure}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{patient.dentist}</span>
                      </td>

                      {/* Biostability Progress Glow */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 w-28">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>Bioglow</span>
                            <span className="text-emerald-400 font-bold">{patient.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse"
                              style={{ width: `${patient.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Diagnostic Status */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          patient.status === "Crítico" 
                            ? "bg-red-500/10 text-red-400 border border-red-500/15" 
                            : patient.status === "Em Andamento" 
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                            : patient.status === "Agendado"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/15"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 px-5 text-center text-xs text-slate-500 font-mono">
                        Nenhum ficha corresponde aos critérios de pesquisa.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detailed Info Panel Card / Agenda Side-rail */}
        <div className="space-y-6">
          
          {/* Detail viewer for Selected Patient */}
          {selectedPatient && (
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <HeartPulse className="w-12 h-12 text-slate-900/80 -rotate-12" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase font-semibold">
                  Mapeamento Clínico Ativo
                </span>
                <h3 className="text-lg font-bold text-slate-100 font-display mt-0.5">
                  {selectedPatient.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gênero: {selectedPatient.gender} • Idade: {selectedPatient.age} anos • ID: {selectedPatient.id}
                </p>
              </div>

              <div className="border-t border-slate-900 pt-4 space-y-3">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Tratamento Realizado</span>
                  <p className="text-xs text-slate-300 font-semibold mt-0.5">{selectedPatient.procedure}</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Histórico Clínico</span>
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 border border-slate-900/60 rounded-xl mt-1.5 italic">
                    "{selectedPatient.notes}"
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onSelectPatientForAI({ type: "Paciente Focando", name: selectedPatient.name, procedure: selectedPatient.procedure, notes: selectedPatient.notes })}
                  className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Análise IA</span>
                </button>
                <div className="w-10 bg-slate-950/60 border border-slate-900 rounded-xl flex items-center justify-center text-xs text-slate-400 font-mono font-bold">
                  {selectedPatient.progress}%
                </div>
              </div>
            </div>
          )}

          {/* Clinic calendar agendas */}
          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Calendar className="w-4.5 h-4.5 text-emerald-400" />
              <h4 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-semibold">
                {t.upcomingProcedures}
              </h4>
            </div>
            <div className="space-y-3">
              {scheduleList.map((sc, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <span className="text-xs font-mono font-bold text-slate-400 shrink-0 w-10 py-0.5">
                    {sc.time}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 duration-150">
                      {sc.patient}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      {sc.procedure} • <span className="text-slate-600">{sc.desk}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Modal dialog popup form: Create new dental profile chart */}
      {showAddModal && (
        <div className="fixed inset-0 select-none z-[120] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs" onClick={() => setShowAddModal(false)}></div>
          <div className="relative w-full max-w-lg bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal header */}
            <div className="p-5 border-b border-slate-900 bg-slate-900/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-emerald-400 animate-bio-glow" />
                <h4 className="text-base font-bold text-white font-display">
                  {t.newProfileTitle}
                </h4>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-300"
              >
                &times;
              </button>
            </div>

            {/* Modal scrollable form block */}
            <form onSubmit={handleCreatePatient} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Full name */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    {t.fullName}
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Dra. Gisele Rodrigues"
                    className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 outline-none focus:border-emerald-500/50"
                  />
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    {t.age}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 outline-none focus:border-emerald-500/50"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    {t.gender}
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              {/* Procedure */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  {t.procedure}
                </label>
                <input
                  type="text"
                  required
                  value={newProcedure}
                  onChange={(e) => setNewProcedure(e.target.value)}
                  placeholder="Ex: Copolímero Acrílico Nanovidro"
                  className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Dentist Responsible */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    {t.dentist}
                  </label>
                  <select
                    value={newDentist}
                    onChange={(e) => setNewDentist(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="Dra. Beatriz Salles">Dra. Beatriz Salles</option>
                    <option value="Dr. Robert Vance">Dr. Robert Vance</option>
                    <option value="Marcus Chen">Marcus Chen (Téc. Lab)</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    {t.status}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Crítico">Crítico</option>
                    <option value="Agendado">Agendado</option>
                  </select>
                </div>
              </div>

              {/* Glow Biostability slider index selection */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  <span>{t.biostatus}</span>
                  <span className="text-emerald-400 font-bold">{newProgress}% Progress</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  {t.clinicalNotes}
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Detalhes sobre a coroa nanovidro cristalino, biocompatibilidade..."
                  rows={3}
                  className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-100 outline-none focus:border-emerald-500/50 resize-none font-sans"
                />
              </div>

              {/* Form buttons */}
              <div className="flex gap-2 pt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  {t.save}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}
