const express = require('express');
const router = express.Router();
const Flight = require('../schemas/Flight'); // Adjust if path is different

// SEARCH FLIGHTS API
router.get('/search-flights', async (req, res) => {
  const { from, to, departureDate, returnDate } = req.query;

  try {
    const forwardFlights = await Flight.find({
      origin: from,
      destination: to,
      journeyDate: departureDate,
    });

    let returnFlights = [];
    if (returnDate) {
      returnFlights = await Flight.find({
        origin: to,
        destination: from,
        journeyDate: returnDate,
      });
    }

    res.json({ forwardFlights, returnFlights });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search flights' });
  }
});

module.exports = router;
