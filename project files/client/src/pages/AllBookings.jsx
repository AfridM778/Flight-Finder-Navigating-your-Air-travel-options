import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AllBookings.css'; // Ensure styling is customized

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-bookings');
      setBookings(response.data.reverse());
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const cancelTicket = async (id) => {
    try {
      await axios.put(`http://localhost:6001/cancel-ticket/${id}`);
      alert("Ticket cancelled successfully!");
      fetchBookings();
    } catch (err) {
      console.error("Error cancelling ticket:", err);
    }
  };

  return (
    <div className="all-bookings-container">
      <h2 className="section-title">All Bookings</h2>

      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div className={`booking-card ${booking.bookingStatus === 'cancelled' ? 'cancelled' : ''}`} key={booking._id}>
            <h5>Booking ID: <span>{booking._id}</span></h5>

            <div className="info-group">
              <p><strong>Flight:</strong> {booking.flightName} ({booking.flightId})</p>
              <p><strong>Passenger(s):</strong></p>
              <ul>
                {booking.passengers.map((p, i) => (
                  <li key={i}>{p.name} (Age: {p.age})</li>
                ))}
              </ul>
              <p><strong>Seats:</strong> {booking.bookingStatus === 'confirmed' ? booking.seats : '—'}</p>
            </div>

            <div className="info-group">
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Mobile:</strong> {booking.mobile}</p>
              <p><strong>From:</strong> {booking.departure}</p>
              <p><strong>To:</strong> {booking.destination}</p>
            </div>

            <div className="info-group">
              <p><strong>Journey Date:</strong> {booking.journeyDate?.slice(0, 10)}</p>
              <p><strong>Booking Date:</strong> {booking.bookingDate?.slice(0, 10)}</p>
              <p><strong>Time:</strong> {booking.journeyTime}</p>
              <p><strong>Total:</strong> ₹{booking.totalPrice}</p>
            </div>

            <div className="status-group">
              <p>
                <strong>Status:</strong>{' '}
                <span className={booking.bookingStatus === 'cancelled' ? 'text-danger' : 'text-success'}>
                  {booking.bookingStatus}
                </span>
              </p>
              {booking.bookingStatus === 'confirmed' && (
                <button className="btn btn-danger btn-sm" onClick={() => cancelTicket(booking._id)}>
                  Cancel Ticket
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBookings;
