# Finance Dashboard

Full-stack financial transaction system. Authorization is backend-driven and enforced via JWT on every request. The frontend has no role in security decisions.

---

## Repositories

- **Frontend:** [https://github.com/wolfnhk20/findash-frontend](https://github.com/wolfnhk20/findash-frontend)
- **Backend:** [https://github.com/wolfnhk20/findash-backend](https://github.com/wolfnhk20/findash-backend)

---

## Tech Stack

**Backend**
- Java, Spring Boot, Spring Security
- JWT-based stateless authentication
- Custom JWT filter for per-request validation

**Frontend**
- Next.js, TypeScript, Tailwind CSS
- Axios with request interceptor for token attachment

**Database**
- PostgreSQL-compatible schema (Supabase)
- UUID primary keys

**Deployment**
- Frontend: [Vercel](https://vercel.com)
- Backend: [Railway](https://railway.app)

---

## System Flow

```
Client (Next.js)
  -> Axios (attaches JWT)
  -> Spring Boot API (validates JWT, checks role/ownership)
  -> PostgreSQL
  -> Response
```

Every request goes through a custom JWT filter before reaching any controller.

---

## Setup Instructions

### Backend

```bash
git clone <backend-repo-url>
cd backend
./mvnw spring-boot:run
```

Configure `application.properties`:

```properties
jwt.secret=your_secret_key
spring.datasource.url=jdbc:postgresql://localhost:5432/finance
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Configure `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

---

## Authentication Flow

Login is email-only. No password required.

```
POST /auth/login?email={email}
```

If the user exists and `status` is `ACTIVE`, the backend issues a JWT containing:

- `email`
- `role` (ADMIN / ANALYST / VIEWER)
- `userId`

**Example response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ADMIN",
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

All subsequent requests must include:

```
Authorization: Bearer <token>
```

A custom Spring Security filter runs on every request. It extracts the JWT and validates the signature. Role and identity are resolved before the request reaches any controller. INACTIVE users are rejected at login. No token is issued.

---

## API Documentation

**Base URL:** `http://localhost:8080`

All endpoints require a valid JWT unless stated otherwise.

---

### Auth

#### Login

```
POST /auth/login?email={email}
```

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| email     | string | Yes      | Registered user email |

---

### Transactions

#### List Transactions

```
GET /transactions
```

ADMIN and ANALYST can query all transactions. VIEWER is restricted to their own records and must pass `userId`.

| Parameter | Type   | Required          | Description                    |
|-----------|--------|-------------------|--------------------------------|
| role      | string | Yes               | ADMIN, ANALYST, or VIEWER      |
| userId    | UUID   | Yes (VIEWER only) | Filters to that user's records |
| type      | string | No                | INCOME or EXPENSE              |
| category  | string | No                | e.g. DINING, SALARY            |
| startDate | string | No                | YYYY-MM-DD                     |
| endDate   | string | No                | YYYY-MM-DD                     |
| page      | int    | No                | Zero-indexed page number       |
| size      | int    | No                | Records per page               |

**Examples:**

```
GET /transactions?role=ADMIN
GET /transactions?role=VIEWER&userId=3fa85f64-5717-4562-b3fc-2c963f66afa6
GET /transactions?role=ADMIN&type=EXPENSE&category=DINING
GET /transactions?role=ADMIN&page=0&size=10
```

---

#### Create Transaction

```
POST /transactions
```

```json
{
  "amount": 2500,
  "type": "EXPENSE",
  "category": "DINING",
  "description": "Dinner",
  "date": "2026-04-05",
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

ADMIN only. Restricted by role on the backend.

---

#### Update Transaction

```
PUT /transactions/{id}
```

ADMIN only.

---

#### Delete Transaction

```
DELETE /transactions/{id}
```

ADMIN only.

---

### Analytics

```
GET /transactions/analytics
```

| Parameter | Type   | Required          | Description               |
|-----------|--------|-------------------|---------------------------|
| role      | string | Yes               | ADMIN, ANALYST, or VIEWER |
| userId    | UUID   | Yes (VIEWER only) | Scopes analytics to user  |

**Examples:**

```
GET /transactions/analytics?role=ADMIN
GET /transactions/analytics?role=VIEWER&userId=3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**Response:**

```json
{
  "totalIncome": 50000,
  "totalExpense": 18000,
  "netBalance": 32000
}
```

---

### Users

```
GET /users?authRole=ADMIN
```

Returns all registered users. ADMIN only.

---

## Role Behavior

| Action                | ADMIN | ANALYST | VIEWER   |
|-----------------------|-------|---------|----------|
| Create transaction    | Yes   | No      | No       |
| Update transaction    | Yes   | No      | No       |
| Delete transaction    | Yes   | No      | No       |
| View all transactions | Yes   | Yes     | Own only |
| View analytics        | Yes   | Yes     | Own only |
| View all users        | Yes   | No      | No       |

VIEWER requests must include `userId`. The backend validates that the requested data belongs to the token's subject.

---

## Behavior and Conditions

- Only users with `status = ACTIVE` can log in.
- INACTIVE users are blocked at login. No token is issued and no access is granted.
- The frontend attaches the JWT via an Axios interceptor on every outgoing request.
- Frontend role-based UI rendering is cosmetic only. The backend enforces all access rules independently.
- For VIEWER requests, the backend compares the `userId` query parameter against the JWT subject to verify ownership.

---

## Database Structure

### `users`

| Column     | Type      | Notes                  |
|------------|-----------|------------------------|
| id         | UUID      | Primary key            |
| email      | string    | Unique                 |
| name       | string    |                        |
| role       | enum      | ADMIN, ANALYST, VIEWER |
| status     | enum      | ACTIVE, INACTIVE       |
| created_at | timestamp |                        |

### `transactions`

| Column      | Type      | Notes                  |
|-------------|-----------|------------------------|
| id          | UUID      | Primary key            |
| amount      | decimal   |                        |
| type        | enum      | INCOME, EXPENSE        |
| category    | string    |                        |
| description | string    |                        |
| date        | date      |                        |
| user_id     | UUID      | Foreign key -> users.id |
| created_at  | timestamp |                        |

One user can have many transactions. `user_id` is used for ownership checks on VIEWER-scoped requests.

---

## Assumptions

- Email uniqueness is enforced at the database level.
- Role assignment happens outside this application (e.g. seeded or managed via admin tooling).
- The JWT secret is symmetric (HMAC). Token expiry and refresh are not covered here.
- `userId` in VIEWER query parameters is validated against the JWT. It is not trusted on its own.
- Pagination defaults are configured server-side.

---

## Tradeoffs

- **Email-only login** removes password complexity but puts all identity trust on email access. No MFA or session revocation is in scope.
- **Role in JWT** means role changes only take effect after the token expires. A demoted user retains their old access until re-login.
- **Role as query parameter** is redundant since the JWT already carries the role. Without server-side cross-validation, it introduces a privilege escalation risk.
- **No frontend security enforcement** is correct by design. If the token is tampered with client-side, the UI may show stale controls.

---

## Known Issues

- No token refresh endpoint. Long-lived sessions require re-login.
- No logout or token invalidation. A stolen token stays valid until expiry.
- The `role` query parameter on `/transactions` must always be validated against the JWT role on the backend.

---

## Test Users

Seed these into the database before running locally. All must have `status = ACTIVE`.

| Email               | Role    |
|---------------------|---------|
| admin@example.com   | ADMIN   |
| analyst1@example.com | ANALYST |
| viewer2@example.com  | VIEWER  |

---

## Live Links

- Frontend: [https://findash-eta-two.vercel.app/](https://findash-eta-two.vercel.app/)
- Backend: [https://findash-backend-m4ta.onrender.com](https://findash-backend-m4ta.onrender.com)

The backend is the source of truth for all access control and validation.
