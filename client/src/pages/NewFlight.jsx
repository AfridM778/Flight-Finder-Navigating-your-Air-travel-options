import React, { useEffect, useState, useCallback } from 'react';
import '../styles/NewFlight.css';
import axios from 'axios';

const NewFlight = () => {
  const [userDetails, setUserDetails] = useState(null);

  const flightName = localStorage.getItem('username') || '';
  const [flightId, setFlightId] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [error, setError] = useState('');

  const fetchUserData = useCallback(async () => {
    try {
      const id = localStorage.getItem('userId');
      const res = await axios.get(`http://localhost:6001/fetch-user/${id}`);
      setUserDetails(res.data);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleSubmit = async () => {
    if (!flightId || !origin || !destination || !departureTime || !arrivalTime || !totalSeats || !basePrice) {
      setError('Please fill all the fields');
      return;
    }

    if (origin === destination) {
      setError('Origin and destination cannot be the same');
      return;
    }

    const newFlight = {
      flightName,
      airlineName: flightName, 
      flightId,
      origin,
      destination,
      departureTime,
      arrivalTime,
      basePrice: Number(basePrice),
      totalSeats: Number(totalSeats),
    };

    try {
      await axios.post('http://localhost:6001/add-flight', newFlight);
      alert('Flight added successfully!');
      setFlightId('');
      setOrigin('');
      setDestination('');
      setDepartureTime('');
      setArrivalTime('');
      setBasePrice('');
      setTotalSeats('');
      setError('');
    } catch (err) {
      console.error('Flight add error:', err);
      setError('Failed to add flight');
    }
  };

  const cityOptions = [
    "Chennai", "Banglore", "Hyderabad", "Mumbai", "Indore",
    "Delhi", "Pune", "Trivendrum", "Bhopal", "Kolkata",
    "Varanasi", "Jaipur"
  ];

  if (!userDetails) return null;

  if (userDetails.approval === 'not-approved') {
    return (
      <div className="notApproved-box">
        <h3>Approval Required</h3>
        <p>Your application is under processing. Please wait for admin approval.</p>
      </div>
    );
  }

  if (userDetails.approval === 'rejected') {
    return (
      <div className="notApproved-box">
        <h3>Application Rejected</h3>
        <p>Unfortunately, your request has been rejected.</p>
      </div>
    );
  }

  return (
    <div className="NewFlightPage">
      <div className="NewFlightPageContainer">
        <h2>Add New Flight</h2>

        {error && <p className="error-text">{error}</p>}

        <div className="form-section">
          <div className="form-floating mb-3">
            <input type="text" className="form-control" value={flightName} disabled />
            <label>Flight Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              value={flightId}
              onChange={(e) => setFlightId(e.target.value)}
            />
            <label>Flight ID</label>
          </div>
        </div>

        <div className="form-section">
          <div className="form-floating">
            <select className="form-select" value={origin} onChange={(e) => setOrigin(e.target.value)}>
              <option value="" disabled>Select</option>
              {cityOptions.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <label>Origin</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="time"
              className="form-control"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
            <label>Departure Time</label>
          </div>
        </div>

        <div className="form-section">
          <div className="form-floating">
            <select className="form-select" value={destination} onChange={(e) => setDestination(e.target.value)}>
              <option value="" disabled>Select</option>
              {cityOptions.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <label>Destination</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="time"
              className="form-control"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
            <label>Arrival Time</label>
          </div>
        </div>

        <div className="form-section">
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
            />
            <label>Total Seats</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
            <label>Base Price</label>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Add Flight
        </button>
      </div>
    </div>
  );
};

export default NewFlight;
