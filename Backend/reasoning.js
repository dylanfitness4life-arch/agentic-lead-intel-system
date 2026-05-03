import { config, hasReasoningModel } from "./config.js";

export async function runReasoning({ url, businessName, location, scraped }) {
  if (hasReasoningModel() && !config.demoMode) {
    return reasonWithOpenAICompatibleModel({ url, businessName, location, scraped });
  }

  return deterministicReasoning({ url, businessName, location, scraped });
}

async function reasonWithOpenAICompatibleModel({ url, businessName, location, scraped }) {
  const system = [
    "You are Hermes, a precise business reasoning engine inside an agentic workflow.",
    "Analyze local business websites for outreach opportunities.",
    "Return strict JSON only. Do not include markdown."
  ].join(" ");

  const user = {
    task: "Analyze this business website for web presence improvement opportunities.",
    url,
    businessName,
    location,
    scraped: {
      title: scraped.title,
      description: scraped.description,
      content: String(scraped.markdown || "").slice(0, 9000)
    },
    output_schema: {
      business_summary: "string",
      website_score: "number 0-100",
      confidence: "number 0-1",
      pain_points: ["string"],
      opportunities: ["string"],
      recommended_offer: "string",
      outreach_angle: "string",
      risk_flags: ["string"]
    }
  };

  const response = await fetch(`${config.openaiBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.openaiApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: config.openaiModel,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(user) }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Reasoning model failed: ${response.status} ${detail}`);
  }

  const payload = await response.json();
  return JSON.parse(payload.choices[0].message.content);
}

function deterministicReasoning({ url, businessName, location, scraped }) {
  const content = `${scraped.title || ""} ${scraped.description || ""} ${scraped.markdown || ""}`.toLowerCase();

  const signals = {
    hasBooking: /book|schedule|appointment|reserve/.test(content),
    hasTestimonials: /testimonial|review|stars|google reviews/.test(content),
    hasServices: /services|what we do|solutions/.test(content),
    hasLocation: /location|address|serving|near|city/.test(content),
    hasContact: /contact|phone|email|call/.test(content),
    hasModernCTA: /get a quote|free estimate|start now|request/.test(content)
  };

  let score = 45;
  if (signals.hasBooking) score += 10;
  if (signals.hasTestimonials) score += 10;
  if (signals.hasServices) score += 10;
  if (signals.hasLocation) score += 8;
  if (signals.hasContact) score += 8;
  if (signals.hasModernCTA) score += 9;
  score = Math.max(15, Math.min(92, score));

  const painPoints = [];
  if (!signals.hasBooking) painPoints.push("No obvious online booking or scheduling path detected.");
  if (!signals.hasTestimonials) painPoints.push("Limited visible social proof or customer testimonial language.");
  if (!signals.hasServices) painPoints.push("Service offering may not be clearly structured for conversion.");
  if (!signals.hasLocation) painPoints.push("Local SEO signals appear limited or underdeveloped.");
  if (!signals.hasModernCTA) painPoints.push("Primary call-to-action could be stronger.");

  const displayName = businessName || scraped.title || "the business";
  const displayLocation = location || "their local market";

  return {
    business_summary: `${displayName} appears to be a local business serving ${displayLocation}. The current web presence has enough baseline information to be useful, but it likely leaves conversion, trust, and local SEO gains on the table.`,
    website_score: score,
    confidence: scraped.source === "firecrawl" ? 0.84 : 0.68,
    pain_points: painPoints.length ? painPoints : ["Website has baseline content, but differentiation and conversion path can likely be improved."],
    opportunities: [
      "Add a clearer above-the-fold value proposition.",
      "Create stronger service-specific sections or landing pages.",
      "Add trust signals such as testimonials, recent work, guarantees, or review highlights.",
      "Improve local SEO with city/service keywords and structured business information.",
      "Add a low-friction contact or quote request flow."
    ],
    recommended_offer: "Website conversion and local visibility audit with a practical improvement roadmap.",
    outreach_angle: `Lead with a concise observation about ${displayName}'s current site and offer a specific improvement path rather than a generic website redesign pitch.`,
    risk_flags: [
      "Avoid claiming exact traffic, revenue, or ranking issues without verified analytics.",
      "Respect robots.txt, rate limits, and contact preferences.",
      "Human approval required before sending outreach."
    ],
    signal_map: signals,
    analyzed_url: url
  };
}
