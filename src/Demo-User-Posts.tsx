import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchJson } from "./api.ts";

type PublicProfile = {
  id: number;
  username: string;
  role: string;
  about: string;
};

type PublicPost = {
  id: number;
  title: string;
  content: string | null;
  owner_id: number | null;
  published: boolean;
};

const DemoUserPosts = () => {
  const { user_id } = useParams();
  const parsedUserId = Number(user_id);
  const isValidUserId = Number.isInteger(parsedUserId) && parsedUserId > 0;

  const pageQuery = useQuery({
    queryKey: ["demo-user-posts", parsedUserId],
    enabled: isValidUserId,
    queryFn: async () => {
      const [profile, posts] = await Promise.all([
        fetchJson(`/profile/${parsedUserId}`),
        fetchJson(`/posts/user/${parsedUserId}`),
      ]);

      return {
        profile: profile as PublicProfile,
        posts: posts as PublicPost[],
      };
    },
  });

  if (!isValidUserId) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl">
          <h2 className="text-4xl font-semibold text-white">
            Public Demo Posts
          </h2>
          <p className="mt-4 text-lg text-rose-300">Invalid user id.</p>
        </div>
      </section>
    );
  }

  if (pageQuery.isPending) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl">
          <p className="text-lg text-slate-300">Loading public demo posts...</p>
        </div>
      </section>
    );
  }

  if (pageQuery.isError) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl">
          <p className="text-lg text-rose-300">{pageQuery.error.message}</p>
        </div>
      </section>
    );
  }

  const { profile, posts } = pageQuery.data;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Public Demo Posts
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-white">
            @{profile.username}'s posts
          </h2>
          <Link
            to={`/spaces/user/${profile.id}/about`}
            className="mt-5 inline-flex rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            View about
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-white/10 px-6 py-12 text-center text-slate-400">
            No public demo posts yet.
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

export default DemoUserPosts;
