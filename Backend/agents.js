import { nanoid } from "nanoid";
import { scrapeWebsite } from "./scraper.js";
import { runReasoning } from "./reasoning.js";
import { saveLeadAnalysis } from "./memory.js";

export async function runLeadIntelWorkflow({ url, businessName, location }) {
  const workflowId = nanoid();

  const trace = [];
  trace.push(step("input_received", "Website URL received and normalized for analysis."));

  const scraped = await scrapeWebsite(url);
  trace.push(step("scraper", `Scraped website using ${scraped.source}.`));

  const extracted = extractBusinessSignals({ url, businessName, location, scraped });
  trace.push(step("openclaw_agent_layer", "Controller extracted business signals and prepared reasoning payload."));

  const reasoning = await runReasoning({ url, businessName, location, scraped });
  trace.push(step("hermes_reasoning_layer", "Reasoning layer produced website assessment and opportunity map."));

  const outreachDraft = createOutreachDraft({ businessName, location, url, reasoning });
  trace.push(step("human_review_queue", "Outreach draft created and marked pending human review."));

  const obsidianNote = createObsidianNote({
    workflowId,
    url,
    businessName: extracted.businessName,
    location: extracted.location,
    reasoning,
    outreachDraft
  });
  trace.push(step("memory_obsidian", "Generated Obsidian-style memory note."));

  const leadRecord = {
    workflow_id: workflowId,
    url,
    business_name: extracted.businessName,
    location: extracted.location,
    scraped_title: scraped.title,
    website_score: reasoning.website_score,
    confidence: reasoning.confidence,
    pain_points: reasoning.pain_points,
    opportunities: reasoning.opportunities,
    recommended_offer: reasoning.recommended_offer,
    outreach_angle: reasoning.outreach_angle,
    outreach_draft: outreachDraft,
    obsidian_note: obsidianNote,
    status: "pending_review",
    trace,
    raw_analysis: {
      extracted,
      reasoning,
      scraper: {
        source: scraped.source,
        title: scraped.title,
        description: scraped.description,
        metadata: scraped.metadata
      }
    }
  };

  const saved = await saveLeadAnalysis(leadRecord);
  trace.push(step("supabase_memory", saved.persisted ? "Saved lead analysis to Supabase." : "Supabase unavailable; returned unsaved demo record."));

  return {
    ...leadRecord,
    id: saved.id,
    persisted: saved.persisted,
    trace
  };
}

function extractBusinessSignals({ url, businessName, location, scraped }) {
  return {
    businessName: businessName || scraped.title || hostnameToName(url),
    location: location || "Unknown",
    sourceUrl: url,
    title: scraped.title,
    contentLength: String(scraped.markdown || "").length
  };
}

function hostnameToName(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host.split(".")[0].replace(/[-_]/g, " ");
  } catch {
    return "Unknown Business";
  }
}

function createOutreachDraft({ businessName, location, url, reasoning }) {
  const name = businessName || "your business";
  const area = location ? ` in ${location}` : "";

  return [
    `Subject: Quick website improvement idea for ${name}`,
    "",
    `Hi ${name} team,`,
    "",
    `I took a look at your website${area} and noticed a few practical opportunities that could make it easier for visitors to understand your services, trust the business, and take action.`,
    "",
    `The biggest opportunity I saw: ${reasoning.pain_points?.[0] || "the site could use a clearer conversion path."}`,
    "",
    `I build AI-assisted web presence audits that identify specific improvements for local businesses, including clearer calls-to-action, stronger service pages, better local SEO structure, and more trust signals.`,
    "",
    `I put together a short improvement roadmap for ${url}.`,
    "",
    "Would you be open to me sending over the quick notes?",
    "",
    "Best,"
  ].join("\n");
}

function createObsidianNote({ workflowId, url, businessName, location, reasoning, outreachDraft }) {
  const now = new Date().toISOString();

  return [
    "---",
    `workflow_id: ${workflowId}`,
    `business_name: ${quoteYaml(businessName)}`,
    `url: ${url}`,
    `location: ${quoteYaml(location)}`,
    `website_score: ${reasoning.website_score}`,
    `confidence: ${reasoning.confidence}`,
    "status: pending_review",
    `created_at: ${now}`,
    "tags:",
    "  - lead-intel",
    "  - agentic-workflow",
    "  - human-review",
    "---",
    "",
    `# ${businessName}`,
    "",
    "## Summary",
    reasoning.business_summary,
    "",
    "## Pain Points",
    ...reasoning.pain_points.map((item) => `- ${item}`),
    "",
    "## Opportunities",
    ...reasoning.opportunities.map((item) => `- ${item}`),
    "",
    "## Recommended Offer",
    reasoning.recommended_offer,
    "",
    "## Outreach Angle",
    reasoning.outreach_angle,
    "",
    "## Human Review Draft",
    "```text",
    outreachDraft,
    "```"
  ].join("\n");
}

function quoteYaml(value) {
  return `"${String(value || "").replace(/"/g, '\\"')}"`;
}

function step(name, description) {
  return {
    name,
    description,
    timestamp: new Date().toISOString()
  };
}
