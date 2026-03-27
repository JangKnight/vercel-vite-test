import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "./Auth.tsx";
import { fetchJson, getAuthHeaders } from "./api.ts";

type Post = {
  id: number;
  title: string;
  content: string | null;
  owner_id: number | null;
  published: boolean;
};

const DemoBlog = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const postsQuery = useQuery({
    queryKey: ["demo-posts", token],
    enabled: isAuthenticated && Boolean(token),
    queryFn: async () => {
      return (await fetchJson("/posts/me", {
        headers: getAuthHeaders(token),
      })) as Post[];
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const createPostMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string }) => {
      return (await fetchJson("/posts", {
        method: "POST",
        headers: getAuthHeaders(token, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          title: payload.title,
          content: payload.content || null,
          published: true,
        }),
      })) as Post;
    },
    onSuccess: async () => {
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["demo-posts", token] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (payload: {
      id: number;
      title: string;
      content: string;
    }) => {
      return (await fetchJson(`/posts/${payload.id}`, {
        method: "PUT",
        headers: getAuthHeaders(token, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          title: payload.title,
          content: payload.content || null,
          published: true,
        }),
      })) as Post;
    },
    onSuccess: async () => {
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["demo-posts", token] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      return fetchJson(`/posts/${postId}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
      });
    },
    onSuccess: async (_, postId) => {
      if (editingId === postId) {
        resetForm();
      }
      await queryClient.invalidateQueries({ queryKey: ["demo-posts", token] });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const payload = {
      title: trimmedTitle,
      content: content.trim(),
    };

    if (editingId) {
      updatePostMutation.mutate({ id: editingId, ...payload });
      return;
    }

    createPostMutation.mutate(payload);
  };

  if (!isAuthenticated) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl">
          <h2 className="text-4xl font-semibold text-white">Your Blog</h2>
          <p className="mt-4 text-lg text-slate-300">
            Sign in to create posts for your blog.
          </p>
          <Link
            to="/spaces/login"
            className="mt-8 inline-flex rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Go to login
          </Link>
        </div>
      </section>
    );
  }

  const posts = postsQuery.data ?? [];
  const mutationError =
    createPostMutation.error?.message ??
    updatePostMutation.error?.message ??
    deletePostMutation.error?.message;
  const isSaving = createPostMutation.isPending || updatePostMutation.isPending;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Your Blog
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-white">
            Publish into your blog space
          </h2>
          {user?.id ? (
            <Link
              to={`/spaces/user/${user.id}/posts`}
              className="mt-5 inline-flex rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Public view
            </Link>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl"
        >
          <div className="grid gap-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Post title"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={5}
              placeholder="What do you want to publish?"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
            {mutationError ? (
              <p className="text-sm text-rose-300">{mutationError}</p>
            ) : null}
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-slate-400">
                {editingId
                  ? "Editing an existing post."
                  : "Create something new."}
              </div>
              <div className="flex gap-3">
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:text-white"
                  >
                    Cancel
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editingId
                    ? updatePostMutation.isPending
                      ? "Saving..."
                      : "Save post"
                    : createPostMutation.isPending
                      ? "Publishing..."
                      : "Publish"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {postsQuery.isPending ? (
          <p className="text-center text-slate-300">
            Loading your demo posts...
          </p>
        ) : postsQuery.isError ? (
          <p className="text-center text-rose-300">
            {postsQuery.error.message}
          </p>
        ) : posts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-white/10 px-6 py-12 text-center text-slate-400">
            No demo posts yet.
          </p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      {post.title}
                    </h3>
                    <p className="mt-4 whitespace-pre-wrap text-slate-300">
                      {post.content || "No content yet."}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(post.id);
                        setTitle(post.title);
                        setContent(post.content ?? "");
                      }}
                      className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePostMutation.mutate(post.id)}
                      className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200 transition hover:border-rose-400 hover:text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DemoBlog;
