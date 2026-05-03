# Recruiter Demo Script

## 30-Second Version

This is an agentic AI lead intelligence system. A user enters a business website URL, the backend scrapes the page, routes the content through an OpenClaw-style agent controller, applies a Hermes-style reasoning layer, stores the result in Supabase and Obsidian-style memory, then generates an outreach draft that requires human review before action.

## 90-Second Version

I built this to demonstrate practical AI workflow implementation.

The system starts with a business URL. The scraper collects public website content and converts it into usable text. The agent controller coordinates the workflow: it validates the input, calls the scraper, prepares the reasoning payload, creates the outreach draft, and writes memory.

The reasoning layer evaluates the website for conversion, trust signals, service clarity, local SEO, and business opportunity. The system then stores a structured record in Supabase and creates an Obsidian-style markdown note so the result is both machine-readable and human-readable.

The final outreach draft is not sent automatically. It enters a human review state. That design choice is intentional because responsible automation needs approval gates.

This project shows I understand agents, tools, model orchestration, memory, human-in-the-loop systems, deployment, and business outcomes.

## Demo Steps

1. Open the dashboard.
2. Show the architecture pipeline.
3. Enter a test business URL.
4. Run analysis.
5. Show the website score and confidence.
6. Show pain points and opportunities.
7. Show the Obsidian memory note.
8. Show the outreach draft.
9. Approve the draft.
10. Explain how each layer can be swapped or scaled.

## Strong Closing Line

This is not just a prompt. It is a deployable workflow pattern for AI-enabled business operations.
