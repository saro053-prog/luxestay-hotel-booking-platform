// ============================================================================
// LuxeStay — Hospitality REST API Server
// ============================================================================

import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory relational hospitality database for high speed & zero setup friction
let hotels = [
  {
    id: 'HTL-1001',
    name: 'The Grand Mumbai Palace & Spa',
    brand: 'LuxeStay Royal Heritage',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    starRating: 5,
    guestRating: 4.9,
    reviewsCount: 384,
    pricePerNight: 24500,
    category: 'Luxury Resort',
    featured: true,
    totalRooms: 120,
    availableRooms: 34,
    description: 'An iconic colonial-era luxury palace overlooking the Arabian Sea, featuring Michelin-starred dining, private butler service, and award-winning Ayurvedic wellness therapies.',
    amenities: ['Free High-Speed Wi-Fi', 'Infinity Pool', 'Full-Service Luxury Spa', 'Fine Dining Restaurant', 'Airport Chauffeur Transfer', '24/7 Butler Service', 'Fitness Center', 'Sea View Balconies'],
  },
  {
    id: 'HTL-1002',
    name: 'The Imperial Pavilion',
    brand: 'LuxeStay Signature',
    city: 'New Delhi',
    state: 'Delhi NCR',
    country: 'India',
    starRating: 5,
    guestRating: 4.8,
    reviewsCount: 290,
    pricePerNight: 19800,
    category: 'Heritage Palace',
    featured: true,
    totalRooms: 160,
    availableRooms: 42,
    description: 'A grand heritage landmark nestled in Lutyens Delhi, surrounded by 8 acres of manicured Italian gardens, art galleries, and bespoke royal high tea pavilions.',
    amenities: ['Free High-Speed Wi-Fi', 'Full-Service Luxury Spa', 'Fine Dining Restaurant', 'Airport Chauffeur Transfer', '24/7 Butler Service', 'Executive Business Center'],
  },
  {
    id: 'HTL-1003',
    name: 'Azure Cove Beachfront Villa & Resort',
    brand: 'LuxeStay Coastal',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    starRating: 5,
    guestRating: 4.95,
    reviewsCount: 412,
    pricePerNight: 28900,
    category: 'Beachfront Villa',
    featured: true,
    totalRooms: 85,
    availableRooms: 18,
    description: 'Direct beachfront access to the secluded shores of South Goa with private plunge pool villas, sunset cocktail cabanas, and fresh oceanfront Mediterranean seafood grill.',
    amenities: ['Free High-Speed Wi-Fi', 'Infinity Pool', 'Beachfront Access', 'Full-Service Luxury Spa', 'Fine Dining Restaurant', 'Private Pool Cabana'],
  },
  {
    id: 'HTL-1004',
    name: 'Rambagh Royal Haveli & Gardens',
    brand: 'LuxeStay Royal Heritage',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    starRating: 5,
    guestRating: 4.92,
    reviewsCount: 356,
    pricePerNight: 32000,
    category: 'Heritage Palace',
    featured: true,
    totalRooms: 95,
    availableRooms: 12,
    description: 'Former residence of the Maharaja with hand-painted fresco ceilings, marble courtyards, regal peacock lawns, and evening Rajasthani folk symphonies.',
    amenities: ['Free High-Speed Wi-Fi', 'Full-Service Luxury Spa', 'Fine Dining Restaurant', '24/7 Butler Service', 'Royal Courtyard Dining'],
  },
  {
    id: 'HTL-1005',
    name: 'The Burj Skyline Palace',
    brand: 'LuxeStay Elite',
    city: 'Dubai',
    state: 'Dubai',
    country: 'United Arab Emirates',
    starRating: 5,
    guestRating: 4.98,
    reviewsCount: 520,
    pricePerNight: 58000,
    category: 'Luxury Resort',
    featured: true,
    totalRooms: 210,
    availableRooms: 45,
    description: 'Ultra-luxury high-rise oasis with panoramic views of the Dubai Fountain, rooftop infinity pool, private helipad transfers, and Rolls-Royce chauffeur fleet.',
    amenities: ['Free High-Speed Wi-Fi', 'Infinity Pool', 'Helipad Access', '24/7 Butler Service', 'Fine Dining Restaurant', 'Michelin Star Chef'],
  },
];

let bookings = [
  {
    id: 'LUX-BOOK-901',
    hotelId: 'HTL-1001',
    hotelName: 'The Grand Mumbai Palace & Spa',
    hotelCity: 'Mumbai',
    roomId: 'RM-101',
    roomType: 'Presidential Royal Sea Suite',
    roomNumber: '1402',
    guestId: 'USR-GUEST-1',
    guestName: 'Arun Kumar',
    guestEmail: 'arun.traveler@example.com',
    guestPhone: '+91 98401 23456',
    checkIn: '2026-10-18',
    checkOut: '2026-10-22',
    nights: 4,
    totalAmount: 115640,
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    createdAt: '2026-10-15T10:30:00Z',
  },
  {
    id: 'LUX-BOOK-902',
    hotelId: 'HTL-1003',
    hotelName: 'Azure Cove Beachfront Villa & Resort',
    hotelCity: 'Goa',
    roomId: 'RM-103',
    roomType: 'Private Plunge Pool Villa',
    roomNumber: 'V-08',
    guestId: 'USR-GUEST-1',
    guestName: 'Arun Kumar',
    guestEmail: 'arun.traveler@example.com',
    guestPhone: '+91 98401 23456',
    checkIn: '2026-10-12',
    checkOut: '2026-10-16',
    nights: 4,
    totalAmount: 136368,
    bookingStatus: 'Checked In',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI Instant',
    createdAt: '2026-10-10T14:15:00Z',
  },
];

// ----------------------------------------------------------------------------
// API Endpoints
// ----------------------------------------------------------------------------

// 1. Health & Server Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'LuxeStay Enterprise Hospitality API',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
    hotelsCount: hotels.length,
    bookingsCount: bookings.length,
  });
});

// 2. Hotels Catalog
app.get('/api/hotels', (req, res) => {
  let results = [...hotels];
  const { city, category, starRating, maxPrice, search } = req.query;

  if (city) {
    results = results.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (category && category !== 'All') {
    results = results.filter((h) => h.category.toLowerCase() === category.toLowerCase());
  }
  if (starRating) {
    results = results.filter((h) => h.starRating === Number(starRating));
  }
  if (maxPrice) {
    results = results.filter((h) => h.pricePerNight <= Number(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: results.length,
    hotels: results,
  });
});

// 3. Hotel Details
app.get('/api/hotels/:id', (req, res) => {
  const hotel = hotels.find((h) => h.id.toLowerCase() === req.params.id.toLowerCase());
  if (!hotel) {
    return res.status(404).json({ success: false, error: 'Hotel property not found' });
  }
  res.json({ success: true, hotel });
});

// 4. Bookings
app.get('/api/bookings', (req, res) => {
  let results = [...bookings];
  const { guestEmail, hotelId, status } = req.query;

  if (guestEmail) {
    results = results.filter((b) => b.guestEmail.toLowerCase() === guestEmail.toLowerCase());
  }
  if (hotelId) {
    results = results.filter((b) => b.hotelId.toLowerCase() === hotelId.toLowerCase());
  }
  if (status && status !== 'All') {
    results = results.filter((b) => b.bookingStatus === status);
  }

  res.json({
    success: true,
    count: results.length,
    bookings: results,
  });
});

// 5. Create Booking
app.post('/api/bookings', (req, res) => {
  const {
    hotelId,
    hotelName,
    hotelCity,
    roomType,
    roomNumber,
    guestName,
    guestEmail,
    guestPhone,
    checkIn,
    checkOut,
    nights,
    totalAmount,
    paymentMethod,
  } = req.body;

  if (!hotelId || !guestEmail || !checkIn || !checkOut) {
    return res.status(400).json({ success: false, error: 'Missing required reservation fields' });
  }

  const newBooking = {
    id: `LUX-BOOK-${Math.floor(1000 + Math.random() * 9000)}`,
    hotelId,
    hotelName: hotelName || 'LuxeStay Partner Hotel',
    hotelCity: hotelCity || 'City',
    roomType: roomType || 'Luxury Deluxe Room',
    roomNumber: roomNumber || `${Math.floor(100 + Math.random() * 900)}`,
    guestId: 'USR-GUEST-1',
    guestName: guestName || 'Guest User',
    guestEmail,
    guestPhone: guestPhone || '+91 98000 00000',
    checkIn,
    checkOut,
    nights: Number(nights) || 1,
    totalAmount: Number(totalAmount) || 25000,
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: paymentMethod || 'Credit Card',
    createdAt: new Date().toISOString(),
  };

  bookings.unshift(newBooking);

  res.status(201).json({
    success: true,
    message: 'Reservation confirmed successfully',
    booking: newBooking,
  });
});

// 6. Update Booking Status
app.patch('/api/bookings/:id/status', (req, res) => {
  const { status } = req.body;
  const booking = bookings.find((b) => b.id.toLowerCase() === req.params.id.toLowerCase());

  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking reservation not found' });
  }

  booking.bookingStatus = status;
  res.json({
    success: true,
    message: `Booking status updated to ${status}`,
    booking,
  });
});

// 7. Auth Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' });
  }

  let role = 'guest';
  let name = 'Arun Kumar';
  let loyaltyTier = 'Diamond VIP';

  if (email.includes('admin')) {
    role = 'admin';
    name = 'Sophia Sterling';
  } else if (email.includes('manager')) {
    role = 'manager';
    name = 'Vikramaditya Singhania';
  } else if (email.includes('frontdesk')) {
    role = 'staff';
    name = 'Sneha Rao';
  }

  res.json({
    success: true,
    token: `jwt_luxestay_${Date.now()}`,
    user: {
      id: `USR-${Date.now()}`,
      name,
      email,
      role,
      loyaltyTier,
    },
  });
});

// 8. Platform Admin KPIs
app.get('/api/admin/metrics', (req, res) => {
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  res.json({
    success: true,
    metrics: {
      totalHotels: 108,
      totalRooms: 4800,
      activeBookings: bookings.length,
      occupancyRate: 84.6,
      grossRevenue: totalRevenue,
      averageDailyRate: 22450,
      revPar: 18990,
    },
  });
});

app.listen(PORT, () => {
  console.log(`[LuxeStay REST API] Server active on http://localhost:${PORT}`);
});
