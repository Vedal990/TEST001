# PillPal

A simple pill reminder and device binding demo built with **React + Vite** and **Supabase**.

## Features

- Phone-based login (local demo auth backed by `users` table)
- Create / edit / delete medication reminders (`medication_reminders`)
- Confirm a reminder -> writes an event (`pill_event`, `confirmed_by_app`)
- Device binding screen (`device_bindings`) for firmware device id (default: `demo_device_01`)
- Event history view (`pill_event`) with filter chips

## Tech Stack

- React + Vite
- Supabase (Postgres + JS client)
- TailwindCSS + shadcn/ui

## Getting Started (Local)

```bash
cd pillpal
npm install
npm run dev
```

Then open the dev server URL printed in the terminal.

## Environment Variables

Create a file `pillpal/.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_DEFAULT_DEVICE_ID=demo_device_01
```

> `VITE_DEFAULT_DEVICE_ID` must match the firmware device id if you have a device simulator.

## Database Tables (Supabase)

This app expects these tables:

### `users`
- `id` (uuid, pk, default gen_random_uuid())
- `phone` (text, unique)

### `medication_reminders`
- `id` (bigint/uuid, pk)
- `user_id` (uuid, fk -> users.id)
- `remind_time` (time)
- `memo` (text)
- `is_active` (bool)
- `created_at` (timestamp)

### `pill_event`
- `id` (bigint/uuid, pk)
- `user_id` (uuid, fk -> users.id)
- `event_time` (timestamp)
- `event_type` (text)
- `voltage` (numeric, nullable)
- `memo` (text, nullable)

### `device_bindings`
- `device_id` (text, pk)
- `user_id` (uuid, fk -> users.id)
- `bound_at` (timestamp, default now())

## Notes

- This project no longer depends on Base44.
- If you see old Base44 references, they should be removed from configs/dependencies.