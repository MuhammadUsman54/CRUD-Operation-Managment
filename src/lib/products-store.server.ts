// In-memory product store + validation. Server-only.
import { randomUUID } from "node:crypto";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const store: Product[] = [
  {
    id: randomUUID(),
    name: "Sample Tee",
    description: "A soft cotton t-shirt to get you started.",
    price: 19.99,
    stock: 25,
    image: "https://picsum.photos/seed/tee/600/400",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const products = {
  all: () => store.slice().reverse(),
  find: (id: string) => store.find((p) => p.id === id),
  add: (p: Product) => {
    store.push(p);
  },
  replace: (id: string, p: Product) => {
    const i = store.findIndex((x) => x.id === id);
    if (i !== -1) store[i] = p;
  },
  remove: (id: string) => {
    const i = store.findIndex((x) => x.id === id);
    if (i === -1) return null;
    const [removed] = store.splice(i, 1);
    return removed;
  },
};

type Input = Omit<Product, "id" | "createdAt" | "updatedAt">;

export function validateProduct(body: Record<string, unknown>): {
  errors: string[];
  data: Input;
} {
  const errors: string[] = [];
  const data = {} as Input;
  const stringField = (k: "name" | "description" | "image", max: number) => {
    const v = body[k];
    if (typeof v !== "string" || !v.trim()) errors.push(`${k} is required`);
    else if (v.length > max) errors.push(`${k} must be ≤ ${max} chars`);
    else data[k] = v.trim();
  };
  const numberField = (k: "price" | "stock") => {
    const n = Number(body[k]);
    if (Number.isNaN(n) || n < 0) errors.push(`${k} must be a non-negative number`);
    else data[k] = n;
  };
  stringField("name", 120);
  stringField("description", 1000);
  stringField("image", 2000);
  numberField("price");
  numberField("stock");
  return { errors, data };
}
