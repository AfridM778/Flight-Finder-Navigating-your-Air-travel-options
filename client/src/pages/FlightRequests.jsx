import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FlightRequests.css';

const FlightRequests = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-users');
      const unapprovedOperators = response.data.filter(
        user => user.usertype === 'flight-operator' && user.approval === 'not-approved'
      );
      setPendingUsers(unapprovedOperators);
    } catch (err) {
      console.error("Failed to fetch flight operator requests", err);
    }
  };

  const updateApproval = async (userId, decision) => {
    try {
      await axios.put(`http://localhost:6001/approve-user/${userId}`, {
        approval: decision,
      });
      alert(`User has been ${decision}`);
      fetchPendingRequests();
    } catch (err) {
      alert('Failed to update approval status');
    }
  };

  return (
    <div className="flight-requests-page">
      <h2>Pending Flight Operator Requests</h2>

      {pendingUsers.length === 0 ? (
        <p className="no-requests">No pending requests found.</p>
      ) : (
        <div className="requests-container">
          {pendingUsers.map(user => (
            <div className="request-card" key={user._id}>
              <p><strong>Name:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <div className="action-buttons">
                <button className="btn btn-success" onClick={() => updateApproval(user._id, 'approved')}>Approve</button>
                <button className="btn btn-danger" onClick={() => updateApproval(user._id, 'rejected')}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightRequests;
