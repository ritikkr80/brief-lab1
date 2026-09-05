# Brief Lab — AI Pre-Production Layer

Brief Lab is an AI creative pre-production companion built for the HexCoded platform. It transforms rough product briefs into structured creative concepts, shot lists, casting direction, and node-based production workflows — before a single frame is rendered.


## What it does

1. **Enter a brief** — paste a product description, or drop a URL to auto-extract product info
2. **Generate concepts** — Claude AI creates 1–3 distinct creative strategies, each with shot lists, dialogue, and casting specs
3. **Route to tools** — each concept is matched to the right HexCoded tool (Talking Actors, Kling, Creative Studio, etc.)
4. **Localize** — instantly adapt dialogue and cultural framing for India, US, UK, Japan, Germany, France
5. **Build a workflow** — convert any concept into a React Flow node graph, then export the JSON

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (custom editorial design system) |
| AI | Anthropic Claude (`@anthropic-ai/sdk`) |
| URL Scraping | Firecrawl API |
| Database | In-memory (demo) / Supabase PostgreSQL (production) |
| Workflow Canvas | React Flow (`@xyflow/react`) |
| Validation | Zod v4 |
| Animation | Framer Motion |
| Fonts | DM Serif Display + Inter + Geist Mono |
| Deployment | Vercel |

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/brief-lab
cd brief-lab
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

| Variable | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Yes | [Anthropic Console](https://console.anthropic.com) |


> **Zero-config mode:** Without any API keys, the app still works — it uses a high-fidelity built-in concept engine to generate realistic water bottle / product ad concepts. Ideal for recruiter demos.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
open [https://brief-lab1.vercel.app/]
---

## Architecture

```
User
 │
 ▼
Brief Lab UI (Next.js 16, React 19)
 │
 ▼
API Orchestrator (Next.js Route Handlers — server-side only)
 │
 ├── /api/research    → Firecrawl → product extraction
 ├── /api/concepts    → Claude AI → structured concepts (Zod-validated)
 ├── /api/concepts/[id]/localize → Claude AI → cultural dialogue rewrite
 ├── /api/concepts/[id]/workflow → React Flow graph generation
 └── /api/tools       → HexCoded tool catalog
 │
 ▼
Anthropic Claude        Firecrawl        Supabase / In-Memory
```

### Security

- `ANTHROPIC_API_KEY` is **never exposed** to the browser — all AI calls go through Next.js server routes
- `SUPABASE_SERVICE_ROLE_KEY` is server-only
- Client only receives `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## HexCoded tool catalog

The AI is injected with a curated tool catalog at generation time:

| Tool | Category | Best for |
|---|---|---|
| Talking Actors | Video | UGC testimonials, direct-to-camera |
| Kling | Video | Fluid dynamics, macro product b-roll |
| Runway Gen-3 Alpha | Video | Cinematic camera movement |
| Creative Studio | Creative | Product packshots, compositing |
| ElevenLabs | Audio | Voiceover, localized audio |
| Captions AI | Post | Kinetic subtitles, CTA overlays |

Claude **only recommends tools from this catalog** — it cannot hallucinate new tools.

---


## Folder structure

```
brief-lab/
├── app/
│   ├── page.tsx              # Main landing + brief form + concept results
│   ├── layout.tsx            # Fonts, metadata, global styles
│   ├── globals.css           # Design tokens, paper card styles, React Flow overrides
│   └── api/
│       ├── concepts/route.ts           # POST: generate concepts
│       ├── concepts/[id]/route.ts      # GET: fetch concept
│       ├── concepts/[id]/localize/     # POST: localize dialogue
│       ├── concepts/[id]/workflow/     # POST: build workflow graph
│       ├── research/route.ts           # POST: scrape product URL
│       └── tools/route.ts              # GET: tool catalog
│
├── components/
│   ├── brief-form.tsx         # Main form with URL analyzer
│   ├── concept-card.tsx       # Physical briefing sheet card
│   ├── concept-list.tsx       # Concept grid layout
│   ├── header.tsx             # Editorial fixed header
│   ├── loading-state.tsx      # Progressive loading animation
│   ├── localization-modal.tsx # Locale picker + dialog
│   ├── shot-list.tsx          # Shot list renderer
│   ├── tool-badge.tsx         # Tool recommendation pill
│   └── workflow-canvas.tsx    # React Flow canvas + export
│
├── lib/
│   ├── anthropic.ts           # Claude client + concept/localization generation
│   ├── firecrawl.ts           # URL scraper + HTML fallback
│   ├── supabase.ts            # DB client + in-memory fallback
│   ├── prompts.ts             # System + user prompt builders
│   ├── tool-router.ts         # Capability-based tool matching
│   └── utils.ts               # Helpers
│
├── schemas/
│   ├── brief.ts               # Brief form Zod schema
│   ├── concept.ts             # Concept Zod schema (strict)
│   └── workflow.ts            # Workflow node/edge schema
│
└── data/
    └── hexcoded-tools.ts      # Static HexCoded tool catalog
```

---

## Design system

| Token | Value | Usage |
|---|---|---|
| `--page` | `#F7F5F0` | Page background |
| `--text` | `#171717` | Primary text |
| `--muted` | `#6F6A61` | Secondary text |
| `--border` | `#DDD8CE` | Borders and dividers |
| `--paper` | `#F1EBDD` | Card backgrounds |
| `--accent` | `#EF432F` | CTAs and highlights |

