import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/AllUsers.css';
import axios from 'axios';

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-users');
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="all-users-container">
        <section className="user-section">
          <h2 className="section-title">Customer Users</h2>
          <div className="user-grid">
            {users.filter(user => user.usertype === 'customer').map(user => (
              <div className="user-card" key={user._id}>
                <h5>{user.username}</h5>
                <p><strong>User ID:</strong> {user._id}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="user-section">
          <h2 className="section-title">Flight Operators</h2>
          <div className="user-grid">
            {users.filter(user => user.usertype === 'flight-operator').map(user => (
              <div className="user-card" key={user._id}>
                <h5>{user.username}</h5>
                <p><strong>Operator ID:</strong> {user._id}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default AllUsers;
