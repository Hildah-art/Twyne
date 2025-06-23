import "./../styles/MatchCard.css";

function MatchCard({ name, age, bio, image }) {
  return (
    <div className="match-card">
      <img src={image} alt={`${name}'s profile`} />
      <h3>{name}, {age}</h3>
      <p>{bio}</p>
      <button>Like ❤️</button>
    </div>
  );
}

export default MatchCard;
