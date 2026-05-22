import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, X, Terminal, Hourglass } from "lucide-react";
import { Language, translations } from "../utils/translations";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface GeminiChatProps {
  lang: Language;
  contextData?: any;
}

export default function GeminiChat({ lang, contextData }: GeminiChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: 
        lang === "PT" 
          ? "Olá, Dr. Administrator. Sou a **IA Diagnóstica** da Nanoglass Dent. Como posso auxiliar em sua análise clínica biomimética ou laboratorial hoje?"
          : lang === "ES"
          ? "Hola, Dr. Administrador. Soy la **IA Diagnóstica** de Nanoglass Dent. ¿Cómo puedo ayudarle en su análisis clínico biomimético o de laboratorio hoy?"
          : "Hello, Dr. Administrator. I am the Nanoglass Dent **Diagnostic AI**. How can I assist with your biomimetic clinical or laboratory analysis today?"
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const t = translations[lang].dashboard;

  const suggestChips = lang === "PT" ? [
    "Diferenças de polimerização: Nanovidro vs Cerâmica",
    "Estabilidade biológica em próteses totais",
    "Instruções de cimentação de Zircônia translúcida",
    "Mapeamento biomimético de cor escala A1/A2"
  ] : lang === "ES" ? [
    "Diferencias de polimerización: Nanovidrio vs Cerámica",
    "Estabilidad biológica en prótesis totales",
    "Instrucciones de cementación de Zirconia translúcida",
    "Mapeo biomimético de color escala A1/A2"
  ] : [
    "Polymerization differences: Nanoglass vs Ceramic",
    "Biological stability in total prostheses",
    "Cementation guidelines for translucent Zirconia",
    "Biomimetic shade mapping A1/A2"
  ];

  const handleSend = async (textToSend?: string) => {
    const rawVal = textToSend || inputMsg;
    if (!rawVal.trim() || loading) return;

    const userMessage: Message = { role: "user", content: rawVal };
    setMessages((prev) => [...prev, userMessage]);
    
    if (!textToSend) setInputMsg("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: contextData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro de resposta do servidor");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  // Simple custom Markdown formatter to handle formatting like bold, lists and paragraphs cleanly
  const formatMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let content = line;
      // Handle bold tags **bold**
      content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");
      content = content.replace(/`(.*?)`/g, "<code class='bg-slate-900 border border-slate-700 font-mono text-emerald-400 px-1 py-0.5 rounded'>$1</code>");

      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-slate-300 leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: content.substring(2) }} />
        );
      }
      if (line.trim().startsWith("### ")) {
        return (
          <h4 key={idx} className="text-sm font-semibold text-emerald-400 mt-3 mb-1" dangerouslySetInnerHTML={{ __html: content.substring(4) }} />
        );
      }
      if (line.trim().startsWith("## ")) {
        return (
          <h3 key={idx} className="text-md font-semibold text-slate-100 mt-4 mb-2 border-b border-slate-800 pb-1" dangerouslySetInnerHTML={{ __html: content.substring(3) }} />
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-sm text-slate-300 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: content }} />
      );
    });
  };

  return (
    <>
      {/* Floating Sparkly Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold rounded-full shadow-[0_4px_25px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none z-[100] animate-pulse border border-emerald-300/20"
        id="toggle-ai-chat"
      >
        <Bot className="w-5 h-5 shrink-0" />
        <span className="text-xs font-display tracking-wide uppercase">IA Biomédica</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      </button>

      {/* Slide-out Sidebar Drawer panel */}
      {isOpen && (
        <div className="fixed inset-0 select-none z-[110] flex justify-end">
          {/* Backdrop screen lock */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" 
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Chat Panel Box */}
          <div className="relative w-full max-w-md h-full bg-slate-950 border-l border-slate-900 shadow-2xl flex flex-col z-[120]">
            
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900/90 to-slate-950 border-b border-emerald-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400 animated-bio-glow" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    Nanoglass Diagnostic AI
                  </h3>
                  <p className="text-[10px] text-emerald-400 font-mono tracking-wider flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                    {translations[lang].dashboard.aiOnline}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Widget if present */}
            {contextData && (
              <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-900 flex items-center gap-2 text-xs text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">
                  Ctx: <strong className="text-slate-200">{contextData.type || "Geral"}</strong> {contextData.name ? `(${contextData.name})` : ""}
                </span>
              </div>
            )}

            {/* Chat list block */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/95">
              {messages.map((m, index) => (
                <div 
                  key={index} 
                  className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === "user" 
                      ? "bg-slate-800 border border-slate-700 text-slate-300" 
                      : "bg-emerald-500/15 border border-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {m.role === "user" ? "DR" : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4.5 rounded-2xl border ${
                    m.role === "user" 
                      ? "bg-slate-900/80 border-slate-800 text-slate-200 rounded-tr-none" 
                      : "bg-slate-900/40 border-emerald-500/10 text-slate-100 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {m.role === "user" ? <p className="text-sm whitespace-pre-wrap">{m.content}</p> : formatMarkdown(m.content)}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center animate-spin">
                    <Hourglass className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-emerald-500/10 rounded-tl-none text-slate-400 text-xs flex items-center gap-2">
                    <span>Avaliando parâmetros clínicos...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-300">
                  <p className="font-semibold text-red-400 mb-1">Status de Erro</p>
                  <p>{error}</p>
                </div>
              )}
              
              <div ref={bottomRef} />
            </div>

            {/* Chips for suggestions */}
            <div className="px-4 py-3 border-t border-slate-900 bg-slate-950/70 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-thin scrollbar-thumb-emerald-500/10">
              {suggestChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(chip)}
                  className="px-3 py-1.5 bg-slate-900/90 hover:bg-emerald-500/10 border border-slate-800/80 hover:border-emerald-500/30 rounded-lg text-xs text-slate-400 hover:text-emerald-300 transition-all duration-150 cursor-pointer select-none truncate max-w-[200px]"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-4 border-t border-slate-900 bg-slate-950"
            >
              <div className="flex gap-2 p-1 bg-slate-900/60 border border-slate-800 rounded-xl">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder={translations[lang].dashboard.aiAskPlaceholder}
                  className="flex-1 bg-transparent border-0 ring-0 focus:ring-0 text-sm py-2 px-3 focus:outline-none placeholder-slate-500 text-slate-100"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputMsg.trim()}
                  className="p-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-slate-950 shadow-md transition-all duration-150 disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none cursor-pointer"
                >
                  <Send className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
