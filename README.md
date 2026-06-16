# Cricbuzz Clone (Scoring & Match Management Platform)

An enterprise-grade, real-time cricket scoring and match administration dashboard built on the MERN stack with strict Role-Based Access Control (RBAC), live Socket.IO integration, and a highly polished glassmorphic UI.

---

## 🚀 Key Features

* **Admin Match Lifecycle Controls**: 
  * Schedule, start, pause, and complete matches.
  * **Single Live Match Guarantee**: Prevents starting concurrent live matches across the system.
  * Interactive "Confirm & Complete Match" modal with numeric inputs for runs, wickets, and overs.
* **Granular Role-Based Access Control (RBAC)**:
  * `SUPER_ADMIN`: Access to team creations, squad allocations, role promotions, and match schedules.
  * `ADMIN` / `SCORER`: Access to scoring matches, running matches, and schedules.
  * `USER`: Access to public view-only matches and live broadcasts.
* **Real-time Live Scoring Engine**:
  * Persistent database tracking for `striker`, `nonStriker`, and `currentBowler` with stats updating in real-time.
  * Real-time sync via WebSocket (`Socket.IO`) broadcasts.
  * Responsive 7-day API and Traffic dashboard graph.
* **Flexible Seeding Tooling**:
  * Custom seeder script to populate fully relational teams, players, tournaments, and schedules.

---

## 🛠 Tech Stack

### Client (Frontend)
* **Core**: React 19 (Vite)
* **State Management**: Redux Toolkit (RTK)
* **Routing**: React Router v7
* **Styling**: Tailwind CSS v4, Lucide Icons
* **API Client**: Axios with interceptor setup for authorization headers

### Server (Backend)
* **Runtime**: Node.js (ES Modules)
* **Framework**: Express 5
* **Database**: MongoDB (Atlas) via Mongoose ODM
* **Security & Auth**: JWT, Passport (Google OAuth2), bcrypt, Helmet, CORS, hpp
* **WebSockets**: Socket.IO
* **Logging**: Pino & Pino-Pretty
* **Validation**: Zod Schemas

---

## 📂 Project Architecture

```
├── client/                      # Frontend Application
│   ├── src/
│   │   ├── app/                 # Redux Store & Route Config
│   │   ├── config/              # Axios Instance Setup
│   │   ├── features/            # Feature-driven Modules
│   │   │   ├── auth/            # Authentication State & Screens
│   │   │   └── dashboard/       # Match Management, Scoring, Teams
│   └── package.json
│
├── server/                      # Backend Service
│   ├── src/
│   │   ├── config/              # Environment & DB Setup
│   │   ├── database/            # MongoDB Connection Init
│   │   ├── models/              # Mongoose DB Schemas
│   │   ├── modules/             # Modular Server Controllers & Routes
│   │   │   ├── auth/
│   │   │   ├── match/
│   │   │   ├── score/
│   │   │   └── team/
│   │   ├── shared/              # Middlewares, Constants, Custom Errors
│   │   └── sockets/             # Socket.IO Gateway Setup
│   └── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas Cluster or local MongoDB instance

### Step 1: Clone and Install Dependencies

```bash
# Install root (or individual packages)
cd server
npm install

cd ../client
npm install
```

### Step 2: Configure Environment Variables

Create `.env` inside `server/` with the following configuration:

```env
PORT=9000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
NODE_ENV=development
```

Create `.env` inside `client/` if configuration overrides are needed (defaults to `http://localhost:9000` internally via axios setup).

### Step 3: Run Seeders

To populate the database with testing data (Teams, Players, Series, Matches):

```bash
cd server
npm run seed:dummy
```

### Step 4: Run Locally

Start backend server:
```bash
cd server
npm run dev
```

Start frontend client:
```bash
cd client
npm run dev
```

---

## 🔐 Authentication & RBAC Rules

1. **Permissions Matrix**:
   * `SUPER_ADMIN` can edit teams, squads, and delete matches.
   * `ADMIN` / `SCORER` can access the schedule board and write scoreboards.
   * `USER` has public `GET` endpoint access for live feeds.

2. **Routes Enforcements**:
   * Team and Squad mutations are strictly locked under `authorizeRoles('SUPER_ADMIN')`.
   * Match mutations are locked under `authorizeRoles('SUPER_ADMIN', 'ADMIN')`.
   * Score mutations are locked under `authorizeRoles('SUPER_ADMIN', 'ADMIN', 'SCORER')`.

---

## 📡 WebSockets (Live Sync)
* WebSocket connections are established dynamically per active match.
* Every score update on `PATCH /api/score/:id` triggers a `score.updated` broadcast room event to notify fans in real-time.
