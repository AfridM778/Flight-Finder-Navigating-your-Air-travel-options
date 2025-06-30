import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import '../styles/FlightBookings.css';

const FlightBookings = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-user/${userId}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch user data', error);
    }
  }, [userId]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-bookings');
      setBookings(response.data.reverse());
    } catch (error) {
      console.error('❌ Failed to fetch bookings', error);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchBookings();
  }, [fetchUserDetails, fetchBookings]);

  const cancelTicket = async (id) => {
    try {
      await axios.put(`http://localhost:6001/cancel-ticket/${id}`);
      alert('✅ Ticket cancelled successfully!');
      fetchBookings();
    } catch (error) {
      alert('❌ Cancellation failed.');
      console.error('Cancel error:', error);
    }
  };

  const renderPageContent = () => {
    if (!userDetails) return null;

    const { approval } = userDetails;

    if (approval === 'not-approved') {
      return (
        <div className="approval-status-box">
          <h3>Awaiting Approval</h3>
          <p>Your application is under review. Please wait for admin approval.</p>
        </div>
      );
    }

    if (approval === 'rejected') {
      return (
        <div className="approval-status-box">
          <h3>Application Rejected</h3>
          <p>Unfortunately, your operator request was rejected.</p>
        </div>
      );
    }

    const userBookings = bookings.filter(b => b.flightName === username);

    return (
      <div className="FlightBookingsPage">
        <h2>Your Flight Bookings</h2>

        {userBookings.length === 0 ? (
          <p className="no-bookings">No bookings found for your flights.</p>
        ) : (
          <div className="bookings-container">
            {userBookings.map((booking) => (
              <div className="booking-card" key={booking._id}>
                <p><b>Booking ID:</b> {booking._id}</p>

                <div className="booking-details-grid">
                  <div>
                    <p><b>Flight ID:</b> {booking.flightId}</p>
                    <p><b>Flight Name:</b> {booking.flightName}</p>
                  </div>
                  <div>
                    <p><b>From:</b> {booking.departure}</p>
                    <p><b>To:</b> {booking.destination}</p>
                  </div>
                  <div>
                    <p><b>Date:</b> {booking.journeyDate?.slice(0, 10)}</p>
                    <p><b>Time:</b> {booking.journeyTime}</p>
                  </div>
                  <div>
                    <p><b>Price:</b> ₹{booking.totalPrice}</p>
                    <p>
                      <b>Status:</b>{' '}
                      <span style={{ color: booking.bookingStatus === 'cancelled' ? 'red' : 'green' }}>
                        {booking.bookingStatus}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <p><b>Passengers:</b></p>
                  <ul>
                    {booking.passengers?.map((p, i) => (
                      <li key={i}>{p.name}, Age: {p.age}</li>
                    ))}
                  </ul>
                </div>

                {booking.bookingStatus === 'confirmed' && (
                  <button className="btn btn-danger" onClick={() => cancelTicket(booking._id)}>
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flight-bookings-page">
      {renderPageContent()}
    </div>
  );
};

export default FlightBookings;
