# Running ASHA Care locally in VS Code

This guide walks you through cloning the project from Replit, opening it in
VS Code on your own computer, and running the full app (frontend + AI
backend) end-to-end.

The app is offline-first. Only the AI Symptom Checker needs internet — the
rest works fully offline once loaded.

---

## 1. Prerequisites

Install these once:

| Tool | Version | Where |
| --- | --- | --- |
| Node.js | 20.12 or newer | https://nodejs.org/ (LTS is fine) |
| pnpm | 9 or newer | `npm install -g pnpm` |
| Git | any | https://git-scm.com/ |
| VS Code | latest | https://code.visualstudio.com/ |

Recommended VS Code extensions (optional but helpful):
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense

Verify everything is installed:

```bash
node --version    # v20.12.x or higher
pnpm --version    # 9.x or higher
git --version
```

---

## 2. Get the code

In Replit, open the Git pane (left sidebar) and either:
- Connect the project to your own GitHub repo and clone from there, or
- Use the "Download as ZIP" option in the project menu.

Then on your computer:

```bash
git clone <your-repo-url> asha-care
cd asha-care
code .                 # opens VS Code in the project folder
```

---

## 3. Install dependencies

In the VS Code terminal (`Ctrl+`` `) run:

```bash
pnpm install
```

This installs every workspace package (`asha-care`, `api-server`, shared libs).

---

## 4. Add your Anthropic API key

The AI Symptom Checker calls Anthropic's Claude. On Replit this is wired up
automatically; locally you provide your own key.

1. Get a key at https://console.anthropic.com/settings/keys
2. Copy `.env.example` to `.env` at the **project root**:

   ```bash
   cp .env.example .env
   ```

3. Open `.env` and paste your key:

   ```env
   ANTHROPIC_API_KEY=sk-ant-your-real-key-here
   ```

> **Note:** Without a key, the rest of the app still works. Only the AI
> Symptom Checker page will return a 503 error.

---

## 5. Run the app

### Option A — One command (recommended)

From the project root:

```bash
pnpm run dev
```

This starts both the Express API server and the React frontend in parallel.

You should see output similar to:

```
[dev:api]  Server listening { port: 3001 }
[dev:web]  VITE v7.x  ready in 400 ms
[dev:web]  ➜ Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser.

### Option B — Two separate terminals

If you prefer one terminal per process:

```bash
# Terminal 1 — API server
pnpm run dev:api

# Terminal 2 — frontend
pnpm run dev:web
```

---

## 6. Try it out

1. Visit http://localhost:5173
2. Use the "Role" dropdown in the sidebar to switch between ASHA Worker,
   Doctor, Supervisor, and Patient Portal.
3. Switch the "Language" dropdown to Hindi, Kannada, Tamil, etc. — the entire
   UI translates instantly.
4. Go to the Patient Portal, type or speak symptoms, and click "Get AI
   Guidance" to test the AI integration.
5. Toggle airplane mode / disconnect the network to confirm offline support
   for everything except the AI page.

---

## 7. Build a production bundle (optional)

```bash
pnpm run build              # type-checks then builds every artifact
```

To preview the production frontend:

```bash
pnpm --filter @workspace/asha-care run serve
```

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `Use pnpm instead` | Install pnpm: `npm install -g pnpm` |
| `EADDRINUSE: 5173` or `3001` | Another app is using the port. Run `PORT=5174 pnpm run dev:web` (or `PORT=3002 API_PORT=3002 pnpm run dev:api`). |
| AI page returns 503 | `ANTHROPIC_API_KEY` is missing or wrong in `.env`. Restart `pnpm run dev` after editing `.env`. |
| Voice (mic / speaker) not working | Web Speech API is Chrome/Edge/Safari only. Firefox has limited support. Use HTTPS or `localhost`. |
| IndexedDB has stale data | In DevTools → Application → IndexedDB, delete the `asha-care` database, then refresh. |
| Windows shell errors with `PORT=...` | Use PowerShell: `$env:PORT=5173; pnpm run dev:web`, or install `cross-env` and adjust the script. |

---

## Project structure

```
asha-care/
├── artifacts/
│   ├── asha-care/          # React + Vite frontend (port 5173)
│   └── api-server/         # Express AI backend (port 3001)
├── lib/                    # Shared TypeScript libraries
├── .env                    # YOUR local secrets (git-ignored)
├── .env.example            # Template
└── package.json            # Root scripts (dev, build, ...)
```

That's it. Happy hacking.
