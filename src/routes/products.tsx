import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus, Trash2, Package, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/sonner";
import { API_LABEL, productsApi, type Product, type ProductInput } from "@/lib/api";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Products — Ecommerce CRUD" },
      { name: "description", content: "Create, read, update and delete products." },
    ],
  }),
});

const emptyForm: ProductInput = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  image: "",
};

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setProducts(await productsApi.list());
    } catch (e) {
      toast.error("Couldn't load products", {
        description: (e as Error).message + ` — API: ${API_LABEL}`,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      image: p.image,
    });
    setDialogOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        const updated = await productsApi.update(editing.id, form);
        setProducts((p) => p.map((x) => (x.id === updated.id ? updated : x)));
        toast.success("Product updated");
      } else {
        const created = await productsApi.create(form);
        setProducts((p) => [created, ...p]);
        toast.success("Product created");
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error("Save failed", { description: (e as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await productsApi.remove(deleteTarget.id);
      setProducts((p) => p.filter((x) => x.id !== deleteTarget.id));
      toast.success("Product deleted");
    } catch (e) {
      toast.error("Delete failed", { description: (e as Error).message });
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />

      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Package className="h-4 w-4" />
            <span className="font-semibold tracking-tight text-foreground">Shopdesk</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New product
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connected to <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{API_LABEL}</code>
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-lg border bg-muted/40" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <Package className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-medium">No products yet</p>
                <p className="text-sm text-muted-foreground">Create your first product to get started.</p>
              </div>
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" /> New product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Card key={p.id} className="overflow-hidden">
                {p.image ? (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                  </div>
                ) : null}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    <span className="truncate">{p.name}</span>
                    <span className="shrink-0 text-base font-semibold">
                      ${Number(p.price).toFixed(2)}
                    </span>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{p.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Stock: <span className="font-medium text-foreground">{p.stock}</span>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(p)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update product details. PUT replaces the whole record." : "Add a product to your catalog."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  required
                  maxLength={1000}
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  required
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : editing ? "Save changes" : "Create product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.name} will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
