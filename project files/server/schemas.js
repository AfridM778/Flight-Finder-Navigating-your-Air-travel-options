import mongoose from "mongoose";

// ================== USER SCHEMA ===================
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  usertype: {
    type: String,
    enum: ['customer', 'admin', 'flight-operator'],
    required: true
  },
  password: { type: String, required: true },
  approval: {
    type: String,
    enum: ['approved', 'not-approved', 'rejected'],
    default: 'approved'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ================== FLIGHT SCHEMA ===================
const flightSchema = new mongoose.Schema({
  flightName: { type: String, required: true },
  airlineName: { type: String, required: true },
  flightId: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  basePrice: { type: Number, required: true },
  totalSeats: { type: Number, required: true }
}, { timestamps: true });

const Flight = mongoose.model('Flight', flightSchema);

// ================== BOOKING SCHEMA ===================
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  flightName: { type: String, required: true },
  flightId: { type: String },
  departure: { type: String },
  destination: { type: String },
  email: { type: String },
  mobile: { type: String },
  seats: [String], // ✅ FIXED: now accepts array of strings like ["E-1", "E-2"]
  passengers: [
    {
      name: { type: String },
      age: { type: Number },
      gender: { type: String }
    }
  ],
  totalPrice: { type: Number },
  bookingDate: { type: Date, default: Date.now },
  journeyDate: { type: String },
  journeyTime: { type: String },
  seatClass: { type: String },
  bookingStatus: { type: String, default: "confirmed" }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

// ✅ Export all models
export { User, Flight, Booking };
