import React, { useContext, useEffect, useState, useCallback } from 'react';
import '../styles/BookFlight.css';
import { GeneralContext } from '../context/GeneralContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// ✅ Moved outside to avoid ESLint warnings
const priceMultiplier = {
  'economy': 1,
  'premium-economy': 2,
  'business': 3,
  'first-class': 4
};

const BookFlight = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ticketBookingDate } = useContext(GeneralContext);

  const [flight, setFlight] = useState({});
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [seatClass, setSeatClass] = useState('');
  const [journeyDate, setJourneyDate] = useState(ticketBookingDate || '');
  const [passengerCount, setPassengerCount] = useState(0);
  const [passengerInfo, setPassengerInfo] = useState([]);
  const [totalFare, setTotalFare] = useState(0);

  // ✅ useCallback to avoid warning in useEffect
  const fetchFlightDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-flight/${id}`);
      setFlight(response.data);
    } catch (err) {
      console.error('Failed to fetch flight:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchFlightDetails();
  }, [fetchFlightDetails]);

  useEffect(() => {
    if (flight.basePrice && seatClass && passengerCount > 0) {
      const multiplier = priceMultiplier[seatClass] || 1;
      setTotalFare(multiplier * flight.basePrice * passengerCount);
    }
  }, [seatClass, passengerCount, flight.basePrice]);

  const handlePassengerCount = (e) => {
    const value = parseInt(e.target.value);
    setPassengerCount(value);
    setPassengerInfo(Array(value).fill({ name: '', age: '', gender: '' }));
  };

  const updatePassengerInfo = (index, field, value) => {
    const updated = [...passengerInfo];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerInfo(updated);
  };

  const handleBooking = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId || !id) {
      alert("Missing user or flight ID!");
      return;
    }

    const seats = Array.from({ length: passengerCount }, (_, index) => `E-${index + 1}`);

    const bookingPayload = {
      user: userId,
      flight: id,
      flightName: flight.flightName,
      flightId: flight.flightId,
      departure: flight.origin,
      destination: flight.destination,
      journeyTime: flight.departureTime,
      email,
      mobile,
      seats,
      passengers: passengerInfo,
      totalPrice: totalFare,
      journeyDate,
      seatClass,
    };

    try {
      await axios.post('http://localhost:6001/book-ticket', bookingPayload);
      alert('✅ Booking successful!');
      navigate('/bookings');
    } catch (error) {
      console.error('❌ Booking Error:', error.response?.data || error.message);
      alert(`❌ Booking failed: ${error.response?.data?.message || 'Server Error'}`);
    }
  };

  return (
    <div className="book-flight-container">
      <div className="booking-card">
        <h2>Book Your Flight</h2>

        <div className="flight-details">
          <p><strong>Flight Name:</strong> {flight.flightName}</p>
          <p><strong>Flight No:</strong> {flight.flightId}</p>
          <p><strong>From:</strong> {flight.origin} <strong>To:</strong> {flight.destination}</p>
          <p><strong>Departure:</strong> {flight.departureTime}</p>
          <p><strong>Base Fare:</strong> ₹{flight.basePrice}</p>
        </div>

        <div className="user-inputs">
          <div className="form-floating mb-3">
            <input type="email" className="form-control" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="emailInput">Email</label>
          </div>

          <div className="form-floating mb-3">
            <input type="text" className="form-control" id="mobileInput" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            <label htmlFor="mobileInput">Mobile Number</label>
          </div>

          <div className="form-floating mb-3">
            <input type="number" className="form-control" id="passengerCount" value={passengerCount} onChange={handlePassengerCount} />
            <label htmlFor="passengerCount">Number of Passengers</label>
          </div>

          <div className="form-floating mb-3">
            <input type="date" className="form-control" id="journeyDate" value={journeyDate} onChange={(e) => setJourneyDate(e.target.value)} />
            <label htmlFor="journeyDate">Journey Date</label>
          </div>

          <div className="form-floating mb-3">
            <select
              className="form-select"
              id="seatClass"
              value={seatClass}
              onChange={(e) => setSeatClass(e.target.value)}
            >
              <option value="" disabled>Select Class</option>
              <option value="economy">Economy</option>
              <option value="premium-economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first-class">First Class</option>
            </select>
            <label htmlFor="seatClass">Seat Class</label>
          </div>
        </div>

        {passengerCount > 0 && (
          <div className="passenger-section">
            <h4>Passenger Details</h4>
            {Array.from({ length: passengerCount }).map((_, i) => (
              <div className="passenger-form" key={i}>
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={passengerInfo[i]?.name || ''}
                    onChange={(e) => updatePassengerInfo(i, 'name', e.target.value)}
                    id={`passengerName${i}`}
                  />
                  <label htmlFor={`passengerName${i}`}>Passenger {i + 1} Name</label>
                </div>

                <div className="form-floating mb-2">
                  <input
                    type="number"
                    className="form-control"
                    value={passengerInfo[i]?.age || ''}
                    onChange={(e) => updatePassengerInfo(i, 'age', e.target.value)}
                    id={`passengerAge${i}`}
                  />
                  <label htmlFor={`passengerAge${i}`}>Age</label>
                </div>

                <div className="form-floating mb-2">
                  <select
                    className="form-select"
                    value={passengerInfo[i]?.gender || ''}
                    onChange={(e) => updatePassengerInfo(i, 'gender', e.target.value)}
                    id={`passengerGender${i}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <label htmlFor={`passengerGender${i}`}>Gender</label>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="summary">
          <p><strong>Total Fare:</strong> ₹{totalFare}</p>
          <button className="btn btn-success" onClick={handleBooking}>Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default BookFlight;
