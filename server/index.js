// Simple Express CRUD API for products (in-memory store).
// Run locally: cd server && npm install && npm run dev
// Deploy: push to Vercel (see README.md)

import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";

const app = express();

// CORS — in production, restrict this to your frontend URL
const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

/** @type {Array<{id:string,name:string,description:string,price:number,stock:number,image:string,createdAt:string,updatedAt:string}>} */
let products = [
  {
    id: randomUUID(),
    name: "Sample Tee",
    description: "A soft cotton t-shirt.",
    price: 19.99,
    stock: 25,
    image: "https://picsum.photos/seed/tee/600/400",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function validate(body, { partial = false } = {}) {
  const errors = [];
  const out = {};
  const fields = [
    ["name", "string"],
    ["description", "string"],
    ["price", "number"],
    ["stock", "number"],
    ["image", "string"],
  ];
  for (const [key, type] of fields) {
    if (body[key] === undefined || body[key] === null || body[key] === "") {
      if (!partial) errors.push(`${key} is required`);
      continue;
    }
    if (type === "number") {
      const n = Number(body[key]);
      if (Number.isNaN(n)) errors.push(`${key} must be a number`);
      else out[key] = n;
    } else {
      if (typeof body[key] !== "string") errors.push(`${key} must be a string`);
      else out[key] = body[key].trim();
    }
  }
  return { errors, data: out };
}

app.get("/api/products", (_req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const p = products.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

app.post("/api/products", (req, res) => {
  const { errors, data } = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const now = new Date().toISOString();
  const product = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
  products.push(product);
  res.status(201).json(product);
});

// PUT replaces the whole product (except id/createdAt)
app.put("/api/products/:id", (req, res) => {
  const idx = products.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const { errors, data } = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const updated = {
    ...products[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  products[idx] = updated;
  res.json(updated);
});

app.delete("/api/products/:id", (req, res) => {
  const idx = products.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const [removed] = products.splice(idx, 1);
  res.json(removed);
});

// Local dev only — Vercel handles the server in production
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`API ready on http://localhost:${port}`);
  });
}

export default app;
