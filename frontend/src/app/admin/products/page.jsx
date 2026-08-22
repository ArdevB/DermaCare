"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ImageOff,
  Sparkles,
  X,
} from "lucide-react";
import { AdminTopbar } from "@/components/admin/Topbar";
import { Modal, ConfirmDialog } from "@/components/admin/Modal";
import { PaginationBar } from "@/components/admin/PaginationBar";
import { useCurrentUser } from "@/lib/auth";
import { useProducts, useCategories } from "@/hooks/useAdminApi";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
} from "@/lib/adminActions";
import { getErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  brand: "",
  category: "",
  ingredients: "",
  features: "",
  benefits: "",
  images: [],
};

function toCommaList(value) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={null}>
      <AdminProductsPageInner />
    </Suspense>
  );
}

function AdminProductsPageInner() {
  const { user } = useCurrentUser();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { categories } = useCategories();
  const { products, pagination, isLoading, isError, refetch } = useProducts({
    page,
    limit: 12,
    search: search || undefined,
    category: categoryFilter === "all" ? undefined : categoryFilter,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.descriptionGeneratedByAI ? "" : product.description,
      price: String(product.price),
      stock: String(product.stock),
      brand: product.brand ?? "",
      category:
        typeof product.category === "object"
          ? product.category._id
          : product.category,
      ingredients: product.ingredients.join(", "),
      features: product.featuresGeneratedByAI
        ? ""
        : product.features.join(", "),
      benefits: product.benefitsGeneratedByAI
        ? ""
        : product.benefits.join(", "),
      images: [],
    });
    setError("");
    setModalOpen(true);
  }

  // Deep-link from the dashboard's low-stock list (?edit=<id>)
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && products.length > 0) {
      const product = products.find((p) => p._id === editId);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (product) openEdit(product);
    }
  }, [searchParams, products]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.category || !form.price) {
      setError("Name, category, and price are required.");
      return;
    }
    const values = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock || 0),
      category: form.category,
      brand: form.brand.trim(),
      ingredients: toCommaList(form.ingredients),
      features: toCommaList(form.features),
      benefits: toCommaList(form.benefits),
      images: form.images,
    };
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await updateProduct(editing._id, values);
      } else {
        await createProduct(values);
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget._id);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  async function handleRemoveExistingImage(publicId) {
    if (!editing) return;
    try {
      const res = await deleteProductImage(editing._id, publicId);
      setEditing(res.data.product);
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <>
      <AdminTopbar
        title="Products"
        user={user}
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-lg bg-pink-500 px-3.5 py-2 text-sm font-medium text-white hover:bg-pink-600"
          >
            <Plus className="h-4 w-4" /> New product
          </button>
        }
      />
      <main className="p-4 lg:p-8">
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-lg border pl-9 pr-3 text-sm"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-lg border px-3 text-sm sm:w-48"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 px-5 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}
          {isError && (
            <div className="p-6 text-center text-sm text-red-500">
              Couldn&apos;t load products. Check that the backend server is
              running.
            </div>
          )}

          {isLoading ? (
            <div className="space-y-2 p-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 w-full animate-pulse rounded-lg bg-gray-100"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    <th className="px-4 py-2.5">Product</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Price</th>
                    <th className="px-4 py-2.5">Stock</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                            {product.images?.[0]?.url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageOff className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        {typeof product.category === "object"
                          ? product.category.name
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-3.5">
                        {product.stock <= 10 ? (
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                            {product.stock} left
                          </span>
                        ) : (
                          product.stock
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => openEdit(product)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-gray-400">
              No products found{search ? ` for "${search}"` : ""}.
            </p>
          )}

          <PaginationBar pagination={pagination} onPageChange={setPage} />
        </div>
      </main>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit product" : "New product"}
        wide
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Retinol Night Cream"
                className="h-10 w-full rounded-lg border px-3 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="h-10 w-full rounded-lg border px-3 text-sm"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Brand
              </label>
              <input
                value={form.brand}
                onChange={(e) =>
                  setForm((f) => ({ ...f, brand: e.target.value }))
                }
                placeholder="DermaCare Lab"
                className="h-10 w-full rounded-lg border px-3 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Price (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                placeholder="24.99"
                className="h-10 w-full rounded-lg border px-3 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Stock
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stock: e.target.value }))
                }
                placeholder="50"
                className="h-10 w-full rounded-lg border px-3 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Description <Sparkles className="h-3 w-3 text-pink-400" />
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Leave blank to auto-generate with AI"
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Ingredients (comma separated)
            </label>
            <textarea
              value={form.ingredients}
              onChange={(e) =>
                setForm((f) => ({ ...f, ingredients: e.target.value }))
              }
              placeholder="Retinol, Hyaluronic Acid, Niacinamide"
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-400">
              Ingredients are entered manually and never AI-generated, for
              accuracy and safety.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Features <Sparkles className="h-3 w-3 text-pink-400" />
              </label>
              <textarea
                value={form.features}
                onChange={(e) =>
                  setForm((f) => ({ ...f, features: e.target.value }))
                }
                placeholder="Leave blank to auto-generate"
                rows={2}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Benefits <Sparkles className="h-3 w-3 text-pink-400" />
              </label>
              <textarea
                value={form.benefits}
                onChange={(e) =>
                  setForm((f) => ({ ...f, benefits: e.target.value }))
                }
                placeholder="Leave blank to auto-generate"
                rows={2}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          {editing && editing.images?.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Current images
              </label>
              <div className="flex flex-wrap gap-2">
                {editing.images.map((img) => (
                  <div
                    key={img.publicId}
                    className="group relative h-16 w-16 overflow-hidden rounded-lg border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img.publicId)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {editing ? "Add more images" : "Images"}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  images: Array.from(e.target.files ?? []),
                }))
              }
              className="w-full text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-pink-500 px-3.5 py-2 text-sm font-medium text-white hover:bg-pink-600 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Create product"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete product?"
        description={`This permanently deletes "${deleteTarget?.name}" and its images.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        destructive
      />
    </>
  );
}
