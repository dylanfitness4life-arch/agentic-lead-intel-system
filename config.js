import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || "development",
  demoMode: String(process.env.DEMO_MODE || "true").toLowerCase() === "true",

  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",

  firecrawlApiKey: process.env.FIRECRAWL_API_KEY || "",

  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  openaiBaseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"
};

export function hasSupabase() {
  return Boolean(config.supabaseUrl && config.supabaseServiceRoleKey);
}

export function hasFirecrawl() {
  return Boolean(config.firecrawlApiKey);
}

export function hasReasoningModel() {
  return Boolean(config.openaiApiKey);
}
