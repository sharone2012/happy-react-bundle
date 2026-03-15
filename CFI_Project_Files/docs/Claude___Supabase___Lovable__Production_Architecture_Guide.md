# Claude + Supabase + Lovable: production architecture guide

**The most reliable production architecture for Claude-powered file processing into Supabase is a Lovable React app with Supabase Edge Functions as middleware** — not the Supabase MCP connector, which Supabase itself explicitly warns against using in production. For a non-developer CEO uploading files regularly, the stack works like this: a Lovable-generated React app provides the upload UI and dashboard, an Edge Function receives the file and calls the Claude API for extraction and validation, and the Edge Function writes structured results to Supabase PostgreSQL using a controlled service_role client. The frontend reads data live using the direct `@supabase/supabase-js` client with Realtime subscriptions. This entire stack costs roughly **$30–40/month** and can be built in a few hours through Lovable's chat-based development.

---

## How Lovable pulls live data from Supabase

Lovable has a **native, first-class Supabase integration** — it is the platform's primary backend. When you connect a Supabase project (via Settings → Integrations → Supabase), Lovable auto-generates a `@supabase/supabase-js` client with `createClient()` using your project URL and publishable key. This is the direct client pattern, and it is the correct default approach — no intermediate API layer is needed for standard data reads.

The auto-generated client code follows this pattern:

```typescript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

For **live/real-time data** (so the CEO sees new records appear immediately after Claude processes a file), the 2025/2026 best practice uses the channel-based Realtime API with `postgres_changes` for simpler setups, or the newer **Broadcast** pattern with database triggers for production scale. Supabase now recommends Broadcast as the primary mechanism for most production use cases, with `postgres_changes` reserved for development and low-traffic scenarios.

The critical detail: **no API layer is needed between Lovable and Supabase for reading data**. Supabase's auto-generated REST API combined with Row Level Security provides database-level access control, eliminating the need for a custom backend. Edge Functions are only needed when you must call external APIs with secret keys (like the Claude API), process payments, or run complex server-side logic. Lovable generates both patterns — direct client calls for CRUD and Edge Functions for backend logic — all from plain English prompts.

Supabase is also transitioning to new **publishable keys** (`sb_publishable_xxx`) replacing the legacy `anon` JWT keys, with both types working during the transition through mid-2026.

---

## Three ways Claude can write to Supabase, and which one to use

There are fundamentally three mechanisms, each with very different production-readiness profiles.

**The Supabase REST API via Edge Functions is the production answer.** Your application code (an Edge Function) calls the Claude API to process files, parses Claude's structured response, then executes HTTP POST/PATCH calls against Supabase's auto-generated PostgREST endpoints using the `service_role` key. This gives you full control over validation, error handling, rate limiting, and security. The REST API is instant, auto-generated from your schema, and designed for production workloads.

**The Claude API with tool_use is the recommended integration pattern.** You define tools as JSON schemas (e.g., `insert_record`, `validate_data`), Claude returns structured `tool_use` content blocks, and your code executes the actual Supabase writes. The Anthropic SDK includes a tool runner (available in Python, TypeScript, and Ruby) that automates this request-response loop. This is the pattern that every serious production implementation uses.

**Direct PostgreSQL connections** are viable only from your application code — Claude itself cannot open TCP connections or network sockets. Your Edge Function or backend server would use standard PostgreSQL drivers through Supabase's connection pooler (Supavisor). This is appropriate for complex queries but unnecessary for most insert/update operations where the REST API suffices.

---

## Supabase MCP is real, but it is not for production

The Supabase MCP server (at `github.com/supabase-community/supabase-mcp`, **2,500+ stars**) is an official tool that bridges Claude to your Supabase project using the Model Context Protocol. It provides **20+ tools** including `execute_sql` (arbitrary SQL execution), `apply_migration` (schema changes), `list_tables`, `deploy_edge_function`, and project management operations. Authentication uses OAuth 2.1, and the hosted remote server runs at `https://mcp.supabase.com/mcp`.

The connector works from **Claude.ai directly** — not just Claude Desktop. Supabase is now an official Claude plugin with over **26,000 installs**, accessible on Pro, Max, Team, and Enterprise plans via Settings → Integrations. It also works on Claude mobile apps (iOS/Android since July 2025).

However, Supabase's own documentation repeatedly warns: **"Don't connect to production"** and **"Supabase MCP is only designed for development and testing purposes."** The reasons are serious. When write mode is enabled (`read_only=false`), Claude can execute arbitrary SQL including destructive operations. Prompt injection risks mean the LLM could run unintended queries. There is no built-in input validation, rate limiting, or audit trail. The MCP protocol itself is still evolving — the 2026 roadmap (published March 9, 2026) identifies gaps in horizontal scaling, stateless sessions, and enterprise features. A security report found **53% of MCP servers use static credentials**, and a CVE was published for Claude Code MCP integration vulnerabilities.

For the CEO's use case — **prototyping and validating data extraction prompts** — MCP is excellent. Connect it to a development Supabase project, upload test files in Claude.ai, and iterate on extraction logic. Then build the production pipeline using Edge Functions.

---

## The four approaches compared side by side

Understanding the spectrum from manual to fully automated is essential for choosing the right architecture.

**Approach (a): Claude generates SQL, user pastes manually.** This is the lowest-tech option. Claude processes a file, outputs INSERT statements, and the CEO runs them in the Supabase SQL Editor. It works but is error-prone, tedious, and completely unscalable. No validation occurs beyond what Claude includes in the SQL. There is zero automation — every upload requires manual copy-paste-execute.

**Approach (b): Claude uses Supabase MCP to write directly.** The CEO uploads a file in Claude.ai, Claude processes it, and uses MCP tools to execute SQL against the database. This is semi-automated — the human is still in the loop (uploading and prompting), but Claude handles the database interaction. It is excellent for ad-hoc processing and development, limited by MCP's production-readiness warnings and the manual per-upload workflow.

**Approach (c): Lovable app with AI-powered upload pipeline.** The CEO opens a web app, drags a file onto an upload area, and walks away. The Edge Function processes the file through Claude API, validates the extracted data, writes it to the database, and the dashboard updates in real time. This is fully automated from the CEO's perspective — **2–3 clicks per upload** with no SQL knowledge required. Validation logic is programmable and consistent. This is the production architecture.

**Approach (d): Orchestration platform (Make.com/n8n).** The CEO drops a file in Google Drive or a watched folder. Make.com or n8n detects it, sends it to Claude API, and writes results to Supabase. This offers the most robust error handling (automatic retries, failure alerts, visual debugging) with potentially **1–2 steps** for the CEO. Make.com starts at ~$10/month with native Claude and Supabase integrations.

| Factor | (a) Manual SQL | (b) MCP Direct | (c) Lovable Pipeline | (d) Make.com/n8n |
|--------|---------------|----------------|---------------------|-----------------|
| CEO effort per upload | High (copy/paste) | Medium (upload + prompt) | Low (upload + wait) | Lowest (drop file) |
| Automation | None | Semi-automated | Fully automated | Fully automated |
| Data validation | None | Conversational | Programmable | Programmable |
| Production-ready | No | No (per Supabase) | Yes | Yes |
| Custom dashboard | No | No | Yes | No (needs frontend) |
| Monthly cost | ~$0 | ~$17 | ~$30–40 | ~$15–25 |

---

## The simplest reliable production architecture for a non-developer CEO

The recommended progression has three phases, starting with zero development.

**Phase 1 (today, $17/month): Claude.ai + Supabase MCP on a development project.** The CEO enables the Supabase connector in Claude.ai, connects a non-production Supabase project, and starts uploading files. This validates the entire concept — what data Claude can extract from your specific file types, what database schema makes sense, and what validation rules matter. All file types (PDF, Excel, Word, JSON) are natively supported in Claude.ai with no conversion needed. This phase costs only a Claude Pro subscription.

**Phase 2 (production, ~$30/month): Lovable React app with Edge Function pipeline.** Once extraction logic is validated, build the production system in Lovable. Prompt Lovable to create: (1) a file upload page with drag-and-drop supporting PDF, Excel, Word, and JSON, (2) Supabase Storage for file persistence, (3) an Edge Function that fetches uploaded files, calls the Claude API with your validated extraction prompt, and writes structured results to a `processed_data` table, and (4) a dashboard page showing extracted data with filtering, search, and status indicators. Lovable generates all of this — React components, database schema, Edge Functions, and wiring — from conversational prompts in roughly **2–4 hours**.

The production data flow looks like this: CEO opens app → drags file to upload zone → file stored in Supabase Storage → Edge Function triggers → Claude API extracts and validates data → Edge Function writes to PostgreSQL → dashboard auto-updates via Realtime subscription → CEO sees results within seconds.

**Phase 3 (scale, ~$40–55/month): Add Make.com for robustness.** If upload volume grows or you need multi-source triggers (email attachments, Google Drive folders, form submissions), add Make.com as the orchestration layer. It provides professional-grade error handling with automatic retries, failure alerts, and visual workflow debugging that Edge Functions alone do not offer.

For file processing specifics: PDFs work natively with the Claude API (send as base64, **1,500–3,000 tokens per page**). Excel files should be converted to CSV server-side before sending to Claude. Word files can be converted to plain text or PDF. JSON and CSV pass directly as text content. Claude's **200,000-token context window** handles documents up to roughly 500 pages.

---

## Securing Supabase when an AI pipeline writes to your database

The `service_role` key **completely bypasses all Row Level Security policies** — this is the single biggest security risk in the architecture. When your Edge Function uses this key to write Claude-processed data, there is zero database-level access control protecting other tables or rows. A defense-in-depth approach is essential.

**Use Edge Functions as a controlled gateway.** The Edge Function authenticates the incoming request (via a custom API key stored in Supabase Secrets), validates and sanitizes all input data against a strict schema, then uses the `service_role` client internally to write only to specific allowed tables. This pattern confines the powerful service_role key to a narrow, controlled code path.

**Apply database-level constraints that work regardless of role.** CHECK constraints, NOT NULL constraints, foreign keys, and UNIQUE constraints are enforced even when `service_role` bypasses RLS. A BEFORE INSERT trigger should validate business logic, force the `created_by` field to `'ai_pipeline'`, set `is_approved` to `false` (requiring human review), and ensure `user_id` comes from the authenticated context rather than from AI-generated input. Supabase also supports JSON schema validation via the `pg_jsonschema` extension for JSONB columns.

**Isolate AI-writable tables in a private schema.** Supabase's hardening guide recommends creating a private schema (e.g., `ai_data`) that is not exposed via the Data API. Tables in non-exposed schemas can only be accessed via Edge Functions or direct connections, preventing any accidental client-side access. For multi-tenant scenarios, every row must be tagged with the correct `user_id` — and critically, this ID should be derived from the authenticated user's JWT in the Edge Function, **never from AI-generated input**.

**Implement audit logging for all AI writes.** An AFTER INSERT trigger should log every AI write to an `ai_audit_log` table, capturing the table name, operation type, new data, and timestamp. This creates an immutable record of everything the AI pipeline has written, enabling forensic review and compliance.

The security architecture in summary: request authentication at the Edge Function → input validation and sanitization → controlled `service_role` write to specific tables → database CHECK constraints and triggers → RLS policies protecting data for user-facing queries → audit logging for all operations.

Key rules: never expose the `service_role` key in client-side code. Never let the AI determine its own `user_id`. Never trust AI-generated content without validation. Use the new `sb_secret_` keys (which reject browser-origin requests) instead of legacy `service_role` JWTs where possible. Test RLS policies with pgTAP.

---

## Known limitations and issues as of early 2026

The **Supabase MCP is explicitly not production-ready** per Supabase's own documentation. Write mode must be manually enabled by removing `read_only=true`, and even then, Claude can execute destructive SQL including cascading deletes. Prompt injection remains an unsolved risk — a malicious file could theoretically influence Claude's SQL generation.

The **MCP protocol itself is still maturing**. The November 2025 spec introduced OAuth 2.1 and async tasks, but the March 2026 roadmap identifies remaining gaps: horizontal scaling challenges with stateful sessions, no standard metadata discovery without a live connection, and enterprise features (audit trails, SSO, gateway patterns) still undefined. MCP was donated to the Linux Foundation's Agentic AI Foundation, but governance structures are still being established.

**Claude.ai's MCP integration has friction points.** While remote MCP servers work via Integrations on paid plans, tools must be enabled per-conversation. It is not as seamless as Claude Code where MCP tools are always available. Claude itself cannot make HTTP requests — all external operations require the tool_use → application code → external service pattern.

**File processing has practical limits.** The 200K-token context window handles most documents, but very large Excel workbooks or multi-hundred-page PDFs may require chunking. Excel files need server-side conversion to CSV before sending to the Claude API (unlike Claude.ai which handles .xlsx natively with the Analysis Tool). Edge Functions have execution time limits, so very large files may need async processing patterns.

**Rate limits affect pipeline throughput.** Both the Claude API and Supabase have rate limits. Running hundreds of file processing jobs simultaneously requires queuing logic, which Edge Functions alone do not provide — this is where orchestration tools like Make.com or n8n add significant value with built-in retry logic, rate limit handling, and failure alerting.

## Conclusion

The architecture that best serves a non-developer CEO is not the flashiest one — it is the Lovable React app backed by Supabase Edge Functions calling the Claude API. This pattern keeps the AI processing server-side (where API keys are secure), provides a polished upload-and-dashboard experience, and uses battle-tested infrastructure (Supabase PostgreSQL, Deno Edge Functions, Claude's Messages API) rather than still-maturing protocols. Start with Claude.ai + MCP to prototype your data extraction logic, then build the production pipeline in Lovable. The Supabase MCP connector is a powerful development tool, not a production data pipeline — and that distinction is the most important architectural decision in this entire stack.