import React, { useEffect, useState } from "react";
import MatchCard from "./MatchCard";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    fetch("http://localhost:5555/profile", {
      headers: {
        Authorization: `Bearer ${token},
      `},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>Welcome back, {user.name}!</h2>
      <MatchCard
        name={user.name}
        age={user.age}
        location={user.location}
        bio={user.bio}
        image={user.image_url || "https://via.placeholder.com/150"}
      />
    </div>
  );
}

export default Profile;