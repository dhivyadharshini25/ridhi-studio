# RiDhi Studio — Full-Stack Web Application

A real, working full-stack foundation for RiDhi Studio: React + TypeScript frontend, Node.js/Express +
TypeScript backend, PostgreSQL database, JWT authentication, customer dashboard, admin panel, file
uploads, and a Razorpay-ready payment architecture.

---

## 1. Folder Structure

```
ridhi-studio/
├── client/                        # React + TypeScript + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             # Navbar, Footer, DashboardShell, AdminShell, PublicLayout
│   │   │   ├── public/              # ServiceCard, PortfolioCard, TestimonialCard
│   │   │   ├── ui/                  # StatusBadge, LoadingState, ErrorState, EmptyState
│   │   │   └── ProtectedRoute.tsx  # route guards (auth + admin)
│   │   ├── context/AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── public/              # Home, Services, ServiceDetails, Portfolio, About, Contact, StartAProject
│   │   │   ├── auth/                # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── customer/            # Overview, Enquiries, Bookings, Projects, Quotes, Notifications, Profile
│   │   │   └── admin/               # Dashboard, Customers, Services, Portfolio, Enquiries, Bookings, Projects, Quotes, Testimonials, Messages
│   │   ├── services/                # api.ts (axios instance) + resources.ts (all API calls)
│   │   ├── types/index.ts
│   │   ├── App.tsx                  # all routes
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── server/                        # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── config/db.ts             # PostgreSQL connection pool
│   │   ├── middleware/              # auth.ts (JWT + RBAC), upload.ts (multer), errorHandler.ts
│   │   ├── controllers/             # one per resource (auth, services, portfolio, enquiries, bookings,
│   │   │                              projects, quotes, notifications, contact, testimonials, files,
│   │   │                              users/admin, payments, settings)
│   │   ├── routes/                  # one per resource, mounted under /api
│   │   ├── utils/                   # jwt.ts, asyncHandler.ts, notify.ts
│   │   ├── scripts/createAdmin.ts   # promote/create an ADMIN account
│   │   ├── app.ts                   # Express app (security, CORS, rate limiting, routes)
│   │   └── server.ts                # entrypoint
│   ├── uploads/                     # local file storage (dev) — swap for S3/Supabase Storage in prod
│   └── package.json
│
├── database/
│   ├── schema.sql                   # full PostgreSQL schema (tables, enums, indexes, FKs)
│   └── seed.sql                     # starter services + categories
│
└── README.md                      # this file
```

---

## 2. Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ running locally (or a hosted instance)
- VS Code (recommended: install the "PostgreSQL" and "ESLint" extensions)

---

## 3. PostgreSQL Database Setup

Create the database:

```bash
# from a terminal with psql available
createdb ridhi_studio
# or, inside psql:
psql -U postgres -c "CREATE DATABASE ridhi_studio;"
```

Apply the schema and seed data — easiest is directly with `psql`:

```bash
psql -U postgres -d ridhi_studio -f database/schema.sql
psql -U postgres -d ridhi_studio -f database/seed.sql
```

(Alternatively, once `server/.env` is configured, you can run `npm run migrate` and `npm run seed`
from inside `server/` — see the scripts in `server/package.json`.)

---

## 4. Environment Configuration

### server/.env

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ridhi_studio

JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
RESET_TOKEN_EXPIRES_MINUTES=30

UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=RiDhi Studio <no-reply@ridhistudio.com>

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Generate a strong `JWT_SECRET` quickly with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### client/.env

```bash
cd client
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 5. Install & Run — Backend

```bash
cd server
npm install
npm run dev
```

The API starts on **http://localhost:5000**. Health check: `GET http://localhost:5000/api/health`.

## 6. Install & Run — Frontend

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The site opens on **http://localhost:5173** (Vite proxies `/api` to the backend during dev).

---

## 7. Create the First Admin Account

Registration through the public site always creates a `CUSTOMER`. To create your first admin, run:

```bash
cd server
npm run create-admin -- admin@ridhistudio.com "StrongPassword123" "Studio Admin"
```

This either creates a new ADMIN user or promotes an existing account with that email to ADMIN.
Log in at `http://localhost:5173/login` with those credentials, then visit `/admin`.

---

## 8. Testing the Complete Application in VS Code

1. Open the `ridhi-studio/` folder in VS Code.
2. Open two integrated terminals: one in `server/` running `npm run dev`, one in `client/` running `npm run dev`.
3. Visit `http://localhost:5173`:
   - Browse **Services** and **Portfolio** — data is loaded live from PostgreSQL via the API (seeded in step 3).
   - **Register** a customer account, then **Start a Project** to create an enquiry (optionally attach a file).
   - Log in as the admin you created in step 7 at `/admin`:
     - **Enquiries** → change status, convert an approved enquiry into a **Project**.
     - **Services** / **Portfolio** → add, edit, publish/unpublish.
     - **Quotes** → create a quote for a customer; log back in as that customer to accept/reject it.
     - **Bookings** → confirm/cancel a booking submitted from the customer dashboard (try the Saree
       Pre-Pleating service to see the extra fields, and try booking the same date/time twice to see the
       double-booking guard).
     - **Messages** → view Contact form submissions.
   - As the customer, check **Notifications** — they're created automatically on status changes, new
     quotes, etc.
4. To verify security: log in as two different customers in two browser profiles/incognito windows and
   confirm neither can see the other's enquiries/bookings/projects/quotes/files (enforced server-side —
   see `requireAuth`/`requireRole` in `server/src/middleware/auth.ts` and the `customer_id` checks in
   every controller).
5. To go live with payments: add `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` to `server/.env`, install the
   Razorpay SDK (`npm install razorpay` inside `server/`), and follow the inline comment in
   `server/src/controllers/paymentsController.ts` — the order-creation, verification, and DB schema are
   already in place.
6. To use your real logo: drop the file into `client/public/logo.png` and swap the placeholder comment in
   `client/src/components/layout/Navbar.tsx` for `<img src="/logo.png" alt="RiDhi Studio" className="h-9 w-auto" />`
   — never re-generate or re-color it.

---

## 9. Notes on Architecture

- **Security**: every protected route checks the JWT server-side (`requireAuth`) and role (`requireRole`);
  every controller that reads/writes customer data filters by `customer_id = req.user.userId` unless the
  requester is an admin — the frontend never decides access on its own.
- **Passwords**: hashed with bcrypt (12 rounds), never stored or returned in plain text.
- **File uploads**: validated by MIME type and size (`server/src/middleware/upload.ts`), stored on disk
  under `server/uploads/`, and only ever served through `/api/files/:id/download` after an ownership check
  — the storage path itself is never exposed directly.
- **Payments**: architecture is fully wired (orders, verification endpoint, DB table) but ships with a
  stub order-creation function until real Razorpay keys are added — no fake "successful payment" is ever
  shown to a user.
- **Reusability for a future mobile app**: all API calls live in `client/src/services/`, and all backend
  business logic lives in `server/src/controllers/` — a React Native app can call the same REST API
  directly.
