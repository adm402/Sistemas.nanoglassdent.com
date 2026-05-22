import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialize Gemini clients
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
  });

  // Diagnostic Assistant API endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    const { messages, context } = req.body;
    
    // Check key on demand for lazy initialization safety
    const currentApiKey = process.env.GEMINI_API_KEY;
    if (!currentApiKey) {
      return res.status(503).json({
        error: "A chave API do Gemini não está configurada no painel de segredos (Settings > Secrets). Por favor, configure GEMINI_API_KEY para habilitar a IA diagnóstica odontológica.",
      });
    }

    if (!ai) {
      ai = new GoogleGenAI({
        apiKey: currentApiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }

    try {
      const systemInstruction = `Você é o Assistente Dentário IA da Nanoglass Dent, um portal intranet avançado de estética dental de alta precisão. 
Sua missão é dar suporte a dentistas, esteticistas prostéticos, cirurgiões e técnicos do laboratório integrando insights biológicos e materiais nanotecnológicos de altíssima qualidade (cristais nanovidros cristalinos, cerâmicas flexíveis, matrizes de zircônia e fixações de titânio).
Responda sempre com profissionalismo, precisão clínica, embasamento técnico e de maneira empática. Use em suas respostas termos odontológicos apropriados em Português.
Sempre formate as respostas com marcações estruturadas do Markdown (títulos, negritos, seções, listas) para facilitar a leitura rápida na tela.
Informações atuais de contexto do prontuário ou ação ativa: ${JSON.stringify(context || {})}`;

      // Convert format for gemini models
      const formattedContents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || m.text }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini Request Error:", err);
      res.status(500).json({ error: err.message || "Falha ao se comunicar com a IA da Google" });
    }
  });

  // Serve static UI assets or mount Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started in custom mode, running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Critical server startup error:", error);
});
