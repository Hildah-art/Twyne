import React, { useState } from "react";


function MatchCard({ name, location, bio, image }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="match-card">
      <img src={image} alt={name} className="match-image" />
      <h3>{name}</h3>
      <p>{location}</p>
      <p><em>{bio}</em></p>
      <button
        className={`like-button ${liked ? 'liked' : ''}`}
        onClick={() => setLiked(!liked)}
      >
        {liked ? "❤️ Liked" : "♡ Like"}
      </button>
    </div>
  );
}

export default MatchCard;
