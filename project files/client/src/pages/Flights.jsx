import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Flights.css'; // Make sure to create/update this CSS

const Flights = () => {
  const [user, setUser] = useState(null);
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  // Fetch user data on mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const res = await axios.get(`http://localhost:6001/fetch-user/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    getUser();
  }, []);

  // Fetch flights on mount
  useEffect(() => {
    const getFlights = async () => {
      try {
        const res = await axios.get('http://localhost:6001/fetch-flights');
        setFlights(res.data);
      } catch (err) {
        console.error('Failed to fetch flights:', err);
      }
    };
    getFlights();
  }, []);

  if (!user) return null;

  if (user.approval === 'not-approved') {
    return (
      <div className="approval-warning">
        <h2>Access Pending</h2>
        <p>Your request is under review. Please wait for administrator approval.</p>
      </div>
    );
  }

  return (
    <div className="flight-dashboard">
      <h2>Your Flight Listings</h2>
      {flights.filter(f => f.flightName === localStorage.getItem('username')).length === 0 ? (
        <p className="no-flights-text">No flights found. Add a new route to get started.</p>
      ) : (
        <div className="flight-list">
          {flights
            .filter(flight => flight.flightName === localStorage.getItem('username'))
            .map(flight => (
              <div className="flight-card" key={flight._id}>
                <h4>{flight.flightId}</h4>
                <p><strong>Name:</strong> {flight.flightName}</p>
                <p><strong>Route:</strong> {flight.origin} ➜ {flight.destination}</p>
                <p><strong>Timings:</strong> {flight.departureTime} - {flight.arrivalTime}</p>
                <p><strong>Seats:</strong> {flight.totalSeats}</p>
                <p><strong>Price:</strong> ₹{flight.basePrice}</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate(`/edit-flight/${flight._id}`)}
                >
                  Edit Flight
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Flights;
