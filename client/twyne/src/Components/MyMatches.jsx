import React, { useEffect, useState } from 'react';

const MyMatches = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});

  const currentUserId = 1; // Replace this with dynamic ID if available
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view matches.');
      setLoading(false);
      return;
    }

    let allUsers = [];

    fetch('http://localhost:5555/users', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token},
      `},
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized. Please log in again.');
          }
          throw new Error('Failed to fetch users');
        }
        return response.json();
      })
      .then((usersData) => {
        allUsers = usersData;

        return fetch('http://localhost:5555/match', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token},
          `},
        });
      })
      .then((matchRes) => {
        if (!matchRes.ok) {
          if (matchRes.status === 401) {
            throw new Error('Unauthorized. Please log in again.');
          }
          throw new Error('Failed to fetch matches');
        }
        return matchRes.json();
      })
      .then((matchesData) => {
        const mutualMatchIds = new Set();
        matchesData.forEach((match) => {
          if (match.user_1_id === currentUserId) {
            mutualMatchIds.add(match.user_2_id);
          } else if (match.user_2_id === currentUserId) {
            mutualMatchIds.add(match.user_1_id);
          }
        });

        const mutualUsers = allUsers.filter((user) => mutualMatchIds.has(user.id));
        setMatchedUsers(mutualUsers);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message || 'An error occurred.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUserId, token]);

  const handleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return <div className="matches-container"><p>Loading matches...</p></div>;
  }

  if (error) {
    return <div className="matches-container"><p className="error-message">Error: {error}</p></div>;
  }

  return (
    <div className="matches-container">
      <h2 className="title">Your Matches 💘</h2>
      {matchedUsers.length === 0 ? (
        <p className="no-matches">No mutual matches yet... but love might be right around the corner ✨</p>
      ) : (
        <div className="match-list">
          {matchedUsers.map((match) => (
            <div key={match.id} className="match-card-horizontal">
              <div className="match-info">
                <h3>{match.name}, {match.age}</h3>
                <p className="location">{match.location}</p>
                <p className="bio">{match.bio}</p>
                <div className="buttons">
                  <button className="chat-btn" onClick={() => alert(`Chat with ${match.name}`)}>Chat 💬</button>
                  <button
                    className={`like-btn ${likes[match.id] ? 'liked' : ''}`}
                    onClick={() => handleLike(match.id)}
                  >
                    {likes[match.id] ? '💖 Liked' : '🤍 Like'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMatches;