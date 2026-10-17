import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  User as UserIcon,
  LogOut,
  Calendar,
  Building2,
  ShieldCheck,
  Menu,
  X,
  CreditCard,
  Key,
  Globe,
  Bell,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { hotelAuth, User } from '@/lib/hotel-auth';
import { Hotel, Room, Booking, HOTELS_DATA } from '@/lib/hotel-data';
import { Brand, BookingModal, HotelDetailModal } from '@/components/shared';
import { AuthModal } from '@/components/auth-modal';
import { HotelPortal } from '@/components/hotel-portal';
import { AdminDashboard } from '@/components/admin-dashboard';
import { GuestDashboard } from '@/components/guest-dashboard';
import { ManagerDashboard } from '@/components/manager-dashboard';
import { AIAssistant } from '@/components/ai-assistant';

export function App() {
  // Authentication State
  const [user, setUser] = useState<User | null>(hotelAuth.getUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'guest' | 'manager' | 'staff' | 'admin'>('guest');

  // Active View Portal
  // 'portal' = Discovery, 'trips' = Guest Trips, 'manager' = Front-Desk, 'admin' = Admin Console
  const [activePortal, setActivePortal] = useState<'portal' | 'trips' | 'manager' | 'admin'>('portal');

  // Modal Controllers
  const [detailHotel, setDetailHotel] = useState<Hotel | null>(null);
  const [bookingHotel, setBookingHotel] = useState<Hotel | null>(null);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);

  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Subscribe to auth changes
  useEffect(() => {
    const unsubscribe = hotelAuth.subscribe((state) => {
      setUser(state.user);
    });
    return () => unsubscribe();
  }, []);

  // Handlers
  const handleSelectHotel = (hotel: Hotel) => {
    setDetailHotel(hotel);
  };

  const handleBookHotel = (hotel: Hotel, room?: Room) => {
    setBookingHotel(hotel);
    setBookingRoom(room || null);
  };

  const handleOpenAuth = (role: 'guest' | 'manager' | 'staff' | 'admin' = 'guest') => {
    setAuthDefaultRole(role);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    hotelAuth.logout();
    setActivePortal('portal');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-600 selection:text-white">
      {/* Top Universal Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo Brand */}
            <div
              className="cursor-pointer"
              onClick={() => {
                setActivePortal('portal');
                setDetailHotel(null);
              }}
            >
              <Brand />
            </div>

            {/* Portal Switcher Tabs (Desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActivePortal('portal')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activePortal === 'portal'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Discover Hotels
              </button>

              <button
                onClick={() => {
                  if (!user) {
                    handleOpenAuth('guest');
                  } else {
                    setActivePortal('trips');
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activePortal === 'trips'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar size={13} className="text-amber-600" />
                <span>My Trips & VIP</span>
              </button>

              <button
                onClick={() => {
                  if (!user || (user.role !== 'manager' && user.role !== 'staff' && user.role !== 'admin')) {
                    handleOpenAuth('manager');
                  } else {
                    setActivePortal('manager');
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activePortal === 'manager'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Key size={13} className="text-amber-600" />
                <span>Front-Desk Desk</span>
              </button>

              <button
                onClick={() => {
                  if (!user || user.role !== 'admin') {
                    handleOpenAuth('admin');
                  } else {
                    setActivePortal('admin');
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activePortal === 'admin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck size={13} className="text-amber-600" />
                <span>Global Admin</span>
              </button>
            </div>

            {/* Right Controls: User Profile / Auth Button */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setActivePortal(user.role === 'admin' ? 'admin' : user.role === 'manager' ? 'manager' : 'trips')}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
                  >
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white font-luxury text-sm font-bold flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
                      <div className="text-[10px] text-amber-800 font-semibold uppercase tracking-wider">
                        {user.loyaltyTier || user.role}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Log Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAuth('guest')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleOpenAuth('guest')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold shadow-md shadow-amber-900/10 transition-all"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2">
            <button
              onClick={() => {
                setActivePortal('portal');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              Discover Hotels
            </button>
            <button
              onClick={() => {
                if (!user) handleOpenAuth('guest');
                else setActivePortal('trips');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              My Trips & VIP Portal
            </button>
            <button
              onClick={() => {
                if (!user) handleOpenAuth('manager');
                else setActivePortal('manager');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              Property Front-Desk Terminal
            </button>
            <button
              onClick={() => {
                if (!user) handleOpenAuth('admin');
                else setActivePortal('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              Platform Executive Console
            </button>
          </div>
        )}
      </nav>

      {/* Main Portals Router */}
      <div className="flex-1">
        {activePortal === 'portal' && (
          <HotelPortal
            user={user}
            onSelectHotel={handleSelectHotel}
            onBookHotel={handleBookHotel}
          />
        )}

        {activePortal === 'trips' && (
          <GuestDashboard
            user={user}
            onBookAgain={(hotelId) => {
              const h = HOTELS_DATA.find((x) => x.id === hotelId);
              if (h) handleBookHotel(h);
            }}
            onOpenHotel={(hotelId) => {
              const h = HOTELS_DATA.find((x) => x.id === hotelId);
              if (h) handleSelectHotel(h);
            }}
          />
        )}

        {activePortal === 'manager' && (
          <ManagerDashboard
            user={user}
            onOpenHotelDetail={(hotel) => handleSelectHotel(hotel)}
          />
        )}

        {activePortal === 'admin' && (
          <AdminDashboard
            onSelectHotel={(hotel) => handleSelectHotel(hotel)}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white">
                  <Sparkles size={18} className="text-amber-300" />
                </div>
                <span className="font-luxury text-xl font-bold tracking-tight text-white">LuxeStay</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The world's premier curated marketplace for luxury hotels, heritage palaces, and private beachfront villas.
              </p>
            </div>

            <div>
              <h4 className="font-luxury text-sm font-bold text-amber-300 uppercase tracking-wider mb-4">Top Destinations</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>Mumbai & Delhi NCR</li>
                <li>Goa & Rajasthan Palaces</li>
                <li>Dubai & Abu Dhabi</li>
                <li>Paris & London Mansions</li>
                <li>Maldives Private Atolls</li>
              </ul>
            </div>

            <div>
              <h4 className="font-luxury text-sm font-bold text-amber-300 uppercase tracking-wider mb-4">Hospitality Services</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>24/7 Personal Travel Concierge</li>
                <li>Diamond VIP Loyalty Perks</li>
                <li>Airport Chauffeur Dispatch</li>
                <li>Fine Dining Reservations</li>
                <li>Private Villa Charters</li>
              </ul>
            </div>

            <div>
              <h4 className="font-luxury text-sm font-bold text-amber-300 uppercase tracking-wider mb-4">Portals & RBAC</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => setActivePortal('portal')} className="hover:text-amber-400">Public Discovery</button></li>
                <li><button onClick={() => { handleOpenAuth('guest'); setActivePortal('trips'); }} className="hover:text-amber-400">Guest VIP Portal</button></li>
                <li><button onClick={() => { handleOpenAuth('manager'); setActivePortal('manager'); }} className="hover:text-amber-400">Front-Desk Desk</button></li>
                <li><button onClick={() => { handleOpenAuth('admin'); setActivePortal('admin'); }} className="hover:text-amber-400">Platform Admin</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-700 gap-4">
            <div>
              &copy; {new Date().getFullYear()} LuxeStay Hospitality Group Ltd. All rights reserved. Strictly Hotel Domain Platform.
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Luxury Stays</span>
              <span>•</span>
              <span>Folio Reconciliation</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultRole={authDefaultRole}
        onSuccess={(authenticatedUser) => {
          if (authenticatedUser.role === 'admin') setActivePortal('admin');
          else if (authenticatedUser.role === 'manager' || authenticatedUser.role === 'staff') setActivePortal('manager');
          else setActivePortal('trips');
        }}
      />

      {detailHotel && (
        <HotelDetailModal
          hotel={detailHotel}
          isOpen={true}
          onClose={() => setDetailHotel(null)}
          onBookNow={(h: Hotel, r?: Room) => {
            setDetailHotel(null);
            handleBookHotel(h, r);
          }}
        />
      )}

      {bookingHotel && (
        <BookingModal
          hotel={bookingHotel}
          room={bookingRoom || undefined}
          isOpen={true}
          onClose={() => {
            setBookingHotel(null);
            setBookingRoom(null);
          }}
          onSuccess={() => {
            setActivePortal('trips');
          }}
        />
      )}

      {/* Floating AI Travel Concierge */}
      <AIAssistant
        user={user}
        onSelectHotel={handleSelectHotel}
        onBookHotel={handleBookHotel}
        onOpenGuestPortal={() => setActivePortal('trips')}
      />
    </div>
  );
}
export default App;
