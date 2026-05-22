import React, { useState } from "react";
import { 
  Users, 
  Search, 
  MessageSquare, 
  Radio, 
  PhoneCall, 
  MapPin, 
  Sparkles, 
  Send,
  Heart,
  Smile
} from "lucide-react";
import { Language, translations } from "../utils/translations";
import { StaffMember, SystemAnnouncement } from "../types";

interface StaffProps {
  lang: Language;
  staff: StaffMember[];
  announcements: SystemAnnouncement[];
  onAddAnnouncement: (text: string) => void;
  onLikeAnnouncement: (id: string) => void;
}

export default function Staff({ lang, staff, announcements, onAddAnnouncement, onLikeAnnouncement }: StaffProps) {
  const [filterActive, setFilterActive] = useState<"All" | "Clinicians" | "Lab">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [announcementMsg, setAnnouncementMsg] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const t = translations[lang].staff;

  // Filter staff criteria
  const filteredStaff = staff.filter((s) => {
    // Role filter
    if (filterActive === "Clinicians" && !s.role.toLowerCase().includes("dra") && !s.role.toLowerCase().includes("dr.")) {
      if (!s.role.toLowerCase().includes("clínco") && !s.role.toLowerCase().includes("dentist")) return false;
    }
    if (filterActive === "Lab" && !s.role.toLowerCase().includes("lab") && !s.role.toLowerCase().includes("téc")) return false;

    // Search term matching
    const query = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.role.toLowerCase().includes(query) ||
      s.specialty.toLowerCase().includes(query)
    );
  });

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementMsg.trim()) return;
    onAddAnnouncement(announcementMsg);
    setAnnouncementMsg("");
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div>
        <h2 className="text-2xl font-display font-medium text-slate-100">{t.title}</h2>
        <p className="text-sm text-slate-400 mt-1">{t.sub}</p>
      </div>

      {/* Grid: Staff items left (2 cols) / Communications mural right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Staff directory */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Subheader Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/35 border border-slate-900 rounded-2xl p-3">
            <div className="flex gap-1">
              <button
                onClick={() => setFilterActive("All")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  filterActive === "All" 
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.filterAll}
              </button>
              <button
                onClick={() => setFilterActive("Clinicians")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  filterActive === "Clinicians" 
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.filterClinicians}
              </button>
              <button
                onClick={() => setFilterActive("Lab")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  filterActive === "Lab" 
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.filterLabs}
              </button>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="Buscar especialista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-0 text-xs w-full focus:outline-none text-slate-200 focus:ring-0 placeholder-slate-600 font-sans"
              />
            </div>
          </div>

          {/* Cards list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStaff.map((person) => (
              <div 
                key={person.id}
                onClick={() => setSelectedStaff(person)}
                className="p-5 bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-2xl flex items-start gap-4 hover:scale-[1.01] transition-all duration-150 cursor-pointer text-left relative group overflow-hidden"
              >
                {/* Photo with status indicator overlay bulb */}
                <div className="relative shrink-0 select-none">
                  <img 
                    src={person.avatar} 
                    alt={person.name} 
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl border border-slate-800 object-cover bg-slate-900"
                  />
                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 shadow-sm ${
                    person.status === "Ativo" 
                      ? "bg-emerald-400 animate-pulse" 
                      : person.status === "Em Cirurgia" 
                      ? "bg-amber-400" 
                      : "bg-slate-500"
                  }`} />
                </div>

                {/* Info summary labels */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-100 text-sm group-hover:text-emerald-400 duration-150 truncate leading-none">
                      {person.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 font-medium truncate leading-none">{person.role}</p>
                  
                  <span className="inline-block px-2 py-0.5 bg-slate-950 border border-slate-900 text-slate-500 text-[9px] font-mono rounded-md font-semibold shrink-0 uppercase tracking-wide mt-2">
                    {person.specialty}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Staff Focus Profile Drawer modal */}
          {selectedStaff && (
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
              <div className="flex gap-4 items-center min-w-0">
                <img 
                  src={selectedStaff.avatar} 
                  alt={selectedStaff.name} 
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover bg-slate-900 border border-emerald-500/20 shadow-md"
                />
                <div className="min-w-0">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-semibold block">Foco Operacional Ativo</span>
                  <h3 className="text-lg font-bold text-slate-100 font-display mt-0.5 truncate">{selectedStaff.name}</h3>
                  <p className="text-xs text-slate-400 leading-normal mb-1.5">{selectedStaff.role} • <strong className="text-emerald-400">{selectedStaff.specialty}</strong></p>
                  <p className="text-xs text-slate-400 font-sans italic leading-relaxed max-w-lg bg-slate-950/20 border border-slate-900 p-2.5 rounded-xl">
                    "{selectedStaff.bio}"
                  </p>
                </div>
              </div>

              <div className="space-y-2 shrink-0 w-full md:w-auto">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{t.location}: <strong className="text-slate-300">{selectedStaff.location}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl justify-center font-bold">
                  <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                  <span>{selectedStaff.contact}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* System bulletin mural feed */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-3xl flex flex-col h-[520px] select-none">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3 shrink-0">
            <Radio className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
            <h4 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-semibold">
              {t.activeAnnouncements}
            </h4>
          </div>

          {/* Messages scroll content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl space-y-2 relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{ann.author}</h5>
                    <span className="text-[9px] text-slate-500 font-mono font-medium">{ann.role}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono font-semibold shrink-0">
                    {ann.time}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium whitespace-pre-line">{ann.text}</p>
                
                {/* Micro interactivity: like buttons */}
                <div className="flex items-center justify-between pt-1 w-full border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                  <span>#comunicado</span>
                  <button 
                    onClick={() => onLikeAnnouncement(ann.id)}
                    className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer select-none py-1 px-2 hover:bg-slate-900 rounded-lg"
                  >
                    <Heart className="w-3 h-3 text-red-500/60 fill-red-500/10 group-hover:fill-red-500" />
                    <span>{ann.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Social posting entry form */}
          <form onSubmit={handlePostAnnouncement} className="mt-4 pt-3 border-t border-slate-900 shrink-0">
            <div className="flex gap-1.5 p-1 bg-slate-950 shadow-inner rounded-xl border border-slate-900">
              <input
                type="text"
                placeholder={t.typeAnnouncement}
                value={announcementMsg}
                onChange={(e) => setAnnouncementMsg(e.target.value)}
                className="flex-1 bg-transparent text-xs py-2 px-3 focus:outline-none focus:ring-0 border-none text-slate-200 placeholder-slate-600 font-sans"
              />
              <button
                type="submit"
                disabled={!announcementMsg.trim()}
                className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-900 disabled:text-slate-700 rounded-lg text-slate-950 shadow-md transition-all duration-150 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
