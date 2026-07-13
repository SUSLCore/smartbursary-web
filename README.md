# SmartBursary Web

A role-based bursary management platform for universities, built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Redux Toolkit**.

The system manages the full lifecycle of monthly bursary documents — from initial upload by a Faculty MA officer through multi-step signing and approval, all the way to final acceptance by the Student Services office.

---

## Table of Contents

- [Features](#features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Proxy](#api-proxy)
- [State Management](#state-management)
- [Authentication & Route Protection](#authentication--route-protection)

---

## Features

- **Role-based dashboards** — each user role gets a dedicated dashboard with only the actions relevant to them.
- **Monthly bursary document workflow** — Faculty MA uploads a bursary list, which then passes through multiple approval steps (Department MA → Department Head → Faculty AR → Student Service SAR).
- **Document download, sign & replace** — approvers can download, re-upload signed documents, or reject with remarks at any step.
- **Student self-service** — students can register, log in, and track the status of their own bursary submissions.
- **Admin control panel** — create and manage officer accounts across all roles, manage faculties, departments, batches, and documents.
- **Persistent authentication** — session state is stored via `redux-persist` backed by `localStorage`, with SSR-safe cookie forwarding.
- **Toast notifications** — real-time feedback via `react-hot-toast`.

---

## User Roles

| Role | Identifier | Dashboard Path |
|---|---|---|
| Administrator | `ADMIN` | `/admin` |
| Student Services SAR | `STUDENT_SERVICE_SAR` | `/student-service-sar` |
| Faculty Academic Registrar | `FACULTY_AR` | `/faculty-ar` |
| Faculty Management Admin | `FACULTY_MA` | `/faculty-ma` |
| Department Head | `DEPARTMENT_HEAD` | `/department-head` |
| Department Management Admin | `DEPARTMENT_MA` | `/department-ma` |
| Student | `STUDENT` | `/student` |

> The root page (`/`) reads the current user's role from the server via cookie and automatically redirects to the correct dashboard. Unauthenticated visitors are shown a landing page with **Login** and **Register** links.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Icons | react-icons v5 |
| HTTP Client | Axios v1 |
| State Management | Redux Toolkit + redux-persist |
| Notifications | react-hot-toast |
| Linting | ESLint 9 + eslint-config-next |

---

## Project Structure

```
smartbursery-web/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── register/       # Student self-registration page
│   ├── (dashboard)/
│   │   ├── layout.tsx      # Shared dashboard layout (Navbar + AuthGuard)
│   │   ├── admin/          # Admin dashboard & sub-pages
│   │   │   ├── page.tsx    # Admin overview (users, monthly docs)
│   │   │   ├── batches/
│   │   │   ├── faculties/
│   │   │   ├── manage-documents/
│   │   │   ├── manage-user/
│   │   │   └── student-services/
│   │   ├── faculty-ma/     # Faculty MA dashboard
│   │   │   ├── departments/
│   │   │   ├── monthly-request-approval/
│   │   │   └── upload-bursary-list/
│   │   ├── faculty-ar/     # Faculty AR dashboard
│   │   ├── department-head/
│   │   ├── department-ma/
│   │   ├── student-service-sar/
│   │   └── student/
│   ├── change-password/
│   ├── layout.tsx          # Root layout (Redux Provider, PersistGate)
│   ├── page.tsx            # Landing / role-based redirect
│   └── providers.tsx       # Client-side Redux + PersistGate wrapper
│
├── components/
│   ├── AuthGuard.tsx               # Client-side route protection
│   ├── ConfirmationCard.tsx        # Reusable confirm/cancel modal card
│   ├── DashboardView.tsx           # Generic dashboard summary view
│   ├── DepartmentCard.tsx          # Department display card
│   ├── ManageDocumentsPanel.tsx    # Admin monthly documents table
│   ├── MonthlyPendingRequestsPanel.tsx  # Pending approval workflow panel
│   ├── Navbar.tsx                  # Top navigation bar
│   └── OfficerForm.tsx             # Create officer form (Admin)
│
├── features/
│   └── auth/
│       ├── authSlice.ts    # Redux slice for auth state
│       └── authTypes.ts    # AuthUser type definitions
│
├── hooks/
│   └── useDepartments.ts   # Custom hook for fetching departments
│
├── lib/
│   └── axios.ts            # Axios instance with base URL + error interceptor
│
├── redux/
│   └── store.ts            # Redux store with redux-persist config
│
├── services/
│   ├── admin.service.ts    # Admin API calls (users, officers, docs)
│   ├── auth.service.ts     # Login, register, me, logout
│   ├── batch.service.ts    # Batch management
│   ├── facultyMA.service.ts# Faculty MA specific APIs
│   ├── monthlyFlow.service.ts # Monthly document workflow APIs
│   └── user.service.ts     # General user APIs
│
├── types/
│   ├── batch.types.ts
│   └── department.types.ts
│
├── next.config.ts          # API proxy rewrite rules
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- A running instance of the **SmartBursary API server** (default: `http://localhost:5000`)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd smartbursery-web

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Public — exposed to the browser (used by the client-side Axios instance)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Server-only — used by SSR auth check on the root page
API_SERVER_BASE_URL=http://localhost:5000
```

> If `NEXT_PUBLIC_API_URL` is not set, the Axios instance falls back to `http://localhost:5000`.

---

## API Proxy

`next.config.ts` configures a rewrite rule so that all `/api/*` requests from the browser are transparently forwarded to the backend:

```ts
// next.config.ts
rewrites: [
  { source: "/api/:path*", destination: "http://localhost:5000/api/:path*" }
]
```

This means the frontend never exposes the backend's origin to end users, and avoids CORS issues in development.

---

## State Management

Redux Toolkit is used for global state. The store is configured in [`redux/store.ts`](./redux/store.ts):

- **`auth` slice** — persisted via `redux-persist` to `localStorage`.
  - Persisted keys: `user`, `role`, `isAuthenticated`.
  - SSR-safe: uses a no-op storage adapter on the server to prevent hydration mismatches.

The `PersistGate` wrapper in [`app/providers.tsx`](./app/providers.tsx) delays rendering until the persisted state has been rehydrated.

---

## Authentication & Route Protection

Authentication follows a dual approach:

1. **SSR (Server Components)** — The root page (`app/page.tsx`) calls `authService.meWithCookie()`, forwarding the browser's `Cookie` header directly to the API server. Authenticated users are immediately redirected to their role-specific dashboard via `redirect()`.

2. **Client-side (AuthGuard)** — The `components/AuthGuard.tsx` component checks the Redux `auth` slice on the client. If the user is not authenticated, it redirects to `/login`.

Session cookies (`withCredentials: true`) are used throughout; no tokens are stored in JavaScript-accessible storage.
