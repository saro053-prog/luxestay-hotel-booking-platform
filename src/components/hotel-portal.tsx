import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  Filter,
  RefreshCw,
  Heart,
  Eye,
  Star,
  Award,
  Coffee,
  Wifi,
  Car,
  Tv,
} from 'lucide-react';
import {
  Hotel,
  HOTELS_DATA,
  searchHotels,
  SearchFilters,
} from '@/lib/hotel-data';
import { Stars, RatingBadge, AmenityPill } from '@/components/shared';

interface HotelPortalProps {
  onSelectHotel: (hotel: Hotel) => void;
  onBookHotel: (hotel: Hotel) => void;
  user?: any;
}

const POPULAR_DESTINATIONS = [
  { name: 'All Destinations', city: '' },
  { name: 'Mumbai', city: 'Mumbai' },
  { name: 'Goa', city: 'Goa' },
  { name: 'Jaipur', city: 'Jaipur' },
  { name: 'Delhi NCR', city: 'New Delhi' },
  { name: 'Bengaluru', city: 'Bengaluru' },
  { name: 'Dubai', city: 'Dubai' },
  { name: 'Paris', city: 'Paris' },
  { name: 'London', city: 'London' },
  { name: 'Maldives', city: 'Malé' },
  { name: 'New York', city: 'New York' },
];

const CATEGORIES = [
  'All',
  'Luxury Resort',
  'Heritage Palace',
  'Boutique Hotel',
  'Business & City',
  'Beachfront Villa',
  'Eco Lodge',
];

const AMENITY_OPTIONS = [
  'Free High-Speed Wi-Fi',
  'Infinity Pool',
  'Full-Service Luxury Spa',
  'Fine Dining Restaurant',
  'Airport Chauffeur Transfer',
  '24/7 Butler Service',
  'Fitness Center',
  'Beachfront Access',
];

export function HotelPortal({ onSelectHotel, onBookHotel }: HotelPortalProps) {
  // Search bar states
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);

  // Filter sidebar states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(60000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'popularity'>('recommended');

  // Favorites state (persisted in local state)
  const [favorites, setFavorites] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Toggle favorite
  const toggleFavorite = (hotelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]
    );
  };

  // Toggle star rating
  const toggleStar = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
    setCurrentPage(1);
  };

  // Toggle amenity
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setDestination('');
    setSelectedCategory('All');
    setSelectedStars([]);
    setMaxPrice(60000);
    setMinRating(0);
    setSelectedAmenities([]);
    setSortBy('recommended');
    setCurrentPage(1);
  };

  // Filter query calculation
  const filteredHotels = useMemo(() => {
    const filters: SearchFilters = {
      destination: destination.trim(),
      category: selectedCategory,
      starRating: selectedStars.length > 0 ? selectedStars : undefined,
      maxPrice: maxPrice < 60000 ? maxPrice : undefined,
      minGuestRating: minRating > 0 ? minRating : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      sortBy: sortBy,
    };
    return searchHotels(filters);
  }, [destination, selectedCategory, selectedStars, maxPrice, minRating, selectedAmenities, sortBy]);

  // Paginated hotels
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const paginatedHotels = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHotels.slice(start, start + itemsPerPage);
  }, [filteredHotels, currentPage]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-24 border-b border-amber-900/30">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Resort"
            className="w-full h-full object-cover filter brightness-75 scale-105 transform animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md">
              <Sparkles size={14} className="text-amber-400" />
              World's Premier Luxury Hotel & Resort Collection
            </div>
            <h1 className="font-luxury text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
              Where Extraordinary <span className="italic text-amber-300 font-normal">Stays</span> Begin
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              Explore 108+ handpicked heritage palaces, beachfront villas, and iconic metropolitan hotels across 15+ premier global destinations.
            </p>
          </div>

          {/* Unified Luxury Search Bar */}
          <div className="bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/20 text-slate-900 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Destination */}
              <div className="md:col-span-4 flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors">
                <MapPin className="text-amber-600 flex-shrink-0" size={20} />
                <div className="w-full text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700">Destination or Property</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="e.g. Mumbai, Goa, Paris, Taj..."
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="md:col-span-4 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <Calendar className="text-amber-600 flex-shrink-0" size={18} />
                  <div className="w-full text-left">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <Calendar className="text-amber-600 flex-shrink-0" size={18} />
                  <div className="w-full text-left">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Guests & Rooms */}
              <div className="md:col-span-2 flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <Users className="text-amber-600 flex-shrink-0" size={18} />
                <div className="w-full text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700">Guests & Room</label>
                  <select
                    value={`${guestsCount}-${roomsCount}`}
                    onChange={(e) => {
                      const [g, r] = e.target.value.split('-').map(Number);
                      setGuestsCount(g);
                      setRoomsCount(r);
                    }}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="1-1">1 Guest, 1 Room</option>
                    <option value="2-1">2 Guests, 1 Room</option>
                    <option value="3-1">3 Guests, 1 Room</option>
                    <option value="4-2">4 Guests, 2 Rooms</option>
                    <option value="6-3">6+ Guests, 3 Rooms</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-2xl shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 text-sm"
                >
                  <Search size={18} />
                  <span>Find Hotels</span>
                </button>
              </div>
            </div>

            {/* Quick Destination Pills */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-slate-700 font-bold flex-shrink-0 text-[11px] uppercase tracking-wider">Top Destinations:</span>
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => {
                    setDestination(dest.city);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap text-xs ${
                    (destination === dest.city && dest.city !== '') || (destination === '' && dest.city === '')
                      ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dest.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Strip */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-amber-300 shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Catalog & Filter Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Filter Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-36">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Filter size={18} className="text-amber-600" />
                  <span>Filter Properties</span>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
                >
                  <RefreshCw size={12} />
                  Reset
                </button>
              </div>

              {/* Price Range */}
              <div className="py-5 border-b border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Max Nightly Rate</label>
                  <span className="text-xs font-extrabold text-amber-700">
                    ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="4000"
                  max="60000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-[10px] text-slate-700 mt-1">
                  <span>₹4,000</span>
                  <span>₹60,000+</span>
                </div>
              </div>

              {/* Star Rating Filter */}
              <div className="py-5 border-b border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Hotel Class</label>
                <div className="space-y-2">
                  {[5, 4, 3].map((star) => (
                    <label
                      key={star}
                      className="flex items-center justify-between text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedStars.includes(star)}
                          onChange={() => toggleStar(star)}
                          className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                        />
                        <div className="flex items-center gap-1">
                          <Stars count={star} />
                          <span className="ml-1 text-slate-600 font-medium">{star} Star Luxury</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Guest Rating Filter */}
              <div className="py-5 border-b border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Guest Experience Score</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Any Score', val: 0 },
                    { label: '4.0+ Very Good', val: 4.0 },
                    { label: '4.5+ Superb', val: 4.5 },
                    { label: '4.8+ Exceptional', val: 4.8 },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setMinRating(item.val);
                        setCurrentPage(1);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold text-center border transition-all ${
                        minRating === item.val
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="pt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Popular Amenities</label>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Hotel Results Grid */}
          <section className="lg:col-span-3">
            {/* Results Header Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-luxury text-xl font-bold text-slate-900">
                  {destination ? `Hotels in ${destination}` : 'All Luxury Properties'}
                </h2>
                <p className="text-xs text-slate-700">
                  Showing <span className="font-bold text-slate-900">{filteredHotels.length}</span> curated hotels & resorts available
                </p>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="recommended">Featured & Recommended</option>
                  <option value="rating">Highest Guest Rating</option>
                  <option value="popularity">Most Reviewed</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            {filteredHotels.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm my-8">
                <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={28} />
                </div>
                <h3 className="font-luxury text-2xl font-bold text-slate-900 mb-2">No Properties Match Your Search</h3>
                <p className="text-sm text-slate-700 max-w-md mx-auto mb-6">
                  We couldn't find any hotel matching your exact criteria. Try broadening your price range or clearing destination filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Hotel Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedHotels.map((hotel) => (
                <article
                  key={hotel.id}
                  onClick={() => onSelectHotel(hotel)}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Hotel Image & Floating Tags */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                    {/* Top Row Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                        {hotel.category}
                      </span>
                      <button
                        onClick={(e) => toggleFavorite(hotel.id, e)}
                        className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                          favorites.includes(hotel.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-900/60 text-white hover:bg-rose-500'
                        }`}
                        aria-label="Save to favorites"
                      >
                        <Heart size={14} className={favorites.includes(hotel.id) ? 'fill-white' : ''} />
                      </button>
                    </div>

                    {/* Bottom Row on Image: City & Rating */}
                    <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
                      <div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-200">
                          <MapPin size={13} className="text-amber-400" />
                          <span>{hotel.neighborhood}, {hotel.city}</span>
                        </div>
                      </div>
                      <div className="bg-amber-600 text-white px-2 py-0.5 rounded-lg text-xs font-black shadow-sm">
                        ★ {hotel.guestRating}
                      </div>
                    </div>
                  </div>

                  {/* Hotel Info Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Stars count={hotel.starRating} />
                        <span className="text-[11px] text-slate-700 font-medium">({hotel.reviewsCount} reviews)</span>
                      </div>

                      <h3 className="font-luxury text-lg font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-amber-700 transition-colors">
                        {hotel.name}
                      </h3>

                      <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed">
                        {hotel.description}
                      </p>

                      {/* Amenities Mini Row */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {hotel.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                          >
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <span className="text-[10px] font-semibold text-amber-700 self-center">
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-700 uppercase tracking-wider block font-semibold">Starting from</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-luxury text-xl font-extrabold text-slate-900">
                            ₹{hotel.pricePerNight.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-700">/ night</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHotel(hotel);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                          title="View Details & Rooms"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookHotel(hotel);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold shadow-md shadow-amber-900/10 flex items-center gap-1 transition-all"
                        >
                          <span>Book</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-xs">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 rounded-xl text-xs font-bold transition-colors ${
                            currentPage === page
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-slate-400 text-xs px-1">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Featured Collection Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-amber-900/40 shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
              LuxeStay Diamond Club
            </span>
            <h2 className="font-luxury text-3xl sm:text-4xl font-bold mt-4 mb-3">
              Unlock Complimentary Upgrades & Butler Services
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
              Join over 25,000 discerning travelers who enjoy guaranteed late 4:00 PM check-out, Michelin-starred breakfast, and bespoke chauffeur airport transfers.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                <Check size={16} className="text-amber-400" /> Guaranteed Best Rate
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                <Check size={16} className="text-amber-400" /> 10% Points Back
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                <Check size={16} className="text-amber-400" /> Free Cancellation
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
