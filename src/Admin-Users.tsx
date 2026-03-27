import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "./Auth.tsx";
import { fetchJson, getAuthHeaders } from "./api.ts";

type AdminUser = {
  id: number;
  email: string;
  username: string;
  role: string;
  about: string;
};

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { token, user } = useAuth();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const isAnthony = user?.role === "anthony";

  const usersQuery = useQuery({
    queryKey: ["admin", "users", token],
    enabled: isAnthony && Boolean(token),
    queryFn: async () => {
      return (await fetchJson("/admin/users", {
        headers: getAuthHeaders(token),
      })) as AdminUser[];
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      setDeletingId(userId);
      return fetchJson(`/admin/users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "users", token],
      });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  if (!isAnthony) {
    return null;
  }

  const users = usersQuery.data ?? [];

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Users
          </p>
          <h3 className="mt-2 text-3xl font-semibold text-white">All users</h3>
        </div>
        <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
          {users.length} total
        </span>
      </div>

      {deleteUserMutation.isError ? (
        <p className="mt-6 text-sm text-rose-300">
          {deleteUserMutation.error.message}
        </p>
      ) : null}

      {usersQuery.isPending ? (
        <p className="mt-8 text-slate-300">Loading users...</p>
      ) : usersQuery.isError ? (
        <p className="mt-8 text-rose-300">{usersQuery.error.message}</p>
      ) : users.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-slate-400">
          No users found.
        </p>
      ) : (
        <div className="mt-8 grid gap-4">
          {users.map((entry) => (
            <article
              key={entry.id}
              className="rounded-3xl border border-white/10 bg-slate-950/60 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-2xl font-medium text-white">
                      @{entry.username}
                    </h4>
                    <p className="mt-1 text-sm text-slate-400">{entry.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                    <span className="rounded-full border border-white/10 px-4 py-2">
                      role: {entry.role}
                    </span>
                    <span className="rounded-full border border-white/10 px-4 py-2">
                      id: {entry.id}
                    </span>
                    <Link
                      to={`/demos/user/${entry.id}/about`}
                      className="rounded-full border border-white/10 px-4 py-2 transition hover:border-cyan-400 hover:text-cyan-300"
                    >
                      View owner's bio
                    </Link>
                  </div>
                  <p className="max-w-3xl whitespace-pre-wrap text-sm text-slate-300">
                    {entry.about || "No public demo about text yet."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteUserMutation.mutate(entry.id)}
                  disabled={
                    deleteUserMutation.isPending || entry.id === user?.id
                  }
                  className="rounded-full border border-white/15 p-3 text-rose-200 transition hover:border-rose-400 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Delete user ${entry.username}`}
                  title={
                    entry.id === user?.id
                      ? "You cannot delete your own account"
                      : "Delete user"
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {deletingId === entry.id ? (
                <p className="mt-4 text-sm text-slate-400">Deleting user...</p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
