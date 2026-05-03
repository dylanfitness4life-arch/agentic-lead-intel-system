# iPad-Only Deployment Guide

This guide assumes you have only an iPad.

## Accounts Needed

Create accounts for:

- GitHub
- Render or Railway
- Supabase
- Firecrawl
- OpenAI or OpenRouter
- Lovable

## Step 1 — Create GitHub Repository

1. Open GitHub in Safari.
2. Create a new repository named:

```text
agentic-lead-intel-system
```

3. Upload the files from this package.

Recommended method on iPad:

- Unzip the package in Files.
- Open GitHub repo.
- Use **Add file → Upload files**.
- Upload folders in batches if GitHub does not accept the whole folder at once.

## Step 2 — Create Supabase Project

1. Open Supabase.
2. Create a new project.
3. Go to SQL Editor.
4. Paste the contents of:

```text
supabase/schema.sql
```

5. Run it.
6. Copy:
   - Project URL
   - Service role key

Do not expose the service role key in frontend code.

## Step 3 — Deploy Backend on Render

1. Open Render.
2. New → Web Service.
3. Connect GitHub repository.
4. Select the backend folder if prompted.
5. Use:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

6. Add environment variables:

```text
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FIRECRAWL_API_KEY=your_firecrawl_key
OPENAI_API_KEY=your_openai_or_openrouter_key
OPENAI_MODEL=gpt-4.1-mini
OPENAI_BASE_URL=https://api.openai.com/v1
DEMO_MODE=false
NODE_ENV=production
```

If you do not have every API key yet, keep:

```text
DEMO_MODE=true
```

The app will still run.

## Step 4 — Test Backend

Open:

```text
https://your-render-url.onrender.com/health
```

Expected:

```json
{
  "ok": true,
  "service": "agentic-lead-intel-backend"
}
```

## Step 5 — Build Frontend in Lovable

1. Open Lovable.
2. Create new project.
3. Paste the full prompt from:

```text
lovable/lovable-prompt.md
```

4. Set:

```text
VITE_BACKEND_URL=https://your-render-url.onrender.com
```

5. Publish the app.

## Step 6 — Recruiter Package

Send recruiters:

1. Live Lovable app link
2. GitHub repository link
3. Short demo video
4. README summary

## Step 7 — Demo Script

Use:

```text
docs/recruiter-demo-script.md
```

## Critical Security Rule

Never put these in Lovable frontend code:

- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY
- FIRECRAWL_API_KEY

They belong only in the backend environment variables.
