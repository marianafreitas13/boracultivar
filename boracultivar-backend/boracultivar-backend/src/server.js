import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Origens permitidas ────────────────────────────────────────────────────────
// O frontend Vite/React do Bora Cultivar roda na porta 8080 (vite.config.ts).
// Em produção, substitua pela URL real do deploy (ex: https://boracultivar.com.br).
const allowedOrigins = [
  "http://localhost:8080",   // frontend local (Vite)
  "http://localhost:5173",   // fallback padrão do Vite (caso mude a config)
  process.env.FRONTEND_URL,  // URL de produção via variável de ambiente
].filter(Boolean);           // remove entradas undefined

// ─── Middlewares globais ───────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Permite chamadas sem origin (ex: Postman, curl, testes)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS bloqueado para a origem: ${origin}`));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json()); // Habilita leitura de JSON no body das requisições

// ─── Rotas ────────────────────────────────────────────────────────────────────
app.use("/", chatRoutes);

// ─── Rota de saúde (útil para verificar se o servidor está no ar) ─────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Bora Cultivar API está rodando!" });
});

// ─── Inicialização ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
