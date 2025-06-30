import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { Types } from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User, Booking, Flight } from './schemas.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

console.log('✅ MONGO_URI loaded:', process.env.MONGO_URI);

// Root route
app.get('/', (req, res) => {
  res.send('✈️ FlightFinder API is running 🚀');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tlsAllowInvalidCertificates: true,
})
.then(() => {
  console.log('✅ MongoDB connected');

  // ================== AUTH ==================
  app.post('/register', async (req, res) => {
    const { username, email, usertype, password } = req.body;
    if (!username || !email || !usertype || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(409).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const approval = usertype === 'flight-operator' ? 'not-approved' : 'approved';

      const newUser = new User({ username, email, usertype, password: hashedPassword, approval });
      const savedUser = await newUser.save();

      console.log('✅ User registered:', savedUser.email);
      res.status(201).json(savedUser);
    } catch (err) {
      console.error('❌ Registration Error:', err);
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      res.status(200).json(user);
    } catch (err) {
      console.error('❌ Login Error:', err);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // ✅ ✅ ✅ ADD THIS ROUTE (MISSING EARLIER)
  app.get('/fetch-user/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user);
    } catch (err) {
      console.error('❌ Fetch User Error:', err);
      res.status(500).json({ message: 'Error fetching user' });
    }
  });

  // ================== FLIGHTS ==================
  app.post('/add-flight', async (req, res) => {
    try {
      const newFlight = new Flight(req.body);
      await newFlight.save();
      res.status(201).json({ message: 'Flight added successfully' });
    } catch (err) {
      console.error('❌ Add Flight Error:', err);
      res.status(500).json({ message: 'Error adding flight' });
    }
  });

  app.get('/fetch-flights', async (req, res) => {
    try {
      const flights = await Flight.find();
      res.json(flights);
    } catch (err) {
      console.error('❌ Fetch Flights Error:', err);
      res.status(500).json({ message: 'Error fetching flights' });
    }
  });

  app.post('/search-flights', async (req, res) => {
    const { origin, destination } = req.body;
    const query = {};
    if (origin) query.origin = { $regex: new RegExp(`^${origin}$`, 'i') };
    if (destination) query.destination = { $regex: new RegExp(`^${destination}$`, 'i') };

    try {
      const flights = await Flight.find(query);
      res.json(flights);
    } catch (err) {
      console.error('❌ Search Flights Error:', err);
      res.status(500).json({ message: 'Error searching flights' });
    }
  });

  app.get('/fetch-flight/:id', async (req, res) => {
    try {
      const flight = await Flight.findById(req.params.id);
      if (!flight) return res.status(404).json({ message: 'Flight not found' });
      res.json(flight);
    } catch (err) {
      console.error('❌ Fetch Single Flight Error:', err);
      res.status(500).json({ message: 'Error fetching flight' });
    }
  });

  // ================== BOOKINGS ==================
  app.post('/book-ticket', async (req, res) => {
    try {
      const newBooking = new Booking({
        ...req.body,
        user: new Types.ObjectId(req.body.user),
        flight: new Types.ObjectId(req.body.flight),
        bookingStatus: 'confirmed'
      });
      const savedBooking = await newBooking.save();
      res.status(201).json({ message: 'Booking successful', bookingId: savedBooking._id });
    } catch (err) {
      console.error('❌ Booking Error:', err);
      res.status(500).json({ message: 'Booking failed' });
    }
  });

  app.get('/bookings/:userId', async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.params.userId });
      res.json(bookings);
    } catch (err) {
      console.error('❌ Fetch Bookings Error:', err);
      res.status(500).json({ message: 'Error fetching bookings' });
    }
  });

  app.get('/fetch-bookings', async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.status(200).json(bookings);
    } catch (err) {
      console.error('❌ Fetch All Bookings Error:', err);
      res.status(500).json({ message: 'Error fetching bookings' });
    }
  });

  app.put('/cancel-ticket/:id', async (req, res) => {
    try {
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { bookingStatus: 'cancelled' },
        { new: true }
      );
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      console.log('✅ Booking cancelled:', booking._id);
      res.json({ message: 'Booking cancelled' });
    } catch (err) {
      console.error('❌ Cancel Booking Error:', err);
      res.status(500).json({ message: 'Error cancelling ticket' });
    }
  });

  // ================== ADMIN ==================
  app.get('/fetch-users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      console.error('❌ Fetch Users Error:', err);
      res.status(500).json({ message: 'Error fetching users' });
    }
  });

  app.post('/approve-operator', async (req, res) => {
    try {
      const { id } = req.body;
      const user = await User.findByIdAndUpdate(id, { approval: 'approved' }, { new: true });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ message: 'Operator approved' });
    } catch (err) {
      console.error('❌ Approve Error:', err);
      res.status(500).json({ message: 'Approval failed' });
    }
  });

  app.post('/reject-operator', async (req, res) => {
    try {
      const { id } = req.body;
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'Operator rejected and deleted' });
    } catch (err) {
      console.error('❌ Reject Error:', err);
      res.status(500).json({ message: 'Rejection failed' });
    }
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
});
