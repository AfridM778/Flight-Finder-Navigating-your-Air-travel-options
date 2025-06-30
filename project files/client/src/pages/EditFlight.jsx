import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/NewFlight.css';

const EditFlight = () => {
  const { id } = useParams();

  const [flightData, setFlightData] = useState({
    flightName: '',
    flightId: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: 0,
    basePrice: 0,
  });

  useEffect(() => {
    fetchFlightDetails();
  }, []);

  const fetchFlightDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-flight/${id}`);
      const data = res.data;

      setFlightData({
        flightName: data.flightName,
        flightId: data.flightId,
        origin: data.origin,
        destination: data.destination,
        totalSeats: data.totalSeats,
        basePrice: data.basePrice,
        departureTime: formatTime(data.departureTime),
        arrivalTime: formatTime(data.arrivalTime),
      });
    } catch (err) {
      console.error('Error fetching flight:', err);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const handleChange = (key, value) => {
    setFlightData(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    try {
      const updatedFlight = { _id: id, ...flightData };
      await axios.put('http://localhost:6001/update-flight', updatedFlight);
      alert('Flight updated successfully!');
    } catch (err) {
      alert('Update failed.');
      console.error(err);
    }
  };

  const cityOptions = [
    "Chennai", "Banglore", "Hyderabad", "Mumbai", "Indore",
    "Delhi", "Pune", "Trivendrum", "Bhopal", "Kolkata",
    "Varanasi", "Jaipur"
  ];

  return (
    <div className="edit-flight-page">
      <div className="edit-flight-container">
        <h2>Modify Flight Details</h2>

        <div className="form-row">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              value={flightData.flightName}
              disabled
            />
            <label>Flight Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              value={flightData.flightId}
              onChange={(e) => handleChange('flightId', e.target.value)}
            />
            <label>Flight ID</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-floating">
            <select
              className="form-select mb-3"
              value={flightData.origin}
              onChange={(e) => handleChange('origin', e.target.value)}
            >
              <option value="" disabled>Select origin</option>
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
              value={flightData.departureTime}
              onChange={(e) => handleChange('departureTime', e.target.value)}
            />
            <label>Departure Time</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-floating">
            <select
              className="form-select mb-3"
              value={flightData.destination}
              onChange={(e) => handleChange('destination', e.target.value)}
            >
              <option value="" disabled>Select destination</option>
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
              value={flightData.arrivalTime}
              onChange={(e) => handleChange('arrivalTime', e.target.value)}
            />
            <label>Arrival Time</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              value={flightData.totalSeats}
              onChange={(e) => handleChange('totalSeats', e.target.value)}
            />
            <label>Total Seats</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              value={flightData.basePrice}
              onChange={(e) => handleChange('basePrice', e.target.value)}
            />
            <label>Base Price</label>
          </div>
        </div>

        <button className="btn btn-success mt-3" onClick={handleUpdate}>Update Flight</button>
      </div>
    </div>
  );
};

export default EditFlight;
