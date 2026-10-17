import React, { useState, useMemo } from 'react';
import {
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  Layers,
  Search,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileSpreadsheet,
  Plus,
  Bed,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import {
  HOTELS_DATA,
  BOOKINGS_DATA,
  GUESTS_DATA,
  ROOMS_DATA,
  Booking,
  Hotel,
} from '@/lib/hotel-data';
import { HospitalityChart, Stars } from '@/components/shared';

interface AdminDashboardProps {
  onSelectBooking?: (booking: Booking) => void;
  onSelectHotel?: (hotel: Hotel) => void;
}

export function AdminDashboard({ onSelectBooking, onSelectHotel }: AdminDashboardProps) {
  // Navigation tabs inside admin
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'hotels' | 'guests'>('overview');

  // Bookings management states
  const [bookingSearch, setBookingSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [bookingsPage, setBookingsPage] = useState(1);
  const bookingsPerPage = 10;

  // Hotels management states
  const [hotelSearch, setHotelSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [hotelsPage, setHotelsPage] = useState(1);
  const hotelsPerPage = 8;

  // Local mutable state for bookings (so admin can change status)
  const [bookingsList, setBookingsList] = useState<Booking[]>(BOOKINGS_DATA);

  // Status changer handler
  const handleStatusChange = (bookingId: string, newStatus: Booking['bookingStatus']) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: newStatus } : b))
    );
  };

  // Export Bookings to CSV
  const handleExportCSV = () => {
    const headers = ['Booking ID,Hotel Name,Guest Name,Email,Check In,Check Out,Nights,Total Price,Status,Payment'];
    const rows = bookingsList.map(
      (b) =>
        `"${b.id}","${b.hotelName}","${b.guestName}","${b.guestEmail}","${b.checkIn}","${b.checkOut}",${b.nights},${b.totalAmount},"${b.bookingStatus}","${b.paymentStatus}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `luxestay-bookings-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookingsList.filter((b) => {
      const matchSearch =
        b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.guestName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.hotelName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.guestEmail.toLowerCase().includes(bookingSearch.toLowerCase());

      const matchStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookingsList, bookingSearch, statusFilter]);

  // Paginated Bookings
  const totalBookingsPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = useMemo(() => {
    const start = (bookingsPage - 1) * bookingsPerPage;
    return filteredBookings.slice(start, start + bookingsPerPage);
  }, [filteredBookings, bookingsPage]);

  // Filtered Hotels
  const filteredHotels = useMemo(() => {
    return HOTELS_DATA.filter((h) => {
      const matchSearch =
        h.name.toLowerCase().includes(hotelSearch.toLowerCase()) ||
        h.city.toLowerCase().includes(hotelSearch.toLowerCase());
      const matchCategory = categoryFilter === 'All' || h.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [hotelSearch, categoryFilter]);

  const totalHotelsPages = Math.ceil(filteredHotels.length / hotelsPerPage);
  const paginatedHotels = useMemo(() => {
    const start = (hotelsPage - 1) * hotelsPerPage;
    return filteredHotels.slice(start, start + hotelsPerPage);
  }, [filteredHotels, hotelsPage]);

  // Summary Metrics
  const totalRevenue = useMemo(() => {
    return bookingsList
      .filter((b) => b.bookingStatus !== 'Cancelled')
      .reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [bookingsList]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      {/* Top Operations Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                <Sparkles size={14} />
                Global Hospitality Operations & Admin
              </div>
              <h1 className="font-luxury text-3xl font-bold tracking-tight">Executive Management Console</h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time booking reconciliation, hotel portfolio inventory & revenue analytics
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow-sm transition-colors"
              >
                <Download size={14} className="text-amber-400" />
                <span>Export Bookings CSV</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 border-b border-slate-800/80">
            {[
              { id: 'overview', label: 'KPI Dashboard & Revenue', icon: TrendingUp },
              { id: 'bookings', label: `Bookings Registry (${bookingsList.length})`, icon: Calendar },
              { id: 'hotels', label: `Hotel Portfolio (${HOTELS_DATA.length})`, icon: Building2 },
              { id: 'guests', label: `Loyalty Members (${GUESTS_DATA.length})`, icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-400 bg-slate-800/50 rounded-t-xl'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Gross Platform Revenue</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <DollarSign size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  ₹{(totalRevenue / 10000000).toFixed(2)} Cr
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
                  <ArrowUpRight size={14} />
                  <span>+18.4% vs last quarter</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Total Confirmed Stays</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Calendar size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{bookingsList.length} Bookings</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold mt-2">
                  <span>{bookingsList.filter((b) => b.bookingStatus === 'Confirmed').length} Upcoming check-ins</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Portfolio Occupancy</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <TrendingUp size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">84.6%</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
                  <ArrowUpRight size={14} />
                  <span>+5.2% high season surge</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Average Daily Rate (ADR)</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Building2 size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">₹22,450</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold mt-2">
                  <span>RevPAR: ₹18,990</span>
                </div>
              </div>
            </div>

            {/* Performance Analytics SVG Chart */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <HospitalityChart
                title="Gross Platform Booking Volume & Occupancy Trends (Monthly)"
                subtitle="Aggregated data from 108 luxury partner hotels across India, Middle East, Europe & Americas"
              />
            </div>

            {/* Recent High-Value Bookings Preview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-luxury text-lg font-bold text-slate-900">Recent High-Value Bookings</h3>
                  <p className="text-xs text-slate-700">Latest reservations across premium luxury suites</p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800"
                >
                  View All {bookingsList.length} Bookings &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-y border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Guest</th>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Dates</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {bookingsList.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{b.guestName}</div>
                          <div className="text-[11px] text-slate-700">{b.guestEmail}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{b.hotelName}</div>
                          <div className="text-[11px] text-slate-700">{b.roomType}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {b.checkIn} to {b.checkOut} ({b.nights}n)
                        </td>
                        <td className="py-3 px-4 font-extrabold text-slate-900">
                          ₹{b.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.bookingStatus === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.bookingStatus === 'Checked In'
                                ? 'bg-blue-100 text-blue-800'
                                : b.bookingStatus === 'Checked Out'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {b.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS REGISTRY */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-luxury text-xl font-bold text-slate-900">Global Bookings Registry</h2>
                <p className="text-xs text-slate-700">
                  Search, verify, update check-in statuses, or issue refunds
                </p>
              </div>

              {/* Search & Status Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => {
                      setBookingSearch(e.target.value);
                      setBookingsPage(1);
                    }}
                    placeholder="Search by ID, Guest, Hotel..."
                    className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 w-64"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setBookingsPage(1);
                  }}
                  className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked In">Checked In</option>
                  <option value="Checked Out">Checked Out</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Guest Details</th>
                    <th className="py-3.5 px-4">Hotel & Room</th>
                    <th className="py-3.5 px-4">Dates</th>
                    <th className="py-3.5 px-4">Billing</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {paginatedBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{b.guestName}</div>
                        <div className="text-[11px] text-slate-700">{b.guestEmail}</div>
                        <div className="text-[10px] text-slate-700">{b.guestPhone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{b.hotelName}</div>
                        <div className="text-[11px] text-slate-700">Room {b.roomNumber} ({b.roomType})</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>In: <span className="font-semibold text-slate-900">{b.checkIn}</span></div>
                        <div>Out: <span className="font-semibold text-slate-900">{b.checkOut}</span> ({b.nights}n)</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">₹{b.totalAmount.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">{b.paymentMethod} • {b.paymentStatus}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.bookingStatus === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.bookingStatus === 'Checked In'
                              ? 'bg-blue-100 text-blue-800'
                              : b.bookingStatus === 'Checked Out'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.bookingStatus === 'Confirmed' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'Checked In')}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold transition-colors"
                            >
                              Check-In
                            </button>
                          )}
                          {b.bookingStatus === 'Checked In' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'Checked Out')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition-colors"
                            >
                              Check-Out
                            </button>
                          )}
                          {b.bookingStatus !== 'Cancelled' && b.bookingStatus !== 'Checked Out' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'Cancelled')}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-700">
                Showing {paginatedBookings.length} of {filteredBookings.length} records
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={bookingsPage === 1}
                  onClick={() => setBookingsPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-xs font-bold px-2">
                  Page {bookingsPage} of {totalBookingsPages || 1}
                </span>
                <button
                  disabled={bookingsPage >= totalBookingsPages}
                  onClick={() => setBookingsPage((p) => Math.min(totalBookingsPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HOTELS PORTFOLIO */}
        {activeTab === 'hotels' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-luxury text-xl font-bold text-slate-900">Partner Hotels Portfolio</h2>
                <p className="text-xs text-slate-700">
                  {HOTELS_DATA.length} active luxury properties across 15+ world destinations
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={hotelSearch}
                  onChange={(e) => {
                    setHotelSearch(e.target.value);
                    setHotelsPage(1);
                  }}
                  placeholder="Filter by hotel or city..."
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 w-56"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {paginatedHotels.map((h) => (
                <div
                  key={h.id}
                  onClick={() => onSelectHotel?.(h)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-32 w-full rounded-xl overflow-hidden mb-3 bg-slate-200">
                      <img src={h.images[0]} alt={h.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-700 uppercase mb-1">
                      <span>{h.category}</span>
                      <span>★ {h.guestRating}</span>
                    </div>
                    <h4 className="font-luxury font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                      {h.name}
                    </h4>
                    <p className="text-xs text-slate-700 mt-0.5">{h.city}, {h.country}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-700 block">Inventory</span>
                      <span className="font-bold text-slate-900">{h.totalRooms} Rooms</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-700 block">Base Rate</span>
                      <span className="font-extrabold text-amber-700">₹{h.pricePerNight.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-700">
                Showing {paginatedHotels.length} of {filteredHotels.length} hotels
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={hotelsPage === 1}
                  onClick={() => setHotelsPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-xs font-bold px-2">
                  Page {hotelsPage} of {totalHotelsPages || 1}
                </span>
                <button
                  disabled={hotelsPage >= totalHotelsPages}
                  onClick={() => setHotelsPage((p) => Math.min(totalHotelsPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GUEST LOYALTY REGISTRY */}
        {activeTab === 'guests' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="font-luxury text-xl font-bold text-slate-900">Guest Loyalty & VIP Registry</h2>
              <p className="text-xs text-slate-700">
                Tracking high-value frequent travelers, reward points, and lifetime stays
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Member ID</th>
                    <th className="py-3 px-4">Guest Name</th>
                    <th className="py-3 px-4">Tier Status</th>
                    <th className="py-3 px-4">Total Stays</th>
                    <th className="py-3 px-4">Reward Points</th>
                    <th className="py-3 px-4">Lifetime Spend</th>
                    <th className="py-3 px-4">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {GUESTS_DATA.slice(0, 15).map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{g.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{g.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            g.loyaltyTier === 'Diamond VIP'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : g.loyaltyTier === 'Platinum'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {g.loyaltyTier}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{g.totalStays} Stays</td>
                      <td className="py-3 px-4 font-extrabold text-amber-700">{g.rewardPoints.toLocaleString()} pts</td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{g.totalSpend.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-slate-700">
                        <div>{g.email}</div>
                        <div className="text-[10px]">{g.phone}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
