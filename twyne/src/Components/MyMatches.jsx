import React from 'react';
import matches from '../data/matches'; 

const MyMatches = () => {
  const mutualMatches = matches.filter(match => match.is_mutual);

  return (
    <div className="matches-container">
      <h2>Your Matches 💘</h2>
      {mutualMatches.length === 0 ? (
        <p>No mutual matches yet... but love might be right around the corner ✨</p>
      ) : (
        <div className="match-cards">
          {mutualMatches.map(match => (
            <div key={match.id} className="match-card">
              <img src={match.image} alt={match.name} />
              <h3>{match.name}, {match.age}</h3>
              <p>{match.location}</p>
              <p className="bio">{match.bio}</p>
              <button onClick={() => alert(`Chat with ${match.name}`)}>Chat 💬</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMatches;
