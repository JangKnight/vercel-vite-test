import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "./Auth.tsx";
import { fetchJson, getAuthHeaders } from "./api.ts";

type Note = {
  id: number;
  title: string;
  content: string | null;
  owner_id: number;
};

const Notes = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, token } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const notesQuery = useQuery({
    queryKey: ["notes", token],
    enabled: isAuthenticated && Boolean(token),
    queryFn: async () => {
      return (await fetchJson("/notes", {
        headers: getAuthHeaders(token),
      })) as Note[];
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const createNoteMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string }) => {
      return (await fetchJson("/notes", {
        method: "POST",
        headers: getAuthHeaders(token, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(payload),
      })) as Note;
    },
    onSuccess: async () => {
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["notes", token] });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async (payload: {
      id: number;
      title: string;
      content: string;
    }) => {
      return (await fetchJson(`/notes/${payload.id}`, {
        method: "PUT",
        headers: getAuthHeaders(token, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          title: payload.title,
          content: payload.content,
        }),
      })) as Note;
    },
    onSuccess: async () => {
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["notes", token] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: number) => {
      return fetchJson(`/notes/${noteId}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes", token] });
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
      updateNoteMutation.mutate({ id: editingId, ...payload });
      return;
    }

    createNoteMutation.mutate(payload);
  };

  if (!isAuthenticated) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl">
          <h2 className="text-4xl font-semibold text-white">Your Notes</h2>
          <p className="mt-4 text-lg text-slate-300">
            Sign in to create and manage your personal notes.
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

  const notes = notesQuery.data ?? [];
  const mutationError =
    createNoteMutation.error?.message ??
    updateNoteMutation.error?.message ??
    deleteNoteMutation.error?.message;
  const isSaving = createNoteMutation.isPending || updateNoteMutation.isPending;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[360px_1fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Notebook
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            {editingId ? "Edit note" : "Create a note"}
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Capture drafts, working ideas, or anything you want to keep private.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Title
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Title your note"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Content
              </label>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write whatever you need to remember"
                rows={8}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            {mutationError ? (
              <p className="text-sm text-rose-300">{mutationError}</p>
            ) : null}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingId
                  ? updateNoteMutation.isPending
                    ? "Saving..."
                    : "Save note"
                  : createNoteMutation.isPending
                    ? "Creating..."
                    : "Create note"}
              </button>

              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40 hover:text-white"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                Collection
              </p>
              <h3 className="mt-2 text-3xl font-semibold text-white">
                Your saved notes
              </h3>
            </div>
            <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
              {notes.length} total
            </span>
          </div>

          {notesQuery.isPending ? (
            <p className="mt-8 text-slate-300">Loading notes...</p>
          ) : notesQuery.isError ? (
            <p className="mt-8 text-rose-300">{notesQuery.error.message}</p>
          ) : notes.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-slate-400">
              No notes yet. Start with the form on the left.
            </p>
          ) : (
            <div className="mt-8 grid gap-4">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className="rounded-3xl border border-white/10 bg-slate-950/60 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-2xl font-medium text-white">
                        {note.title}
                      </h4>
                      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
                        {note.content || "No content yet."}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(note.id);
                          setTitle(note.title);
                          setContent(note.content ?? "");
                        }}
                        className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNoteMutation.mutate(note.id)}
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
      </div>
    </section>
  );
};

export default Notes;
