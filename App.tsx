import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Clinics from "./components/Clinics";
import Laboratory from "./components/Laboratory";
import Staff from "./components/Staff";
import Resources from "./components/Resources";
import Payback from "./components/Payback";
import SettingsComponent from "./components/Settings";
import GeminiChat from "./components/GeminiChat";
import { Language } from "./utils/translations";
import { 
  Patient, 
  InventoryItem, 
  LabOrder, 
  StaffMember, 
  ResourceItem, 
  ExpenseItem, 
  SystemAnnouncement 
} from "./types";

export default function App() {
  // App parameters
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [lang, setLang] = useState<Language>("PT");
  const [geminiConfigured, setGeminiConfigured] = useState<boolean>(false);
  const [activeAIContext, setActiveAIContext] = useState<any>(null);

  // Check if Gemini API is available on mounting
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setGeminiConfigured(!!data.geminiConfigured);
      })
      .catch((err) => {
        console.error("Health check error:", err);
        setGeminiConfigured(false);
      });
  }, []);

  // System User Profile details
  const [userProfile, setUserProfile] = useState({
    name: "Dr. Arthur Vance",
    role: "Administrador Geral",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeMxDirW-nBdVMjibzl5UmihH5z5WZw3StHAXGQjUMP_xSB-N-D8RuwlEovJZ2jDPJj_QvgY-GrAFsmO6uqLY6TxeqR72VzDcAHdMNyACn9QDOowRJ8_L4fgJl45APgu_ckmjev-YSweE2HT-KBHkNf590ADOYnfd2tA4swHQquQVLyVQXxcEstjgHWtMzP7fS-yByhnOOmRp-onFZl8Hg0YkkTRdwlr1sNOcbIZOudjqnOeB8kZuUdSxtGKfpb-SvHPhQUAiUSh8",
    email: "arthur.vance@nanoglass.com",
    phone: "+55 (11) 98765-4321"
  });

  // Database State 1: Clinical Patient Files
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "P1024",
      name: "Heloísa Medeiros",
      age: 34,
      gender: "Feminino",
      procedure: "Coroa Copolímera Cristal A1",
      status: "Concluído",
      progress: 95,
      dentist: "Dra. Beatriz Salles",
      lastDate: "20/05/2026",
      notes: "Facetas completas em Cristal Nanovidro biomimético superior aplicadas sem desgaste substancial. Excelente estabilidade periodontal obtida."
    },
    {
      id: "P1088",
      name: "Carlos Eduardo",
      age: 48,
      gender: "Masculino",
      procedure: "Implante Pivot Titanium Slim",
      status: "Em Andamento",
      progress: 80,
      dentist: "Dr. Robert Vance",
      lastDate: "21/05/2026",
      notes: "Fixador de dente 21 instalado com parafuso ultra-slim. Aguardando fase de cicatrização celular óssea e osseointegração periférica."
    },
    {
      id: "P2050",
      name: "Bianca Cavalcanti",
      age: 27,
      gender: "Feminino",
      procedure: "Canal Multirradicular Estético",
      status: "Crítico",
      progress: 45,
      dentist: "Dra. Beatriz Salles",
      lastDate: "22/05/2026",
      notes: "Fratura coronária grave no dente 11. Alto índice de estresse biomecânico na região apical dente exposto, paciente relatando dor persistente."
    },
    {
      id: "P3060",
      name: "Roberto de Assis",
      age: 55,
      gender: "Masculino",
      procedure: "Inlay Biomimético Zircônia B1",
      status: "Agendado",
      progress: 20,
      dentist: "Dr. Robert Vance",
      lastDate: "23/05/2026",
      notes: "Planejamento de inlay dente 46 estruturado na escala de cor B1. Escaneamento intraoral CAD concluído hoje de manhã."
    }
  ]);

  // Database State 2: Inventory supplies
  const [materials, setMaterials] = useState<InventoryItem[]>([
    { id: "M101", name: "Cristal Nanovidro", category: "Nanotecnologia Estética", quantity: 140, unit: "blocos", status: "Ideal", minStock: 25, retailer: "Nanoglass S/A Dent" },
    { id: "M102", name: "Resina Copolímera A1", category: "Polímeros Avançados", quantity: 28, unit: "kits", status: "Alerta", minStock: 30, retailer: "Biopolymers Labs Corp" },
    { id: "M103", name: "Pinos de Titânio Ultra-Slim", category: "Fixadores Cirúrgicos", quantity: 6, unit: "unidades", status: "Crítico", minStock: 15, retailer: "Titanium Surgical Corp" },
    { id: "M104", name: "Zircônia Translúcida B1", category: "Cerâmicas Biomiméticas", quantity: 65, unit: "blocos", status: "Ideal", minStock: 10, retailer: "Zircon Aesthetics Ltd" }
  ]);

  // Database State 3: Prosthetic laboratory orders
  const [labOrders, setLabOrders] = useState<LabOrder[]>([
    { id: "LAB-501", patientName: "Clara Albuquerque", prosthesisType: "Coroa Cristal Nanovidro", material: "Cristal Nanovidro", shade: "A1", status: "Polimento", priority: "Alta", technician: "Marcus Chen", estimatedDelivery: "2 dias" },
    { id: "LAB-502", patientName: "Roberto de Assis", prosthesisType: "Inlay Biomimético Zircônia B1", material: "Zircônia Translúcida", shade: "B1", status: "Recebido", priority: "Normal", technician: "Marcus Chen", estimatedDelivery: "5 dias" },
    { id: "LAB-503", patientName: "Bianca Cavalcanti", prosthesisType: "Fixação Pivot Titanium", material: "Titânio Cirúrgico", shade: "A2", status: "Modelando", priority: "Urgente", technician: "Dr. Robert Vance", estimatedDelivery: "14 horas" }
  ]);

  // Database State 4: System Operational Directory Staff
  const staff: StaffMember[] = [
    {
      id: "ST-01",
      name: "Dra. Beatriz Salles",
      role: "Cirugiã-Dentista Estética",
      contact: "+55 (11) 91234-5678",
      status: "Ativo",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL0937uimrisSfejo2c2A0wD9CwvdqxUvf86dvPzw0feRP4wzcfFydtl0XE1yz_LxMoz7wUJru_TkNtWOwa2wSF_c6UGG1An49PoBA8R0QRRxkEXl7VwbJiUcycJAqH_UnNGoigyvD9IsRQN4rwcbW_5-b8fPpUlp05rU4FAEC0YATd5AWMGiSiuMvWOTLhls7xFE7o8xoGHHvNOx46YtKQ6Br6SD2RoqHDkMtd8mSehQTh65as5yFOrC7dnaiu2oA8tmcgwr95xw",
      bio: "Especialista em reabilitação oral minimamente invasiva e reconstrução de facetas com lentes de nanovidro cristalino de extrema fidelidade óptica.",
      specialty: "Aesthetics",
      location: "Gabinete 1"
    },
    {
      id: "ST-02",
      name: "Dr. Robert Vance",
      role: "Especialista em Prótese",
      contact: "+55 (11) 98765-1122",
      status: "Em Cirurgia",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNDkkuldGGaofGmnSJRrljarW7pIQ1qlNQ0rAz-1KozprJ-iwXZtz_h2R8S8EQmwzE5pcg4_F3g73rQcEPvsushL7KWp63FMnH4S6SMwdgUuLyfTDmqhtKJ2bk84aIOeJGmAydK5vfFVUGNID4dTB7cRpjxG7LzmEZ2idx7joUQU6ubiuwsBOHKF-m5XNqghtvKL4a4ZXhw0RblhWWQf_iqZY8MMi3eQtN3IyYHD8NkdJAlN1OsgxyErmLfWE59-WEMwuVWyJPvXA",
      bio: "Cirurgião de próteses totais complexas e transição óssea. Pioneiro na cimentação assistida e fixações de dentes em pinos de titânio.",
      specialty: "Surgical",
      location: "Cirurgia Prótese"
    },
    {
      id: "ST-03",
      name: "Marcus Chen",
      role: "Técnico Master Laboratorista",
      contact: "+55 (11) 99911-3322",
      status: "Ativo",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpSYBqMeXy8jgC38yvGam7nPlLLY86Gdhw5acgAiWIvuA-17d2wxLt-iClr2ZHKm7fFOhhDzMi2yDrs67k-9kBDeGIzpQW00TLhDn9v0rfUDj-TkgnpiAbjZuWkkrmaAFcJcqTT7BDYzykSPTBXoe5UU-D-B9ZaU7efz-58lnDw2xhZU-wj4F0xu0tQiiQAGmysf2O4XQjnjdwR9HRoC__vjDXSlABv8-eqRqyV6eBAwuaRh0Z_jvY09uD8e594rcRSYrlveFk9mU",
      bio: "Laboratorista especializado no fresamento tridimensional assistido por CAD/CAM. Responsável pelo polimento ótico e biocatálise biomimética.",
      specialty: "Studio Tech",
      location: "Laboratório 3D"
    }
  ];

  // Database State 5: Intranet communications news mural board
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>([
    {
      id: "ANN-1",
      author: "Marcus Chen",
      role: "Laboratorista Principal",
      text: "Finalizamos o polimento das facetas da Heloísa Medeiros. A fidelidade óptica atingiu os 95% recomendados. Lente pronta e encaminhada para o Gabinete 1 para aplicação prática.",
      time: "Há 14 min",
      likes: 8
    },
    {
      id: "ANN-2",
      author: "Dra. Beatriz Salles",
      role: "Cirurgiã Estética",
      text: "Lembrete geral: Fórum de laudo dos casos com maior sensibilidade biomecânica às 17h30 no gabinete de cirurgias. Tragam os prontuários dos pacientes.",
      time: "Há 2 horas",
      likes: 15
    }
  ]);

  // Database State 6: Financial Expenses nano payback transactions
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: "EXP-101", description: "Fatura Lote Resinas Copolímeras A1", category: "Materiais", amount: 4500, date: "20/05/2026", status: "Aprovado", requestedBy: "Marcus Chen" },
    { id: "EXP-102", description: "Turbina Multiflex Alta Rotação", category: "Equipamentos", amount: 3800, date: "21/05/2026", status: "Aprovado", requestedBy: "Dra. Beatriz Salles" },
    { id: "EXP-103", description: "Parafusos Cirúrgicos Auxiliares Titanium", category: "Logística", amount: 1200, date: "22/05/2026", status: "Pendente", requestedBy: "Dr. Robert Vance" }
  ]);

  // Database State 7: Scientific Docs Resources
  const [resources, setResources] = useState<ResourceItem[]>([
    { id: "RES-201", title: "Manual de Resinas Biomiméticas Híbridas Co-Acrílicas", category: "Manuais Técnicos CAD/CAM", type: "PDF", date: "15/04/2026", size: "4.8 MB", author: "Dr. Arthur Vance" },
    { id: "RES-202", title: "Protocolo de Biocompatibilidade em Facetas Nanovidro", category: "Protocolos Clínicos", type: "PDF", date: "18/04/2026", size: "2.4 MB", author: "Dra. Beatriz Salles" },
    { id: "RES-203", title: "STL Modelagem CAD-CAM Coroas Totais Multicamadas", category: "Manuais Técnicos CAD/CAM", type: "ZIP", date: "12/05/2026", size: "18.5 MB", author: "Marcus Chen" },
    { id: "RES-204", title: "Vídeo Demonstrativo de Polimento Ótico Nanoglas", category: "Vídeos Clínicos", type: "VIDEO", date: "16/05/2026", size: "42.0 MB", author: "Marcus Chen" }
  ]);

  // Action Methods:
  const handleAddPatient = (newPat: Patient) => {
    setPatients((prev) => [newPat, ...prev]);
  };

  const handleOrderMaterial = (id: string) => {
    setMaterials((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qtyToAdd = item.minStock * 2;
          const nextQty = item.quantity + qtyToAdd;
          return {
            ...item,
            quantity: nextQty,
            status: nextQty >= item.minStock ? "Ideal" : "Alerta"
          };
        }
        return item;
      })
    );
  };

  const handleAddLabOrder = (newOrd: LabOrder) => {
    setLabOrders((prev) => [newOrd, ...prev]);
  };

  const handleAddAnnouncement = (text: string) => {
    const nextAnn: SystemAnnouncement = {
      id: `ANN-${Math.floor(100 + Math.random() * 900)}`,
      author: userProfile.name,
      role: userProfile.role,
      text,
      time: "Agora mesmo",
      likes: 0
    };
    setAnnouncements((prev) => [nextAnn, ...prev]);
  };

  const handleLikeAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
  };

  const handleAddExpense = (newExp: ExpenseItem) => {
    setExpenses((prev) => [newExp, ...prev]);
  };

  const handleAddResource = (newDoc: ResourceItem) => {
    setResources((prev) => [newDoc, ...prev]);
  };

  // Helper trigger to focus AI on specific contexts
  const handleSelectPatientForAI = (ctx: any) => {
    setActiveAIContext(ctx);
    // Custom triggering event that opens the floating assistant
    setTimeout(() => {
      const chatBtn = document.getElementById("toggle-ai-chat");
      if (chatBtn) chatBtn.click();
    }, 150);
  };

  // Render correct Active Tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard 
            lang={lang} 
            onNavigate={setActiveTab} 
            patients={patients} 
            geminiConfigured={geminiConfigured}
          />
        );
      case "clinics":
        return (
          <Clinics 
            lang={lang} 
            patients={patients} 
            onAddPatient={handleAddPatient} 
            onSelectPatientForAI={handleSelectPatientForAI}
          />
        );
      case "laboratory":
        return (
          <Laboratory 
            lang={lang} 
            materials={materials} 
            labOrders={labOrders} 
            onOrderMaterial={handleOrderMaterial} 
            onAddLabOrder={handleAddLabOrder}
          />
        );
      case "staff":
        return (
          <Staff 
            lang={lang} 
            staff={staff} 
            announcements={announcements} 
            onAddAnnouncement={handleAddAnnouncement} 
            onLikeAnnouncement={handleLikeAnnouncement}
          />
        );
      case "resources":
        return (
          <Resources 
            lang={lang} 
            resources={resources} 
            onAddResource={handleAddResource}
          />
        );
      case "payback":
        return (
          <Payback 
            lang={lang} 
            expenses={expenses} 
            onAddExpense={handleAddExpense}
          />
        );
      case "settings":
        return (
          <SettingsComponent 
            lang={lang} 
            setLang={setLang} 
            profile={userProfile} 
            onUpdateProfile={setUserProfile}
          />
        );
      default:
        return <div className="text-center py-12 text-slate-500 font-mono">Não Encontrado</div>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Side persistent navigation menu bar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lang={lang} 
        setLang={setLang} 
        profile={userProfile}
      />

      {/* Primary content area panel */}
      <main className="flex-1 overflow-x-hidden p-4 md:p-8 space-y-6">
        {renderTabContent()}
      </main>

      {/* Floating Integrated Gemini Diagnostic AI panel */}
      <GeminiChat lang={lang} contextData={activeAIContext} />

    </div>
  );
}
