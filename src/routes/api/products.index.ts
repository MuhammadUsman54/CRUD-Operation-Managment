import { createFileRoute } from "@tanstack/react-router";
import { randomUUID } from "node:crypto";
import { products, validateProduct } from "@/lib/products-store.server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/products/")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async () =>
        new Response(JSON.stringify(products.all()), {
          headers: { "Content-Type": "application/json", ...cors },
        }),
      POST: async ({ request }) => {
        const body = await request.json().catch(() => ({}));
        const { errors, data } = validateProduct(body);
        if (errors.length) {
          return new Response(JSON.stringify({ errors }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
        const now = new Date().toISOString();
        const product = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
        products.add(product);
        return new Response(JSON.stringify(product), {
          status: 201,
          headers: { "Content-Type": "application/json", ...cors },
        });
      },
    },
  },
});
