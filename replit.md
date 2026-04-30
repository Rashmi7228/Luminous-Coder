# Workspace

## Overview

ASHA Care — an offline-first healthcare assistant for ASHA workers in rural India. Frontend-only React + Vite app with no backend, no authentication, and no server database. All patient data lives in the browser via IndexedDB. Voice input/output uses the Web Speech API. Sync is simulated.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **Frontend**: React + Vite + Tailwind CSS + wouter
- **Local storage**: IndexedDB via `idb`
- **Forms**: react-hook-form + zod
- **Icons**: lucide-react
- **Toasts**: sonner
- **QR codes**: `qrcode.react`
- **Voice**: Web Speech API (SpeechRecognition + speechSynthesis)

## Artifacts

- `artifacts/asha-care` — main offline-first ASHA Care web app (root, `/`)
- `artifacts/api-server` — Express API at `/api`. Hosts only the AI symptom-check endpoint at `POST /api/symptom-check` (Anthropic via Replit AI Integrations).
- `artifacts/mockup-sandbox` — design canvas, not used by ASHA Care

## Key Commands

- `pnpm --filter @workspace/asha-care run dev` — run the ASHA Care app locally
- `pnpm --filter @workspace/asha-care run build` — production build
- `pnpm run typecheck` — full typecheck across all packages

## Notes

- The app is offline-first. The only network feature is the AI Symptom Checker in the Patient Portal, which calls `/api/symptom-check`. All other features (records, history, risk, education, QR, sync animation) work without internet.
- IndexedDB access is centralized in `artifacts/asha-care/src/lib/db.ts` (DB version 2 — added `vitals[]` per-patient).
- The risk engine is a pure function in `artifacts/asha-care/src/lib/risk.ts`.
- Health education content is static data in `artifacts/asha-care/src/data/`.
- Sync is simulated — it just timestamps records and shows a fake progress animation.
- Recovery & Health Trend chart on the patient detail page uses `recharts` and reads `patient.vitals[]`. Each new BP reading entered through the form auto-appends a vital entry.
- AI Symptom Checker (Portal): voice or text input → `POST /api/symptom-check` → JSON response (summary, likely causes, home techniques, OTC remedies, urgency). Response strings are returned in the selected regional language and read aloud via the existing `useSpeech` TTS hook.
- UI translations live in `artifacts/asha-care/src/i18n/translations.ts` (7 languages: en/hi/kn/ta/te/bn/mr). Components call the `useT()` hook (see `src/hooks/use-t.ts`) which reads `settings.language` from IndexedDB. The language picker in App Controls (and inside the Patient Portal) writes back to `settings.language`, so changing it translates the entire UI, picks the matching TTS voice, and tells the AI which language to respond in — single source of truth.
- TTS (`src/hooks/use-speech.ts`) loads voices via `voiceschanged`, picks an exact-locale voice (preferring `*-IN`), splits long text into ~180-char chunks on sentence boundaries to avoid Chrome's truncation bug, and exposes `isSpeaking` + `stopSpeaking()`. The Portal's "Listen" button toggles to "Stop" while speech is playing and reads the full guidance (summary, causes, techniques, remedies, urgency, disclaimer).
