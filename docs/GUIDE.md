# SalesFlow CRM — Full Documentation

> Short README with badges, screenshots, and video: [../README.md](../README.md)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Role-Based Access Control](#role-based-access-control)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [MongoDB Setup (Atlas)](#mongodb-setup-atlas)
- [Usage Guide](#usage-guide)
- [Problem-Solving Highlights](#problem-solving-highlights)
- [Screens & Pages](#screens--pages)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

---

## Overview

### Real-world scenario

A company collects leads from multiple channels. The sales team logs in daily to:

- View and manage the lead pipeline  
- Filter high-quality prospects  
- Update status (New → Contacted → Qualified / Lost)  
- Export data for reporting  

**SalesFlow CRM** packages this into a professional SaaS-style dashboard — not just a CRUD demo, but a focused **lead intelligence system**.

### What you get

| Layer    | Description                                      |
|----------|--------------------------------------------------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS      |
| Backend  | Node.js + Express + TypeScript                   |
| Database | MongoDB (local or Atlas)                         |
| Auth     | JWT (Bearer token) + bcrypt password hashing       |

---

## Features

### Authentication & users

- [x] User registration and login  
- [x] JWT-based session (token stored in `localStorage`)  
- [x] Protected routes via `Authorization: Bearer <token>`  
- [x] Profile update (name, email)  
- [x] Admin-only user list page  

### Leads management

- [x] Create, read, update, delete leads  
- [x] **Admin only** can delete leads  
- [x] **Sales** can create and edit leads  
- [x] Lead detail modal (view full record)  
- [x] Color-coded status badges: New, Contacted, Qualified, Lost  
- [x] Source tracking: Website, Instagram, Referral  

### Search, filter & sort

- [x] **Debounced search** (300ms) on name and email  
- [x] Filter by status and source (combinable)  
- [x] Sort by latest or oldest  
- [x] **Dynamic MongoDB query** built from query params  
- [x] Server-side pagination (10 per page)  

### Analytics & dashboard

- [x] Live KPI cards (total, qualified, conversion rate, new leads)  
- [x] Pipeline breakdown by status and source  
- [x] Dedicated **Analytics** page with charts  
- [x] Auto-refresh every **30 seconds**  

### Export & notifications

- [x] **CSV export** with current filters applied  
- [x] Notifications panel for new leads  

### UI/UX

- [x] Dark / light theme toggle  
- [x] Responsive layout (mobile nav + desktop sidebar)  
- [x] Loading states and empty states  
- [x] Professional SaaS-style layout  

---

## Tech Stack

### Frontend

| Technology     | Purpose                          |
|----------------|----------------------------------|
| React 19       | UI library                       |
| TypeScript     | Type safety                      |
| Vite 6         | Dev server & build               |
| Tailwind CSS 3 | Styling                          |
| Axios          | HTTP client                      |
| Lucide React   | Icons                            |
| Context API    | Auth, theme, leads state         |

### Backend

| Technology   | Purpose                    |
|--------------|----------------------------|
| Node.js      | Runtime                    |
| Express 4    | REST API                   |
| TypeScript   | Type safety                |
| Mongoose 8   | MongoDB ODM                |
| bcryptjs     | Password hashing           |
| jsonwebtoken | JWT auth                   |
| dotenv       | Environment config         |
| cors         | Cross-origin requests      |

---

## Project Structure

```
gigflow/
├── assets/                    # Screenshots & demo video
├── docs/
│   ├── GUIDE.md               # This file
│   └── DEMO_SCRIPT.md         # Video recording script
├── backend/
│   └── src/ ...
├── frontend/
│   └── src/ ...
└── README.md
```

---

## Architecture

### Authentication flow

```
1. User registers / logs in
2. Password hashed with bcrypt (salt rounds: 10)
3. Server signs JWT with user id
4. Client stores token in localStorage
5. Every API request sends: Authorization: Bearer <token>
6. protect middleware verifies JWT and loads user
7. restrictTo('admin') guards delete & user list routes
```

### Leads query flow (dynamic filtering)

```
Client query params → Controller builds MongoDB filter object
  ├── search  → $or regex on name + email
  ├── status  → exact match (if not "all")
  ├── source  → exact match (if not "all")
  └── sort    → createdAt -1 (latest) or 1 (oldest)

Pagination: skip = (page - 1) * limit, limit = 10
Stats: aggregated counts returned with same search scope
```

### Frontend state

```
AuthProvider     → user, login, logout, updateUser
ThemeProvider    → light / dark mode
LeadsProvider    → leads list, filters, CRUD, auto-refresh
```

---

## Database Schema

### User

```ts
{
  name: string,
  email: string,
  passwordHash: string,
  role: "admin" | "sales",
  createdAt: Date,
  updatedAt: Date
}
```

### Lead

```ts
{
  name: string,
  email: string,
  status: "new" | "contacted" | "qualified" | "lost",
  source: "website" | "instagram" | "referral",
  createdBy: ObjectId → User,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `name`, `email`, `status`, `source`, `createdAt`.

---

## Role-Based Access Control

| Action              | Admin | Sales |
|---------------------|:-----:|:-----:|
| View leads          |  ✅   |  ✅   |
| Create lead         |  ✅   |  ✅   |
| Edit lead           |  ✅   |  ✅   |
| Delete lead         |  ✅   |  ❌   |
| Export CSV          |  ✅   |  ✅   |
| View Users page     |  ✅   |  ❌   |
| Settings / profile  |  ✅   |  ✅   |

---

## API Reference

Base URL: `http://localhost:5000/api`

### Health

| Method | Endpoint   | Auth | Description        |
|--------|------------|------|--------------------|
| GET    | `/health`  | No   | Server health check |

> Health lives at `http://localhost:5000/health` (not under `/api`).

### Auth

| Method | Endpoint          | Auth   | Description              |
|--------|-------------------|--------|--------------------------|
| POST   | `/auth/register`  | No     | Register new user        |
| POST   | `/auth/login`     | No     | Login, returns JWT       |
| GET    | `/auth/me`        | Yes    | Current user profile     |
| GET    | `/auth/users`     | Admin  | List all users           |
| PATCH  | `/auth/profile`   | Yes    | Update name / email      |

### Leads (JWT required)

| Method | Endpoint            | Role   | Description                    |
|--------|---------------------|--------|--------------------------------|
| GET    | `/leads`            | Any    | List leads (filter + paginate) |
| POST   | `/leads`            | Any    | Create lead                    |
| GET    | `/leads/:id`        | Any    | Get single lead                |
| PUT    | `/leads/:id`        | Any    | Update lead                    |
| DELETE | `/leads/:id`        | Admin  | Delete lead                    |
| GET    | `/leads/export/csv` | Any    | Download CSV                   |

**GET `/leads` query params:** `search`, `status`, `source`, `sort`, `page`, `limit`

---

## Environment Variables

**Backend** (`backend/.env`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart-leads
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Getting Started

```bash
cd backend && npm install && cp .env.example .env
cd ../frontend && npm install && cp .env.example .env

cd ../backend && npm run dev    # port 5000
cd ../frontend && npm run dev   # port 5173
```

Register → add leads → explore Dashboard, Leads, Analytics, Settings.

---

## MongoDB Setup (Atlas)

1. Encode `@` in passwords as `%40`  
2. On Windows, prefer **standard** URI over `mongodb+srv` if you see `querySrv ECONNREFUSED`  
3. Whitelist your IP in Atlas Network Access  

---

## Usage Guide

| Page        | Description                                      |
|-------------|--------------------------------------------------|
| Dashboard   | KPIs, recent leads, pipeline breakdown           |
| Leads       | Full table, search, filters, pagination, CRUD    |
| Analytics   | Status & source charts from live data            |
| Users       | Team list (**admin only**)                       |
| Settings    | Profile edit + theme toggle                      |

---

## Problem-Solving Highlights

| Topic | Approach |
|-------|----------|
| Combined filters | Single dynamic `queryObject` in MongoDB |
| Search performance | Debounced input (300ms) + regex indexes |
| Security | bcrypt + JWT + role middleware |
| CSV export | Server-side with same filters as list |
| Live dashboard | 30s polling via `LeadsContext` |

---

## Scripts

| Location  | Command           | Description        |
|-----------|-------------------|--------------------|
| backend   | `npm run dev`     | Dev API server     |
| backend   | `npm run build`   | Compile TS         |
| frontend  | `npm run dev`     | Vite dev server    |
| frontend  | `npm run build`   | Production build   |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `EADDRINUSE :::5000` | Kill process on port 5000 or change `PORT` |
| `querySrv ECONNREFUSED` | Use standard MongoDB URI on Windows |
| `_mongodb._tcp.098` | URL-encode `@` in password as `%40` |
| Can't delete leads | Login as **admin** |

```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## Future Improvements

- [ ] HTTP-only cookies for JWT  
- [ ] Toast notifications  
- [ ] WebSockets for real-time sync  
- [ ] Docker Compose  
- [ ] Automated tests  
