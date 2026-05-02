# SMMBoost BD — Premium SMM Panel

A full-stack Social Media Marketing panel built for Bangladesh, with bKash & Nagad manual payment integration.

## 🛠 Tech Stack

| Layer     | Technology                         |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend   | Node.js, Express                   |
| Database  | MongoDB                            |
| Auth      | JWT (jsonwebtoken)                 |
| Payments  | Manual — bKash & Nagad             |

---

## 📁 Project Structure

```
smm-panel/
├── backend/
│   ├── models/          # User, Service, Order, Payment
│   ├── routes/          # auth, users, services, orders, payments
│   ├── middleware/      # auth.js (JWT + admin guard)
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── context/     # AuthContext
    │   ├── layouts/     # DashboardLayout, AdminLayout
    │   ├── lib/         # axios api instance
    │   ├── pages/
    │   │   ├── dashboard/   # Home, NewOrder, AddFunds, OrderHistory, Transactions, ApiPage, Profile
    │   │   └── admin/       # AdminDashboard, AdminPayments, AdminOrders, AdminUsers, AdminServices
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## ⚡ Prerequisites

Make sure these are installed on your system:

1. **Node.js** (v18+) — https://nodejs.org
2. **MongoDB** — https://www.mongodb.com/try/download/community (local) OR use MongoDB Atlas
3. **npm** (comes with Node.js)

---

## 🚀 Setup & Run

### Step 1: Install Backend Dependencies

```bash
cd smm-panel/backend
npm install
```

### Step 2: Configure Backend Environment

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smm-panel
JWT_SECRET=your_super_secret_key_change_me
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

### Step 3: Start the Backend

```bash
# In backend/ directory
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

### Step 4: Install Frontend Dependencies

```bash
cd smm-panel/frontend
npm install
```

### Step 5: Start the Frontend

```bash
# In frontend/ directory
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 👤 Creating the Admin Account

The **first user to register** on the platform automatically becomes an **Admin**.

1. Go to http://localhost:5173/register
2. Create your account
3. You will be redirected to the User Dashboard
4. Navigate to http://localhost:5173/admin for the Admin Panel

All subsequent registrations will create regular user accounts.

---

## 💳 Payment Flow (bKash & Nagad)

1. User goes to **Add Funds** in their dashboard
2. Selects bKash or Nagad, follows the instructions to send money to **01620177883**
3. Submits the Transaction ID + amount in the form
4. Payment request is stored with status **"pending"**
5. Admin goes to **Admin Panel → Payments**, reviews the TrxID, and clicks **Approve**
6. User's balance is **automatically updated** upon approval

---

## 🔗 API Endpoints Summary

### Auth
| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| POST   | /api/auth/register  | Register new user    |
| POST   | /api/auth/login     | Login, returns JWT   |
| GET    | /api/auth/me        | Get current user     |

### Services
| Method | Endpoint            | Auth      | Description         |
|--------|---------------------|-----------|---------------------|
| GET    | /api/services       | Public    | List active services|
| GET    | /api/services/all   | Admin     | List all services   |
| POST   | /api/services       | Admin     | Create service      |
| PUT    | /api/services/:id   | Admin     | Update service      |
| DELETE | /api/services/:id   | Admin     | Delete service      |

### Orders
| Method | Endpoint            | Auth  | Description          |
|--------|---------------------|-------|----------------------|
| POST   | /api/orders         | User  | Place order          |
| GET    | /api/orders/my      | User  | My orders            |
| GET    | /api/orders         | Admin | All orders           |
| PATCH  | /api/orders/:id/status | Admin | Update status     |

### Payments
| Method | Endpoint              | Auth  | Description          |
|--------|-----------------------|-------|----------------------|
| POST   | /api/payments         | User  | Submit payment       |
| GET    | /api/payments/my      | User  | My payments          |
| GET    | /api/payments         | Admin | All payments         |
| PATCH  | /api/payments/:id/status | Admin | Approve/Reject   |

---

## 🎨 Features

- ✅ Dark UI — black + purple + neon blue glassmorphism
- ✅ Fully responsive (mobile + desktop)
- ✅ JWT authentication with auto-refresh
- ✅ bKash & Nagad manual payment flow
- ✅ Payment approval updates user balance automatically
- ✅ Admin panel: manage users, services, orders, payments
- ✅ Real-time price calculation on order form
- ✅ Toast notifications
- ✅ Order status management
- ✅ Smooth Framer Motion animations

---

## 📦 Deploy

### Backend (e.g. Railway / Render)
1. Set environment variables in your hosting dashboard
2. Set build command: `npm install`
3. Set start command: `node server.js`

### Frontend (e.g. Vercel / Netlify)
1. Set build command: `npm run build`
2. Set output directory: `dist`
3. Update `vite.config.js` proxy to point to your deployed backend URL (or set `VITE_API_URL` env var and update `src/lib/api.js`)
