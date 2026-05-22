import React, { useState, useRef } from "react";
import { 
  FolderClosed, 
  Search, 
  CornerDownRight, 
  Download, 
  File, 
  Share2, 
  Sparkles, 
  ArrowRight,
  UploadCloud,
  Layers,
  Archive,
  BookOpen,
  MonitorPlay
} from "lucide-react";
import { Language, translations } from "../utils/translations";
import { ResourceItem } from "../types";

interface ResourcesProps {
  lang: Language;
  resources: ResourceItem[];
  onAddResource: (resource: ResourceItem) => void;
}

export default function Resources({ lang, resources, onAddResource }: ResourcesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFolder, setActiveFolder] = useState<string>("All");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = translations[lang].resources;

  // Folder directories counts
  const folders = [
    { id: "All", label: "Toda a Central", icon: Archive, color: "text-slate-400" },
    { id: "Protocolos Clínicos", label: "Protocolos Clínicos", icon: BookOpen, color: "text-emerald-400" },
    { id: "Manuais Técnicos CAD/CAM", label: "Manuais CAD/CAM", icon: Layers, color: "text-teal-400" },
    { id: "Vídeos Clínicos", label: "Media & Vídeos", icon: MonitorPlay, color: "text-purple-400" }
  ];

  // Filtering documents list
  const filteredResources = resources.filter((r) => {
    // Folder category filter
    if (activeFolder !== "All" && r.category !== activeFolder) return false;

    // Search query match
    const term = searchTerm.toLowerCase();
    return (
      r.title.toLowerCase().includes(term) ||
      r.category.toLowerCase().includes(term) ||
      r.type.toLowerCase().includes(term)
    );
  });

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      registerSimulatedFile(file.name, file.size);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      registerSimulatedFile(file.name, file.size);
    }
  };

  const registerSimulatedFile = (name: string, rawSize: number) => {
    const sizeInMB = (rawSize / (1024 * 1024)).toFixed(2);
    const splitExt = name.split(".").pop()?.toUpperCase() || "PDF";
    const typeMap: any = ["PDF", "DOCX", "VIDEO", "ZIP", "XLSX"].includes(splitExt) ? splitExt : "PDF";

    const newItem: ResourceItem = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      title: name.replace(/\.[^/.]+$/, ""), // remove extension
      category: activeFolder === "All" ? "Protocolos Clínicos" : activeFolder,
      type: typeMap,
      date: new Date().toLocaleDateString(lang === "PT" ? "pt-BR" : "en-US"),
      size: `${sizeInMB} MB`,
      author: "Dr. Administrator"
    };

    onAddResource(newItem);
  };

  return (
    <div className="space-y-6">
      
      {/* Prime title bar */}
      <div>
        <h2 className="text-2xl font-display font-medium text-slate-100">{t.title}</h2>
        <p className="text-sm text-slate-400 mt-1">{t.sub}</p>
      </div>

      {/* Directory Folders Access Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {folders.map((fold) => {
          const Icon = fold.icon;
          const isActive = activeFolder === fold.id;
          return (
            <button
              key={fold.id}
              onClick={() => setActiveFolder(fold.id)}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-32 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 cursor-pointer shadow-sm group ${
                isActive 
                  ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.06)]" 
                  : "bg-slate-900/30 border-slate-900"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className={`w-6 h-6 ${fold.color}`} />
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  {resources.filter(r => fold.id === "All" || r.category === fold.id).length} itens
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs text-slate-400 font-mono">Folders</p>
                <h4 className="text-sm font-bold text-slate-200 mt-1 leading-tight group-hover:text-emerald-400 duration-150 truncate">
                  {fold.label}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Grid splitter: docs left / drag and drop uploader right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Documents repository */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Seek Filter bar */}
          <div className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <Search className="w-5 h-5 text-slate-500 shrink-0 ml-1" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar documentos, protocolos, manuais biomiméticos..."
              className="flex-1 bg-transparent border-none text-sm text-slate-200 outline-none focus:ring-0 placeholder-slate-500 font-sans"
            />
          </div>

          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider font-semibold">{t.docs}</span>
              <span className="text-[10px] text-slate-500 font-mono">Listando {filteredResources.length} arquivos</span>
            </div>

            <div className="divide-y divide-slate-900/60 max-h-[380px] overflow-y-auto pr-1">
              {filteredResources.map((doc) => (
                <div key={doc.id} className="py-3.5 flex items-center justify-between group gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-400 shrink-0 select-none">
                      <File className={`w-5 h-5 ${
                        doc.type === "PDF" ? "text-red-400" : doc.type === "ZIP" ? "text-amber-400" : "text-emerald-400"
                      }`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-200 text-sm group-hover:text-emerald-400 duration-150 truncate leading-snug">
                        {doc.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {doc.category} • <strong className="text-slate-400">{doc.size}</strong> • {doc.date}
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 select-none opacity-80 group-hover:opacity-100 duration-150">
                    <span className="text-[10px] font-mono text-slate-600 font-bold select-none truncate max-w-[100px] hidden sm:inline mr-2">
                       by: {doc.author}
                    </span>
                    <button 
                      onClick={() => alert(`Iniciando download simulado de: ${doc.title}.${doc.type.toLowerCase()}`)}
                      className="p-2 bg-slate-900 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-800 rounded-xl text-slate-400 duration-150 shrink-0 cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredResources.length === 0 && (
                <div className="text-center py-12 text-xs text-slate-500 font-mono">
                  Nenhum arquivo encontrado na pasta selecionada.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Polished file upload drag and drop section */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-3xl flex flex-col justify-between h-[500px]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <UploadCloud className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-semibold">
                {t.uploadTitle}
              </h4>
            </div>

            {/* Input target area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center h-56 cursor-pointer select-none transition-all duration-200 ${
                dragActive 
                  ? "border-emerald-500 bg-emerald-500/5 text-emerald-300" 
                  : "border-slate-800 hover:border-slate-700 bg-slate-950/25 hover:bg-slate-950/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.docx,.zip,.xlsx,.mp4"
              />
              <UploadCloud className={`w-10 h-10 mb-3 ${dragActive ? "text-emerald-400 animate-bounce" : "text-slate-500"}`} />
              <p className="text-xs font-bold text-slate-200">
                Arraste o arquivo ou toque para procurar
              </p>
              <p className="text-[10px] text-slate-600 mt-2 font-mono">
                Suporta: PDF, STL, CAD, ZIP (Max: 15MB)
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl mt-4 space-y-1.5 shrink-0">
            <h5 className="text-xs font-bold text-emerald-400 font-display flex items-center gap-1.5 leading-none">
              <Sparkles className="w-3.5 h-3.5" /> Indexador de PDF Clínicos
            </h5>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Arquivos de laudo e estudos carregados na central são processados automaticamente por nossa IA para sugerir insights biomiméticos na tela do respectivo paciente nas consultas subsequentes.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
