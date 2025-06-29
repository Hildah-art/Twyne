import React, { useState } from "react";


function MatchCard({ name, location, bio, image }) {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => setLiked(!liked);

  return (
    <div className="match-card">
      <img src={image} alt={name} className="match-image" />
      <div className="match-info">
        <h3>{name}</h3>
        <p className="location">{location}</p>
        <p className="bio">{bio}</p>
        <button className={`like-button ${liked ? "liked" : ""}`} onClick={toggleLike}>
          {liked ? "💖 Liked" : "🤍 Like"}
        </button>
      </div>
    </div>
  );
}

export default MatchCard;
