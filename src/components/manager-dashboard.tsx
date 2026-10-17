import React, { useState, useMemo } from 'react';
import {
  Bed,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Key,
  Layers,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  UserCheck,
  Users,
  Wrench,
  AlertCircle,
  Coffee,
  Check,
} from 'lucide-react';
import {
  HOTELS_DATA,
  ROOMS_DATA,
  BOOKINGS_DATA,
  Room,
  Booking,
  Hotel,
} from '@/lib/hotel-data';

interface ManagerDashboardProps {
  user: any;
  onOpenHotelDetail?: (hotel: Hotel) => void;
}

export function ManagerDashboard({ user, onOpenHotelDetail }: ManagerDashboardProps) {
  // Determine hotel being managed
  const managedHotelId = user?.managedHotelId || 'HTL-1001';
  const hotel = HOTELS_DATA.find((h) => h.id === managedHotelId) || HOTELS_DATA[0];

  // Tab: 'desk' (Daily Arrivals/Departures), 'rooms' (Room Matrix & Housekeeping), 'services' (Requests)
  const [activeTab, setActiveTab] = useState<'desk' | 'rooms' | 'services'>('desk');

  // Local rooms state so manager can toggle status (Cleaned, Available, Maintenance)
  const hotelRooms = useMemo(() => {
    return ROOMS_DATA.filter((r) => r.hotelId === hotel.id);
  }, [hotel.id]);

  const [rooms, setRooms] = useState<Room[]>(hotelRooms);
  const [roomFilter, setRoomFilter] = useState<string>('All');

  // Bookings for this hotel
  const hotelBookings = useMemo(() => {
    return BOOKINGS_DATA.filter((b) => b.hotelId === hotel.id);
  }, [hotel.id]);

  const [bookings, setBookings] = useState<Booking[]>(hotelBookings);
  const [deskSearch, setDeskSearch] = useState('');

  // Service requests simulated queue
  const [serviceRequests, setServiceRequests] = useState([
    { id: 'REQ-1', room: 'Suite 1402', guest: 'Ananya Sharma', service: 'Late Check-out Request (03:00 PM)', status: 'Pending', time: '10 mins ago' },
    { id: 'REQ-2', room: 'Deluxe 408', guest: 'David Miller', service: 'Airport Chauffeur Transfer to BOM', status: 'In Progress', time: '25 mins ago' },
    { id: 'REQ-3', room: 'Royal 702', guest: 'Rahul Verma', service: 'Fresh Floral Arrangement & Fruit Basket', status: 'Completed', time: '1 hr ago' },
    { id: 'REQ-4', room: 'Premier 512', guest: 'Sophie Laurent', service: 'Extra Goose-Down Pillows & Blanket', status: 'Pending', time: '2 hrs ago' },
  ]);

  // Handle Room Status Toggle
  const handleToggleRoomStatus = (roomId: string, nextStatus: Room['status']) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status: nextStatus } : r))
    );
  };

  // Handle Booking Check-in / Check-out
  const handleBookingAction = (bookingId: string, newStatus: Booking['bookingStatus']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: newStatus } : b))
    );
  };

  // Metrics
  const occupiedCount = rooms.filter((r) => r.status === 'Occupied').length;
  const availableCount = rooms.filter((r) => r.status === 'Available').length;
  const cleaningCount = rooms.filter((r) => r.status === 'Under Cleaning').length;
  const maintenanceCount = rooms.filter((r) => r.status === 'Maintenance').length;
  const occupancyPercent = Math.round((occupiedCount / rooms.length) * 100);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    if (roomFilter === 'All') return rooms;
    return rooms.filter((r) => r.status === roomFilter);
  }, [rooms, roomFilter]);

  // Filtered arrivals / departures
  const filteredDeskBookings = useMemo(() => {
    return bookings.filter(
      (b) =>
        b.guestName.toLowerCase().includes(deskSearch.toLowerCase()) ||
        b.roomNumber.toLowerCase().includes(deskSearch.toLowerCase()) ||
        b.id.toLowerCase().includes(deskSearch.toLowerCase())
    );
  }, [bookings, deskSearch]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      {/* Property Manager Banner */}
      <header className="bg-slate-900 text-white border-b border-slate-800 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                <Sparkles size={14} /> Property Management & Front-Desk Terminal
              </div>
              <h1 className="font-luxury text-3xl font-bold tracking-tight">{hotel.name}</h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin size={13} className="text-amber-400" />
                {hotel.neighborhood}, {hotel.city} • Managed by {user?.name || 'Vikramaditya Singhania'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                Front Office: ONLINE
              </span>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 mt-8 border-b border-slate-800/80">
            {[
              { id: 'desk', label: 'Front-Desk Check-In / Out', icon: UserCheck },
              { id: 'rooms', label: `Room Matrix & Housekeeping (${rooms.length} Rooms)`, icon: Bed },
              { id: 'services', label: `Guest Requests Queue (${serviceRequests.filter((r) => r.status === 'Pending').length})`, icon: Coffee },
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

      {/* Main Operations Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Live Occupancy</span>
              <span className="text-2xl font-black text-slate-900">{occupancyPercent}%</span>
              <span className="text-[10px] text-slate-700 block">{occupiedCount} of {rooms.length} Suites</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Bed size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Ready for Check-In</span>
              <span className="text-2xl font-black text-emerald-600">{availableCount}</span>
              <span className="text-[10px] text-slate-700 block">Inspected & Vacant</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Housekeeping</span>
              <span className="text-2xl font-black text-amber-600">{cleaningCount}</span>
              <span className="text-[10px] text-slate-700 block">Rooms In Progress</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <RefreshCw size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Out of Order</span>
              <span className="text-2xl font-black text-rose-600">{maintenanceCount}</span>
              <span className="text-[10px] text-slate-700 block">Maintenance Inspection</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Wrench size={20} />
            </div>
          </div>
        </div>

        {/* TAB 1: FRONT-DESK CHECK-IN / CHECK-OUT DESK */}
        {activeTab === 'desk' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-luxury text-xl font-bold text-slate-900">Today's Front-Desk Roster</h2>
                <p className="text-xs text-slate-700">
                  Manage guest arrivals, room key assignment, and express departures
                </p>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={deskSearch}
                  onChange={(e) => setDeskSearch(e.target.value)}
                  placeholder="Search guest or room..."
                  className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Voucher</th>
                    <th className="py-3 px-4">Guest</th>
                    <th className="py-3 px-4">Assigned Room</th>
                    <th className="py-3 px-4">Stay Duration</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredDeskBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{b.guestName}</div>
                        <div className="text-[11px] text-slate-700">{b.guestEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-amber-700">Room {b.roomNumber}</div>
                        <div className="text-[10px] text-slate-700">{b.roomType}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {b.checkIn} to {b.checkOut} ({b.nights}n)
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.bookingStatus === 'Confirmed'
                              ? 'bg-amber-100 text-amber-800'
                              : b.bookingStatus === 'Checked In'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.bookingStatus === 'Checked Out'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {b.bookingStatus === 'Confirmed' && (
                          <button
                            onClick={() => handleBookingAction(b.id, 'Checked In')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                          >
                            Express Check-In
                          </button>
                        )}
                        {b.bookingStatus === 'Checked In' && (
                          <button
                            onClick={() => handleBookingAction(b.id, 'Checked Out')}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs"
                          >
                            Complete Check-Out
                          </button>
                        )}
                        {b.bookingStatus === 'Checked Out' && (
                          <span className="text-[11px] text-slate-700 font-semibold">Departed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ROOM OCCUPANCY MATRIX & HOUSEKEEPING */}
        {activeTab === 'rooms' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-luxury text-xl font-bold text-slate-900">Room Status Matrix</h2>
                <p className="text-xs text-slate-700">
                  Click on any room card to toggle housekeeping or maintenance status
                </p>
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'Available', 'Occupied', 'Under Cleaning', 'Maintenance'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setRoomFilter(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      roomFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredRooms.map((r) => {
                const isOccupied = r.status === 'Occupied';
                const isCleaning = r.status === 'Under Cleaning';
                const isAvailable = r.status === 'Available';
                const isMaintenance = r.status === 'Maintenance';

                return (
                  <div
                    key={r.id}
                    className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                      isOccupied
                        ? 'bg-rose-50/70 border-rose-200'
                        : isCleaning
                        ? 'bg-amber-50/70 border-amber-200'
                        : isMaintenance
                        ? 'bg-slate-100 border-slate-300'
                        : 'bg-emerald-50/70 border-emerald-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-black text-sm text-slate-900">
                          #{r.roomNumber}
                        </span>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isOccupied
                              ? 'bg-rose-500'
                              : isCleaning
                              ? 'bg-amber-500 animate-pulse'
                              : isMaintenance
                              ? 'bg-slate-500'
                              : 'bg-emerald-500'
                          }`}
                        ></span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-700 line-clamp-1">{r.roomType}</div>
                      <div className="text-[10px] text-slate-700">{r.floor} • {r.view} View</div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider block mb-1.5 ${
                          isOccupied
                            ? 'text-rose-700'
                            : isCleaning
                            ? 'text-amber-700'
                            : isMaintenance
                            ? 'text-slate-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {r.status}
                      </span>

                      {/* Action quick toggle */}
                      {isCleaning && (
                        <button
                          onClick={() => handleToggleRoomStatus(r.id, 'Available')}
                          className="w-full py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                        >
                          Mark Ready
                        </button>
                      )}
                      {isAvailable && (
                        <button
                          onClick={() => handleToggleRoomStatus(r.id, 'Under Cleaning')}
                          className="w-full py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-semibold"
                        >
                          Clean
                        </button>
                      )}
                      {isOccupied && (
                        <span className="text-[10px] text-slate-700 block text-center font-medium">Guest In-House</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: GUEST SERVICE REQUESTS */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="font-luxury text-xl font-bold text-slate-900">In-House Concierge & Service Requests</h2>
              <p className="text-xs text-slate-700">Real-time room service and guest assistance queue</p>
            </div>

            <div className="space-y-3">
              {serviceRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Coffee size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-700 text-xs">{req.room}</span>
                        <span className="text-xs font-bold text-slate-900">• {req.guest}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-0.5">{req.service}</p>
                      <span className="text-[10px] text-slate-700">{req.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>

                    {req.status !== 'Completed' && (
                      <button
                        onClick={() =>
                          setServiceRequests((prev) =>
                            prev.map((s) => (s.id === req.id ? { ...s, status: 'Completed' } : s))
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
