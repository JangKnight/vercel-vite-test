import { useEffect, useState } from "react";

const FetchGHProfile = () => {
  const changeUser = (form) => {
    form.preventDefault();
    const formData = new FormData(form.target);
    let username = formData.get("username");
    let trimmed = null;
    if (typeof username === "string") {
      trimmed = username.trim();
    }
    setUsername(trimmed || "JangKnight");
    form.target.reset();
  };

  const [username, setUsername] = useState("JangKnight");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setProfile(data);
        } else {
          console.error("Error fetching profile:", res.status);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };
    fetchProfile();
  }, [username]);
  return (
    <>
      <div className="flex flex-col p-4 items-center">
        <form onSubmit={changeUser}>
          <input
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="text"
            name="username"
            placeholder="GitHub username"
          />
          <button
            className="mx-2 p-2 bg-blue-500 rounded hover:bg-blue-600"
            type="submit"
          >
            Fetch Profile
          </button>
        </form>

        <h2 className="my-4 ">
          {profile ? (
            <>
              <a
                className="text-blue-500"
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.login}
              </a>
            </>
          ) : (
            "Fetch GH Profile"
          )}
        </h2>
        {profile && (
          <div className="flex flex-col items-center">
            <a
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={profile.avatar_url}
                alt={`${profile.login}'s avatar`}
                className="w-24 h-24 rounded-full mb-4 mx-auto"
              />
            </a>
            <p>{profile.name}</p>
            <p>"{profile.company}"</p>
            <p>{profile.location}</p>
            <p>{profile.bio}</p>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500 mt-4 text-center">
        <hr className="my-4 mx-auto border-gray-300 w-full max-w-4xl" />
        Use cases: Try fetching one of these profiles --&gt;{" "}
        <code>"torvalds"</code>, <code>"mit"</code>, an empty string, a friend's
        username, or your own username!
      </div>
    </>
  );
};
export default FetchGHProfile;
