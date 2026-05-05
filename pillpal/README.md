# PillPal

PillPal is a lightweight course/demo web app for **medication reminders** and **basic chronic-disease health management**, built with **React + Vite**. It uses **Supabase** as the backend (Postgres + JS client) and includes a simple **phone-number login** flow, reminder confirmation tracking, and optional **device binding** (simulated).

## Features

- **Demo login** with a phone number (stored in a `users` table)
- **Medication reminders**: create / edit / delete reminders
- **Confirm reminders** and write events to an event table (e.g., `confirmed_by_app`)
- **Device binding**: bind a `device_id` to the current user
- **History**: view and filter pill events
- **Chronic disease pages** (e.g., Diabetes, Heart Disease, Mood, Respiratory, General) with a **dynamic detail page** route (`/disease/:id`)

## Tech Stack

- **React 18** + **Vite**
- **React Router** (client-side routing)
- **@tanstack/react-query** (data fetching/caching)
- **Supabase** (`@supabase/supabase-js`)
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives)

## Project Layout

This repository contains the app inside:

- `pillpal/` — Vite project root (run all npm commands here)

Key files/folders:

- `pillpal/src/main.jsx` — app bootstrap (providers + render)
- `pillpal/src/App.jsx` — router, auth guard, and main routes
- `pillpal/src/pages/` — route pages
- `pillpal/src/components/` — reusable components + UI
- `pillpal/src/api/` — API/Supabase calls (if present)
- `pillpal/src/lib/` — contexts, shared utilities, query client, etc.
- `pillpal/src/hooks/` — custom React hooks
- `pillpal/vite.config.js` — Vite config + `@` alias to `src`
- `pillpal/vercel.json` — SPA rewrite rules for Vercel

## Getting Started (Local)

### Prerequisites
- Node.js 18+ recommended

### Install
```bash
cd pillpal
npm install
```

### Environment Variables

Create a local env file (or adapt to your deployment platform):

```bash
# from inside the pillpal folder
cp .env.example .env.local
```

Then edit `pillpal/.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_DEFAULT_DEVICE_ID=demo_device_01
```

### Run
```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173/`).

## Routes (High Level)

- `/login` — login page
- `/` — reminders
- `/history` — event history
- `/device` — device binding
- `/profile` — profile/settings
- `/diabetes`, `/heart`, `/mood`, `/respiratory`, `/general` — disease modules
- `/disease/:id` — dynamic disease detail/config page

## Expected Supabase Tables (Example)

This app typically expects tables similar to:

### `users`
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `phone` (text, unique)

### `medication_reminders`
- `id` (bigint or uuid, primary key)
- `user_id` (uuid, foreign key → `users.id`)
- `remind_time` (time)
- `memo` (text)
- `is_active` (boolean)
- `created_at` (timestamp)

### `pill_event`
- `id` (bigint or uuid, primary key)
- `user_id` (uuid, foreign key → `users.id`)
- `event_time` (timestamp)
- `event_type` (text)
- `voltage` (numeric, nullable)
- `memo` (text, nullable)

### `device_bindings`
- `device_id` (text, primary key)
- `user_id` (uuid, foreign key → `users.id`)
- `bound_at` (timestamp, default `now()`)

> Note: If Row Level Security (RLS) is enabled, you must add policies accordingly (or disable RLS for a simpler demo setup).

## Scripts

From `pillpal/`:

- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint
- `npm run lint:fix` — fix lint issues
- `npm run typecheck` — run TypeScript typecheck (via `jsconfig.json`)

## Deployment Notes

- This is a single-page app (SPA) using client-side routing.
- `pillpal/vercel.json` rewrites all routes to `index.html` so direct navigation works on Vercel.

## License

Educational use.
