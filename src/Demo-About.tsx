import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "./Auth.tsx";
import { fetchJson, getAuthHeaders } from "./api.ts";

type Profile = {
  id: number;
  email: string;
  username: string;
  role: string;
  about: string;
};

const DemoAbout = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, token, user } = useAuth();
  const [aboutDraft, setAboutDraft] = useState("");

  const profileQuery = useQuery({
    queryKey: ["profile", token],
    enabled: isAuthenticated && Boolean(token),
    queryFn: async () => {
      return (await fetchJson("/profile/me", {
        headers: getAuthHeaders(token),
      })) as Profile;
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      setAboutDraft(profileQuery.data.about ?? "");
    }
  }, [profileQuery.data]);

  const saveProfileMutation = useMutation({
    mutationFn: async (about: string) => {
      return (await fetchJson("/profile/me", {
        method: "PUT",
        headers: getAuthHeaders(token, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ about }),
      })) as Profile;
    },
    onSuccess: async (profile) => {
      queryClient.setQueryData(["profile", token], profile);
    },
  });

  if (!isAuthenticated) {
    return (
      <section id="demo-about" className="py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl">
          <h2 className="text-4xl font-semibold text-white">Your About</h2>
          <p className="mt-4 text-lg text-slate-300">
            Sign in to create your own blog profile.
          </p>
          <Link
            to="/demos/login"
            className="mt-8 inline-flex rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Go to login
          </Link>
        </div>
      </section>
    );
  }

  const profile = profileQuery.data;

  return (
    <section id="demo-about" className="py-12">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Your Profile
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-white">
              Build your own blog profile.
            </h2>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 px-4 py-2">
                @{profile?.username ?? user?.username}
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2">
                {profile?.email ?? user?.email}
              </span>
            </div>

            {(profile?.id ?? user?.id) ? (
              <div className="mt-6">
                <Link
                  to={`/demos/user/${profile?.id ?? user?.id}/about`}
                  className="inline-flex rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  View your public page
                </Link>
              </div>
            ) : null}
          </div>

          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6">
            {profileQuery.isPending ? (
              <p className="text-slate-300">Loading your profile...</p>
            ) : profileQuery.isError ? (
              <p className="text-rose-300">{profileQuery.error.message}</p>
            ) : (
              <>
                <label className="mb-3 block text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
                  About / description
                </label>
                <textarea
                  value={aboutDraft}
                  onChange={(event) => setAboutDraft(event.target.value)}
                  rows={10}
                  placeholder="Tell readers what your blog is about."
                  className="w-full rounded-3xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none transition focus:border-cyan-400"
                />

                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="text-sm text-slate-400">
                    {aboutDraft.length}/4000 characters
                  </p>
                  <button
                    type="button"
                    disabled={saveProfileMutation.isPending}
                    onClick={() => saveProfileMutation.mutate(aboutDraft)}
                    className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saveProfileMutation.isPending ? "Saving..." : "Save about"}
                  </button>
                </div>

                {saveProfileMutation.isError ? (
                  <p className="mt-4 text-sm text-rose-300">
                    {saveProfileMutation.error.message}
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoAbout;
