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
          <button className="mx-3 btn btn-primary" type="submit">
            Fetch Profile
          </button>
        </form>

        <h2 className="my-4 ">
          {profile ? `${profile.login}'s Profile` : "Fetch GH Profile"}
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
    </>
  );
};
export default FetchGHProfile;
