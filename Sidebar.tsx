import React, { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  FlaskConical, 
  Users, 
  FolderClosed, 
  DollarSign, 
  Settings, 
  Globe, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";
import { Language, translations } from "../utils/translations";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  profile: { name: string; role: string; avatar: string };
}

export default function Sidebar({ activeTab, setActiveTab, lang, setLang, profile }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = translations[lang].sidebar;

  const menuItems = [
    { id: "dashboard", label: t.dashboard, icon: LayoutDashboard },
    { id: "clinics", label: t.clinics, icon: FileText },
    { id: "laboratory", label: t.labs, icon: FlaskConical },
    { id: "staff", label: t.staff, icon: Users },
    { id: "resources", label: t.resources, icon: FolderClosed },
    { id: "payback", label: t.payback, icon: DollarSign },
    { id: "settings", label: t.settings, icon: Settings },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 animate-bio-glow">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <div className="absolute -inset-0.5 bg-emerald-400/20 rounded-xl blur-sm opacity-50"></div>
        </div>
        <div>
          <h1 className="text-lg font-display font-bold tracking-tight text-white leading-none">
            NANOGLASS<span className="text-emerald-400">DENT</span>
          </h1>
          <span className="text-[9px] font-mono tracking-widest text-emerald-400/80 font-medium mt-1 inline-block">
            {t.dentalTech}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                isActive 
                  ? "bg-emerald-500/15 text-emerald-300 border-l-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.08)]" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Multilingual Switcher Footer */}
      <div className="p-4 mx-4 bg-slate-900/60 border border-slate-800/50 rounded-2xl mb-4">
        <div className="flex items-center gap-2 mb-2 text-xs text-slate-400 font-mono">
          <Globe className="w-3.5 h-3.5 text-emerald-500/80" />
          <span>{t.language}</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {(["PT", "EN", "ES"] as Language[]).map((language) => (
            <button
              key={language}
              id={`lang-btn-${language}`}
              onClick={() => setLang(language)}
              className={`py-1 text-xs font-bold rounded-lg transition-all duration-150 ${
                lang === language 
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                  : "text-slate-500 hover:text-slate-300 bg-slate-950/40"
              }`}
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      {/* Admin User Identifier */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-3">
        <img 
          src={profile.avatar} 
          alt={profile.name} 
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full border border-emerald-500/20 shadow-md object-cover bg-slate-900"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-200 truncate">{profile.name}</p>
          <p className="text-xs text-slate-500 truncate">{profile.role}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Trigger Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 shrink-0 select-none z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-emerald-400 animate-bio-glow" />
          </div>
          <span className="font-display font-bold text-white text-md">
            NANOGLASS<span className="text-emerald-400">DENT</span>
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Toggle Menu"
          id="mobile-menu-toggle"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-slate-950/80 border-r border-slate-900/80 sticky top-0 shrink-0 overflow-hidden select-none z-50">
        {navContent}
      </aside>

      {/* Mobile Sidebar Backing Layer / Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 flex z-50">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}></div>
          <aside className="relative flex flex-col w-64 max-w-xs h-full bg-slate-950 border-r border-slate-900/80 shadow-2xl animate-in slide-in-from-left duration-200">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
