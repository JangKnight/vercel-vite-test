import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "./Auth.tsx";
import { fetchJson, getAuthHeaders } from "./api.ts";

type AdminPost = {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  owner_id: number | null;
  owner_username: string | null;
};

const AdminPosts = () => {
  const queryClient = useQueryClient();
  const { token, user } = useAuth();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const isAnthony = user?.role === "anthony";

  const postsQuery = useQuery({
    queryKey: ["admin", "posts", token],
    enabled: isAnthony && Boolean(token),
    queryFn: async () => {
      return (await fetchJson("/admin/posts", {
        headers: getAuthHeaders(token),
      })) as AdminPost[];
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      setDeletingId(postId);
      return fetchJson(`/admin/posts/${postId}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "posts", token],
      });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  if (!isAnthony) {
    return null;
  }

  const posts = postsQuery.data ?? [];

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Posts
          </p>
          <h3 className="mt-2 text-3xl font-semibold text-white">All posts</h3>
        </div>
        <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
          {posts.length} total
        </span>
      </div>

      {deletePostMutation.isError ? (
        <p className="mt-6 text-sm text-rose-300">
          {deletePostMutation.error.message}
        </p>
      ) : null}

      {postsQuery.isPending ? (
        <p className="mt-8 text-slate-300">Loading posts...</p>
      ) : postsQuery.isError ? (
        <p className="mt-8 text-rose-300">{postsQuery.error.message}</p>
      ) : posts.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-slate-400">
          No posts found.
        </p>
      ) : (
        <div className="mt-8 grid gap-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-3xl border border-white/10 bg-slate-950/60 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-2xl font-medium text-white">
                      {post.title}
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-300">
                      <span className="rounded-full border border-white/10 px-4 py-2">
                        owner: {post.owner_username ?? "Unknown"}
                      </span>
                      <span className="rounded-full border border-white/10 px-4 py-2">
                        owner id: {post.owner_id ?? "None"}
                      </span>
                      {post.owner_id ? (
                        <Link
                          to={`/demos/user/${post.owner_id}/posts`}
                          className="rounded-full border border-white/10 px-4 py-2 transition hover:border-cyan-400 hover:text-cyan-300"
                        >
                          View owner's posts
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <p className="max-w-3xl whitespace-pre-wrap text-sm text-slate-300">
                    {post.content || "No content yet."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deletePostMutation.mutate(post.id)}
                  disabled={deletePostMutation.isPending}
                  className="rounded-full border border-white/15 p-3 text-rose-200 transition hover:border-rose-400 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Delete post ${post.title}`}
                  title="Delete post"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {deletingId === post.id ? (
                <p className="mt-4 text-sm text-slate-400">Deleting post...</p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPosts;
