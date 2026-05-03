import { config, hasFirecrawl } from "./config.js";

export async function scrapeWebsite(url) {
  if (hasFirecrawl() && !config.demoMode) {
    return scrapeWithFirecrawl(url);
  }

  return scrapeWithFallback(url);
}

async function scrapeWithFirecrawl(url) {
  const response = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.firecrawlApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url,
      formats: ["markdown", "html"],
      onlyMainContent: true
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Firecrawl scrape failed: ${response.status} ${detail}`);
  }

  const payload = await response.json();

  return {
    source: "firecrawl",
    url,
    title: payload?.data?.metadata?.title || "",
    description: payload?.data?.metadata?.description || "",
    markdown: payload?.data?.markdown || "",
    html: payload?.data?.html || "",
    metadata: payload?.data?.metadata || {}
  };
}

async function scrapeWithFallback(url) {
  let text = "";
  let title = "";

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "AgenticLeadIntelBot/1.0; recruiter-demo"
      }
    });

    text = await response.text();
    title = extractTitle(text);
  } catch {
    text = demoHtml(url);
    title = "Demo Business Website";
  }

  return {
    source: "fallback-fetch",
    url,
    title,
    description: "",
    markdown: htmlToLooseText(text),
    html: text,
    metadata: { fallback: true }
  };
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/is);
  return match ? cleanText(match[1]).slice(0, 160) : "";
}

function htmlToLooseText(html) {
  return cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  ).slice(0, 12000);
}

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function demoHtml(url) {
  return `
    <html>
      <head><title>Demo Local Business</title></head>
      <body>
        <h1>Demo Local Business</h1>
        <p>Family-owned service business serving the Kansas City metro.</p>
        <p>Call us today for quality service.</p>
        <p>No online booking, limited service descriptions, no testimonials, and no clear city pages.</p>
        <p>Contact: info@example.com</p>
        <p>Phone: 555-555-5555</p>
        <p>URL analyzed: ${url}</p>
      </body>
    </html>
  `;
}
