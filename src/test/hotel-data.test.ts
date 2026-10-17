import { describe, it, expect } from 'vitest';
import {
  HOTELS_DATA,
  ROOMS_DATA,
  BOOKINGS_DATA,
  GUESTS_DATA,
  searchHotels,
  getHotelById,
  getRoomsForHotel,
  getBookingsForGuest,
} from '../lib/hotel-data';

describe('LuxeStay Hotel Dataset & Query Verification', () => {
  it('should contain at least 100+ luxury hotels across global destinations', () => {
    expect(HOTELS_DATA.length).toBeGreaterThanOrEqual(100);
  });

  it('should contain 200+ detailed rooms', () => {
    expect(ROOMS_DATA.length).toBeGreaterThanOrEqual(200);
  });

  it('should contain 500+ realistic bookings', () => {
    expect(BOOKINGS_DATA.length).toBeGreaterThanOrEqual(500);
  });

  it('should contain 200+ guests with loyalty tiers', () => {
    expect(GUESTS_DATA.length).toBeGreaterThanOrEqual(200);
  });

  it('should filter hotels correctly by destination (Goa)', () => {
    const goaHotels = searchHotels({ destination: 'Goa' });
    expect(goaHotels.length).toBeGreaterThan(0);
    expect(goaHotels.every((h) => h.city.toLowerCase().includes('goa') || h.name.toLowerCase().includes('goa'))).toBe(true);
  });

  it('should filter hotels by 5-star rating', () => {
    const fiveStar = searchHotels({ starRating: [5] });
    expect(fiveStar.length).toBeGreaterThan(0);
    expect(fiveStar.every((h) => h.starRating === 5)).toBe(true);
  });

  it('should filter hotels by max price ceiling', () => {
    const max = 25000;
    const under25k = searchHotels({ maxPrice: max });
    expect(under25k.length).toBeGreaterThan(0);
    expect(under25k.every((h) => h.pricePerNight <= max)).toBe(true);
  });

  it('should lookup hotel by ID', () => {
    const hotel = getHotelById('HTL-1001');
    expect(hotel).toBeDefined();
    expect(hotel?.name).toBe('The Grand Mumbai Palace & Spa');
  });

  it('should return rooms for a specific hotel', () => {
    const rooms = getRoomsForHotel('HTL-1001');
    expect(rooms.length).toBeGreaterThan(0);
    expect(rooms.every((r) => r.hotelId === 'HTL-1001')).toBe(true);
  });

  it('should retrieve bookings for a specific guest', () => {
    const bookings = getBookingsForGuest('arun.traveler@example.com');
    expect(bookings.length).toBeGreaterThan(0);
  });
});
