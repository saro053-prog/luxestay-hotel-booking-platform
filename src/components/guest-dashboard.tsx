import React, { useState } from 'react';
import {
  Calendar,
  CreditCard,
  Download,
  Gift,
  Key,
  MapPin,
  QrCode,
  Sparkles,
  Star,
  User,
  Wifi,
  Phone,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Coffee,
} from 'lucide-react';
import { Booking, getBookingsForGuest, BOOKINGS_DATA, Hotel } from '@/lib/hotel-data';
import { Stars } from '@/components/shared';

interface GuestDashboardProps {
  user: any;
  onBookAgain?: (hotelId: string) => void;
  onOpenHotel?: (hotelId: string) => void;
}

export function GuestDashboard({ user, onBookAgain, onOpenHotel }: GuestDashboardProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'upcoming' | 'past' | 'loyalty'>('current');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Fetch bookings for this user or fallback to demo guest bookings
  const guestEmail = user?.email || 'arun.traveler@example.com';
  const allUserBookings = getBookingsForGuest(guestEmail);
  const userBookings = allUserBookings.length > 0 ? allUserBookings : BOOKINGS_DATA.slice(0, 5);

  const currentStay = userBookings.find((b) => b.bookingStatus === 'Checked In') || userBookings[0];
  const upcomingStays = userBookings.filter((b) => b.bookingStatus === 'Confirmed');
  const pastStays = userBookings.filter((b) => b.bookingStatus === 'Checked Out');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewBooking(null);
      setReviewSubmitted(false);
      setReviewText('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      {/* Top Banner / VIP Member Header */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white pt-10 pb-12 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-luxury text-2xl font-bold shadow-lg shadow-amber-900/40 border border-amber-400/40">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white">
                    {user?.name || 'Arun Kumar'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30 uppercase tracking-wider">
                    {user?.loyaltyTier || 'Diamond VIP'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Member since Oct 2022 • {guestEmail} • +91 98401 23456
                </p>
              </div>
            </div>

            {/* Loyalty Quick Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  Reward Points Balance
                </span>
                <span className="font-luxury text-2xl font-bold text-white">18,400 pts</span>
                <span className="text-[11px] text-slate-300 block mt-0.5">Worth ₹18,400 towards free nights</span>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">Tier Status</span>
                <span className="text-xs font-bold text-emerald-400">Maintained through 2027</span>
                <span className="text-[11px] text-slate-300 block mt-0.5">3 stays to Royal Ambassador</span>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-8 border-b border-white/10">
            {[
              { id: 'current', label: 'Current Stay Pass', icon: Key },
              { id: 'upcoming', label: `Upcoming Trips (${upcomingStays.length})`, icon: Calendar },
              { id: 'past', label: `Past Stays & Receipts (${pastStays.length})`, icon: Clock },
              { id: 'loyalty', label: 'VIP Perks & Rewards', icon: Gift },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-amber-400 text-amber-300 bg-white/5 rounded-t-xl'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* CURRENT STAY DIGITAL PASS */}
        {activeTab === 'current' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Digital Pass / Key Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/40 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 inline-flex items-center gap-1.5 mb-2">
                    <CheckCircle2 size={12} /> Active In-House Stay
                  </span>
                  <h2 className="font-luxury text-2xl font-bold">{currentStay.hotelName}</h2>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                    <MapPin size={13} className="text-amber-400" />
                    {currentStay.hotelCity}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/10">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Assigned Room</span>
                  <span className="font-mono text-2xl font-black text-white">{currentStay.roomNumber}</span>
                  <span className="text-[10px] text-slate-300 block">{currentStay.roomType}</span>
                </div>
              </div>

              {/* Digital Pass Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Check-in</span>
                  <span className="font-bold text-white">{currentStay.checkIn}</span>
                  <span className="text-[10px] text-slate-400 block">From 02:00 PM</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Check-out</span>
                  <span className="font-bold text-white">{currentStay.checkOut}</span>
                  <span className="text-[10px] text-amber-300 block">VIP Late 04:00 PM</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Guests</span>
                  <span className="font-bold text-white">{currentStay.guestsCount.adults} Adults</span>
                  <span className="text-[10px] text-slate-400 block">{currentStay.nights} Nights</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Voucher Pass</span>
                  <span className="font-mono font-bold text-amber-400">{currentStay.id}</span>
                  <span className="text-[10px] text-emerald-400 block">Verified Pass</span>
                </div>
              </div>

              {/* In-Stay Key Actions */}
              <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <Wifi size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">High-Speed Wi-Fi</span>
                    <span className="font-mono text-xs font-bold text-white">Network: {currentStay.hotelName.split(' ')[0]}_VIP</span>
                    <span className="text-[10px] text-slate-300 block">Key: <span className="font-mono font-bold text-amber-300">LUXE2026</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedInvoiceBooking(currentStay)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/10 flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>View Folio</span>
                  </button>
                  <a
                    href="tel:+919820011223"
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-2"
                  >
                    <Phone size={14} />
                    <span>Call Concierge</span>
                  </a>
                </div>
              </div>
            </div>

            {/* QR Code Digital Room Key */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4">
                <QrCode size={140} className="text-slate-900" />
              </div>
              <h3 className="font-luxury text-base font-bold text-slate-900">Contactless Key & Room Access</h3>
              <p className="text-xs text-slate-700 mt-1 max-w-xs">
                Scan at elevators, suite door lock, and executive lounge entrance
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 w-full flex items-center justify-around text-xs text-slate-600 font-semibold">
                <span>Room {currentStay.roomNumber}</span>
                <span>•</span>
                <span>Floor 14</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">Active</span>
              </div>
            </div>
          </div>
        )}

        {/* UPCOMING TRIPS */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingStays.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Calendar size={36} className="mx-auto text-amber-600 mb-3" />
                <h3 className="font-luxury text-xl font-bold text-slate-900">No Upcoming Trips Booked</h3>
                <p className="text-xs text-slate-700 mt-1">Ready for your next getaway? Explore our 108+ luxury destinations.</p>
              </div>
            ) : (
              upcomingStays.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={b.hotelImage}
                      alt={b.hotelName}
                      className="h-24 w-28 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
                        Confirmed Reservation
                      </span>
                      <h3 className="font-luxury text-lg font-bold text-slate-900">{b.hotelName}</h3>
                      <p className="text-xs text-slate-700 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-amber-600" />
                        {b.hotelCity} • Room {b.roomNumber} ({b.roomType})
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-700">
                        <span>Check-in: <strong className="text-slate-900">{b.checkIn}</strong></span>
                        <span>Check-out: <strong className="text-slate-900">{b.checkOut}</strong></span>
                        <span>({b.nights} nights)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-between gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-700 uppercase font-bold block">Total Paid</span>
                      <span className="font-luxury text-xl font-extrabold text-slate-900">
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedInvoiceBooking(b)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Download size={14} />
                        <span>Voucher</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PAST STAYS & REVIEWS */}
        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastStays.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={b.hotelImage}
                    alt={b.hotelName}
                    className="h-20 w-24 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
                      Completed Stay
                    </span>
                    <h3 className="font-luxury text-base font-bold text-slate-900">{b.hotelName}</h3>
                    <p className="text-xs text-slate-700">{b.hotelCity} • Stayed {b.checkIn} to {b.checkOut}</p>
                    <span className="text-xs font-bold text-amber-700 mt-1 block">
                      +{(b.totalAmount * 0.05).toFixed(0)} Loyalty Points Credited
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedInvoiceBooking(b)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    <span>Folio Tax Invoice</span>
                  </button>

                  <button
                    onClick={() => setReviewBooking(b)}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors flex items-center gap-1.5 border border-amber-200"
                  >
                    <Star size={14} className="text-amber-600" />
                    <span>Write Review</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOYALTY PERKS */}
        {activeTab === 'loyalty' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-4">
                <Clock size={24} />
              </div>
              <h3 className="font-luxury text-base font-bold text-slate-900">Guaranteed Late 4 PM Check-Out</h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Enjoy your leisure at your own pace without early morning rush. Available across all portfolio hotels.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-4">
                <Coffee size={24} />
              </div>
              <h3 className="font-luxury text-base font-bold text-slate-900">Daily Gourmet Champagne Breakfast</h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Complimentary for two guests at the hotel’s flagship restaurant throughout every stay.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-4">
                <Sparkles size={24} />
              </div>
              <h3 className="font-luxury text-base font-bold text-slate-900">Complimentary Room Upgrades</h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Subject to availability upon check-in, bumped up to Junior or Executive Suites automatically.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Tax Folio Invoice Modal */}
      {selectedInvoiceBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-luxury text-lg font-bold">Official Hospitality Folio & Tax Invoice</h3>
                <span className="text-[10px] text-slate-700 font-mono">GSTIN: 27AABCL1234F1Z8</span>
              </div>
              <button
                onClick={() => setSelectedInvoiceBooking(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-700">Booking Voucher:</span>
                <span className="font-mono font-bold">{selectedInvoiceBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Hotel Property:</span>
                <span className="font-bold">{selectedInvoiceBooking.hotelName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Guest Name:</span>
                <span className="font-semibold">{selectedInvoiceBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Stay Period:</span>
                <span>{selectedInvoiceBooking.checkIn} to {selectedInvoiceBooking.checkOut} ({selectedInvoiceBooking.nights} nights)</span>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-700">Base Room Charge:</span>
                  <span>₹{selectedInvoiceBooking.roomTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Luxury GST (18% Total):</span>
                  <span>₹{selectedInvoiceBooking.taxAmount.toLocaleString('en-IN')}</span>
                </div>
                {selectedInvoiceBooking.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Loyalty Voucher Discount:</span>
                    <span>-₹{selectedInvoiceBooking.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold pt-2 border-t border-slate-200 text-slate-900">
                  <span>Total Paid in Full:</span>
                  <span>₹{selectedInvoiceBooking.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download size={14} />
                <span>Print or Save PDF</span>
              </button>
              <button
                onClick={() => setSelectedInvoiceBooking(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative text-slate-900">
            <h3 className="font-luxury text-lg font-bold">Write a Verified Stay Review</h3>
            <p className="text-xs text-slate-700 mt-1">{reviewBooking.hotelName}</p>

            {reviewSubmitted ? (
              <div className="py-8 text-center text-emerald-600">
                <CheckCircle2 size={40} className="mx-auto mb-2" />
                <h4 className="font-bold text-base">Review Published!</h4>
                <p className="text-xs text-slate-700 mt-1">Thank you for helping fellow luxury travelers.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Overall Experience Rating
                  </label>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={24}
                          className={star <= reviewRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Feedback
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts on the amenities, hospitality, food, and views..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewBooking(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
