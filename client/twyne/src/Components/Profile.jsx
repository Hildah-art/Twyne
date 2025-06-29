import React from "react";
import "../styles/index.css";

const Profile = () => {
  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
         
          <img src="https://www.pexels.com/photo/portrait-of-a-traditional-african-woman-outdoors-30629416/" alt="Hilda" />
        </div>
        <h2 className="profile-name">Hilda</h2>
        <p className="profile-location">📍 Nairobi, 24</p>
        <p className="profile-bio">
          Hi! I'm Hilda, I love traveling, photography, and good vibes. Let’s connect!
        </p>
        <button className="profile-edit-btn">Edit Profile</button>
      </div>
    </div>
  );
};

export default Profile;