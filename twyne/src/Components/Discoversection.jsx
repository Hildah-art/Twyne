import React from "react";
import "../styles/index.css";

const Discoversection = () => {
  return (
    <section className="discover-section">
      <h2>Discover New People</h2>
      <div className="profile-grid">
        {[1, 2, 3, 4].map((person) => (
          <div key={person} className="profile-card">
            <div className="profile-pic"></div>
            <h3>User Name</h3>
            <p>Location</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Discoversection;