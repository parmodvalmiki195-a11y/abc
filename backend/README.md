# Backend API

Express + MongoDB Atlas API for the Navratna Kuber frontend.

## Setup

1. Copy `.env.example` to `.env`.
2. Put your Atlas connection string in `MONGO_URI`.
3. Change `JWT_SECRET`.
4. Run:

```bash
npm run seed
npm run dev
```

## Environment

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/navratna?retryWrites=true&w=majority
JWT_SECRET=change-this-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
CLIENT_ORIGIN=http://127.0.0.1:5173
```

## Routes

- `GET /api/health`
- `POST /api/auth/login`
  - Body: `{ "username": "admin", "password": "admin123" }`
  - Returns: `{ token, user }`
- `GET /api/coupons`
  - Public user/admin coupon data.
- `PUT /api/coupons/:id`
  - Admin only. Requires `Authorization: Bearer <token>`.
- `PUT /api/coupons`
  - Admin only. Replaces all coupons.
- `POST /api/coupons/reset`
  - Admin only. Restores default coupons.
