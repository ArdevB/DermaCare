"use client";

import { useState } from "react";
import { Trash2, ShieldCheck, ShieldOff } from "lucide-react";
import { AdminTopbar } from "@/components/admin/Topbar";
import { Badge } from "@/components/admin/Badge";
import { ConfirmDialog } from "@/components/admin/Modal";
import { PaginationBar } from "@/components/admin/PaginationBar";
import { useCurrentUser } from "@/lib/auth";
import { useUsers } from "@/hooks/useAdminApi";
import { updateUserRole, deleteUser } from "@/lib/adminActions";
import { getErrorMessage } from "@/lib/api";
import { formatDate, initials } from "@/lib/format";
import {
  FadeInSection,
  StaggerGrid,
  StaggerItem,
} from "@/components/shop/FadeInSection";

export default function AdminCustomersPage() {
  const { user: currentUser } = useCurrentUser();
  const [page, setPage] = useState(1);
  const { users, pagination, isLoading, isError, refetch } = useUsers({
    page,
    limit: 15,
  });

  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleToggleRole(user) {
    const nextRole = user.role === "admin" ? "user" : "admin";
    setPendingId(user._id);
    setError("");
    try {
      await updateUserRole(user._id, nextRole);
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget._id);
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
      <AdminTopbar title="Customers" user={currentUser} />
      <main className="p-4 lg:p-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}
        <FadeInSection className="rounded-xl border bg-white shadow-sm">
          {isError && (
            <div className="p-6 text-center text-sm text-red-500">
              Couldn&apos;t load customers. Check that the backend server is
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
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    <th className="px-4 py-2.5">User</th>
                    <th className="px-4 py-2.5">Role</th>
                    <th className="px-4 py-2.5">Verified</th>
                    <th className="px-4 py-2.5">Joined</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <StaggerGrid as="tbody" className="divide-y">
                  {users.map((user) => {
                    const isSelf = user._id === currentUser?._id;
                    return (
                      <StaggerItem
                        as="tr"
                        key={user._id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-xs font-semibold text-pink-600">
                              {initials(user.name)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "outline"
                            }
                            className="capitalize"
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          {user.isEmailVerified ? (
                            <Badge variant="success">Verified</Badge>
                          ) : (
                            <Badge variant="warning">Unverified</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            title={
                              user.role === "admin"
                                ? "Revoke admin"
                                : "Make admin"
                            }
                            disabled={isSelf || pendingId === user._id}
                            onClick={() => handleToggleRole(user)}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
                          >
                            {user.role === "admin" ? (
                              <ShieldOff className="h-4 w-4" />
                            ) : (
                              <ShieldCheck className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            disabled={isSelf}
                            onClick={() => setDeleteTarget(user)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </StaggerItem>
                    );
                  })}
                </StaggerGrid>
              </table>
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-gray-400">
              No customers yet.
            </p>
          )}

          <PaginationBar pagination={pagination} onPageChange={setPage} />
        </FadeInSection>
      </main>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this user?"
        description={`This permanently deletes "${deleteTarget?.name}"'s account.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        destructive
      />
    </>
  );
}
