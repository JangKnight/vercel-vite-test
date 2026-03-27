import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "./api.ts";

type Post = {
  id: number;
  title: string;
  content: string | null;
  owner_id: number | null;
  published: boolean;
};

const Posts = () => {
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return (await fetchJson("/posts/blog")) as Post[];
    },
  });

  if (postsQuery.isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 pt-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Posts</h2>
        <p className="text-lg text-center max-w-2xl">Loading posts...</p>
      </div>
    );
  }

  if (postsQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 pt-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Posts</h2>
        <p className="text-lg text-center max-w-2xl text-rose-300">
          {postsQuery.error.message}
        </p>
      </div>
    );
  }

  const posts = postsQuery.data ?? [];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Blog
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-white">
            Anthony's public blog
          </h2>
        </div>

        {posts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-white/10 px-6 py-12 text-center text-slate-400">
            No posts yet.
          </p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl"
              >
                <h3 className="text-2xl font-semibold text-white">
                  {post.title}
                </h3>
                <p className="mt-4 whitespace-pre-wrap text-slate-300">
                  {post.content || "No content yet."}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Posts;
