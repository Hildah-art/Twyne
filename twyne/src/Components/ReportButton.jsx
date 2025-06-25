import React, { useState } from 'react';


const ReportButton = ({ username = "this user" }) => {
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    console.log(`Report submitted for ${username}: ${reason}`);
    alert("Thanks for reporting—we’ll review this user soon.");
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
          <textarea
            placeholder="Tell us why you're reporting this user..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="4"
          />
          <div className="report-actions">
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportButton;
