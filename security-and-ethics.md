# Security and Ethics

## Human Review

The system does not send outreach automatically. It creates a draft and requires approval.

## Scraping Boundaries

The scraper should be used only for public business website information. Respect:

- robots.txt
- website terms
- rate limits
- privacy expectations
- opt-out requests

## No False Claims

The reasoning layer should not claim:

- exact traffic numbers
- revenue impact
- Google ranking positions
- analytics data
- private business performance

unless those facts are verified by first-party data.

## Secret Management

Never expose backend keys in frontend code.

Keep these server-side only:

- Supabase service role key
- Firecrawl API key
- OpenAI/OpenRouter API key

## Recruiter Demo Mode

Demo mode exists so the system can remain functional without live scraping or paid model calls.
