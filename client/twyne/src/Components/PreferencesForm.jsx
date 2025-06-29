import React, { useEffect, useState } from 'react';
import matches from '../data/matches'; 

const Discoversection = () => {
  const [preferences, setPreferences] = useState({
    preferredGender: '',
    minAge: '',
    maxAge: '',
    preferredLocation: ''
  });

  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem('datingPreferences'));
    if (savedPrefs) setPreferences(savedPrefs);
  }, []);

  const filteredMatches = matches.filter((match) => {
    const {
      preferredGender,
      minAge,
      maxAge,
      preferredLocation
    } = preferences;

    return (
      (!preferredGender || match.gender === preferredGender || preferredGender === 'any') &&
      (!minAge || match.age >= parseInt(minAge)) &&
      (!maxAge || match.age <= parseInt(maxAge)) &&
      (!preferredLocation || match.location === preferredLocation)
    );
  });

  return (
    <div className="discover-section">
      <h2>Discover New People</h2>
      <div className="profile-grid">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <div key={match.id} className="profile-card">
              <div className="profile-pic">
                <img src={match.image} alt={match.name} style={{ width: '100%', height: '100%', borderRadius: '10px' }} />
              </div>
              <h3>{match.name}</h3>
              <p>{match.location}</p>
              <p className="bio">{match.bio}</p>
            </div>
          ))
        ) : (
          <p>No matches found for your preferences 💔</p>
        )}
      </div>
    </div>
  );
};

export default Discoversection;
