import React, { useState } from 'react';

const PreferencesForm = () => {
  const [preferences, setPreferences] = useState({
    preferredGender: '',
    minAge: '',
    maxAge: ''
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="signup-container">
      <h2>What’s your type?</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="preferredGender"
          value={preferences.preferredGender}
          onChange={handleChange}
        >
          <option value="">Preferred Gender</option>
          <option value="female">Women</option>
          <option value="male">Men</option>
          <option value="nonbinary">Non-binary</option>
          <option value="any">Anyone</option>
        </select>

        <input
          type="number"
          name="minAge"
          placeholder="Minimum Age"
          value={preferences.minAge}
          onChange={handleChange}
        />

        <input
          type="number"
          name="maxAge"
          placeholder="Maximum Age"
          value={preferences.maxAge}
          onChange={handleChange}
        />

        {saved && <p className="success">Preferences saved 💘</p>}
        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
};

export default PreferencesForm;
