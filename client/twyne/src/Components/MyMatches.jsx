import React, { useState, useEffect } from 'react';

const MyMatches = () => {
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likes, setLikes] = useState({});

   
    const currentUserId = 1; 
    const token = localStorage.getItem('access_token'); 

    useEffect(() => {
        setLoading(true);
        setError(null);

        // First, fetch all users
        fetch('http://localhost:5555/users', {
            method: 'GET', // GET is default, but explicitly stating for clarity
            headers: {
                'Content-Type': 'application/json', // Not strictly necessary for GET, but good practice
                'Authorization': `Bearer ${token}`, // Include the JWT token
            },
        })
        .then(response => {
            // Check if the response was successful
            if (!response.ok) {
                // If not successful, throw an error to be caught by the .catch block
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }
            return response.json(); // Parse the JSON response
        })
        .then(allUsers => {
            // After successfully fetching users, now fetch matches
            return fetch('http://localhost:5555/match', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
                }
                return response.json(); // Parse the JSON response
            })
            .then(allMatches => {
                // Once both allUsers and allMatches are fetched, process them

                // Determine "mutual matches" based on the current user's ID.
                // This logic is a simplification. A true mutual match would involve
                // a two-way "like" system confirmed by the backend.
                const mutualMatchIds = new Set();
                allMatches.forEach(match => {
                    if (match.user_1_id === currentUserId) {
                        mutualMatchIds.add(match.user_2_id);
                    } else if (match.user_2_id === currentUserId) {
                        mutualMatchIds.add(match.user_1_id);
                    }
                });

                // Filter the fetched users to only include those who are "mutual matches"
                const fetchedMutualUsers = allUsers.filter(user =>
                    mutualMatchIds.has(user.id)
                );

                // Update the state with the filtered matched users
                setMatchedUsers(fetchedMutualUsers);
            });
        })
        .catch(err => {
            // Catch any errors that occurred during any of the fetch operations or parsing
            console.error("Failed to fetch matches:", err);
            setError(err.message || 'Failed to load matches.');
        })
        .finally(() => {
            // Always set loading to false, regardless of success or failure
            setLoading(false);
        });

    }, [currentUserId, token]); // Dependencies for useEffect: re-run if currentUserId or token changes

    // handleLike function remains the same as it's client-side state
    const handleLike = (id) => {
        setLikes(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
        // In a real app, you would send a POST/PATCH request to your backend
        // to update the like status or create a "like" record.
        console.log(`Toggled like for user ID: ${id}`);
    };

    // Render loading, error, or match list based on state
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
                    {matchedUsers.map(match => (
                        <div key={match.id} className="match-card-horizontal">
                            <div className="match-image-section">
                                {/* Using a placeholder image as user model doesn't have an image field */}
                                <img src={`https://via.placeholder.com/150?text=${match.name.charAt(0)}`} alt={match.name} className="match-img" />
                            </div>
                            <div className="match-info">
                                <h3>{match.name}, {match.age}</h3>
                                <p className="location">{match.location}</p>
                                <p className="bio">{match.bio}</p>
                                <div className="buttons">
                                    {/* Using alert for chat, consider replacing with a modal or routing */}
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
