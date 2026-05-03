# Lovable / View Pro Frontend Prompt

Build a polished recruiter-facing dashboard called **Agentic Lead Intel System**.

## Objective

Create a web app interface for an AI agent workflow that analyzes local business websites and generates reviewed outreach drafts.

The app should feel like a serious AI implementation portfolio project, not a toy demo.

## Pages

### 1. Home / Workflow Dashboard

Show the system pipeline:

```text
Website URL Input
→ Scraper
→ Agent Layer: OpenClaw Controller
→ Reasoning Layer: Hermes Evaluator
→ Memory: Supabase + Obsidian Markdown
→ Human Review
→ Outreach Draft
```

Use cards for each stage with status indicators.

### 2. Analyze Lead Page

Create a form with:

- Website URL
- Business Name
- Location
- Run Analysis button

On submit, call:

```http
POST {{BACKEND_URL}}/api/analyze
Content-Type: application/json
```

Body:

```json
{
  "url": "https://example.com",
  "businessName": "Example Business",
  "location": "Kansas City, MO"
}
```

Display:

- Website score
- Confidence
- Pain points
- Opportunities
- Recommended offer
- Outreach angle
- Outreach draft
- Trace timeline
- Obsidian memory note

### 3. Lead Memory Page

Call:

```http
GET {{BACKEND_URL}}/api/leads
```

Show a table/card list:

- Business name
- URL
- Location
- Website score
- Confidence
- Status
- Created date

### 4. Lead Detail Page

Call:

```http
GET {{BACKEND_URL}}/api/leads/:id
```

Show the complete lead record.

Add an Approve button:

```http
POST {{BACKEND_URL}}/api/leads/:id/approve
```

### 5. Architecture Page

Explain:

- Scraper API
- OpenClaw-style controller
- Hermes-style reasoning layer
- Supabase memory
- Obsidian markdown memory
- Human review gate
- Outreach action layer

## Visual Style

- Clean technical dashboard
- Dark mode preferred
- Professional SaaS look
- Use subtle borders and cards
- Avoid cartoon visuals
- Use compact technical labels
- Make it look recruiter-ready

## Important Copy

Use this positioning:

> This project demonstrates an end-to-end agentic AI implementation workflow: data ingestion, tool use, reasoning, persistent memory, human review, and business action generation.

## Backend URL

Expose a frontend setting or environment variable:

```text
VITE_BACKEND_URL
```

Default local value:

```text
http://localhost:3000
```

## Error Handling

If backend request fails, show:

> Backend unavailable. Demo mode can still be shown with sample output.

## Sample Demo URL

Use this test payload:

```json
{
  "url": "https://example.com",
  "businessName": "Example Local Services",
  "location": "Kansas City, MO"
}
```
