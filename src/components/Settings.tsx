import React, { useState } from "react";
import { 
  Settings, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  ShieldCheck, 
  Globe, 
  BellRing, 
  Save, 
  Smile,
  CircleCheck,
  Building
} from "lucide-react";
import { Language, translations } from "../utils/translations";

interface SettingsProps {
  lang: Language;
  setLang: (lang: Language) => void;
  profile: { name: string; role: string; avatar: string; email: string; phone: string };
  onUpdateProfile: (updated: { name: string; role: string; avatar: string; email: string; phone: string }) => void;
}

export default function SettingsComponent({ lang, setLang, profile, onUpdateProfile }: SettingsProps) {
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [twoFactor, setTwoFactor] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [successMsg, setSuccessMsg] = useState(false);

  const t = translations[lang].settings;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, role, avatar, email, phone });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  const avatarsList = [
    // Administrator default (Dr Arthur Vance)
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB8WxQ3znbx9E73wHjiewIvhJxU6ECwLK9SceMBYzRAxQGEULFLlorZPwJjfAepaT7h6SJMIMZBE3FPAb5mw637ZcRdeJDxe2ddpdH1tfv5saegIrHmpw2f6G18nnFM7B4fOr9wzdcTlmQwkotZGPLn6IQ2b7fYoumjzWMFS7BfBqYXwRZKU9Uxqs7G18pMZeKctnqdDWGgimi0wNVb-Y9jqDAO8KeLWtEimKzS2uxzJfykog1spR_tdcFw6xC8tN8P-NG2jrCLnBY",
    // Dra Beatriz Salles
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCL0937uimrisSfejo2c2A0wD9CwvdqxUvf86dvPzw0feRP4wzcfFydtl0XE1yz_LxMoz7wUJru_TkNtWOwa2wSF_c6UGG1An49PoBA8R0QRRxkEXl7VwbJiUcycJAqH_UnNGoigyvD9IsRQN4rwcbW_5-b8fPpUlp05rU4FAEC0YATd5AWMGiSiuMvWOTLhls7xFE7o8xoGHHvNOx46YtKQ6Br6SD2RoqHDkMtd8mSehQTh65as5yFOrC7dnaiu2oA8tmcgwr95xw",
    // Dr Robert Vance
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBNDkkuldGGaofGmnSJRrljarW7pIQ1qlNQ0rAz-1KozprJ-iwXZtz_h2R8S8EQmwzE5pcg4_F3g73rQcEPvsushL7KWp63FMnH4S6SMwdgUuLyfTDmqhtKJ2bk84aIOeJGmAydK5vfFVUGNID4dTB7cRpjxG7LzmEZ2idx7joUQU6ubiuwsBOHKF-m5XNqghtvKL4a4ZXhw0RblhWWQf_iqZY8MMi3eQtN3IyYHD8NkdJAlN1OsgxyErmLfWE59-WEMwuVWyJPvXA",
    // Arthur Vance Settings Avatar
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAeMxDirW-nBdVMjibzl5UmihH5z5WZw3StHAXGQjUMP_xSB-N-D8RuwlEovJZ2jDPJj_QvgY-GrAFsmO6uqLY6TxeqR72VzDcAHdMNyACn9QDOowRJ8_L4fgJl45APgu_ckmjev-YSweE2HT-KBHkNf590ADOYnfd2tA4swHQquQVLyVQXxcEstjgHWtMzP7fS-yByhnOOmRp-onFZl8Hg0YkkTRdwlr1sNOcbIZOudjqnOeB8kZuUdSxtGKfpb-SvHPhQUAiUSh8"
  ];

  return (
    <div className="space-y-6">
      
      {/* Target Title */}
      <div>
        <h2 className="text-2xl font-display font-medium text-slate-100">{t.title}</h2>
        <p className="text-sm text-slate-400 mt-1">{t.sub}</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-sm text-emerald-300 animate-in fade-in duration-200">
          <CircleCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Configurações do sistema gravadas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card and Form Inputs (Left & Center) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: profile edit inputs */}
          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-3xl space-y-6 text-left">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <User className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-display font-medium text-slate-100">{t.profile}</h3>
            </div>

            {/* Avatar Selection row */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Selecione seu Avatar Clínico</label>
              <div className="flex flex-wrap gap-4 items-center">
                <img 
                  src={avatar} 
                  alt="Avatar atual" 
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full border-2 border-emerald-500 p-0.5 object-cover bg-slate-900"
                />
                
                <div className="flex gap-2">
                  {avatarsList.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-11 h-11 rounded-full overflow-hidden border duration-100 cursor-pointer ${
                        avatar === av ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <img src={av} alt={`Avatar ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full name input */}
              <div className="space-y-1.5Col">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5 text-slate-650" /> Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-emerald-500/50 p-3 rounded-xl text-slate-250 focus:outline-none placeholder-slate-600"
                />
              </div>

              {/* Title Role input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-650" /> {t.role}
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-emerald-500/50 p-3 rounded-xl text-slate-250 focus:outline-none placeholder-slate-600"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-650" /> {t.email}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-emerald-500/50 p-3 rounded-xl text-slate-250 focus:outline-none placeholder-slate-600 font-mono"
                />
              </div>

              {/* Telephone phone */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-650" /> {t.phone}
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-emerald-500/50 p-3 rounded-xl text-slate-250 focus:outline-none placeholder-slate-600 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: regional security parameters and notification options */}
          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-3xl space-y-6 text-left">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-display font-medium text-slate-100">{t.security}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Language selection options */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                  {t.preferredLang}
                </label>
                <div className="flex gap-2">
                  {(["PT", "EN", "ES"] as Language[]).map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => setLang(language)}
                      className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-150 border cursor-pointer ${
                        lang === language 
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" 
                          : "text-slate-400 hover:text-slate-200 bg-slate-950/40 border-slate-900"
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two Factor bio encryption */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                  {t.twoFactor}
                </label>
                <button
                  type="button"
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-full py-3 text-xs font-semibold rounded-xl text-center duration-150 border cursor-pointer ${
                    twoFactor 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "text-slate-500 border-slate-900 bg-slate-950/20"
                  }`}
                >
                  {twoFactor ? "ATIVADA • Biometria Digital" : "DESATIVADA • Apenas Senha"}
                </button>
              </div>

              {/* Email Stock Warnings */}
              <div className="sm:col-span-2 flex items-center justify-between p-4 bg-slate-950/40 border border-slate-900 rounded-xl">
                <div className="flex gap-3 items-center">
                  <BellRing className="w-5 h-5 text-slate-500" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{t.notifications}</h5>
                    <p className="text-[10px] text-slate-510 leading-snug mt-0.5">Envia alertas de reabastecimento de alta prioridade diretamente para {email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyLowStock(!notifyLowStock)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-155 ease-in-out cursor-pointer ${
                    notifyLowStock ? "bg-emerald-500" : "bg-slate-800"
                  }`}
                >
                  <div className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform duration-155 ease-in-out ${
                    notifyLowStock ? "translate-x-6" : "translate-x-0"
                  }`} />
                </button>
              </div>

            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 duration-150 cursor-pointer shadow-md select-none"
          >
            <Save className="w-4.5 h-4.5" />
            <span>{t.saveConfig}</span>
          </button>

        </div>

        {/* Corporate Intranet Credentials Board (Right) */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-3xl h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <Building className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h4 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-semibold">
              Instituição Conveniada
            </h4>
          </div>

          <div className="space-y-3.5 text-xs text-slate-400">
            <div>
              <span className="text-[10px] font-mono text-slate-500 block">Licença Corporativa Ativa</span>
              <p className="font-semibold text-slate-250 mt-1">Nanoglass Dent S/A</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 block">Status Regulatório</span>
              <p className="font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                ✔️ ISO 13485:2016 Compliat
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 block">Dispositivo de Diagnóstico</span>
              <p className="font-semibold text-slate-250 mt-1">Glow Bio-Aesthetic Core</p>
              <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">Calibração de comprimento de onda luminosa automatizada.</p>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
