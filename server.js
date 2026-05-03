import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { validateAnalyzeRequest } from "./validators.js";
import { runLeadIntelWorkflow } from "./agents.js";
import { approveLead, getLeadAnalysis, listLeadAnalyses } from "./memory.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "agentic-lead-intel-backend",
    demoMode: config.demoMode,
    timestamp: new Date().toISOString()
  });
});

app.post("/api/analyze", async (req, res, next) => {
  try {
    const input = validateAnalyzeRequest(req.body);
    const result = await runLeadIntelWorkflow(input);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

app.get("/api/leads", async (req, res, next) => {
  try {
    const leads = await listLeadAnalyses();
    res.json({ leads });
  } catch (error) {
    next(error);
  }
});

app.get("/api/leads/:id", async (req, res, next) => {
  try {
    const lead = await getLeadAnalysis(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  } catch (error) {
    next(error);
  }
});

app.post("/api/leads/:id/approve", async (req, res, next) => {
  try {
    const lead = await approveLead(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: error.message || "Unexpected server error",
    statusCode
  });
});

app.listen(config.port, () => {
  console.log(`Agentic Lead Intel backend running on port ${config.port}`);
});
