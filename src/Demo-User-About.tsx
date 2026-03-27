import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchJson } from "./api.ts";

type PublicProfile = {
  id: number;
  username: string;
  role: string;
  about: string;
};

const DemoUserAbout = () => {
  const { user_id } = useParams();
  const parsedUserId = Number(user_id);
  const isValidUserId = Number.isInteger(parsedUserId) && parsedUserId > 0;

  const profileQuery = useQuery({
    queryKey: ["demo-user-profile", parsedUserId],
    enabled: isValidUserId,
    queryFn: async () => {
      return (await fetchJson(`/profile/${parsedUserId}`)) as PublicProfile;
    },
  });

  if (!isValidUserId) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl">
          <h2 className="text-4xl font-semibold text-white">
            Public Demo About
          </h2>
          <p className="mt-4 text-lg text-rose-300">Invalid user id.</p>
        </div>
      </section>
    );
  }

  if (profileQuery.isPending) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl">
          <p className="text-lg text-slate-300">
            Loading public demo profile...
          </p>
        </div>
      </section>
    );
  }

  if (profileQuery.isError) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl">
          <p className="text-lg text-rose-300">{profileQuery.error.message}</p>
        </div>
      </section>
    );
  }

  const profile = profileQuery.data;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          Public Demo Profile
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-white">
          @{profile.username}
        </h2>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
          <Link
            to={`/spaces/user/${profile.id}/posts`}
            className="rounded-full border border-white/10 px-4 py-2 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            View posts
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white">About</h3>
          <p className="mt-4 whitespace-pre-wrap text-slate-300">
            {profile.about ||
              "This user has not written a public demo about section yet."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DemoUserAbout;
