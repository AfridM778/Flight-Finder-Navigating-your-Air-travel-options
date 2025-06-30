import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FlightAdmin.css';

const FlightAdmin = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [flightsCount, setFlightsCount] = useState(0);

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  const fetchUserDetails = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-user/${userId}`);
      setUserDetails(res.data);
      console.log('Fetched user details:', res.data);
      console.log('Approval status:', res.data.approval);
    } catch (err) {
      console.error('Error fetching user details', err);
    }
  }, [userId]);

  const fetchCounts = useCallback(async () => {
    try {
      const bookingsRes = await axios.get('http://localhost:6001/fetch-bookings');
      const flightsRes = await axios.get('http://localhost:6001/fetch-flights');

      const filteredBookings = bookingsRes.data.filter(
        (booking) => booking.flightName === username
      );
      const filteredFlights = flightsRes.data.filter(
        (flight) => flight.flightName === username
      );

      setBookingCount(filteredBookings.length);
      setFlightsCount(filteredFlights.length);
    } catch (err) {
      console.error('Error fetching counts', err);
    }
  }, [username]);

  useEffect(() => {
    fetchUserDetails();
    fetchCounts();
  }, [fetchUserDetails, fetchCounts]);

  const renderStatusMessage = () => {
    if (!userDetails) return <p>Loading user details...</p>;

    switch (userDetails.approval) {
      case 'not-approved':
        return (
          <div className="status-box pending">
            <h3>Awaiting Approval</h3>
            <p>Your application is under review by the admin team.</p>
          </div>
        );
      case 'rejected':
        return (
          <div className="status-box rejected">
            <h3>Application Rejected</h3>
            <p>Unfortunately, your application was not approved.</p>
          </div>
        );
      case 'approved':
        return (
          <div className="flight-admin-dashboard">
            <div className="admin-card-grid">
              <div className="admin-card card-green">
                <h4>Total Bookings</h4>
                <p>{bookingCount}</p>
                <button onClick={() => navigate('/flight-bookings')} className="btn btn-primary">
                  View Bookings
                </button>
              </div>
              <div className="admin-card card-yellow">
                <h4>Your Flights</h4>
                <p>{flightsCount}</p>
                <button onClick={() => navigate('/flights')} className="btn btn-warning">
                  Manage Flights
                </button>
              </div>
              <div className="admin-card card-blue">
                <h4>Add Flight</h4>
                <p>Create a new route</p>
                <Link to="/add-flight">
                  <button className="btn btn-success">Add Flight</button>
                </Link>
              </div>
            </div>
          </div>
        );
      default:
        return <p>Invalid approval status: {userDetails.approval}</p>;
    }
  };

  return (
    <div className="flight-admin-page">
      {renderStatusMessage()}
    </div>
  );
};

export default FlightAdmin;
