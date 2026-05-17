// Default to same-origin (built-in TanStack server routes).
// Set VITE_API_URL to point at a standalone Express server instead.
export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";
export const API_LABEL = API_URL || "same-origin /api";

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

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.errors) msg = body.errors.join(", ");
      else if (body?.error) msg = body.error;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const productsApi = {
  list: () => fetch(`${API_URL}/api/products`).then((r) => handle<Product[]>(r)),
  get: (id: string) =>
    fetch(`${API_URL}/api/products/${id}`).then((r) => handle<Product>(r)),
  create: (data: ProductInput) =>
    fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => handle<Product>(r)),
  update: (id: string, data: ProductInput) =>
    fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => handle<Product>(r)),
  remove: (id: string) =>
    fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" }).then((r) =>
      handle<Product>(r),
    ),
};
