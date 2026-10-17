import React, { useState } from 'react';
import {
  Star,
  MapPin,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  X,
  CreditCard,
  QrCode,
  Sparkles,
  Bed,
  Coffee,
  Wifi,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Hotel, Room, Booking } from '@/lib/hotel-data';

export function Brand({ sub = 'HOTELS & LUXURY RESORTS', name = 'LuxeStay' }: { sub?: string; name?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white shadow-md shadow-amber-900/20">
        <Sparkles size={20} className="text-amber-200" />
      </div>
      <div>
        <div className="font-luxury text-xl font-bold tracking-tight text-slate-900 leading-none">
          {name}
        </div>
        <div className="text-[9px] font-bold tracking-widest text-amber-800 uppercase mt-0.5">
          {sub}
        </div>
      </div>
    </div>
  );
}

export function Stars({ count = 5, rating }: { count?: number; rating?: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < (rating ? Math.round(rating) : count) ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}
        />
      ))}
    </div>
  );
}

export function RatingBadge({ score, count }: { score: number; count?: number }) {
  const label = score >= 4.8 ? 'Exceptional' : score >= 4.5 ? 'Superb' : score >= 4.0 ? 'Very Good' : 'Good';
  return (
    <div className="flex items-center gap-2">
      <div className="text-right">
        <div className="text-xs font-bold text-slate-800">{label}</div>
        {count && <div className="text-[10px] text-slate-500">{count} verified reviews</div>}
      </div>
      <div className="flex h-8 w-9 items-center justify-center rounded-lg bg-slate-900 font-bold text-xs text-amber-300 shadow-xs">
        {score.toFixed(1)}
      </div>
    </div>
  );
}

export function AmenityPill({ icon: Icon, label }: { icon?: any; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
      {Icon && <Icon size={14} className="text-amber-600" />}
      <span>{label}</span>
    </div>
  );
}

// Interactive SVG Bar & Line Chart for Revenue & Occupancy Telemetry
export function HospitalityChart({
  type = 'revenue',
  title,
  subtitle,
}: {
  type?: 'revenue' | 'occupancy';
  title?: string;
  subtitle?: string;
}) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const values = type === 'revenue' ? [45, 62, 58, 75, 92, 98, 88] : [65, 72, 70, 84, 96, 100, 91];

  return (
    <div className="w-full">
      {title && (
        <div className="mb-4">
          <h3 className="font-luxury text-lg font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <svg viewBox="0 0 500 160" className="w-full h-40 overflow-visible">
        {/* Subtle background grids */}
        <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

        {/* Bar charts with gold gradient */}
        {values.map((v, i) => {
          const height = (v / 100) * 110;
          const y = 140 - height;
          const x = 35 + i * 65;
          return (
            <g key={days[i]}>
              <rect
                x={x}
                y={y}
                width="28"
                height={height}
                rx="6"
                className="fill-amber-500/80 hover:fill-amber-600 transition-all cursor-pointer"
              />
              <text x={x + 14} y="155" textAnchor="middle" className="text-[11px] font-medium fill-slate-500">
                {days[i]}
              </text>
              <text x={x + 14} y={y - 6} textAnchor="middle" className="text-[10px] font-bold fill-slate-700">
                {type === 'revenue' ? `₹${v}k` : `${v}%`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Reservation Confirmation Voucher Modal
export function BookingModal({
  open,
  isOpen,
  onClose,
  hotel,
  selectedRoom,
  room,
  onBookingSuccess,
  onSuccess,
}: {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  hotel?: Hotel | null;
  selectedRoom?: Room | null;
  room?: Room | null;
  onBookingSuccess?: (booking: Booking) => void;
  onSuccess?: () => void;
}) {
  const isModalOpen = isOpen !== undefined ? isOpen : open ?? false;
  const activeRoom = selectedRoom || room || null;
  const [step, setStep] = useState<1 | 2>(1);
  const [checkIn, setCheckIn] = useState('2026-11-10');
  const [checkOut, setCheckOut] = useState('2026-11-13');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestName, setGuestName] = useState('Arun Kumar');
  const [guestEmail, setGuestEmail] = useState('arun.traveler@example.com');
  const [guestPhone, setGuestPhone] = useState('+91 98401 23456');
  const [specialRequests, setSpecialRequests] = useState('Quiet room on high floor, late check-in');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isModalOpen || !hotel) return null;

  const roomPrice = activeRoom ? activeRoom.pricePerNight : hotel.pricePerNight;
  const nights = 3;
  const roomTotal = roomPrice * nights;
  const discountAmount = Math.round((roomTotal * discountPercent) / 100);
  const taxes = Math.round((roomTotal - discountAmount) * 0.18);
  const finalTotal = roomTotal - discountAmount + taxes;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'LUXESTAY20') {
      setDiscountPercent(20);
    } else if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscountPercent(10);
    }
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelCity: hotel.city,
      hotelImage: hotel.images[0],
      roomId: activeRoom?.id || `RM-${hotel.id}-101`,
      roomType: activeRoom?.roomType || 'Deluxe King Room',
      roomNumber: activeRoom?.roomNumber || '304',
      guestId: 'GST-1001',
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      nights,
      guestsCount: { adults, children },
      roomsCount: 1,
      pricePerNight: roomPrice,
      roomTotal,
      taxes,
      taxAmount: taxes,
      discount: discountAmount,
      discountAmount,
      finalAmount: finalTotal,
      totalAmount: finalTotal,
      status: 'Confirmed',
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      specialRequests,
      bookingDate: new Date().toISOString().split('T')[0],
      voucherCode: `VCH-${hotel.city.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setConfirmedBooking(newBooking);
    setStep(2);
    if (onBookingSuccess) onBookingSuccess(newBooking);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Luxury Reservation Desk
              </div>
              <h3 className="font-luxury text-lg font-bold">{hotel.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleConfirmReservation} className="p-6 overflow-y-auto space-y-4 text-xs">
            {/* Stay Information Bar */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-800">
              <div>
                <span className="text-[10px] text-amber-900 font-bold block uppercase">Check-in</span>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="font-semibold bg-transparent text-xs outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] text-amber-900 font-bold block uppercase">Check-out</span>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="font-semibold bg-transparent text-xs outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] text-amber-900 font-bold block uppercase">Selected Room</span>
                <span className="font-bold text-slate-900 truncate block">
                  {selectedRoom?.roomType || 'Deluxe King Suite'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-amber-900 font-bold block uppercase">Nightly Rate</span>
                <span className="font-bold text-amber-800 block">₹{roomPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Guest Details */}
            <div className="space-y-3 pt-1">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Users size={15} className="text-amber-600" />
                Primary Guest Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Name (As on Passport/ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Confirmation Email Address
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Special Hospitality Requests (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g., Honeymoon bed decoration, airport pickup, feather-free pillows"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Promo code & pricing calculation */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (Try LUXESTAY20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 uppercase rounded-lg border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition"
                >
                  Apply
                </button>
              </div>

              {discountPercent > 0 && (
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  Promo applied! {discountPercent}% discount active.
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Room rate (3 Nights)</span>
                  <span>₹{roomTotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes & Luxury Hospitality GST (18%)</span>
                  <span>₹{taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount Due</span>
                  <span className="text-amber-800">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg shadow-amber-900/10 flex items-center justify-center gap-2 transition"
            >
              <CreditCard size={16} />
              Confirm & Book Reservation (Instant Voucher)
            </button>
          </form>
        ) : (
          /* Step 2: Instant Booking Voucher */
          <div className="p-6 text-center space-y-4 text-xs overflow-y-auto">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-1">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-luxury text-xl font-bold text-slate-900">
              Reservation Confirmed & Guaranteed!
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Your official stay voucher has been generated. A confirmation receipt has been sent to{' '}
              <strong>{guestEmail}</strong>.
            </p>

            <div className="max-w-md mx-auto p-4 bg-amber-50/70 border border-amber-300 rounded-2xl text-left space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200/70 pb-2">
                <div>
                  <span className="text-[10px] text-amber-900 font-bold uppercase">Booking Reference</span>
                  <div className="text-sm font-extrabold text-slate-900">{confirmedBooking?.id}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-amber-900 font-bold uppercase">Digital Pass</span>
                  <div className="text-xs font-mono font-bold text-amber-800">
                    {confirmedBooking?.voucherCode}
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-slate-700 text-[11px]">
                <p>
                  <strong>Hotel:</strong> {hotel.name}
                </p>
                <p>
                  <strong>Room Assigned:</strong> {confirmedBooking?.roomType} (Room {confirmedBooking?.roomNumber})
                </p>
                <p>
                  <strong>Dates:</strong> {checkIn} to {checkOut} ({nights} Nights)
                </p>
                <p>
                  <strong>Total Paid:</strong> ₹{finalTotal.toLocaleString()} (All taxes included)
                </p>
              </div>

              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-2 rounded-lg text-[10px] font-semibold">
                <ShieldCheck size={14} />
                Guaranteed Check-in · Free cancellation available until 24 hrs prior
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition"
            >
              Return to Hotels & Trips
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Complete Hotel Inspector Modal
export function HotelDetailModal({
  hotel,
  isOpen,
  onClose,
  onBook,
  onBookNow,
}: {
  hotel: Hotel | null;
  isOpen?: boolean;
  onClose: () => void;
  onBook?: (hotel: Hotel, room?: Room) => void;
  onBookNow?: (hotel: Hotel, room?: Room) => void;
}) {
  if (!hotel || (isOpen !== undefined && !isOpen)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header with image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0">
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Stars count={hotel.starRating} />
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/80 text-white font-semibold">
                  {hotel.category}
                </span>
              </div>
              <h2 className="font-luxury text-2xl sm:text-3xl font-bold">{hotel.name}</h2>
              <p className="text-xs text-slate-200 flex items-center gap-1.5 mt-1">
                <MapPin size={13} className="text-amber-400" />
                {hotel.address}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-300 block">Starting from</span>
              <span className="text-2xl font-bold text-amber-300">
                ₹{hotel.pricePerNight.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-300"> / night</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-2">About The Property</h4>
            <p className="leading-relaxed text-slate-600">{hotel.description}</p>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Check-In / Out</span>
              <span className="font-semibold text-slate-900 block mt-0.5">
                {hotel.checkInTime} / {hotel.checkOutTime}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Guest Rating</span>
              <span className="font-semibold text-slate-900 block mt-0.5">
                ⭐ {hotel.guestRating} ({hotel.reviewsCount} reviews)
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Cancellation</span>
              <span className="font-semibold text-emerald-700 block mt-0.5 truncate">
                {hotel.cancellationPolicy}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Suites</span>
              <span className="font-semibold text-slate-900 block mt-0.5">
                {hotel.totalRooms} Rooms ({hotel.availableRooms} available today)
              </span>
            </div>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-2.5">Key Hotel Amenities</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hotel.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/50 border border-amber-200/60 text-slate-800 text-[11px]">
                  <CheckCircle2 size={13} className="text-amber-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Attractions */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-2">Nearby Landmarks & Transit</h4>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              {hotel.nearbyAttractions.map((att) => (
                <li key={att} className="flex items-center gap-2">
                  <MapPin size={12} className="text-amber-600 shrink-0" />
                  <span>{att}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">Best Rate Guarantee</span>
              <span className="text-xl font-bold text-slate-900">
                ₹{hotel.pricePerNight.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-500">/ night</span>
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                (onBook || onBookNow)?.(hotel);
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg transition"
            >
              Reserve Room Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
