import React from "react";
import "../styles/index.css";

const Profile = () => {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-avatar"></div>
        <h2>Hilda</h2>
        <p>Nairobi, 24</p>
        <p className="bio">
          Hi! I'm Jane, I love traveling, photography, and good vibes. Let’s connect!
        </p>
      </div>
    </div>
  );
};

export default Profile;