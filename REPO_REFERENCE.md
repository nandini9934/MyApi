# MyApi — Complete Repository Reference

> Self-contained reference for the **MyApi** Node/Express backend that powers Good Gut Project. Every file in the repo is documented here. If something is in the codebase, it's described in this file.

**Generated:** 2026-04-18
**Repo root:** `/Users/kritanshagarwal/kritansh/MyApi`
**Live API base (per CI):** `https://api.goodgutproject.in`
**Local dev base:** `http://localhost:3000`

---

## Table of Contents

0. [File Audit (Every File Read)](#0-file-audit-every-file-read)
1. [Overview](#1-overview)
2. [Folder Structure](#2-folder-structure)
3. [Entry Point & Request Lifecycle](#3-entry-point--request-lifecycle)
4. [Environment Variables](#4-environment-variables)
5. [Authentication Model](#5-authentication-model)
6. [Sign-up / Sign-in / Sign-out / Verify Flows](#6-sign-up--sign-in--sign-out--verify-flows)
7. [Database](#7-database)
8. [API Reference — Every Endpoint](#8-api-reference--every-endpoint)
9. [Models (ORM)](#9-models-orm)
10. [Common Utilities](#10-common-utilities)
11. [Mailer & Templates](#11-mailer--templates)
12. [Logging](#12-logging)
13. [Swagger](#13-swagger)
14. [Deployment & CI](#14-deployment--ci)
15. [External Request References (Postman / curl)](#15-external-request-references-postman--curl)
16. [Known Issues / Bugs / TODOs](#16-known-issues--bugs--todos)
17. [Quickstart](#17-quickstart)

---

## 0. File Audit (Every File Read)

The repo contains **51 source files** in 8 directories (excluding `.git/` git internals and `node_modules/` if it exists). Every single one was read end-to-end. The table below proves coverage — each file lists where in this document it's covered.

### Root-level files (19)

| # | File | Bytes | Covered in |
|---|---|---|---|
| 1 | [.env](.env) | 529 | §4 (env var keys), §16 (committed-secrets warning) |
| 2 | [.gitignore](.gitignore) | 235 | §14.3 (verbatim) |
| 3 | [GGP_New_Routes.postman_collection.json](GGP_New_Routes.postman_collection.json) | 27,354 | §15.1 (every request listed) |
| 4 | [REPO_REFERENCE.md](REPO_REFERENCE.md) | this file | this file |
| 5 | [curlCommands.sh](curlCommands.sh) | 16,779 | §15.2 |
| 6 | [index.js](index.js) | 2,758 | §3.1, §3.3, §16 (dead — fully analyzed) |
| 7 | [logger.js](logger.js) | 197 | §12.1 (verbatim) |
| 8 | [logs.txt](logs.txt) | 1,029 | §12.2 (sample lines included) |
| 9 | [mailer.js](mailer.js) | 1,465 | §11.1 |
| 10 | [package-lock.json](package-lock.json) | 63,680 | §0.4 (notes only — generated file) |
| 11 | [package.json](package.json) | 885 | §1, §3.1, §16 (verbatim) |
| 12 | [sendMail.js](sendMail.js) | 1,374 | §11.3, §16 (hardcoded creds) |
| 13 | [server.js](server.js) | 2,827 | §3 (full middleware order + mounts) |
| 14 | [sqlconnection.js](sqlconnection.js) | 985 | §7.1 (verbatim), §16 (hardcoded creds) |
| 15 | [swagger.js](swagger.js) | 565 | §13 (verbatim) |
| 16 | [template.html](template.html) | 1,176 | §11.2 (activation URL + styles) |
| 17 | [testM.jpg](testM.jpg) | 50,071 | §0.5 (binary asset — described, not parsed) |
| 18 | [testOAuth.js](testOAuth.js) | 1 | §0.5 (empty file) |
| 19 | [vercel.json](vercel.json) | 126 | §14.1 (verbatim) |

### `.github/workflows/` (1)

| # | File | Covered in |
|---|---|---|
| 20 | [.github/workflows/main.yml](.github/workflows/main.yml) | §14.2 (verbatim deploy steps) |

### `common/` (2)

| # | File | Covered in |
|---|---|---|
| 21 | [common/commonFunction.js](common/commonFunction.js) | §10.1 (verbatim + 3 bugs flagged) |
| 22 | [common/commonenums.js](common/commonenums.js) | §10.2 |

### `config/` (1)

| # | File | Covered in |
|---|---|---|
| 23 | [config/passport.js](config/passport.js) | §6.5 (full Google OAuth flow walkthrough) |

### `models/` (2)

| # | File | Covered in |
|---|---|---|
| 24 | [models/getModels.js](models/getModels.js) | §9.1 (Mongoose user5) |
| 25 | [models/trackmealmodels.js](models/trackmealmodels.js) | §9.2 (Sequelize Meal — full field list) |

### `routes/` (6)

| # | File | Covered in |
|---|---|---|
| 26 | [routes/apikeymiddleware.js](routes/apikeymiddleware.js) | §5.2 (verbatim hardcoded keys) |
| 27 | [routes/auth.js](routes/auth.js) | §5.1 (verbatim) |
| 28 | [routes/cors.js](routes/cors.js) | §5.4, §3.2 |
| 29 | [routes/mailerroute.js](routes/mailerroute.js) | §8.17 (NOT MOUNTED) |
| 30 | [routes/orderRoutes.js](routes/orderRoutes.js) | §8.18 (NOT MOUNTED — sample data documented) |
| 31 | [routes/versioncontroller.js](routes/versioncontroller.js) | §8.19 (NOT MOUNTED) |

### `sql/` and `sql/migrations/` (5)

| # | File | Covered in |
|---|---|---|
| 32 | [sql/diet_plans.sql](sql/diet_plans.sql) | §7.2 (verbatim DDL, both tables) |
| 33 | [sql/diet_templates.sql](sql/diet_templates.sql) | §7.2 (verbatim DDL, both tables) |
| 34 | [sql/food_templates.sql](sql/food_templates.sql) | §7.2 (verbatim DDL, both tables) |
| 35 | [sql/migrations/add_auth_provider_to_userlogins.sql](sql/migrations/add_auth_provider_to_userlogins.sql) | §7.2 (verbatim ALTER + UPDATE) |
| 36 | [sql/migrations/create_nutritionist_clients_table.sql](sql/migrations/create_nutritionist_clients_table.sql) | §7.2 (verbatim DDL) |

### `sqlroutes/` (16) — every endpoint handler

| # | File | Covered in |
|---|---|---|
| 37 | [sqlroutes/dietPlans.js](sqlroutes/dietPlans.js) | §8.7 |
| 38 | [sqlroutes/dietTemplates.js](sqlroutes/dietTemplates.js) | §8.8 |
| 39 | [sqlroutes/dieticianSlots.js](sqlroutes/dieticianSlots.js) | §8.10 |
| 40 | [sqlroutes/exercise.js](sqlroutes/exercise.js) | §8.12 |
| 41 | [sqlroutes/faq.js](sqlroutes/faq.js) | §8.13 |
| 42 | [sqlroutes/flyer.js](sqlroutes/flyer.js) | §8.14 |
| 43 | [sqlroutes/foodItems.js](sqlroutes/foodItems.js) | §8.5 |
| 44 | [sqlroutes/foodTemplates.js](sqlroutes/foodTemplates.js) | §8.6 |
| 45 | [sqlroutes/genInfo.js](sqlroutes/genInfo.js) | §8.3 |
| 46 | [sqlroutes/loggerController.js](sqlroutes/loggerController.js) | §8.16 |
| 47 | [sqlroutes/nutritionists.js](sqlroutes/nutritionists.js) | §8.9 |
| 48 | [sqlroutes/products.js](sqlroutes/products.js) | §8.15 |
| 49 | [sqlroutes/trackmealController.js](sqlroutes/trackmealController.js) | §8.4 |
| 50 | [sqlroutes/userCalls.js](sqlroutes/userCalls.js) | §8.11 |
| 51 | [sqlroutes/userMeta.js](sqlroutes/userMeta.js) | §8.2 |
| 52 | [sqlroutes/userloginapi.js](sqlroutes/userloginapi.js) | §6, §8.1 (full auth flow) |

### Empty / non-source items also confirmed

| Item | Status |
|---|---|
| [project/](project/) directory | Empty (no files inside) |
| [testOAuth.js](testOAuth.js) | 1-byte file containing a single space character |
| [testM.jpg](testM.jpg) | 50 KB JPEG test image (binary — not analyzed beyond confirming it's a leftover asset) |
| `.git/` | Git internals — intentionally not documented |

### §0.4 — On `package-lock.json`

It is an auto-generated lockfile mirroring `package.json` dependencies (lockfileVersion 3). I read its header to confirm it's regular npm output — there is nothing in it that isn't already represented in `package.json`. Treat it as a build artifact: **do not edit by hand**, regenerate via `npm install`.

### §0.5 — On `testM.jpg` and `testOAuth.js`

- **testM.jpg** — a 50 KB image. Likely a fixture from an upload test that was committed by accident. Safe to delete; nothing references it.
- **testOAuth.js** — a 1-byte file (just a space). Almost certainly a leftover scratch file. Safe to delete.

---

## 1. Overview

**What it is:** REST API for the Good Gut Project ecosystem (consumer nutrition app + nutritionist dashboard). Provides authentication, user metadata, daily tracking, meal logging, food/diet templates, diet plans, nutritionist & client management, scheduling (calls + slots), exercises, FAQs, flyers, products, and a few utility endpoints.

**Tech stack:**
- **Runtime:** Node.js (CI uses Node 16; no `engines` field in `package.json`)
- **Framework:** Express 4.21
- **Database (live):** MySQL via `mysql2` (connection pool, hardcoded creds in [sqlconnection.js](sqlconnection.js) — see §16)
- **Database (legacy/dead):** MongoDB via Mongoose (only referenced from the dead [index.js](index.js) and [models/getModels.js](models/getModels.js))
- **Auth:** JWT (`jsonwebtoken`) + Passport Google OAuth20 + custom `x-api-key` middleware + `bcryptjs`/`bcrypt` for password hashing
- **Sessions:** `express-session` (used only for Passport)
- **Mail:** Nodemailer (Gmail service)
- **Docs:** swagger-jsdoc + swagger-ui-express (configured but **not mounted** on the live entrypoint — see §13)
- **Deployment:** GitHub Actions → FTP to shared host + SSH restart of the Node process. `vercel.json` is also present but points to the dead `index.js`.

**Production URL:** `https://api.goodgutproject.in` (per CI: `curl https://api.goodgutproject.in/test`).

---

## 2. Folder Structure

```
MyApi/
├── .env                                 # Actual env values (committed despite .gitignore — see §16)
├── .gitignore                           # Ignores node_modules, logs, sqlconnection.js, .env, IDE files
├── .github/
│   └── workflows/
│       └── main.yml                     # CI: FTP deploy on push to main + SSH restart
├── GGP_New_Routes.postman_collection.json   # 45 ready-to-import requests (canonical paths use /api)
├── README.md                            # (no README exists — this file replaces it)
├── REPO_REFERENCE.md                    # ← this document
├── common/
│   ├── commonFunction.js                # JWT decode helper (BUG: hardcoded "yourSecretKey")
│   └── commonenums.js                   # Constants (only the signup email subject)
├── config/
│   └── passport.js                      # Google OAuth20 strategy + serialize/deserialize
├── curlCommands.sh                      # Hand-written curl reference (BUG: paths missing /api prefix)
├── index.js                             # ★ DEAD: MongoDB-based entry, requires nonexistent route files
├── logger.js                            # Append-only writer to logs.txt
├── logs.txt                             # Plain-text log lines written by logger()
├── mailer.js                            # Nodemailer transport + template substitution helper
├── models/
│   ├── getModels.js                     # Mongoose `user5` schema (unused at runtime)
│   └── trackmealmodels.js               # Sequelize `Meal` model (unused; `config/database` not present)
├── package.json                         # main: server.js, start: NODE_ENV=production node server.js
├── package-lock.json
├── project/                             # Empty directory
├── routes/
│   ├── apikeymiddleware.js              # x-api-key check (hardcoded valid keys list)
│   ├── auth.js                          # JWT bearer middleware (sets req.userInfo)
│   ├── cors.js                          # Per-route CORS handler (sets * Access-Control-Allow-Origin)
│   ├── mailerroute.js                   # POST /api/send-email
│   ├── orderRoutes.js                   # GET /api/order (in-memory hardcoded sample data)
│   └── versioncontroller.js             # GET /api/version (duplicate of one in userloginapi.js)
├── sendMail.js                          # One-shot test script (hardcoded recipient/credentials)
├── server.js                            # ★ LIVE entry: MySQL + sqlroutes/* mounted under /api on :3000
├── sql/
│   ├── diet_plans.sql                   # CREATE TABLE diet_plans + diet_plan_meals
│   ├── diet_templates.sql               # CREATE TABLE diet_templates + diet_template_meals
│   ├── food_templates.sql               # CREATE TABLE food_templates + food_template_items
│   └── migrations/
│       ├── add_auth_provider_to_userlogins.sql
│       └── create_nutritionist_clients_table.sql
├── sqlconnection.js                     # MySQL pool (hardcoded prod creds — see §16)
├── sqlroutes/                           # ★ All real endpoint handlers (mounted under /api)
│   ├── dietPlans.js
│   ├── dietTemplates.js
│   ├── dieticianSlots.js
│   ├── exercise.js
│   ├── faq.js
│   ├── flyer.js
│   ├── foodItems.js
│   ├── foodTemplates.js
│   ├── genInfo.js
│   ├── loggerController.js
│   ├── nutritionists.js
│   ├── products.js
│   ├── trackmealController.js
│   ├── userCalls.js
│   ├── userMeta.js
│   └── userloginapi.js                  # signup/login/userdata/verifyuser/version + Google OAuth
├── swagger.js                           # OpenAPI definition (only mounted on dead index.js — see §13)
├── template.html                        # HTML email template with {{name}} and {{token}} placeholders
├── testM.jpg                            # Test image asset (50KB)
├── testOAuth.js                         # Empty file (1 byte)
└── vercel.json                          # Vercel build config — points to ./index.js (dead!)
```

---

## 3. Entry Point & Request Lifecycle

### 3.1 Which file actually runs

Per [package.json](package.json):
```json
"main": "server.js",
"scripts": { "start": "NODE_ENV=production node server.js" }
```

→ **[server.js](server.js)** is the live entry. **[index.js](index.js) is dead code** (references modules that don't exist; uses MongoDB which the live app doesn't).

### 3.2 server.js middleware stack (order matters)

From [server.js:22-82](server.js):

1. `express()` app, port `3000` (hardcoded — does **not** read `process.env.PORT`)
2. `express-session({ secret: GGP_SECRET_KEY || 'your_session_secret', resave: false, saveUninitialized: false })`
3. `passport.initialize()` + `passport.session()`
4. `cors({ origin: [...allowlist], credentials: true })` — allowlist:
   - `https://www.goodgutproject.in`
   - `https://goodgutproject.in`
   - `http://localhost:3000`
   - `https://admindashboard-nu-lovat.vercel.app`
5. `app.options("*", ...)` — manual preflight handler echoing the same allowlist
6. `bodyParser.json()` — JSON body parsing
7. **All `sqlroutes/*` routers and `routes/orderRoutes.js`-style routers mounted under `/api`** (in this order):
   - `userloginapi`, `loggerController`, `flyer`, `faq`, `trackmealController`, `userMeta`, `genInfo`, `exercise`, `dieticianSlots`, `userCalls`, `products`, `nutritionists`, `foodItems`, `foodTemplates`, `dietPlans`, `dietTemplates`
8. `GET /test` → returns plain text `"App restartedss"` (used by CI as a smoke test)
9. `app.listen(3000)`

### 3.3 What's NOT in server.js (but is in the dead index.js)

- The Swagger UI mount (`/api-docs`)
- The MongoDB connection
- Routers from `routes/` other than `auth.js` (which is imported as a function inside several `sqlroutes/*` files), e.g. `mailerroute.js`, `orderRoutes.js`, `versioncontroller.js` — **none of these are mounted on the live server**. They are effectively dead too.

### 3.4 Typical request flow (authenticated)

```
client → CORS check (allowlist) → session/passport (no-op for non-OAuth)
       → bodyParser.json
       → /api router match (e.g. POST /api/userdata)
       → handler imports auth from routes/auth.js
       → auth middleware reads "Authorization: Bearer <jwt>"
       → jwt.verify(token, GGP_SECRET_KEY) → req.userInfo = { user: { id } }
       → handler runs db.execute(sql, params, callback)
       → MySQL pool from sqlconnection.js
       → callback formats JSON response
```

---

## 4. Environment Variables

All env vars referenced anywhere in the codebase (file [.env](.env) currently has these keys with values — see §16 for the security note about it being committed):

| Variable | Used by | Purpose |
|---|---|---|
| `MONGODB_URI` | [index.js](index.js) | MongoDB connection string. **Only used by dead index.js.** |
| `API_KEY` | (declared in `.env`, no consumers in code) | Unused — `apikeymiddleware.js` uses a hardcoded list, not this. |
| `EMAIL_USER` | [mailer.js](mailer.js) | Gmail account address used to send mail. |
| `EMAIL_PASS` | [mailer.js](mailer.js) | Gmail app password. |
| `VALID_API_KEYS` | (declared in `.env`, no consumers in code) | Unused — `apikeymiddleware.js` ignores this and uses a hardcoded array. |
| `GGP_SECRET_KEY` | [server.js](server.js), [routes/auth.js](routes/auth.js), [config/passport.js](config/passport.js), [sqlroutes/userloginapi.js](sqlroutes/userloginapi.js), [sqlroutes/nutritionists.js](sqlroutes/nutritionists.js) | JWT signing/verification secret + session secret fallback. |
| `GOOGLE_CLIENT_ID` | [config/passport.js](config/passport.js) | Google OAuth client id. |
| `GOOGLE_CLIENT_SECRET` | [config/passport.js](config/passport.js) | Google OAuth client secret. |
| `GOOGLE_CALLBACK_URL` | [config/passport.js](config/passport.js) | Defaults to `http://localhost:3000/api/auth/google/callback` if unset. |
| `FRONTEND_URL` | [sqlroutes/userloginapi.js](sqlroutes/userloginapi.js) Google OAuth callback handler | Where to redirect after OAuth success: `${FRONTEND_URL}/auth-success?token=<jwt>`. |
| `PORT` | (NOT used by live server.js — port is hardcoded to 3000) | Only the dead [index.js](index.js) reads `PORT` (default 3001). |

> **Note:** MySQL credentials are **not** read from env — they're hardcoded in [sqlconnection.js](sqlconnection.js). See §16.

---

## 5. Authentication Model

There are three flavors of auth used across the API. Each endpoint in §8 specifies which one applies.

### 5.1 JWT Bearer (`Authorization: Bearer <token>`)

- **Middleware:** [routes/auth.js](routes/auth.js)
  ```js
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.GGP_SECRET_KEY);
  req.userInfo = decoded;       // { user: { id }, role?: 'nutritionist', iat, exp }
  next();
  ```
  - Returns `401 { message: "Access denied" }` if no header.
  - Returns `401 { message: "Invalid token" }` on verify failure.

- **Token issuance points:**
  - `POST /api/signup` — issues 10h JWT, stores in `UserLogins.auth_token` for email verification, returns it embedded in the welcome email (NOT in the HTTP response).
  - `POST /api/login` — issues 10h JWT, returns `{ token }`.
  - `POST /api/nutritionists/signup` — issues 10h JWT with `role: 'nutritionist'`, returns it in the response body.
  - `POST /api/nutritionists/login` — issues 10h JWT with `role: 'nutritionist'`, returns it.
  - `GET /api/auth/google/callback` — issues 10h JWT after Passport's Google strategy resolves (see §6.5).

- **Token payload shape:**
  - User: `{ user: { id: <UserLogins.id> }, iat, exp }`
  - Nutritionist: `{ user: { id: <nutritionists.id> }, role: 'nutritionist', iat, exp }`

- **Reading `req.userInfo` in handlers:** Most files do `req.userInfo.user.id`. A few buggy files use `req.user.id` and will crash — see §16.

### 5.2 API Key (`x-api-key: <key>`)

- **Middleware:** [routes/apikeymiddleware.js](routes/apikeymiddleware.js)
- **Valid keys (hardcoded array):** `"12345-abcde"`, `"67890-fghij"`, `"ggp-pro-ject"`
- **Behavior:**
  - Missing header → `403 { message: "API key is required" }`
  - Unknown key → `401 { message: "Invalid API key" }`
- **Used by:** Only `POST /api/verifyuser` ([sqlroutes/userloginapi.js](sqlroutes/userloginapi.js)) on the live server. The dead `routes/mailerroute.js` and `routes/versioncontroller.js` also reference it.

### 5.3 No auth

A large number of endpoints have **no auth at all** — including some destructive ones (PUT/DELETE on nutritionists, products, food items, exercises). Listed individually in §8 and summarized as a security concern in §16.

### 5.4 The two CORS layers

1. **Global CORS in server.js** — allowlisted origins (see §3.2).
2. **Per-route `cors` middleware** in [routes/cors.js](routes/cors.js) — sets `Access-Control-Allow-Origin: *` (wildcard). Imported and used by `userloginapi.js` on the `/login` and `/version` routes specifically. Other handlers don't apply it. So `POST /api/login` actually gets `Access-Control-Allow-Origin: *` (set last wins on the response header), while everything else gets the allowlisted origin.

---

## 6. Sign-up / Sign-in / Sign-out / Verify Flows

### 6.1 User signup — `POST /api/signup`

Handler: [sqlroutes/userloginapi.js:38](sqlroutes/userloginapi.js#L38)

**Request:**
```http
POST /api/signup
Content-Type: application/json

{ "name": "John Doe", "email": "john@example.com", "password": "secret" }
```

**Server steps:**
1. `bcrypt.genSalt(10)` → `bcrypt.hash(password)`.
2. Validate that name/email/password are present (returns `400` if not).
3. `SELECT * FROM UserLogins WHERE email = ?` — if any row exists, returns `400 { error: "User Already Registred" }`. **Bug:** this check returns from the inner callback but the outer flow continues anyway and proceeds to insert (race condition with the next INSERT — see §16).
4. `INSERT INTO UserLogins (name, email, password, signupdate, auth_provider) VALUES (?, ?, ?, ?, 'local')`.
5. `jwt.sign({ user: { id: insertId } }, GGP_SECRET_KEY, { expiresIn: '10h' })`.
6. `UPDATE UserLogins SET auth_token = ? WHERE id = ?` (stores the JWT for email-verification comparison).
7. Calls `sendEmail(email, "Welcome To Good Gut Family !", name, token)` — see §11.
8. Logs `\n New User has been registered with mail:- ${email} , Time:-${signupdate}` to `logs.txt`.

**Response (success):** `200 { msg: "User registred successfully" }` (note: token is NOT returned in the body — it's only delivered via the activation email).

**Account is created with `isActive = 0`** (NULL in DB initially; the verify step sets it to 1).

### 6.2 User login — `POST /api/login`

Handler: [sqlroutes/userloginapi.js:126](sqlroutes/userloginapi.js#L126)

**Request:** `{ email, password }`

**Server steps:**
1. `SELECT id, password, isActive FROM UserLogins WHERE email = ?`.
2. If no row → `404 { msg: "No account found with this email" }`.
3. `bcrypt.compare(password, results[0].password)` → if false → `401 { msg: "Invalid Credentials" }`.
4. If `isActive == 0` → `403 { msg: "Please activate your account" }`.
5. `jwt.sign({ user: { id } }, GGP_SECRET_KEY, { expiresIn: '10h' })`.

**Response:** `200 { token: "<jwt>" }`.

### 6.3 Email verification — `POST /api/verifyuser`

Handler: [sqlroutes/userloginapi.js:266](sqlroutes/userloginapi.js#L266)

**Auth:** requires `x-api-key` header (see §5.2).
**Request:** `{ token: "<jwt-from-welcome-email>" }`

**Flow:**
1. `jwt.verify(token, GGP_SECRET_KEY)` → extract `id`.
2. `SELECT auth_token, isActive FROM UserLogins WHERE id = ?`.
3. If `isActive === 1` → `{ title: "Thank You!", message: "Your Account is already activated" }`.
4. If `auth_token !== token` → `{ title: "", message: "Invalid token" }`.
5. Else `UPDATE UserLogins SET isActive = 1 WHERE id = ?` → `{ title: "Thank You!", message: "Your account has been activated" }`.

**Bug:** every error response in this handler returns HTTP **200** (not 4xx/5xx). See §16.

The activation link in the email is `https://www.goodgutproject.in/verify-user?token={{token}}` ([template.html:24](template.html#L24)) — the frontend extracts the token from the query string and POSTs it to `/api/verifyuser`.

### 6.4 Update user profile — `POST /api/userdata`

Handler: [sqlroutes/userloginapi.js:171](sqlroutes/userloginapi.js#L171)

Uses JWT auth. If a `UserData` row exists for the authenticated user, it builds a dynamic `UPDATE` from whatever fields are in the body. Otherwise it does a fixed `INSERT INTO UserData (...) VALUES (..., true, ?)` with `onboarded` hardcoded to true.

Body fields (all optional on update; insert uses these specific names): `gender, dob, height, weight, medical, goal, bodyfat, workout, food, occupation, onboarded, targetWeight`.

### 6.5 Google OAuth flow

Endpoints: [sqlroutes/userloginapi.js:20-36](sqlroutes/userloginapi.js#L20-L36)
Strategy: [config/passport.js](config/passport.js)

1. **Client opens** `GET /api/auth/google` → `passport.authenticate('google', { scope: ['profile', 'email'] })` → 302 to Google's consent screen.
2. **Google redirects** to `GET /api/auth/google/callback?code=...` (callback URL = `GOOGLE_CALLBACK_URL` env, default `http://localhost:3000/api/auth/google/callback`).
3. **Strategy verify callback** (in `passport.js`):
   - `SELECT id, email, isActive FROM UserLogins WHERE email = ?`.
   - **Existing user:** if `isActive === 0` → fails with "Please activate your account" message (which causes failureRedirect). Otherwise signs a 10h JWT and resolves with `{ token, user }`.
   - **New user:** `INSERT INTO UserLogins (name, email, isActive, signupdate, auth_provider) VALUES (?, ?, 1, NOW(), 'google')` — note: Google-onboarded users skip email verification (`isActive = 1` immediately). Then signs a JWT and resolves.
4. **Callback handler** redirects to `${FRONTEND_URL}/auth-success?token=${token}`.
5. **failureRedirect:** `/login` (relative to API host).

**Sessions:** OAuth uses `session: false` — JWT is stateless. Express-session is initialized but only Passport's serialize/deserialize touch it.

### 6.6 Sign-out

There is **no server-side sign-out endpoint**. JWTs are stateless and not revoked server-side. The client is expected to discard the token. There is no token blocklist, no refresh token, no rotation.

### 6.7 Nutritionist signup/login

Separate flow under `/api/nutritionists/signup` and `/api/nutritionists/login`. Same bcrypt-10 + JWT-10h pattern, but the JWT payload carries `role: 'nutritionist'`. Detailed in §8.9.

---

## 7. Database

### 7.1 Connection ([sqlconnection.js](sqlconnection.js))

```js
mysql2.createPool({
  host: "s769.use1.mysecurecloudhost.com",
  user: "gamescr1_ggp",
  password: "PuXgZRX-JHe!",
  database: "gamescr1_ggp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
```

Credentials are **hardcoded, not from env** — see §16. The file is in `.gitignore` but is committed anyway. Module exports the pool directly; handlers call `db.execute(sql, params, cb)` or `db.query(sql, params, cb)`.

### 7.2 Tables observed (across all `sqlroutes/*` queries and `sql/*` files)

**Tables with explicit CREATE TABLE in the repo:**

#### `diet_plans` ([sql/diet_plans.sql](sql/diet_plans.sql))
```sql
CREATE TABLE IF NOT EXISTS diet_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nutritionist_id INT NOT NULL,
  client_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nutritionist_id) REFERENCES nutritionists(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES UserLogins(id) ON DELETE CASCADE
);
```

#### `diet_plan_meals` ([sql/diet_plans.sql](sql/diet_plans.sql))
```sql
CREATE TABLE IF NOT EXISTS diet_plan_meals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  diet_plan_id INT NOT NULL,
  day_of_week INT NOT NULL,           -- 0=Sun, 1=Mon, ...
  meal_type VARCHAR(50) NOT NULL,     -- Breakfast/Lunch/Dinner/Snack
  food_item_id INT,
  template_id INT,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (diet_plan_id) REFERENCES diet_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES food_templates(id) ON DELETE CASCADE,
  CHECK (food_item_id IS NOT NULL OR template_id IS NOT NULL),
  CHECK (food_item_id IS NULL OR template_id IS NULL)
);
```

#### `diet_templates` ([sql/diet_templates.sql](sql/diet_templates.sql))
```sql
CREATE TABLE IF NOT EXISTS diet_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nutritionist_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nutritionist_id) REFERENCES nutritionists(id) ON DELETE CASCADE
);
```

#### `diet_template_meals` ([sql/diet_templates.sql](sql/diet_templates.sql))
```sql
CREATE TABLE IF NOT EXISTS diet_template_meals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  diet_template_id INT NOT NULL,
  day_of_week INT NOT NULL,           -- 0=Sun, 1=Mon, ...
  meal_type VARCHAR(50) NOT NULL,     -- Breakfast/Lunch/Dinner/Snack
  food_item_id INT,
  template_id INT,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (diet_template_id) REFERENCES diet_templates(id) ON DELETE CASCADE,
  FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES food_templates(id) ON DELETE CASCADE,
  CHECK (food_item_id IS NOT NULL OR template_id IS NOT NULL),
  CHECK (food_item_id IS NULL OR template_id IS NULL)
);
```

#### `food_templates`, `food_template_items` ([sql/food_templates.sql](sql/food_templates.sql))
```sql
CREATE TABLE IF NOT EXISTS food_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  nutritionist_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nutritionist_id) REFERENCES nutritionists(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_template_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_id INT NOT NULL,
  food_item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES food_templates(id) ON DELETE CASCADE,
  FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
);
```

#### `nutritionist_clients` ([sql/migrations/create_nutritionist_clients_table.sql](sql/migrations/create_nutritionist_clients_table.sql))
```sql
CREATE TABLE IF NOT EXISTS nutritionist_clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nutritionist_id INT NOT NULL,
  client_id INT NOT NULL,
  status ENUM('active','inactive','pending') DEFAULT 'pending',
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (nutritionist_id) REFERENCES nutritionists(id),
  FOREIGN KEY (client_id) REFERENCES UserLogins(id),
  UNIQUE KEY unique_nutritionist_client (nutritionist_id, client_id)
);
```

#### Migration: add `auth_provider` ([sql/migrations/add_auth_provider_to_userlogins.sql](sql/migrations/add_auth_provider_to_userlogins.sql))
```sql
ALTER TABLE UserLogins ADD COLUMN auth_provider VARCHAR(50) DEFAULT NULL;
UPDATE UserLogins SET auth_provider = 'local' WHERE auth_provider IS NULL;
```

### 7.3 Tables inferred from queries (no CREATE TABLE in repo)

These were read off live SQL queries in `sqlroutes/*`. Column lists are accurate; types are inferred from how values are passed.

| Table | Columns observed in code |
|---|---|
| `UserLogins` | `id`, `name`, `email`, `password`, `signupdate`, `auth_token`, `auth_provider` (post-migration), `isActive` (TINYINT 0/1) |
| `UserData` | `id`, `userId` (FK→UserLogins.id), `gender`, `dob`, `height`, `weight`, `medical`, `goal`, `bodyfat`, `workout`, `food`, `occupation`, `onboarded`, `targetWeight`, `assignNutritionist` (FK→nutritionists.id) |
| `Slots` | `SlotID`, `SlotTime` |
| `NutritionistSlots` | `nutritionist_id`, `date`, `SlotID`, `availability` |
| `userCalls` | `id`, `user_id`, `nutritionist_id`, `scheduled_date`, `scheduled_time`, `status` ('pending'/'confirmed'/etc.), `created_at`, `updated_at` |
| `MealByDate` | `id`, `userId`, `mealDate`, `name`, `quantity`, `kcal`, `p`, `c`, `f`, `image`, `isVeg`, `isSelected`, `mealType`, `isTargetMeal` |
| `DailyTrack` | `id`, `userId`, `selectedDate`, `sleepHours`, `waterIntake`, `steps` (+ any other dynamic field passed in body) |
| `GenInfo` | `id` (only one query, and it's broken — see §16) |
| `exercises` | `id`, `exerciseName`, `type`, `videoLink`, `muscleType`, `workoutSteps` |
| `user_exercises` | `id`, `userId`, `exerciseId`, `date` |
| `nutritionists` | `id`, `first_name`, `last_name`, `email`, `password`, `phone_number`, `specialty`, `years_of_experience`, `current_organisation`, `address`, `created_at`, `updated_at` |
| `flyers` | `id`, `name`, `imageUrl`, `description`, `url` |
| `faq` | `id`, `question`, `answer` |
| `food_items` | `id`, `name`, `quantity`, `kcal`, `p`, `c`, `f`, `image`, `isVeg`, `isSelected`, `mealType`, `created_at` |
| `products` | `id`, `name`, `description`, `price`, `stock_quantity`, `category`, `image_url`, `created_at`, `updated_at` |

---

## 8. API Reference — Every Endpoint

All endpoints below are mounted under `/api` (e.g. handler `router.post("/signup")` becomes `POST /api/signup`).
**Auth column key:** `JWT` = Authorization Bearer; `APIKEY` = x-api-key header; `none` = no auth check.

### 8.1 Auth & Users — [sqlroutes/userloginapi.js](sqlroutes/userloginapi.js)

#### `GET /api/auth/google` — Start Google OAuth
- **Auth:** none
- **Behavior:** redirects to Google consent (`profile`, `email` scopes).

#### `GET /api/auth/google/callback`
- **Auth:** Google OAuth (Passport)
- **Query:** `code`, `state` (from Google)
- **Response:** 302 → `${FRONTEND_URL}/auth-success?token=<jwt>` on success, `/login` on failure.

#### `POST /api/signup`
- **Auth:** none
- **Body:** `{ name, email, password }` (all required)
- **Success:** `200 { msg: "User registred successfully" }`
- **Errors:** `400 { error: "Name, email, and password are required" }`, `400 { error: "User Already Registred" }`, `500 { error: "Database error" }`, `500 { msg: "Server error" }`
- **Tables:** `UserLogins`
- **Side effects:** bcrypt-hashes password (salt 10), inserts row with `auth_provider='local'`, signs 10h JWT, stores it in `auth_token`, sends welcome email with verification link, appends to `logs.txt`.

#### `GET /api/users`
- **Auth:** none ⚠️
- **Response:** `200 { Users: [<full UserLogins rows including hashed passwords>] }`
- **Note:** Public, returns password hashes — see §16.

#### `POST /api/login`
- **Auth:** none (per-route `cors` middleware applies — wildcard origin)
- **Body:** `{ email, password }`
- **Success:** `200 { token: "<jwt>" }` (10h expiry)
- **Errors:** `404 { msg: "No account found with this email" }`, `401 { msg: "Invalid Credentials" }`, `403 { msg: "Please activate your account" }`, `500 { error: "Database error ..." }`
- **Tables:** `UserLogins` (read).

#### `POST /api/userdata`
- **Auth:** JWT
- **Body (update path, dynamic):** any subset of `gender, dob, height, weight, medical, goal, bodyfat, workout, food, occupation, onboarded, targetWeight`. Each key becomes a `column = ?` in the SET clause.
- **Body (insert path, fixed):** all of the above (uses `onboarded=true` hardcoded in INSERT).
- **Success:** `200 { message: "Data updated successfully" }` (existing row) or `201 { message: "Data inserted successfully" }`.
- **Errors:** `500 { error: "Failed to update data" }` / `500 { error: "Failed to insert data ..." }` / `500 { msg: "Database Error" }`
- **Tables:** `UserData`.

#### `POST /api/verifyuser`
- **Auth:** APIKEY (`x-api-key`)
- **Body:** `{ token }`
- **Behavior:** see §6.3.
- **All responses (success and errors) return HTTP 200** with `{ title, message }` shape — see §16.

#### `GET /api/version`
- **Auth:** none (per-route `cors` middleware)
- **Response:** `200 { version: "1.0.0" }` (hardcoded)
- **Note:** Same path is also defined in [routes/versioncontroller.js](routes/versioncontroller.js) but that file is not mounted; the live one is here.

---

### 8.2 User Metadata — [sqlroutes/userMeta.js](sqlroutes/userMeta.js)

#### `GET /api/usermeta`
- **Auth:** JWT
- **Behavior:** RIGHT JOIN `UserData` with `UserLogins` on `userId`, returns single object containing all UserData columns plus `name` and `email` from UserLogins.
- **Success:** `200 <single object>`. If no UserData row, returns the UserLogins row with NULLs in UserData columns.
- **Errors:** `404 { error: "ID not found" }`, `500 { error: "Database error" }`.

---

### 8.3 Daily Tracking — [sqlroutes/genInfo.js](sqlroutes/genInfo.js)

#### `POST /api/dailytrack`
- **Auth:** JWT
- **Body:** `{ selectedDate (required), sleepHours?, waterIntake?, steps?, ...any extra }`
- **Behavior:** if a row exists for `(userId, selectedDate)`, dynamic UPDATE from body; else INSERT with defaults `0` for sleep/water/steps.
- **Success:** `200 { message: "Data updated successfully" }` or `201 { message: "New data added" }`.
- **Errors:** `500 { error: "Failed to update/insert data" }`.
- **Tables:** `DailyTrack`.

#### `GET /api/geninfo`
- **Auth:** none
- **Status:** **BROKEN** — line 77 has `query[id]` (typo) instead of `db.execute(query, [id], cb)` — throws on call. See §16.

---

### 8.4 Meals — [sqlroutes/trackmealController.js](sqlroutes/trackmealController.js)

#### `POST /api/addmeal`
- **Auth:** JWT
- **Body:** `{ mealDate (req), name?, quantity (req), kcal (req), p (req), c (req), f (req), image?, isVeg?, mealType (req) }`
- **Success:** `201 { message: "Meal added successfully" }`
- **Errors:** `400 { message: "Missing required fields...", received }`, `500 { message: "An error occurred while adding the meal." }`
- **Tables:** `MealByDate` (sets `isSelected=0`, `name="Unnamed Meal"` default, `image=null` default).

#### `GET /api/trackmeal`
- **Auth:** JWT
- **Query:** `date=YYYY-MM-DD` (required)
- **Success:** `200 { meals: [...] }`
- **Errors:** `400 { msg: "Missing required parameters: date and userID...", received }`, `500 { msg: "Database error: ..." }`
- **Note:** uses `logger.error(...)` but `logger.js` exports a function — will crash if it ever hits the error path. See §16.

#### `DELETE /api/trackmeal`
- **Auth:** JWT
- **Body:** `{ mealId }`
- **Success:** `200 { msg: "Successfully deleted meal" }`
- **Errors:** `500 { msg: "Database error" }`

#### `PUT /api/selectmeal`
- **Auth:** none ⚠️
- **Body:** `{ mealId, isSelected }`
- **Success:** `200 { msg: "Meal selected successfully" }`
- **Errors:** `500 { msg: "DB Error" }`

#### `POST /api/addtargetmeal`
- **Auth:** none ⚠️ (takes `userId` in body — anyone can write to any user's tracker)
- **Body:** `{ userId, mealDate, name, quantity, kcal, p, c, f, image?, isVeg?, mealType }`
- **Behavior:** inserts with `isSelected=0, isTargetMeal=1`.
- **Success:** `201 { message: "Meal added successfully" }`
- **Errors:** `500 { message: "An error occurred while adding the meal." }`

---

### 8.5 Food Items — [sqlroutes/foodItems.js](sqlroutes/foodItems.js)

| Method | Path | Auth | Body / Params | Notes |
|---|---|---|---|---|
| GET | `/api/fooditems` | none | – | Returns array ordered by `created_at DESC`. |
| GET | `/api/fooditems/:mealType` | none | path: `mealType` | Filtered by `mealType`. |
| POST | `/api/fooditems` | none ⚠️ | `{ name, quantity, kcal, p, c, f, image?, isVeg?, isSelected?, mealType }` (required: name, quantity, kcal, p, c, f, mealType) | `400 { error: "Missing required fields" }` on missing required. Defaults: `image=null`, `isVeg=null`, `isSelected=false`. |
| PUT | `/api/fooditems/:id` | none ⚠️ | any subset of POST fields | Dynamic SET. `400 { error: "No fields provided to update" }` if body empty. `404 { message: "Food item not found" }` if no rows. |
| DELETE | `/api/fooditems/:id` | none ⚠️ | – | `404 { message: "Food item not found" }` if no rows. |

---

### 8.6 Food Templates — [sqlroutes/foodTemplates.js](sqlroutes/foodTemplates.js)

| Method | Path | Auth | Body / Params |
|---|---|---|---|
| POST | `/api/foodtemplates` | JWT | `{ name, description?, nutritionist_id, food_items: [{food_item_id, quantity}, ...] }` |
| GET | `/api/foodtemplates/nutritionist/:nutritionist_id` | JWT | – |
| GET | `/api/foodtemplates/:id` | JWT | – |
| PUT | `/api/foodtemplates/:id` | JWT | `{ name?, description?, food_items? }` (food_items replaces existing) |
| DELETE | `/api/foodtemplates/:id` | JWT | – |

All write operations use a MySQL transaction. GETs use GROUP_CONCAT + JSON_OBJECT and the handler manually `JSON.parse()`s the food_items aggregate.

**Tables:** `food_templates`, `food_template_items`, `food_items` (JOINed in reads).

---

### 8.7 Diet Plans — [sqlroutes/dietPlans.js](sqlroutes/dietPlans.js)

| Method | Path | Auth | Body / Params |
|---|---|---|---|
| POST | `/api/dietplans` | JWT | `{ nutritionist_id, client_id, start_date, end_date, notes?, meals: [{day_of_week, meal_type, food_item_id?, template_id?, quantity?}, ...] }` |
| GET | `/api/dietplans/nutritionist/:nutritionist_id` | JWT | – |
| GET | `/api/dietplans/:id` | JWT | – |
| PUT | `/api/dietplans/:id` | JWT | `{ start_date?, end_date?, notes?, meals? }` — meals (if provided) **replaces** all existing rows. |
| DELETE | `/api/dietplans/:id` | JWT | – |

PUT validates that all referenced `template_id`s exist before inserting; returns `400 { error: "Invalid template IDs", invalidIds: [...] }` if any missing.

DELETE deletes child `diet_plan_meals` rows first, then the plan, in a transaction.

**Tables:** `diet_plans`, `diet_plan_meals`, `food_items`, `food_templates`, `food_template_items`.

---

### 8.8 Diet Templates — [sqlroutes/dietTemplates.js](sqlroutes/dietTemplates.js)

Mirrors the Diet Plans API but for nutritionist-owned reusable templates (no client / dates).

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/api/diettemplates` | JWT | `{ nutritionist_id, name, description?, meals: [...] }` |
| GET | `/api/diettemplates/nutritionist/:nutritionist_id` | JWT | – |
| GET | `/api/diettemplates/:id` | JWT | – |
| PUT | `/api/diettemplates/:id` | JWT | `{ name?, description?, meals? }` (replaces meals) |
| DELETE | `/api/diettemplates/:id` | JWT | – |

**Tables:** `diet_templates`, `diet_template_meals`.

---

### 8.9 Nutritionists & Clients — [sqlroutes/nutritionists.js](sqlroutes/nutritionists.js)

| Method | Path | Auth | Body / Notes |
|---|---|---|---|
| POST | `/api/nutritionists` | none ⚠️ | `{ first_name, last_name, email, phone_number?, specialty?, years_of_experience?, current_organisation?, address? }` — creates record without password. |
| POST | `/api/nutritionists/signup` | none | Same fields + `password` (min 6 chars). bcrypt-10 hashed. Returns `{ message, token (10h JWT, role='nutritionist'), nutritionist }`. Validates email uniqueness. Returns `400` on missing fields, duplicate email, or short password. |
| GET | `/api/nutritionists` | none | Returns array of all nutritionists. |
| GET | `/api/nutritionists/:id` | none | `404 { message: "Nutritionist not found" }` if missing. |
| PUT | `/api/nutritionists/:id` | none ⚠️ | Dynamic SET clause. `updated_at = NOW()`. |
| DELETE | `/api/nutritionists/:id` | none ⚠️ | – |
| POST | `/api/nutritionists/login` | none | `{ email, password }` → `{ message, token (10h JWT, role='nutritionist'), nutritionist }`. `401 { error: "Invalid credentials" }` on mismatch. |
| GET | `/api/nutritionists/:id/clients` | JWT | Requires authenticated user's id == `:id` AND `role === 'nutritionist'`, else `403`. Returns clients with their UserData and relationship details. |
| POST | `/api/nutritionists/:id/clients` | JWT | Body: `{ clientId, notes? }`. Same auth check. `400` on duplicate, `404` if client doesn't exist. |
| PUT | `/api/nutritionists/:nutritionistId/clients/:clientId` | JWT | Body: `{ status?, notes? }`. Same auth check. |
| DELETE | `/api/nutritionists/:nutritionistId/clients/:clientId` | JWT | Same auth check. |

**Tables:** `nutritionists`, `nutritionist_clients`, `UserLogins`, `UserData`.

---

### 8.10 Nutritionist Slots — [sqlroutes/dieticianSlots.js](sqlroutes/dieticianSlots.js)

#### `POST /api/nutritionist/slots`
- **Auth:** none
- **Body:** `{ nutritionist_id, date, SlotID: [{ SlotID, available }, ...] }`
- **Behavior:** loops the `SlotID` array; for each entry verifies the slot exists in `Slots`, then upserts into `NutritionistSlots`.
- **Bug:** races — the response is sent before all per-slot async callbacks complete; multiple `res.json(...)` calls can throw "Cannot set headers after they are sent". See §16.
- **Errors:** `400`, `404 SlotID ${id} does not exist`, `500`.

#### `GET /api/nutritionist/slots/:nutritionist_id/:date`
- **Auth:** none
- **Params:** `nutritionist_id`, `date` (YYYY-MM-DD)
- **Success:** `200 { nutritionist_id, date, slots: [{SlotID, SlotTime, availability}, ...] }`
- **Errors:** `400` (bad params/date), `404 { message: "No slots found ..." }`, `500`.

---

### 8.11 User Calls — [sqlroutes/userCalls.js](sqlroutes/userCalls.js)

#### `POST /api/call`
- **Auth:** JWT (but uses `req.user.id` — wrong, should be `req.userInfo.user.id`. Will throw. §16)
- **Body:** `{ scheduled_date, scheduled_time }`
- **Behavior:** reads `assignNutritionist` from the user's `UserData` row; rejects with `400` if not assigned. Inserts call with `status='pending'`.
- **Success:** `201 { message: "Call scheduled successfully", call_id }`
- **Errors:** `400`, `404 User not found`, `500`.

#### `GET /api/calls`
- **Auth:** JWT (same `req.user.id` bug)
- **Response:** `200 { message, calls: [...] }` or `404 { message: "No scheduled calls found ..." }`. Orders by `scheduled_date DESC, scheduled_time DESC`.

#### `PUT /api/call/:call_id`
- **Auth:** JWT
- **Body:** at least one of `{ scheduled_date, scheduled_time, status }`.
- **Errors:** `400 { error: "At least one field ... must be provided" }`, `404 Call not found`, `500`.

---

### 8.12 Exercises — [sqlroutes/exercise.js](sqlroutes/exercise.js)

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/api/exercise` | none ⚠️ | `{ exerciseName, type, videoLink, muscleType, workoutSteps? }` |
| PUT | `/api/exercise/:id` | JWT | Same fields, all optional (but writes them all — may set NULLs). |
| POST | `/api/add-exercise` | JWT (uses `req.user.id` — buggy, see §16) | `{ exerciseId, date }` |
| GET | `/api/exercise` | none | Returns all exercises. `404 { message: "No exercises found" }` if empty. |

---

### 8.13 FAQ — [sqlroutes/faq.js](sqlroutes/faq.js)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/faq` | JWT | `{ question, answer }`. Response message says "Flyer created" — typo. |
| GET | `/api/faq` | none | Returns raw array. |
| DELETE | `/api/faq/:id` | none ⚠️ | Returns `200 { message: "Deleted Successfully" }` or `200 { message: "ID not found" }`. |

---

### 8.14 Flyers — [sqlroutes/flyer.js](sqlroutes/flyer.js)

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/api/flyer` | none ⚠️ | `{ name, imageUrl, description, url }` |
| GET | `/api/flyer` | none | Returns raw array. |

---

### 8.15 Products — [sqlroutes/products.js](sqlroutes/products.js)

| Method | Path | Auth | Body / Query |
|---|---|---|---|
| POST | `/api/products` | none ⚠️ | `{ name, price, stock_quantity, description?, category?, image_url? }` (first three required) |
| GET | `/api/products` | none | Optional query: `category`, `min_price`, `max_price`. `404 { message: "No products found" }` if empty. |
| PUT | `/api/products/:id` | none ⚠️ | Dynamic SET. `updated_at = NOW()`. |

(There is no DELETE for products — not implemented.)

---

### 8.16 Logs — [sqlroutes/loggerController.js](sqlroutes/loggerController.js)

#### `GET /api/getlogs`
- **Auth:** none ⚠️
- **Behavior:** `fs.readFile("logs.txt")` then `res.json({ logs })`.
- **No error handling** if `logs.txt` is missing or unreadable.

---

### 8.17 Mailer (route) — [routes/mailerroute.js](routes/mailerroute.js) **NOT MOUNTED**

Defined `POST /send-email` (would be `/api/send-email` if mounted), `cors` + `apiKeyMiddleware`, body `{ email, subject, message }`. **Not mounted in [server.js](server.js)** — only required by the dead [index.js](index.js) as `mailRoutes`. So this endpoint is unreachable in production.

---

### 8.18 Orders — [routes/orderRoutes.js](routes/orderRoutes.js) **NOT MOUNTED**

Defined `GET /order` returning hardcoded in-memory sample data (two orders). Same status as above — only `index.js` requires it, not the live `server.js`. Dead.

---

### 8.19 Version (alt) — [routes/versioncontroller.js](routes/versioncontroller.js) **NOT MOUNTED**

Defines `GET /version` with `cors + apiKeyMiddleware`. Not mounted on the live server. The live `/api/version` comes from [sqlroutes/userloginapi.js:332](sqlroutes/userloginapi.js#L332) and does **not** require an API key.

---

## 9. Models (ORM)

Both files exist but are **not on the active request path**.

### 9.1 [models/getModels.js](models/getModels.js) — Mongoose
```js
mongoose.model('user5', new mongoose.Schema({
  name: String, email: String, age: String
}))
```
Only useful with MongoDB, which only the dead `index.js` connects to.

### 9.2 [models/trackmealmodels.js](models/trackmealmodels.js) — Sequelize `Meal`
- Imports `sequelize` from `'../config/database'` — **that path does not exist**, so this module will throw on require if anything imports it.
- Schema: `id (INT, default 0, must be > 0)`, `date (STRING, default = today)`, `name`, `kcal`, `p`, `c`, `f` (all required STRING), `image (nullable)`, `isVeg (INTEGER required)`, `mealType (STRING required)`. `timestamps: true`. Hooks: `beforeValidate` nulls out undefined fields; `beforeCreate` logs.
- Old commented-out Mongoose `trackyourmeal` schema sits at the top of the file as reference.

---

## 10. Common Utilities

### 10.1 [common/commonFunction.js](common/commonFunction.js) — `getUserInformation(token)`
Decodes a JWT. **Has multiple bugs** (see §16):
- Uses `secretKey = "yourSecretKey"` (hardcoded, ignores `GGP_SECRET_KEY`).
- Calls `res.status(...)` with no `res` in scope when token is missing → ReferenceError.
- Strips first 6 chars of token (`token.slice(6)`) — assumes "Bearer" prefix is exactly 6 chars (it's "Bearer " = 7 chars).
- Returns `decoded` from inside a callback (not from the outer function) → always returns `undefined`.

Not currently called from any live handler. Keep for awareness, don't trust.

### 10.2 [common/commonenums.js](common/commonenums.js)
Defines a single object: `subject = { signup: "Welcome To Good Gut Family !" }`. **Not exported** (`module.exports` missing) — so it's effectively dead.

---

## 11. Mailer & Templates

### 11.1 [mailer.js](mailer.js) — `sendEmail(recipientEmail, subject, name, token)`
- Nodemailer Gmail transport, auth from `EMAIL_USER` / `EMAIL_PASS` env.
- Reads [template.html](template.html) from disk on each call.
- Replaces `{{name}}` and `{{token}}` placeholders.
- Sends as `html` (not text). Logs success/failure to console; does not throw.

### 11.2 [template.html](template.html)
Hardcoded HTML email body. Activation link:
```
https://www.goodgutproject.in/verify-user?token={{token}}
```
Logo: `https://www.goodgutproject.in/logo.png`. Background `#108412`, button `#ff9134`.

### 11.3 [sendMail.js](sendMail.js) — One-off test script
Hardcoded `Organikkanpur@gmail.com` as sender (with the App Password also hardcoded), recipient `kushwahaakash2000@gmail.com`, subject "Welcome to Our Service". Reads `template.html`, substitutes `{{name}}` with `'Harshit'`, then sends. **It runs on `require()`** — but nothing imports it in the live tree. Treat as a development scratch script; do not run in production. Credentials are sensitive — see §16.

---

## 12. Logging

### 12.1 [logger.js](logger.js)
```js
const logger = async (message) => {
  fs.appendFile("logs.txt", "\n" + message, (error) => { if (error) throw error; });
};
module.exports = logger;
```
- A single async function that appends to `logs.txt` (relative to CWD).
- Used in `userloginapi.js` for signup events and DB-error events.

### 12.2 [logs.txt](logs.txt)
Plain-text log file, **committed to the repo** (with real production user emails — minor PII leak, see §16). Each line is a free-form message appended by `logger()`. Actual sample (verbatim — note that real user emails are present):
```
 this is new contect added 3
 this is new contect added 3
 this is new contect added 3
Error inserting data:Error: connect ETIMEDOUT
Error inserting data:Error: connect ETIMEDOUTTime:-Mon Dec 16 2024 00:35:24 GMT+0530 (India Standard Time)

 New User has been registered with mail:- kushwahaakash2000@gmail.com , Time:-Tue Jan 14 2025 22:31:05 GMT+0530 (India Standard Time)
 ...
 New User has been registered with mail:- soomething@gmail.com , Time:-Thu Apr 10 2025 17:04:10 GMT+0530 (India Standard Time)
```
A total of ~7 user signup events and 2 DB-error events from Dec 2024 → Apr 2025 are logged. The file grows unbounded — no rotation.

### 12.3 [sqlroutes/loggerController.js](sqlroutes/loggerController.js)
Exposes `GET /api/getlogs` that simply returns the entire file contents as JSON. No auth, no rotation, no truncation.

---

## 13. Swagger

[swagger.js](swagger.js) builds a swagger-jsdoc spec:
```js
{
  openapi: "3.0.0",
  info: { title: "Node.js API Documentation", version: "1.0.0", description: "..." },
  servers: [{ url: "http://localhost:3001" }],
  apis: ["./routes/*.js"]    // ← scans only routes/*.js, not sqlroutes/*.js
}
```

Two issues:
- It is **only mounted by the dead [index.js](index.js)** at `/api-docs`. The live [server.js](server.js) never mounts swagger UI, so `/api-docs` returns 404 in production.
- The `apis` glob misses every real handler (which all live in `sqlroutes/`).
- The default server URL points to `:3001` (also the dead index.js port), not `:3000` (the live one).

---

## 14. Deployment & CI

### 14.1 [vercel.json](vercel.json)
```json
{
  "version": 2,
  "builds": [{"src": "./index.js", "use": "@vercel/node"}],
  "routes": [{"src": "/(.*)", "dest": "/"}]
}
```
Points the build at `./index.js` (the dead file). A Vercel deployment based on this would crash because `index.js` requires nonexistent route modules. **The live deployment is via FTP/SSH, not Vercel** (see below).

### 14.2 [.github/workflows/main.yml](.github/workflows/main.yml)
On `push` to `main`:
1. Checkout (`actions/checkout@v4`).
2. Set up Node 16.
3. `npm install`.
4. **FTP-Deploy** (`SamKirkland/FTP-Deploy-Action@v4.3.5`) using secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`. Pushes the entire repo to the host.
5. **SSH** (`appleboy/ssh-action@v0.1.4`) into `s769.use1.mysecurecloudhost.com` as `gamescr1`:
   ```
   source /home/gamescr1/nodevenv/gamescreed.net/ggp/20/bin/activate \
     && cd /home/gamescr1/gamescreed.net/ggp
   ps ax | grep 'lsnode:/home/gamescr1/gamescreed.net/ggp/' | grep -v grep | awk '{print $1}' | xargs kill
   curl https://api.goodgutproject.in/test
   ```
   - Activates the Node venv (Passenger-style hosting).
   - Kills the running Passenger process by name.
   - Hits `/test` to warm-restart the app via the cgi handler.

### 14.3 [.gitignore](.gitignore)
```
node_modules/
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
sqlconnection.js   ← but the file IS committed (see §16)
.env               ← but the file IS committed (see §16)
.DS_Store
Thumbs.db
.vscode/
.idea/
*.iml
```

---

## 15. External Request References (Postman / curl)

### 15.1 Postman collection — [GGP_New_Routes.postman_collection.json](GGP_New_Routes.postman_collection.json) — **canonical**

Variables defined: `apiURL = http://localhost:3000`, `token = your-jwt-token-here`. All paths use `/api/...` correctly.

**Folders / requests (45 total):**

- **Existing Routes** (12): Login, Signup, Flyer, FAQ, Get Products, Version, Track Meal, Track Meal Update, Add Track Meal, Delete Track Meal, User Meta Data, Update UserData. Several of these ("Track Meal Update", "Add Track Meal", "Delete Track Meal" with body `{ id, mealbydate: [...] }`) reflect the **old MongoDB-shaped API** and don't match the live MySQL handlers — see §16.
- **Food Items** (5): Get All / Get by Meal Type / Add / Update / Delete.
- **Food Templates** (5): Create / Get All for Nutritionist / Get Single / Update / Delete.
- **Diet Templates** (5): Create / Get All for Nutritionist / Get Single / Update / Delete.
- **Diet Plans** (5): Create / Get All for Nutritionist / Get Single / Update / Delete.
- **Nutritionist Routes** (13): Create, Signup, Login, Get All, Get Single, Update, Delete, Get Clients, Add Client, Update Client, Remove Client, Update Slots, Get Slots.

> **Use the Postman collection as your authoritative client reference.** The shapes there match the live handlers (with the few exceptions noted above for the legacy Track Meal entries).

### 15.2 [curlCommands.sh](curlCommands.sh) — **stale, do not trust paths**

Hand-written list of 60+ curl commands covering essentially every endpoint. **All paths omit the `/api` prefix**, e.g. `http://localhost:3000/signup` instead of `http://localhost:3000/api/signup`. Field names and body shapes are largely correct — useful as a body-shape reference, but rewrite the URL with `/api/` before running.

---

## 16. Known Issues / Bugs / TODOs

Findings from full-repo exploration. Each bullet is concrete and locatable.

### Critical / security

1. **MySQL credentials hardcoded and committed** — [sqlconnection.js](sqlconnection.js) has live host/user/password. The `.gitignore` lists this file but it's tracked anyway. Action: move to env, then `git rm --cached sqlconnection.js`.
2. **`.env` is committed** with all real secrets (Gmail App Password, Google OAuth client secret, JWT secret, Mongo URI). Same fix: `git rm --cached .env` and rotate every secret.
3. **`sendMail.js` test script** has a Gmail App Password (`rrjvjwgwotnbunox`) hardcoded in source. Either delete the file or move credentials to env.
4. **`api_key` middleware uses a hardcoded array** of three keys ([routes/apikeymiddleware.js:2](routes/apikeymiddleware.js#L2)) including the obvious `"ggp-pro-ject"`. Move to env (`VALID_API_KEYS` is already declared in `.env` but not read by code).
5. **`GET /api/users` returns full UserLogins rows including bcrypt password hashes**, with no auth — anyone can dump the user list.
6. **No auth on destructive endpoints:**
   - `PUT /api/nutritionists/:id`, `DELETE /api/nutritionists/:id`
   - `PUT /api/products/:id`, `POST /api/products`
   - `POST /api/fooditems`, `PUT /api/fooditems/:id`, `DELETE /api/fooditems/:id`
   - `POST /api/exercise`
   - `PUT /api/selectmeal`, `POST /api/addtargetmeal` (and the latter takes `userId` in the body, so it's a write-anyone's-data primitive)
   - `POST /api/flyer`, `DELETE /api/faq/:id`, `GET /api/getlogs`
7. **`POST /api/signup` race condition** ([sqlroutes/userloginapi.js:51-60](sqlroutes/userloginapi.js#L51-L60)) — the duplicate-email check returns from inside the callback only, then the outer function continues to INSERT regardless. The DB-level uniqueness (if `email` has a UNIQUE constraint, which it should but no schema in the repo confirms it) is the only thing preventing duplicates. With a fast retry, two responses can be sent.
7a. **[logs.txt](logs.txt) is committed and contains real user emails** (`kushwahaakash2000@gmail.com`, `thehiteshwarkaushik@gmail.com`, `hakentigeradi@gmail.com`, etc.). PII leak via git history. Action: `git rm --cached logs.txt`, add to `.gitignore` (already covers `*.log` but not `logs.txt`). Also implement log rotation — the file grows unbounded.

### Functional bugs

8. **`GET /api/geninfo` is broken** — [sqlroutes/genInfo.js:77](sqlroutes/genInfo.js#L77) has `db.execute(query[id], ...)` instead of `db.execute(query, [id], ...)`. Throws on call.
9. **`req.user.id` vs `req.userInfo.user.id` mismatch** — the auth middleware sets `req.userInfo`, but these handlers read `req.user`:
   - `POST /api/add-exercise` ([sqlroutes/exercise.js](sqlroutes/exercise.js))
   - `POST /api/call`, `GET /api/calls` ([sqlroutes/userCalls.js](sqlroutes/userCalls.js))
   All three throw `Cannot read properties of undefined (reading 'id')` on every request.
10. **`GET /api/trackmeal` error path crashes** — uses `logger.error(...)` but [logger.js](logger.js) exports a single async function, not an object. Throws when the DB query errors (so it logs nothing and crashes the response cycle).
11. **`POST /api/nutritionist/slots` race condition** — loops slots and fires async DB calls, then sends `res.json(...)` from the loop bottom (can fire before any callback runs, and then again from inside callbacks → "Cannot set headers after they are sent").
12. **`POST /api/verifyuser` always returns HTTP 200** — even on errors. Frontend has to inspect `title` / `message` strings to detect failure.
13. **`commonFunction.js` is a triple-bug** (described in §10.1). Fortunately nothing uses it.
14. **`commonenums.js` has no `module.exports`** — the `subject` constant cannot be imported.

### Dead code

15. **[index.js](index.js) cannot run** — requires modules that don't exist in `routes/`: `getRoutes`, `postRoutes`, `updateRoutes`, `deleteRoutes`, `signupRoutes`, `loginRoutes`, `getProduct`, `postProduct`, `updateProduct`, `deleteProduct`, `flyerRoutes`, `faqRoutes`, `bodydataRoutes`, `trackmealcontroller`, `fooditemscontroller`. Also uses MongoDB which the live API doesn't.
16. **[vercel.json](vercel.json) points to the dead `./index.js`** — a Vercel deployment based on this would crash.
17. **[swagger.js](swagger.js) is configured but never mounted** on the live server, and its `apis` glob (`./routes/*.js`) misses the actual handlers in `sqlroutes/`.
18. **`routes/mailerroute.js`, `routes/orderRoutes.js`, `routes/versioncontroller.js`** are only required by the dead `index.js`, not by `server.js`. Their endpoints are unreachable in production.
19. **`models/getModels.js`** (Mongoose `user5`) and **`models/trackmealmodels.js`** (Sequelize `Meal`, requires `'../config/database'` which doesn't exist) are not on any active code path.
20. **`testOAuth.js`** is empty (1 byte).
21. **`project/`** is an empty directory.
22. **`testM.jpg`** (50 KB) is committed — appears to be a leftover test asset.

### Inconsistencies / quality

23. **Two CORS layers contradict each other** — global `cors()` in server.js uses an allowlist + credentials; `routes/cors.js` (used on `/login` and `/version`) sets `Access-Control-Allow-Origin: *`. Whichever runs last wins, leading to confusing behavior on those two endpoints.
24. **Both `bcrypt` and `bcryptjs` are dependencies** — `userloginapi.js` and `nutritionists.js` use `bcryptjs`. `bcrypt` is unused. Remove it to avoid native build issues.
25. **`mysql` (callback-only legacy) AND `mysql2` are both deps** — only `mysql2` is used. Drop `mysql`.
26. **`react`, `react-dom`, `cluster`, `os`, `ws`, `uuid` are deps but never imported** in any source file. Bloat.
27. **PORT is hardcoded to `3000`** in [server.js:23](server.js#L23) — won't honor `process.env.PORT`. (Doesn't matter for the current Passenger host since it's also hardcoded to 3000 in the Apache rules, but it's a footgun for any other deploy target.)
28. **Postman collection's "Track Meal Update / Add Track Meal / Delete Track Meal"** use the old MongoDB-shaped body (`{ id, mealbydate: [{ date, meallist: [...] }] }`) which doesn't match the live MySQL handlers (`POST /api/addmeal`, `GET /api/trackmeal?date=...`, `DELETE /api/trackmeal { mealId }`). Update the collection.
29. **`curlCommands.sh` is missing `/api` on every URL** — see §15.2.
30. **FAQ POST response says "Flyer created"** — copy-paste typo in [sqlroutes/faq.js](sqlroutes/faq.js).
31. **`loggerController` reads `logs.txt`** with no error handling — a missing file crashes the response.

---

## 17. Quickstart

### 17.1 Run locally

```bash
git clone <repo>
cd MyApi
npm install

# Create .env with these keys (DO NOT commit):
# MONGODB_URI=...                # only if you also want index.js to start
# EMAIL_USER=...                 # gmail address
# EMAIL_PASS=...                 # gmail app password
# GGP_SECRET_KEY=...             # JWT secret
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
# FRONTEND_URL=http://localhost:3000

npm start                        # runs `node server.js` on :3000
```

You'll also need a reachable MySQL instance with all the tables in §7 created. The current `sqlconnection.js` points at the production host; create your own connection file or refactor to read from env before pointing at a local DB.

### 17.2 Smoke test

```bash
curl http://localhost:3000/test
# → "App restartedss"

curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<existing-user>","password":"<password>"}'
# → { "token": "..." }

curl http://localhost:3000/api/usermeta \
  -H "Authorization: Bearer <token>"
# → { ...UserData fields..., name, email }
```

### 17.3 Use the Postman collection

1. Import [GGP_New_Routes.postman_collection.json](GGP_New_Routes.postman_collection.json).
2. Set the collection variable `apiURL` to your base (default `http://localhost:3000`).
3. Run `Login` → copy `token` from the response → set the collection variable `token` to that value.
4. All other authenticated requests use `Authorization: Bearer {{token}}` automatically.

---

*End of REPO_REFERENCE.md — every file in MyApi/ is referenced above. If you add new files, please add them to §2 and (if they expose endpoints) §8.*
