"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ImageOff,
  Image as ImageIcon,
} from "lucide-react";
import { AdminTopbar } from "@/components/admin/Topbar";
import { Modal, ConfirmDialog } from "@/components/admin/Modal";
import { useCurrentUser } from "@/lib/auth";
import { useCategories } from "@/hooks/useAdminApi";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/adminActions";
import { getErrorMessage } from "@/lib/api";
import {
  FadeInSection,
  StaggerGrid,
  StaggerItem,
} from "@/components/shop/FadeInSection";

const emptyForm = {
  name: "",
  description: "",
  isActive: true,
  image: null,
  banner: null,
};

export default function AdminCategoriesPage() {
  const { user } = useCurrentUser();
  const { categories, isLoading, isError, refetch } = useCategories();

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

  function openEdit(category) {
    setEditing(category);
    setForm({
      name: category.name,
      description: category.description ?? "",
      isActive: category.isActive,
      image: null,
      banner: null,
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await updateCategory(editing._id, form);
      } else {
        await createCategory(form);
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
      await deleteCategory(deleteTarget._id);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <AdminTopbar
        title="Categories"
        user={user}
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-lg bg-pink-500 px-3.5 py-2 text-sm font-medium text-white hover:bg-pink-600"
          >
            <Plus className="h-4 w-4" /> New category
          </button>
        }
      />
      <main className="p-4 lg:p-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}
        <FadeInSection className="rounded-xl border bg-white shadow-sm">
          {isError && (
            <div className="p-6 text-center text-sm text-red-500">
              Couldn&apos;t load categories. Check that the backend server is
              running.
            </div>
          )}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 w-full animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <StaggerGrid className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <StaggerItem
                  key={category._id}
                  className="flex items-center gap-3 rounded-xl border p-3 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                    {category.image?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={category.image.url}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageOff className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {category.name}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {category.description || "No description"}
                    </p>
                    {category.banner?.url ? (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                        <ImageIcon className="h-2.5 w-2.5" /> Banner set
                      </span>
                    ) : (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                        No banner
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => openEdit(category)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(category)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          ) : (
            <p className="p-8 text-center text-sm text-gray-400">
              No categories yet. Create your first one to start adding products.
            </p>
          )}
        </FadeInSection>
      </main>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit category" : "New category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Cleansers"
              className="h-10 w-full rounded-lg border px-3 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Gentle daily cleansers for every skin type"
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Thumbnail image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.files?.[0] ?? null }))
              }
              className="w-full text-sm"
            />
            <p className="text-xs text-gray-400">
              Small square icon used in category lists.
            </p>
          </div>
          <div className="space-y-1.5 rounded-lg border border-dashed border-pink-200 bg-pink-50/50 p-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Banner image
            </label>
            {editing?.banner?.url && !form.banner && (
              <div className="overflow-hidden rounded-lg border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editing.banner.url}
                  alt="Current banner"
                  className="h-24 w-full object-cover"
                />
              </div>
            )}
            {form.banner && (
              <div className="overflow-hidden rounded-lg border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(form.banner)}
                  alt="New banner preview"
                  className="h-24 w-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((f) => ({ ...f, banner: e.target.files?.[0] ?? null }))
              }
              className="w-full text-sm"
            />
            <p className="text-xs text-gray-400">
              Wide hero image shown at the top of this category&apos;s product
              page (recommend ~1920&times;480).
            </p>
          </div>
          <label className="flex items-center justify-between rounded-lg border px-3 py-2.5">
            <span className="text-sm text-gray-700">
              Active (visible to customers)
            </span>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.checked }))
              }
              className="h-4 w-4"
            />
          </label>
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
                  : "Create category"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete category?"
        description={`This permanently deletes "${deleteTarget?.name}". Categories still referenced by active products can't be deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        destructive
      />
    </>
  );
}
