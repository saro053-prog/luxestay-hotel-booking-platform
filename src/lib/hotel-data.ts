// ============================================================================
// LuxeStay — Enterprise Scale Hospitality & Hotel Booking Data Store
// ============================================================================

export interface Hotel {
  id: string;
  name: string;
  brand: string;
  city: string;
  state: string;
  country: string;
  address: string;
  neighborhood: string;
  starRating: 3 | 4 | 5;
  guestRating: number;
  reviewsCount: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  category: 'Luxury Resort' | 'Heritage Palace' | 'Boutique Hotel' | 'Business & City' | 'Beachfront Villa' | 'Eco Lodge';
  featured: boolean;
  images: string[];
  description: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  totalRooms: number;
  availableRooms: number;
  nearbyAttractions: string[];
  offers: { code: string; title: string; discountPercent: number; desc: string }[];
}

export interface Room {
  id: string;
  hotelId: string;
  hotelName: string;
  roomNumber: string;
  roomType: string;
  capacity: { adults: number; children: number; maxGuests: number };
  bedType: string;
  sizeSqFt: number;
  pricePerNight: number;
  floor: string;
  view: string;
  amenities: string[];
  breakfastIncluded: boolean;
  freeCancellation: boolean;
  smoking: boolean;
  status: 'Available' | 'Occupied' | 'Under Cleaning' | 'Maintenance';
  images: string[];
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond VIP';
  rewardPoints: number;
  totalStays: number;
  totalSpend: number;
  avatar: string;
  joinedDate: string;
}

export type BookingStatus =
  | 'Confirmed'
  | 'Checked-in'
  | 'Checked-out'
  | 'Cancelled'
  | 'Pending'
  | 'Completed'
  | 'Checked In'
  | 'Checked Out';

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelCity: string;
  hotelImage: string;
  roomId: string;
  roomType: string;
  roomNumber: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestsCount: { adults: number; children: number };
  roomsCount: number;
  pricePerNight: number;
  roomTotal: number;
  taxes: number;
  taxAmount: number;
  discount: number;
  discountAmount: number;
  finalAmount: number;
  totalAmount: number;
  status: BookingStatus;
  bookingStatus: BookingStatus;
  paymentStatus: 'Paid' | 'Pending' | 'Partially Paid' | 'Refunded';
  paymentMethod: 'Credit Card' | 'UPI' | 'Net Banking' | 'Pay at Hotel';
  specialRequests: string;
  bookingDate: string;
  voucherCode: string;
}

export interface Review {
  id: string;
  hotelId: string;
  guestName: string;
  guestAvatar: string;
  guestCountry: string;
  rating: number;
  categoryRatings: { cleanliness: number; location: number; service: number; facilities: number; value: number };
  date: string;
  title: string;
  comment: string;
  verifiedStay: boolean;
  helpfulCount: number;
}

export interface HotelService {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  hours: string;
  isComplimentary: boolean;
}

// Curated high-res Unsplash luxury travel photography
const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', // Luxury resort pool
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', // Deluxe suite interior
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', // Palace architecture
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', // Beachfront villa
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', // Modern skyscraper hotel
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80', // Grand lobby
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', // Bedroom with ocean view
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80', // Infinity pool at sunset
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80', // Cozy executive room
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80', // Heritage courtyard
];

const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
];

// All major domestic & international destinations
export const DESTINATIONS = [
  { city: 'Mumbai', state: 'Maharashtra', country: 'India', tag: 'Financial Capital & Coastal Glamour' },
  { city: 'Goa', state: 'Goa', country: 'India', tag: 'Sun, Sand & Beachfront Nightlife' },
  { city: 'Jaipur', state: 'Rajasthan', country: 'India', tag: 'The Royal Pink City & Palaces' },
  { city: 'Udaipur', state: 'Rajasthan', country: 'India', tag: 'City of Lakes & Regal Heritage' },
  { city: 'Delhi', state: 'Delhi NCR', country: 'India', tag: 'Historic Capital & Diplomatic Hub' },
  { city: 'Bengaluru', state: 'Karnataka', country: 'India', tag: 'Silicon Valley & Garden City' },
  { city: 'Chennai', state: 'Tamil Nadu', country: 'India', tag: 'Coastal Culture & Temples' },
  { city: 'Kochi', state: 'Kerala', country: 'India', tag: 'Colonial Spice Port & Serene Backwaters' },
  { city: 'Agra', state: 'Uttar Pradesh', country: 'India', tag: 'Home of the Taj Mahal' },
  { city: 'Dubai', state: 'Dubai', country: 'UAE', tag: 'Futuristic Luxury & Golden Sands' },
  { city: 'Singapore', state: 'Singapore', country: 'Singapore', tag: 'Island Metropolis & Garden City' },
  { city: 'London', state: 'England', country: 'United Kingdom', tag: 'Historic Aristocracy & West End' },
  { city: 'Paris', state: 'Île-de-France', country: 'France', tag: 'City of Lights & Haute Couture' },
  { city: 'Bali', state: 'Bali', country: 'Indonesia', tag: 'Tropical Paradise & Sacred Temples' },
  { city: 'Maldives', state: 'Malé Atoll', country: 'Maldives', tag: 'Overwater Luxury & Crystal Lagoons' },
];

export const ALL_AMENITIES = [
  'Free High-Speed Wi-Fi',
  'Swimming Pool',
  'Infinity Pool',
  'Ayurvedic Luxury Spa',
  '24/7 Fitness Center',
  'Fine Dining Restaurant',
  'Rooftop Cocktail Bar',
  'Free Gourmet Breakfast',
  'Airport Chauffeur Service',
  'Beachfront Access',
  'Valet Parking',
  'Pet Friendly',
  'Electric Vehicle (EV) Charging',
  'Grand Ballroom & Events',
  'Kids Play Zone',
  '24/7 Butler Service',
  'Concierge Desk',
  'Tennis Court',
  'Private Jacuzzi',
  'Wheelchair Accessible',
];

const HOTEL_NAME_PREFIXES = [
  'The Grand', 'Royal', 'The Oberoi', 'Taj Heritage', 'Le Meridien', 'Ritz', 'St. Regis', 
  'Hyatt Regency', 'JW Luxury', 'Aura Palace', 'The Serene', 'Solaria', 'Elysium', 'Astra',
  'Belvedere', 'Vivanta', 'The Imperial', 'The Leela', 'Radisson Blu', 'The Westin'
];

const HOTEL_NAME_SUFFIXES = [
  'Palace & Spa', 'Resort & Beach Club', 'Grand Hotel', 'Suites & Residences', 
  'Manor', 'Oasis & Spa', 'Boutique Retreat', 'Towers & Convention Center', 
  'Haven', 'Chateau', 'Villa Sanctuary', 'Crest Hotel'
];

// ----------------------------------------------------------------------------
// Procedural Generation: 108+ Complete Hotels with Real Characteristics
// ----------------------------------------------------------------------------
export function generateHotels(): Hotel[] {
  const hotels: Hotel[] = [];
  let hotelIndex = 1;

  DESTINATIONS.forEach((dest, dIdx) => {
    // Generate 7 to 8 distinct hotels per destination
    const hotelsPerCity = dIdx < 4 ? 9 : 7;

    for (let i = 0; i < hotelsPerCity; i++) {
      const prefix = HOTEL_NAME_PREFIXES[(dIdx * 3 + i) % HOTEL_NAME_PREFIXES.length];
      const suffix = HOTEL_NAME_SUFFIXES[(i + dIdx * 2) % HOTEL_NAME_SUFFIXES.length];
      const name = `${prefix} ${dest.city} ${suffix}`;
      
      const starRating: 3 | 4 | 5 = i % 3 === 0 ? 5 : i % 3 === 1 ? 4 : (i % 2 === 0 ? 5 : 3);
      const guestRating = Number((4.1 + ((dIdx * 7 + i * 3) % 9) / 10).toFixed(1));
      const reviewsCount = 120 + ((dIdx * 37 + i * 43) % 850);
      
      const basePrice = starRating === 5 ? 8500 + (i * 1200) : starRating === 4 ? 4800 + (i * 700) : 2900 + (i * 450);
      
      const category: Hotel['category'] = 
        dest.city === 'Goa' || dest.city === 'Bali' || dest.city === 'Maldives' 
          ? (i % 2 === 0 ? 'Luxury Resort' : 'Beachfront Villa')
          : dest.city === 'Jaipur' || dest.city === 'Udaipur' || dest.city === 'Agra'
          ? (i % 2 === 0 ? 'Heritage Palace' : 'Boutique Hotel')
          : dest.city === 'Mumbai' || dest.city === 'Delhi' || dest.city === 'Singapore' || dest.city === 'Dubai'
          ? (i % 2 === 0 ? 'Luxury Resort' : 'Business & City')
          : 'Boutique Hotel';

      const selectedAmenities = ALL_AMENITIES.filter((_, aIdx) => (aIdx + i + dIdx) % 2 === 0 || aIdx === 0 || aIdx === 4);
      if (starRating === 5 && !selectedAmenities.includes('Infinity Pool')) selectedAmenities.push('Infinity Pool');
      if (!selectedAmenities.includes('Free High-Speed Wi-Fi')) selectedAmenities.push('Free High-Speed Wi-Fi');

      const img1 = HOTEL_IMAGES[(hotelIndex - 1) % HOTEL_IMAGES.length];
      const img2 = HOTEL_IMAGES[(hotelIndex + 2) % HOTEL_IMAGES.length];
      const img3 = HOTEL_IMAGES[(hotelIndex + 4) % HOTEL_IMAGES.length];

      const hotelId = `HTL-${1000 + hotelIndex}`;

      hotels.push({
        id: hotelId,
        name,
        brand: prefix.replace('The ', ''),
        city: dest.city,
        state: dest.state,
        country: dest.country,
        address: `${10 + i * 8}, ${dest.city === 'Mumbai' ? 'Marine Drive Promenade' : dest.city === 'Goa' ? 'Sunset Beach Boulevard' : dest.city === 'Jaipur' ? 'Palace Road, C-Scheme' : 'Prime Avenue'}, ${dest.city}`,
        neighborhood: dest.city === 'Mumbai' ? 'South Mumbai' : dest.city === 'Goa' ? 'North Goa Beachside' : dest.city === 'Delhi' ? 'Lutyens Zone' : 'Downtown Central',
        starRating,
        guestRating,
        reviewsCount,
        pricePerNight: basePrice,
        currency: 'INR',
        amenities: selectedAmenities,
        category,
        featured: i === 0 || (starRating === 5 && i === 1),
        images: [img1, img2, img3],
        description: `Experience timeless hospitality at ${name}. Nestled in ${dest.city}, our ${starRating}-star sanctuary features exquisitely appointed suites, world-class gourmet restaurants, a state-of-the-art wellness pavilion, and panoramic views of ${dest.tag}. Whether traveling for bespoke leisure or executive business, our dedicated 24/7 concierge delivers an unforgettable sojourn.`,
        checkInTime: '14:00 (2:00 PM)',
        checkOutTime: '11:00 (11:00 AM)',
        cancellationPolicy: i % 2 === 0 ? 'Free cancellation up to 24 hours before check-in' : 'Flexible cancellation: 100% refund up to 48 hours prior',
        contactPhone: `+91 ${98100 + dIdx * 100 + i} 55443`,
        contactEmail: `reservations.${dest.city.toLowerCase()}${i}@luxestay.com`,
        website: `https://www.luxestay.com/hotels/${dest.city.toLowerCase()}-${i}`,
        totalRooms: 45 + (i * 15),
        availableRooms: 12 + (i * 4),
        nearbyAttractions: [
          `${dest.city} Famous Monument (1.2 km)`,
          'Central Waterfront Promenade (800m)',
          'Luxury Designer Boutiques & Mall (2.5 km)',
          'International Airport (14 km)',
        ],
        offers: [
          { code: 'LUXESTAY20', title: 'Seasonal Luxury Getaway', discountPercent: 20, desc: 'Enjoy 20% off on suites plus complimentary gourmet breakfast.' },
          { code: 'SPAESCAPE', title: 'Wellness & Spa Credit', discountPercent: 15, desc: 'Includes complimentary 60-min signature couple massage credit.' },
        ],
      });

      hotelIndex++;
    }
  });

  return hotels;
}

export const HOTELS_DATA = generateHotels();

// ----------------------------------------------------------------------------
// Procedural Generation: 240+ Individual Luxury Rooms
// ----------------------------------------------------------------------------
const ROOM_TYPES = [
  { name: 'Deluxe King Room', size: 420, bed: '1 King Bed', adults: 2, children: 1, multiplier: 1.0 },
  { name: 'Executive Ocean View Suite', size: 680, bed: '1 Super King Bed', adults: 2, children: 2, multiplier: 1.45 },
  { name: 'Grand Family Suite', size: 850, bed: '2 Queen Beds', adults: 4, children: 2, multiplier: 1.8 },
  { name: 'Royal Heritage Presidential Suite', size: 1450, bed: 'Master King + Twin Beds', adults: 4, children: 2, multiplier: 3.2 },
  { name: 'Private Pool Garden Villa', size: 1200, bed: '1 California King', adults: 2, children: 1, multiplier: 2.6 },
  { name: 'Premium Club Twin Room', size: 450, bed: '2 Single Beds', adults: 2, children: 0, multiplier: 1.15 },
];

export function generateRooms(hotels: Hotel[]): Room[] {
  const rooms: Room[] = [];
  let roomCount = 1;

  // Generate 2 to 3 rooms for every hotel in the platform
  hotels.forEach((hotel, hIdx) => {
    const numRooms = (hIdx % 2 === 0) ? 3 : 2;

    for (let r = 0; r < numRooms; r++) {
      const typeConfig = ROOM_TYPES[(r + hIdx) % ROOM_TYPES.length];
      const roomPrice = Math.round(hotel.pricePerNight * typeConfig.multiplier);
      const floorNum = 2 + (r * 2) + (hIdx % 8);
      const roomNum = `${floorNum}0${r + 1}`;

      rooms.push({
        id: `RM-${hotel.id}-${roomNum}`,
        hotelId: hotel.id,
        hotelName: hotel.name,
        roomNumber: roomNum,
        roomType: typeConfig.name,
        capacity: {
          adults: typeConfig.adults,
          children: typeConfig.children,
          maxGuests: typeConfig.adults + typeConfig.children,
        },
        bedType: typeConfig.bed,
        sizeSqFt: typeConfig.size,
        pricePerNight: roomPrice,
        floor: `Floor ${floorNum}`,
        view: r === 0 ? 'City Skyline & Garden View' : r === 1 ? 'Panoramic Ocean / Pool View' : 'Regal Courtyard View',
        amenities: [
          'High-Speed Fiber Wi-Fi',
          'Nespresso Coffee Machine',
          'Marble Bathroom with Rain Shower & Deep Soaking Tub',
          '55-inch 4K Smart OLED TV',
          'Signature Goose Down Pillows',
          'Mini Bar & Wine Cooler',
          'Electronic Safe & Work Desk',
        ],
        breakfastIncluded: r !== 0 || hotel.starRating === 5,
        freeCancellation: true,
        smoking: false,
        status: r === 0 ? 'Available' : r === 1 ? (hIdx % 3 === 0 ? 'Occupied' : 'Available') : 'Available',
        images: [
          ROOM_IMAGES[(roomCount - 1) % ROOM_IMAGES.length],
          ROOM_IMAGES[(roomCount + 1) % ROOM_IMAGES.length],
        ],
      });

      roomCount++;
    }
  });

  return rooms;
}

export const ROOMS_DATA = generateRooms(HOTELS_DATA);

// ----------------------------------------------------------------------------
// Procedural Generation: 200+ Verified Guests / Users
// ----------------------------------------------------------------------------
const FIRST_NAMES = ['Arun', 'Priya', 'Aditya', 'Sneha', 'Vikram', 'Ananya', 'Rohan', 'Kavita', 'Siddharth', 'Meera', 'Rajesh', 'Pooja', 'Nikhil', 'Divya', 'Gaurav', 'Sunita', 'Marcus', 'Elena', 'David', 'Sophie'];
const LAST_NAMES = ['Kumar', 'Sharma', 'Nambiar', 'Patel', 'Sundaram', 'Deshmukh', 'Verma', 'Chatterjee', 'Reddy', 'Menon', 'Joshi', 'Bhatia', 'Iyer', 'Gupta', 'Wilson', 'Vance', 'Chen', 'Dubois'];

export function generateGuests(): Guest[] {
  const guests: Guest[] = [];

  for (let i = 1; i <= 210; i++) {
    const fn = FIRST_NAMES[(i * 3) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 5) % LAST_NAMES.length];
    const fullName = `${fn} ${ln}`;
    const loyaltyTier: Guest['loyaltyTier'] = 
      i % 10 === 0 ? 'Diamond VIP' : i % 5 === 0 ? 'Platinum' : i % 3 === 0 ? 'Gold' : i % 2 === 0 ? 'Silver' : 'Bronze';

    guests.push({
      id: `GST-${1000 + i}`,
      name: fullName,
      email: i === 1 ? 'arun.traveler@example.com' : `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
      phone: `+91 ${98400 + i} ${12345 + (i * 2)}`,
      country: i % 12 === 0 ? 'United Kingdom' : i % 15 === 0 ? 'Singapore' : i % 8 === 0 ? 'United States' : 'India',
      city: i % 4 === 0 ? 'Mumbai' : i % 4 === 1 ? 'Bengaluru' : i % 4 === 2 ? 'Delhi' : 'Chennai',
      loyaltyTier,
      rewardPoints: 850 + (i * 140),
      totalStays: 2 + (i % 14),
      totalSpend: 18500 + (i * 6200),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + (i * 1000)}?auto=format&fit=crop&w=150&q=80`,
      joinedDate: `2024-${String(1 + (i % 12)).padStart(2, '0')}-15`,
    });
  }

  return guests;
}

export const GUESTS_DATA = generateGuests();

// ----------------------------------------------------------------------------
// Procedural Generation: 520+ Real Bookings Mapped to Hotels, Rooms & Guests
// ----------------------------------------------------------------------------
export function generateBookings(hotels: Hotel[], rooms: Room[], guests: Guest[]): Booking[] {
  const bookings: Booking[] = [];
  const statuses: Booking['status'][] = ['Confirmed', 'Checked-in', 'Completed', 'Cancelled', 'Confirmed', 'Completed'];

  for (let b = 1; b <= 520; b++) {
    const hotel = hotels[(b * 7) % hotels.length];
    const hotelRooms = rooms.filter((r) => r.hotelId === hotel.id);
    const room = hotelRooms.length > 0 ? hotelRooms[b % hotelRooms.length] : rooms[b % rooms.length];
    const guest = guests[(b * 3) % guests.length];

    const nights = 1 + (b % 5);
    const dayOffset = (b % 40) - 20; // past, present, future
    const now = new Date();
    const checkInDate = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const checkOutDate = new Date(checkInDate.getTime() + nights * 24 * 60 * 60 * 1000);

    const pricePerNight = room.pricePerNight || hotel.pricePerNight;
    const roomTotal = pricePerNight * nights;
    const taxes = Math.round(roomTotal * 0.18); // 18% GST
    const discount = b % 3 === 0 ? Math.round(roomTotal * 0.10) : 0;
    const finalAmount = roomTotal + taxes - discount;

    const status = dayOffset < -4 ? 'Completed' : dayOffset <= 0 ? 'Checked-in' : b % 9 === 0 ? 'Cancelled' : 'Confirmed';
    const paymentStatus: Booking['paymentStatus'] = status === 'Cancelled' ? 'Refunded' : status === 'Confirmed' && b % 4 === 0 ? 'Pending' : 'Paid';

    bookings.push({
      id: `BK-${8000 + b}`,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelCity: hotel.city,
      hotelImage: hotel.images[0],
      roomId: room.id,
      roomType: room.roomType,
      roomNumber: room.roomNumber,
      guestId: guest.id,
      guestName: guest.name,
      guestEmail: guest.email,
      guestPhone: guest.phone,
      checkIn: checkInDate.toISOString().split('T')[0],
      checkOut: checkOutDate.toISOString().split('T')[0],
      nights,
      guestsCount: { adults: 2, children: b % 3 === 0 ? 1 : 0 },
      roomsCount: 1,
      pricePerNight,
      roomTotal,
      taxes,
      taxAmount: taxes,
      discount,
      discountAmount: discount,
      finalAmount,
      totalAmount: finalAmount,
      status,
      bookingStatus: status,
      paymentStatus,
      paymentMethod: b % 3 === 0 ? 'Credit Card' : b % 3 === 1 ? 'UPI' : 'Net Banking',
      specialRequests: b % 2 === 0 ? 'High floor preferred, airport shuttle pickup needed' : 'Late check-out requested if possible, quiet room',
      bookingDate: new Date(checkInDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      voucherCode: `VCH-${hotel.city.substring(0, 3).toUpperCase()}-${8000 + b}`,
    });
  }

  return bookings;
}

export const BOOKINGS_DATA = generateBookings(HOTELS_DATA, ROOMS_DATA, GUESTS_DATA);

// ----------------------------------------------------------------------------
// Procedural Generation: 140+ Authentic Guest Reviews
// ----------------------------------------------------------------------------
const REVIEW_COMMENTS = [
  { title: 'Magnificent luxury and impeccable hospitality!', comment: 'From the moment our chauffeur arrived at the airport until our farewell, everything was beyond 5-star perfection. The infinity pool overlooking the sunset was breathtaking.', rating: 5 },
  { title: 'Best hotel stay in India so far!', comment: 'The breakfast spread was enormous, featuring South Indian specialties and French artisanal pastries. The staff treated us like royalty. Will definitely return next year.', rating: 5 },
  { title: 'Wonderful experience, highly recommended for families', comment: 'Spacious suites, soundproof rooms, and thoughtful amenities for the children. Room service was remarkably swift and delicious.', rating: 4.8 },
  { title: 'Perfect business getaway with outstanding Wi-Fi', comment: 'Attended a 3-day summit here. Conference facilities were seamless, the executive lounge offered quiet work booths, and the bed was heavenly.', rating: 4.6 },
  { title: 'Serene spa and unmatched coastal views', comment: 'The Ayurvedic massage package was genuinely rejuvenating. Beautiful beachfront access and top-tier cocktails by the beach bar.', rating: 4.9 },
  { title: 'Great value for money in prime location', comment: 'Located right next to major cultural monuments and fine dining. Clean marble bathrooms, cozy linens, and welcoming reception staff.', rating: 4.5 },
];

export function generateReviews(hotels: Hotel[]): Review[] {
  const reviews: Review[] = [];

  for (let r = 1; r <= 140; r++) {
    const hotel = hotels[(r * 5) % hotels.length];
    const template = REVIEW_COMMENTS[r % REVIEW_COMMENTS.length];
    const fn = FIRST_NAMES[(r * 2) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(r * 3) % LAST_NAMES.length];

    reviews.push({
      id: `REV-${500 + r}`,
      hotelId: hotel.id,
      guestName: `${fn} ${ln}`,
      guestAvatar: `https://images.unsplash.com/photo-${1534528741775 + (r * 200)}?auto=format&fit=crop&w=120&q=80`,
      guestCountry: r % 4 === 0 ? 'United Kingdom' : r % 6 === 0 ? 'Australia' : 'India',
      rating: template.rating,
      categoryRatings: {
        cleanliness: Number((4.6 + (r % 5) / 10).toFixed(1)),
        location: Number((4.7 + (r % 4) / 10).toFixed(1)),
        service: Number((4.8 + (r % 3) / 10).toFixed(1)),
        facilities: Number((4.6 + (r % 4) / 10).toFixed(1)),
        value: Number((4.4 + (r % 6) / 10).toFixed(1)),
      },
      date: `2026-0${1 + (r % 9)}-${String(10 + (r % 18))}`,
      title: template.title,
      comment: template.comment,
      verifiedStay: true,
      helpfulCount: 4 + (r % 35),
    });
  }

  return reviews;
}

export const REVIEWS_DATA = generateReviews(HOTELS_DATA);

// ----------------------------------------------------------------------------
// Curated Hospitality Services Catalog
// ----------------------------------------------------------------------------
export const HOTEL_SERVICES: HotelService[] = [
  { id: 'SRV-1', name: '24/7 In-Room Gourmet Dining', category: 'Food & Beverage', price: 650, description: 'Handcrafted multi-cuisine dishes delivered directly to your suite.', hours: '24 Hours', isComplimentary: false },
  { id: 'SRV-2', name: 'Ayurvedic & Aromatherapy Spa', category: 'Wellness & Spa', price: 3200, description: 'Deep tissue therapy, herbal steam bath, and rejuvenating facial rituals.', hours: '08:00 AM – 09:00 PM', isComplimentary: false },
  { id: 'SRV-3', name: 'Private Luxury Airport Chauffeur', category: 'Transportation', price: 1800, description: 'Mercedes E-Class / BMW airport transfer with English-speaking chauffeur.', hours: '24 Hours On Demand', isComplimentary: false },
  { id: 'SRV-4', name: 'Infinity Pool & Sunset Cabana', category: 'Recreation', price: 0, description: 'Heated outdoor infinity pool with poolside bar and plush loungers.', hours: '06:00 AM – 10:00 PM', isComplimentary: true },
  { id: 'SRV-5', name: 'Express Valet Laundry & Dry Clean', category: 'Housekeeping', price: 450, description: 'Same-day luxury garment pressing, dry cleaning, and fabric refresh.', hours: '07:00 AM – 08:00 PM', isComplimentary: false },
  { id: 'SRV-6', name: 'Executive Meeting & Conference Suite', category: 'Business', price: 4500, description: 'Equipped with 4K video conferencing, soundproof walls, and catering.', hours: '08:00 AM – 10:00 PM', isComplimentary: false },
  { id: 'SRV-7', name: 'Guided City Heritage Walking Tour', category: 'Experiences', price: 950, description: 'Historian-curated cultural exploration of local architecture and bazaars.', hours: '09:00 AM – 12:00 PM', isComplimentary: false },
  { id: 'SRV-8', name: 'Kids Creative Club & Play Zone', category: 'Family', price: 0, description: 'Supervised indoor activities, gaming consoles, and arts & crafts.', hours: '09:00 AM – 07:00 PM', isComplimentary: true },
];

// ----------------------------------------------------------------------------
// Search, Filter and Helper Functions
// ----------------------------------------------------------------------------
export interface SearchFilters {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  starRating?: number[];
  minPrice?: number;
  maxPrice?: number;
  minGuestRating?: number;
  amenities?: string[];
  category?: string;
  sortBy?: 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'popularity';
}

export function searchHotels(filters: SearchFilters): Hotel[] {
  let results = HOTELS_DATA.filter((hotel) => {
    // Destination filter (City, State, Country, or Hotel Name)
    if (filters.destination && filters.destination.trim() !== '') {
      const q = filters.destination.toLowerCase().trim();
      const match =
        hotel.city.toLowerCase().includes(q) ||
        hotel.name.toLowerCase().includes(q) ||
        hotel.country.toLowerCase().includes(q) ||
        hotel.neighborhood.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Star rating filter
    if (filters.starRating && filters.starRating.length > 0) {
      if (!filters.starRating.includes(hotel.starRating)) return false;
    }

    // Price range
    if (filters.minPrice !== undefined && hotel.pricePerNight < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && hotel.pricePerNight > filters.maxPrice) return false;

    // Guest rating
    if (filters.minGuestRating !== undefined && hotel.guestRating < filters.minGuestRating) return false;

    // Category
    if (filters.category && filters.category !== 'All' && hotel.category !== filters.category) return false;

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAll = filters.amenities.every((req) => hotel.amenities.includes(req));
      if (!hasAll) return false;
    }

    return true;
  });

  // Sorting
  if (filters.sortBy === 'price-asc') {
    results.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (filters.sortBy === 'price-desc') {
    results.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (filters.sortBy === 'rating') {
    results.sort((a, b) => b.guestRating - a.guestRating);
  } else if (filters.sortBy === 'popularity') {
    results.sort((a, b) => b.reviewsCount - a.reviewsCount);
  } else {
    // Default: Featured first, then highest rating
    results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.guestRating - a.guestRating);
  }

  return results;
}

export function getHotelById(id: string): Hotel | undefined {
  return HOTELS_DATA.find((h) => h.id.toLowerCase() === id.toLowerCase());
}

export function getRoomsForHotel(hotelId: string): Room[] {
  return ROOMS_DATA.filter((r) => r.hotelId.toLowerCase() === hotelId.toLowerCase());
}

export function getBookingsForGuest(guestEmailOrId: string): Booking[] {
  const q = guestEmailOrId.toLowerCase().trim();
  return BOOKINGS_DATA.filter((b) => b.guestEmail.toLowerCase() === q || b.guestId.toLowerCase() === q);
}

export function getReviewsForHotel(hotelId: string): Review[] {
  return REVIEWS_DATA.filter((r) => r.hotelId.toLowerCase() === hotelId.toLowerCase());
}
