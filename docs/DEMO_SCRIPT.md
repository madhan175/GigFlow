# SalesFlow CRM — Demo Video Script (~90 seconds)

Use this script to record a portfolio / interview demo. Tools: **Windows Game Bar** (`Win + G`), **OBS Studio**, or **Loom**.

Save the final file as `assets/demo.mp4` or upload to **YouTube** and paste the link in `README.md`.

---

## Before recording

1. Backend running: `cd backend && npm run dev`
2. Frontend running: `cd frontend && npm run dev`
3. Have at least 3–5 sample leads in the database
4. Register one **admin** account for delete + Users page demo
5. Browser zoom: 100%, window maximized

---

## Scene 1 — Intro (10 sec)

**Say:**  
*"This is SalesFlow CRM — a mini lead intelligence dashboard for sales teams. Leads come from website, Instagram, and referrals."*

**Show:** Login page → sign in.

---

## Scene 2 — Dashboard (15 sec)

**Say:**  
*"The dashboard shows live KPIs, recent leads, and pipeline breakdown. Data refreshes every 30 seconds."*

**Show:** Dashboard home → point at stat cards → scroll recent leads.

---

## Scene 3 — Leads pipeline (25 sec)

**Say:**  
*"On the Leads page we have search with debouncing, combined filters, and pagination."*

**Do:**

1. Type in search box (wait for results)
2. Change status filter → Qualified
3. Click **Add Lead** → create one lead → Save
4. Click **eye** icon → detail modal
5. Click **Edit** → change status → Save

**Say (admin only):**  
*"Admins can delete leads; sales users cannot."*

---

## Scene 4 — Analytics & export (15 sec)

**Say:**  
*"Analytics pulls real stats from the API. Export downloads a CSV with current filters."*

**Show:** Analytics page → Leads → **Export CSV**.

---

## Scene 5 — Admin & settings (15 sec)

**Say:**  
*"Role-based access: admins see the Users page. Everyone can update profile and toggle dark mode."*

**Show:** Users page (admin) → Settings → toggle theme.

---

## Scene 6 — Backend mention (10 sec)

**Say:**  
*"The backend uses Express, MongoDB with dynamic queries, JWT auth, and bcrypt. Happy to walk through the API design."*

**Optional:** Quick flash of `README.md` API section or Postman.

---

## After recording

### Option A — YouTube (recommended for README embed)

1. Upload to YouTube (Unlisted or Public)
2. Copy video ID from URL: `youtube.com/watch?v=VIDEO_ID`
3. In `README.md`, replace `YOUR_VIDEO_ID` with that ID

### Option B — Local file in repo

```bash
# Place file here (keep under ~25MB for GitHub)
assets/demo.mp4
```

Uncomment the local video line in `README.md`.

### Option C — GIF preview (optional)

Convert a 15s clip to GIF for fast loading:

```bash
ffmpeg -i assets/demo.mp4 -t 15 -vf "fps=10,scale=1280:-1" assets/demo-preview.gif
```

---

## Suggested title & description (YouTube)

**Title:** SalesFlow CRM | React + Node + MongoDB Lead Dashboard  

**Description:**

```
Full-stack mini CRM with JWT auth, RBAC, debounced search, filters, pagination, CSV export, and live analytics.

Stack: React 19, TypeScript, Tailwind, Express, MongoDB, Mongoose

GitHub: [your-repo-url]
```
