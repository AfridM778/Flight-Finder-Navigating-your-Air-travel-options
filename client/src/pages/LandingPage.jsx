import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LandingPage.css';
import { GeneralContext } from '../context/GeneralContext';

const LandingPage = () => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [roundTrip, setRoundTrip] = useState(false);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');

  const { setTicketBookingDate } = useContext(GeneralContext);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    if (userType === 'admin') {
      navigate('/admin');
    } else if (userType === 'flight-operator') {
      navigate('/flight-admin');
    }
  }, [userType, navigate]);

  const handleSearch = async () => {
    const today = new Date();
    const dep = new Date(departureDate);
    const ret = new Date(returnDate);

    if (!departure || !destination || !departureDate || (roundTrip && !returnDate)) {
      return setError('Please fill all the fields.');
    }

    if (dep < today || (roundTrip && ret <= dep)) {
      return setError('Please enter valid future dates.');
    }

    try {
      setError('');
      const res = await axios.post('http://localhost:6001/search-flights',
        {
          origin: departure.trim(),
          destination: destination.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setFlights(res.data);
    } catch (err) {
      console.error('Search Error:', err);
      setError('Failed to fetch flights. Try again.');
    }
  };

  const handleBookNow = (flight, selectedOrigin) => {
    if (!userId) return navigate('/auth');

    const selectedDate = selectedOrigin === departure ? departureDate : returnDate;
    setTicketBookingDate(selectedDate);
    navigate(`/book-flight/${flight._id}`);
  };

  const renderFlightCard = (flight) => (
    <div className="Flight" key={flight._id}>
      <div>
        <p><strong>{flight.flightName}</strong></p>
        <p><b>Flight ID:</b> {flight.flightId}</p>
      </div>
      <div>
        <p><b>From:</b> {flight.origin}</p>
        <p><b>Departs:</b> {flight.departureTime}</p>
      </div>
      <div>
        <p><b>To:</b> {flight.destination}</p>
        <p><b>Arrives:</b> {flight.arrivalTime}</p>
      </div>
      <div>
        <p><b>Price:</b> ₹{flight.basePrice}</p>
        <p><b>Seats:</b> {flight.totalSeats}</p>
      </div>
      <button className="btn btn-primary" onClick={() => handleBookNow(flight, flight.origin)}>
        Book Now
      </button>
    </div>
  );

  const filteredFlights = flights.filter(f =>
    roundTrip
      ? (f.origin === departure && f.destination === destination) ||
        (f.origin === destination && f.destination === departure)
      : f.origin === departure && f.destination === destination
  );

  return (
    <div className="landingPage">
      <div className="landingHero">
        <div className="landingHero-title">
          <h1>Book Flights Effortlessly!</h1>
          <p>Search and book your next journey with ease and confidence.</p>
        </div>

        <div className="Flight-search-container">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="roundTripSwitch"
              checked={roundTrip}
              onChange={(e) => setRoundTrip(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="roundTripSwitch">
              Return journey
            </label>
          </div>

          <div className="Flight-search-container-body">
            <select
              className="form-select"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            >
              <option value="" disabled>Select Departure</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              className="form-select"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="" disabled>Select Destination</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <input
              type="date"
              className="form-control"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />

            {roundTrip && (
              <input
                type="date"
                className="form-control"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            )}

            <button className="btn btn-primary" onClick={handleSearch}>
              Search Flights
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>

        {flights.length > 0 && (
          <div className="availableFlightsContainer">
            <h2>Available Flights</h2>
            <div className="Flights">
              {filteredFlights.length > 0
                ? filteredFlights.map(renderFlightCard)
                : <p>No flights found for the selected route.</p>}
            </div>
          </div>
        )}
      </div>

      <section className="section-about">
        <div className="container">
          <h2>About Us</h2>
          <p>
            Welcome to our flight booking platform. We aim to provide a seamless experience
            for travelers by offering an intuitive interface, real-time flight listings, and
            easy booking flows. Whether it's your daily commute or your next vacation— 
            we've got you covered.
          </p>
          <p>
            Customize your journey, select your preferences, and explore destinations
            comfortably and reliably. Let's get flying!
          </p>
          <p className="footer">© 2025 FlightConnect. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
};

// ✅ Common city list
const cities = [
  "Chennai", "Banglore", "Hyderabad", "Mumbai", "Indore", "Delhi",
  "Pune", "Trivendrum", "Bhopal", "Kolkata", "Varanasi", "Jaipur"
];

export default LandingPage;
