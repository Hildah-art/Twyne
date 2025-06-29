import React, { useState, useEffect } from "react";

function EditProfile() {
  const [profile, setProfile] = useState({
    id: null,
    name: "",
    bio: "",
    location: "",
    image: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5555/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => console.error("Failed to load profile", err));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5555/users/${profile.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        alert("Profile updated!");
      })
      .catch((err) => {
        alert("Error updating profile");
        console.error(err);
      });
  };

  return (
    <div className="container">
      <h2 className="section-title">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="location"
          value={profile.location}
          onChange={handleChange}
          placeholder="Location"
        />
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          placeholder="Short Bio"
        />
        <input
          type="text"
          name="image"
          value={profile.image}
          onChange={handleChange}
          placeholder="Profile Image URL"
        />

        <button type="submit" className="button">Save Changes</button>
      </form>

      {profile.image && (
        <div className="profile-preview">
          <p style={{ color: "white", marginTop: "1rem" }}>Preview:</p>
          <img
            src={profile.image}
            alt="Profile"
            className="preview-image"
          />
        </div>
      )}
    </div>
  );
}

export default EditProfile;