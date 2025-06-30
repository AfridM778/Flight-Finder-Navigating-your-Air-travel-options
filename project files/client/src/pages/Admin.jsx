import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [flightsCount, setFlightsCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get('http://localhost:6001/fetch-users');
      const allUsers = usersRes.data;

      // Count all except admin
      const filteredUsers = allUsers.filter(
        user => user.usertype === 'customer' || user.usertype === 'flight-operator'
      );
      setUserCount(filteredUsers.length);

      // Only show new operator applications (not-approved)
      const pendingOperators = allUsers.filter(
        user => user.usertype === 'flight-operator' && user.approval === 'not-approved'
      );
      setUsers(pendingOperators);

      const bookingsRes = await axios.get('http://localhost:6001/fetch-bookings');
      setBookingCount(bookingsRes.data.length);

      const flightsRes = await axios.get('http://localhost:6001/fetch-flights');
      setFlightsCount(flightsRes.data.length);
    } catch (error) {
      console.error("❌ Error fetching admin data:", error);
    }
  };

  const approveRequest = async (id) => {
    try {
      await axios.post('http://localhost:6001/approve-operator', { id });
      alert('✅ Operator approved!');
      fetchData();
    } catch (err) {
      console.error('❌ Approval failed:', err);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.post('http://localhost:6001/reject-operator', { id });
      alert('❌ Operator rejected!');
      fetchData();
    } catch (err) {
      console.error('❌ Rejection failed:', err);
    }
  };

  return (
    <div className="admin-page">
      {/* Dashboard Cards */}
      <div className="admin-page-cards">
        <div className="card admin-card users-card">
          <h4>Users</h4>
          <p>{userCount}</p>
          <button className="btn btn-primary" onClick={() => navigate('/all-users')}>
            View all
          </button>
        </div>

        <div className="card admin-card transactions-card">
          <h4>Bookings</h4>
          <p>{bookingCount}</p>
          <button className="btn btn-primary" onClick={() => navigate('/all-bookings')}>
            View all
          </button>
        </div>

        <div className="card admin-card deposits-card">
          <h4>Flights</h4>
          <p>{flightsCount}</p>
          <button className="btn btn-primary" onClick={() => navigate('/all-flights')}>
            View all
          </button>
        </div>
      </div>

      {/* Operator Requests */}
      <div className="admin-requests-container">
        <h3>New Operator Applications</h3>
        <div className="admin-requests">
          {users.length === 0 ? (
            <p>No new requests..</p>
          ) : (
            users.map(user => (
              <div className="admin-request" key={user._id}>
                <span><b>Operator name:</b> {user.username}</span>
                <span><b>Operator email:</b> {user.email}</span>
                <div className="admin-request-actions">
                  <button className="btn btn-primary" onClick={() => approveRequest(user._id)}>
                    Approve
                  </button>
                  <button className="btn btn-danger" onClick={() => rejectRequest(user._id)}>
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
