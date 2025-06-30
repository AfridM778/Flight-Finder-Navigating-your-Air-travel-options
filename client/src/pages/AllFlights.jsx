import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AllFlights.css'; // Create/modify this CSS file for a new design
import { useNavigate } from 'react-router-dom';

const AllFlights = () => {
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-flights');
      setFlights(response.data);
    } catch (err) {
      console.error("Error fetching flights:", err);
    }
  };

  return (
    <div className="flights-page">
      <h2 className="flights-title">Available Flights</h2>

      <div className="flights-grid">
        {flights.map((flight) => (
          <div className="flight-card" key={flight._id}>
            <div className="flight-card-header">
              <h4>{flight.flightName}</h4>
              <span>#{flight.flightId}</span>
            </div>

            <div className="flight-details">
              <p><strong>From:</strong> {flight.origin}</p>
              <p><strong>To:</strong> {flight.destination}</p>
              <p><strong>Departure:</strong> {flight.departureTime}</p>
              <p><strong>Arrival:</strong> {flight.arrivalTime}</p>
              <p><strong>Price:</strong> ₹{flight.basePrice}</p>
              <p><strong>Seats:</strong> {flight.totalSeats}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllFlights;
