import { createFileRoute } from "@tanstack/react-router";
import { products, validateProduct } from "@/lib/products-store.server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/products/$id")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async ({ params }) => {
        const p = products.find(params.id);
        if (!p) {
          return new Response(JSON.stringify({ error: "Not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
        return new Response(JSON.stringify(p), {
          headers: { "Content-Type": "application/json", ...cors },
        });
      },
      PUT: async ({ params, request }) => {
        const existing = products.find(params.id);
        if (!existing) {
          return new Response(JSON.stringify({ error: "Not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
        const body = await request.json().catch(() => ({}));
        const { errors, data } = validateProduct(body);
        if (errors.length) {
          return new Response(JSON.stringify({ errors }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
        const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
        products.replace(params.id, updated);
        return new Response(JSON.stringify(updated), {
          headers: { "Content-Type": "application/json", ...cors },
        });
      },
      DELETE: async ({ params }) => {
        const removed = products.remove(params.id);
        if (!removed) {
          return new Response(JSON.stringify({ error: "Not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
        return new Response(JSON.stringify(removed), {
          headers: { "Content-Type": "application/json", ...cors },
        });
      },
    },
  },
});
