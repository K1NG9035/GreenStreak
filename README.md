# 🟩 GreenStreak

**Track your habits like you track your commits.**

GreenStreak is a full-stack habit tracker with a GitHub-style contribution heatmap, streak analytics, and a clean, modern dashboard — built with Next.js, TypeScript, Prisma, and Tailwind CSS.

![GreenStreak Dashboard](https://via.placeholder.com/900x420?text=GreenStreak+Dashboard+Preview)

---

## ✨ Features

- **Habit Management** — create, edit, archive, and delete habits with custom colors, categories, and target frequencies
- **Quick Daily Logging** — one-tap toggles/counters for today's habits, with the ability to backfill any past date
- **Contribution Heatmap** — a full 365-day GitHub-style grid, both for overall activity and per-habit views, with hover tooltips and an intensity legend
- **Streak Analytics** — current streak, longest streak, total completions, and completion rate, recalculated automatically on every log
- **Weekly/Monthly Charts** — visual consistency trends per habit
- **Dark/Light Mode** — theme toggle powered by `next-themes`
- **Fully Responsive** — mobile, tablet, and desktop layouts
- **Micro-interactions** — checkmark/confetti animation on habit completion

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui + Lucide Icons |
| Database | PostgreSQL (or SQLite for local dev) |
| ORM | Prisma |
| Dates | date-fns |
| Theming | next-themes |

---

## 📁 Project Structure

```
greenstreak/
├── prisma/
│   └── schema.prisma
├── lib/
│   ├── streak-calculator.ts
│   └── heatmap-utils.ts
├── components/
│   ├── ActivityHeatmap.tsx
│   ├── HabitCard.tsx
│   └── ThemeToggle.tsx
├── app/
│   ├── page.tsx                  # Dashboard
│   ├── habits/
│   │   ├── new/page.tsx          # Create habit
│   │   └── [id]/page.tsx         # Habit detail
│   └── api/
│       └── habits/
│           ├── route.ts          # GET/POST habits
│           └── [id]/route.ts     # GET/PATCH/DELETE + completions
├── .env.example
└── package.json
```

---

## 🚀 Getting Started (Local Development)

### 1. Clone & install

```bash
git clone https://github.com/<your-username>/greenstreak.git
cd greenstreak
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/greenstreak?schema=public"
# For local dev without Postgres installed, you can instead use SQLite:
# DATABASE_URL="file:./dev.db"
```

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run the dev server

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

## 🖥️ Desktop App

GreenStreak can also run as a Windows desktop application. Its SQLite database is stored in the Windows application data directory, so habits remain saved between launches and are independent of the source folder.

```bash
npm run desktop:build
```

Open `dist/win-unpacked/GreenStreak.exe` after the build completes. For a traditional NSIS installer, run `npm run desktop:installer` with Windows Developer Mode enabled or with symlink creation permissions.

---

## ☁️ Deployment

GreenStreak is designed to deploy in minutes on **Vercel** with a managed Postgres provider.

### Option A: Vercel + Neon (recommended, free tier available)

1. Push your repo to GitHub.
2. Create a free Postgres database at [neon.tech](https://neon.tech) and copy the connection string.
3. Go to [vercel.com/new](https://vercel.com/new) and import your repo.
4. Add environment variable:
   - `DATABASE_URL` = your Neon connection string
5. Set the build command to include Prisma generation:
   ```
   npx prisma generate && npx prisma migrate deploy && next build
   ```
6. Deploy. Vercel will give you a live URL immediately.

### Option B: Vercel + Supabase

Same steps as above — just swap in your Supabase Postgres connection string as `DATABASE_URL`.

### Option C: Docker (self-hosted)

```bash
docker build -t greenstreak .
docker run -p 3000:3000 --env-file .env greenstreak
```

> 💡 Note: SQLite is great for local dev but not recommended for production on serverless platforms like Vercel (no persistent disk). Use Postgres in production.

---

## 🗄️ Database Schema Overview

- **User** — id, email, createdAt
- **Habit** — id, userId, title, description, category, frequency, targetCount, targetUnit, color, archived, timestamps
- **HabitCompletion** — id, habitId, date, completionCount, timestamps

Cascade deletes are configured so removing a habit cleans up its completion history; archiving is a soft-delete flag instead of a hard delete.

---

## 📊 How Intensity Is Calculated

Each heatmap cell's color intensity is derived from:

```
intensity = (completions for that day) / (target count for that habit) × 100%
```

Buckets: `0%` (empty) → `1–33%` (low) → `34–66%` (medium) → `67%+` (high)

---

## 🛣️ Roadmap Ideas

- [ ] Habit reminders / notifications
- [ ] Export data as CSV
- [ ] Multi-user shared habit challenges
- [ ] Mobile app (React Native)

---

## 📄 License

MIT — free to use, modify, and deploy.

## 📚 File Guide

- `prisma/schema.prisma` defines users, habits, and unique per-day completion records with cascade deletes.
- `lib/streak-calculator.ts` contains frequency-aware streak and completion-rate calculations.
- `lib/heatmap-utils.ts` converts completion records into 365-day intensity cells and tooltip data.
- `components/ActivityHeatmap.tsx` renders the responsive contribution grid and legend.
- `components/HabitCard.tsx` provides optimistic daily increment/decrement controls.
- `components/HabitForm.tsx` handles both create and edit flows.
- `components/ConsistencyCharts.tsx` renders the weekly and monthly detail charts.
- `app/api/habits` exposes habit CRUD, archive, and idempotent completion logging endpoints.
- `app/page.tsx` is the server-rendered dashboard; `app/habits` contains creation and analytics views.

---

Built with focus, consistency, and a little bit of green. 🟩
