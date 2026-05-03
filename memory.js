import { createClient } from "@supabase/supabase-js";
import { config, hasSupabase } from "./config.js";

let supabase = null;

function getSupabase() {
  if (!hasSupabase()) return null;

  if (!supabase) {
    supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { persistSession: false }
    });
  }

  return supabase;
}

const inMemoryLeads = new Map();

export async function saveLeadAnalysis(record) {
  const client = getSupabase();

  if (!client || config.demoMode) {
    const id = record.workflow_id;
    inMemoryLeads.set(id, { id, ...record, created_at: new Date().toISOString() });
    return { id, persisted: false };
  }

  const { data, error } = await client
    .from("lead_analyses")
    .insert({
      workflow_id: record.workflow_id,
      url: record.url,
      business_name: record.business_name,
      location: record.location,
      scraped_title: record.scraped_title,
      website_score: record.website_score,
      confidence: record.confidence,
      pain_points: record.pain_points,
      opportunities: record.opportunities,
      recommended_offer: record.recommended_offer,
      outreach_angle: record.outreach_angle,
      outreach_draft: record.outreach_draft,
      obsidian_note: record.obsidian_note,
      status: record.status,
      trace: record.trace,
      raw_analysis: record.raw_analysis
    })
    .select("id")
    .single();

  if (error) throw new Error(`Supabase insert failed: ${error.message}`);
  return { id: data.id, persisted: true };
}

export async function listLeadAnalyses() {
  const client = getSupabase();

  if (!client || config.demoMode) {
    return Array.from(inMemoryLeads.values()).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  }

  const { data, error } = await client
    .from("lead_analyses")
    .select("id, workflow_id, url, business_name, location, website_score, confidence, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(`Supabase list failed: ${error.message}`);
  return data;
}

export async function getLeadAnalysis(id) {
  const client = getSupabase();

  if (!client || config.demoMode) {
    return inMemoryLeads.get(id) || null;
  }

  const { data, error } = await client
    .from("lead_analyses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function approveLead(id) {
  const client = getSupabase();

  if (!client || config.demoMode) {
    const existing = inMemoryLeads.get(id);
    if (!existing) return null;
    const updated = { ...existing, status: "approved", approved_at: new Date().toISOString() };
    inMemoryLeads.set(id, updated);
    return updated;
  }

  const { data, error } = await client
    .from("lead_analyses")
    .update({ status: "approved", approved_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(`Supabase approve failed: ${error.message}`);
  return data;
}
