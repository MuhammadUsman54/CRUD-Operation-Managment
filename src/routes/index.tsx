import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_LABEL } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Ecommerce CRUD" },
      { name: "description", content: "Manage products with a React UI and Express API." },
    ],
  }),
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Ecommerce CRUD
        </h1>
        <p className="mt-4 text-muted-foreground">
          React frontend wired to a Node/Express API. Create, read, update, and
          delete products in real time.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link to="/products">
              Open products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          API: <code className="rounded bg-muted px-1.5 py-0.5">{API_LABEL}</code>
        </p>
      </div>
    </div>
  );
}
