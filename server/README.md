# Ecommerce API (Express)

Standalone Node/Express CRUD backend for the products UI.

## Run locally

```bash
cd server
npm install
npm run dev
```

API runs on `http://localhost:4000`.

## Endpoints

| Method | Path                  | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/api/products`       | List all products    |
| GET    | `/api/products/:id`   | Get one product      |
| POST   | `/api/products`       | Create a product     |
| PUT    | `/api/products/:id`   | Replace whole product|
| DELETE | `/api/products/:id`   | Delete a product     |

Product shape:

```json
{
  "name": "string",
  "description": "string",
  "price": 0,
  "stock": 0,
  "image": "https://..."
}
```

## Deploy to Vercel

### 1. Connect your repo

Import this repo in [Vercel Dashboard](https://vercel.com).

- **Framework Preset:** Other (we use a custom Express function)
- **Build Command:** leave empty (Vercel will use `vercel.json`)

### 2. Environment variables (optional)

| Variable     | Value                              | Purpose                  |
| ------------ | ---------------------------------- | ------------------------ |
| `CORS_ORIGIN`| `https://your-frontend-url.app`    | Restrict CORS in prod    |

Leave `CORS_ORIGIN` unset (or use `*`) during development.

### 3. Connect the frontend

Once deployed, copy your Vercel URL (e.g. `https://ecommerce-api.vercel.app`).

In your Lovable project, set this environment variable:

| Variable        | Value                               |
| --------------- | ----------------------------------- |
| `VITE_API_URL`  | `https://ecommerce-api.vercel.app`  |

Rebuild & publish the frontend — it will now call your Vercel API.

> The API uses an in-memory store. On Vercel serverless each invocation is a fresh process, so data resets. Connect a real database (e.g. Vercel Postgres, MongoDB Atlas) when you're ready.
