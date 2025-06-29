import React, { useState } from 'react';

const ReportButton = ({ username = "this user" }) => {
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    console.log(`Report submitted for ${username}: ${reason}`);
    alert(`Thanks for reporting ${username} — we’ll review this user soon.`);
    setShowForm(false);
    setReason('');
  };

  return (
    <div className="report-button-container">
      <button className="report-btn" onClick={() => setShowForm(!showForm)}>
        🚩 Report
      </button>

      {showForm && (
        <div className="report-form">
          <p className="report-username">Reporting: <strong>{username}</strong></p>

          <textarea
            placeholder="Tell us why you're reporting this user..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="4"
            className="report-textarea"
          />

          <div className="report-actions">
            <button className="form-button" onClick={handleSubmit}>Submit</button>
            <button className="form-button cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportButton;