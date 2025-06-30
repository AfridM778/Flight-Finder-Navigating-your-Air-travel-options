import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Bookings.css';

const Bookings = () => {
  const [userBookings, setUserBookings] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      const loadUserBookings = async () => {
        try {
          const { data } = await axios.get(`http://localhost:6001/bookings/${userId}`);
          setUserBookings(data.reverse()); // Show latest first
        } catch (err) {
          console.error('❌ Failed to fetch bookings', err);
        }
      };

      loadUserBookings();
    }
  }, [userId]);

  const handleCancel = async (bookingId) => {
    try {
      await axios.put(`http://localhost:6001/cancel-ticket/${bookingId}`);
      alert('❌ Ticket cancelled successfully.');

      // Re-fetch bookings after cancellation
      const { data } = await axios.get(`http://localhost:6001/bookings/${userId}`);
      setUserBookings(data.reverse());
    } catch (err) {
      alert('Failed to cancel ticket.');
      console.error(err);
    }
  };

  return (
    <div className="bookings-page">
      <h2 className="bookings-title">Your Bookings</h2>

      {userBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="bookings-list">
          {userBookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <div className="booking-row">
                <span><strong>Booking ID:</strong> {booking._id}</span>
                <span>
                  <strong>Status:</strong>
                  <span style={{ color: booking.bookingStatus === 'cancelled' ? 'red' : 'green', marginLeft: '5px' }}>
                    {booking.bookingStatus}
                  </span>
                </span>
              </div>

              <div className="booking-row">
                <span><strong>Flight:</strong> {booking.flightName} ({booking.flightId})</span>
                <span><strong>From:</strong> {booking.departure} <strong>To:</strong> {booking.destination}</span>
              </div>

              <div className="booking-row">
                <span><strong>Journey Date:</strong> {booking.journeyDate?.slice(0, 10)}</span>
                <span><strong>Journey Time:</strong> {booking.journeyTime}</span>
              </div>

              <div className="booking-row">
                <span><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</span>
                <span><strong>Total Price:</strong> ₹{booking.totalPrice}</span>
              </div>

              <div className="booking-passengers">
                <strong>Passengers:</strong>
                <ol>
                  {booking.passengers.map((p, index) => (
                    <li key={index}>Name: {p.name}, Age: {p.age}, Gender: {p.gender}</li>
                  ))}
                </ol>
              </div>

              {booking.bookingStatus === 'confirmed' && (
                <button className="btn btn-danger mt-2" onClick={() => handleCancel(booking._id)}>
                  Cancel Ticket
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
