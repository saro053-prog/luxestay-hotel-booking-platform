import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User as UserIcon,
  MapPin,
  Star,
  ArrowRight,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Bed,
  RefreshCw,
} from 'lucide-react';
import {
  Hotel,
  HOTELS_DATA,
  searchHotels,
  getBookingsForGuest,
  BOOKINGS_DATA,
} from '@/lib/hotel-data';
import { Stars } from '@/components/shared';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  hotelCards?: Hotel[];
  bookingCard?: any;
  actionType?: 'book' | 'view' | 'filter';
}

interface AIAssistantProps {
  user: any;
  onSelectHotel: (hotel: Hotel) => void;
  onBookHotel: (hotel: Hotel) => void;
  onOpenGuestPortal?: () => void;
}

const QUICK_PROMPTS = [
  '🏨 Find 5-star hotels in Goa with a pool',
  '💰 Best luxury stays under ₹15,000 in Mumbai',
  '🌴 Honeymoon beachfront resort in Maldives',
  '🔑 What is my current room number & Wi-Fi?',
  '✨ Recommend a heritage palace in Jaipur',
];

export function AIAssistant({
  user,
  onSelectHotel,
  onBookHotel,
  onOpenGuestPortal,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Multi-turn context memory
  const [conversationContext, setConversationContext] = useState<{
    lastCity?: string;
    lastCategory?: string;
    lastHotelList?: Hotel[];
    lastSelectedHotel?: Hotel;
    maxPrice?: number;
  }>({});

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am **Aura**, your personal AI Luxury Travel & Hotel Concierge. I can find private resorts, check room amenities, lookup your active bookings, or recommend handpicked heritage palaces. How may I assist your journey today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // AI Natural Language Reasoning Engine (Multi-Turn aware)
  const processQuery = (userText: string) => {
    const q = userText.toLowerCase().trim();

    // 1. Inquiries about Current Stay / Room Number / Booking
    if (
      q.includes('my room') ||
      q.includes('my booking') ||
      q.includes('wifi') ||
      q.includes('check in time') ||
      q.includes('pass')
    ) {
      const guestEmail = user?.email || 'arun.traveler@example.com';
      const guestBookings = getBookingsForGuest(guestEmail);
      const activeBooking =
        guestBookings.find((b) => b.bookingStatus === 'Checked In') ||
        guestBookings[0] ||
        BOOKINGS_DATA[0];

      return {
        text: `Here is your active reservation details for **${activeBooking.hotelName}** in ${activeBooking.hotelCity}:\n\n- **Assigned Room**: Room ${activeBooking.roomNumber} (${activeBooking.roomType})\n- **Stay Dates**: ${activeBooking.checkIn} to ${activeBooking.checkOut}\n- **In-Room Wi-Fi**: Network "${activeBooking.hotelName.split(' ')[0]}_VIP", Key: "LUXE2026"\n- **Voucher ID**: ${activeBooking.id}`,
        bookingCard: activeBooking,
      };
    }

    // 2. Loyalty points inquiry
    if (q.includes('loyalty') || q.includes('points') || q.includes('tier') || q.includes('perk')) {
      const tier = user?.loyaltyTier || 'Diamond VIP';
      return {
        text: `You currently enjoy **${tier} Member** status with **18,400 Reward Points** in your LuxeStay vault.\n\nYour perks include guaranteed late 4:00 PM check-out, complimentary champagne breakfast, and priority room upgrades.`,
      };
    }

    // 3. Multi-turn context resolution: "cheapest", "cheapest one", "lowest price"
    if (
      (q.includes('cheapest') || q.includes('lowest') || q.includes('most affordable')) &&
      conversationContext.lastHotelList &&
      conversationContext.lastHotelList.length > 0
    ) {
      const sorted = [...conversationContext.lastHotelList].sort(
        (a, b) => a.pricePerNight - b.pricePerNight
      );
      const cheapest = sorted[0];
      setConversationContext((prev) => ({
        ...prev,
        lastSelectedHotel: cheapest,
      }));

      return {
        text: `From the options we discussed, the most affordable is **${cheapest.name}** in ${cheapest.city} at **₹${cheapest.pricePerNight.toLocaleString('en-IN')}/night** (${cheapest.guestRating}★ rating). Would you like to reserve it now?`,
        hotelCards: [cheapest],
      };
    }

    // 4. Multi-turn context resolution: "book it", "book that", "reserve this"
    if (
      (q.includes('book it') || q.includes('book that') || q.includes('reserve')) &&
      conversationContext.lastSelectedHotel
    ) {
      const target = conversationContext.lastSelectedHotel;
      return {
        text: `Certainly! I have initiated the reservation flow for **${target.name}** in ${target.city}. Click below to confirm your stay details and room category:`,
        hotelCards: [target],
        actionType: 'book' as const,
      };
    }

    // 5. Destination & Amenities Query Parsing
    let targetCity = conversationContext.lastCity;
    const cities = ['mumbai', 'goa', 'jaipur', 'delhi', 'bengaluru', 'dubai', 'paris', 'london', 'maldives', 'new york', 'udaipur', 'agra'];
    for (const c of cities) {
      if (q.includes(c)) {
        targetCity = c;
        break;
      }
    }

    let maxPrice = conversationContext.maxPrice;
    const priceMatch = q.match(/(\d+)[kK]|under\s*(\d+)|(\d+)\s*000/i);
    if (priceMatch) {
      const raw = priceMatch[1] || priceMatch[2] || priceMatch[3];
      if (raw) {
        maxPrice = parseInt(raw, 10);
        if (maxPrice < 1000) maxPrice = maxPrice * 1000;
      }
    }

    // Filter criteria
    const hotels = HOTELS_DATA.filter((h) => {
      if (targetCity && !h.city.toLowerCase().includes(targetCity.toLowerCase()) && !h.country.toLowerCase().includes(targetCity.toLowerCase())) {
        return false;
      }
      if (maxPrice && h.pricePerNight > maxPrice) {
        return false;
      }
      if (q.includes('pool') && !h.amenities.some((a) => a.toLowerCase().includes('pool'))) {
        return false;
      }
      if (q.includes('spa') && !h.amenities.some((a) => a.toLowerCase().includes('spa'))) {
        return false;
      }
      if (q.includes('beach') && !h.amenities.some((a) => a.toLowerCase().includes('beach')) && h.category !== 'Beachfront Villa') {
        return false;
      }
      if (q.includes('5 star') || q.includes('5-star')) {
        if (h.starRating !== 5) return false;
      }
      return true;
    });

    const displayHotels = hotels.slice(0, 3);

    // Save context for next turn
    setConversationContext((prev) => ({
      ...prev,
      lastCity: targetCity,
      maxPrice: maxPrice,
      lastHotelList: displayHotels,
      lastSelectedHotel: displayHotels[0],
    }));

    if (displayHotels.length > 0) {
      const cityNameLabel = targetCity ? targetCity.charAt(0).toUpperCase() + targetCity.slice(1) : 'our top destinations';
      return {
        text: `I found **${hotels.length} luxury properties** matching your request in ${cityNameLabel}${maxPrice ? ` under ₹${maxPrice.toLocaleString('en-IN')}` : ''}. Here are the highest-rated recommendations:`,
        hotelCards: displayHotels,
      };
    }

    // Fallback general recommendations
    const featuredHotels = HOTELS_DATA.filter((h) => h.featured).slice(0, 3);
    return {
      text: `I couldn't find an exact match for "${userText}". However, here are three of our most celebrated luxury flagship hotels available for immediate booking:`,
      hotelCards: featuredHotels,
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processQuery(currentInput);
      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: 'Just now',
        hotelCards: response.hotelCards,
        bookingCard: response.bookingCard,
        actionType: response.actionType,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white p-4 rounded-full shadow-2xl hover:shadow-amber-900/40 border border-amber-300/40 flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 group"
          aria-label="Open AI Hotel Concierge"
        >
          <div className="relative">
            <Bot size={24} className="text-amber-200" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>
          <div className="hidden sm:block text-left pr-1">
            <span className="block text-[10px] uppercase font-bold tracking-widest text-amber-300">
              Personal Concierge
            </span>
            <span className="block font-luxury text-sm font-bold leading-tight">Ask Aura AI</span>
          </div>
        </button>
      )}

      {/* Floating Interactive Concierge Drawer / Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden ${
            isMinimized
              ? 'bottom-6 right-6 w-80 h-16'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[440px] h-[85vh] sm:h-[620px]'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-amber-900/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white border border-amber-400/30">
                <Sparkles size={20} className="text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-luxury font-bold text-base leading-tight">Aura Concierge</h3>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-amber-300 uppercase tracking-widest font-semibold">
                  Multi-Turn Travel AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                title="Close Concierge"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message History Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-amber-600 text-white rounded-br-xs shadow-md'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {/* Markdown-like formatting helper */}
                      <div className="whitespace-pre-line">
                        {m.text.split('**').map((part, i) =>
                          i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
                        )}
                      </div>

                      {/* Attached Hotel Recommendation Cards */}
                      {m.hotelCards && m.hotelCards.length > 0 && (
                        <div className="mt-3 space-y-2.5">
                          {m.hotelCards.map((hotel) => (
                            <div
                              key={hotel.id}
                              className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 hover:border-amber-400 transition-colors"
                            >
                              <div className="flex gap-2.5">
                                <img
                                  src={hotel.images[0]}
                                  alt={hotel.name}
                                  className="h-16 w-20 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-amber-700 uppercase">
                                      {hotel.category}
                                    </span>
                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                                      ★ {hotel.guestRating}
                                    </span>
                                  </div>
                                  <h4 className="font-luxury font-bold text-slate-900 text-xs truncate mt-0.5">
                                    {hotel.name}
                                  </h4>
                                  <p className="text-[11px] text-slate-700">{hotel.city}</p>
                                  <div className="text-xs font-black text-slate-900 mt-1">
                                    ₹{hotel.pricePerNight.toLocaleString('en-IN')}{' '}
                                    <span className="text-[10px] text-slate-700 font-normal">/ night</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                                <button
                                  onClick={() => onSelectHotel(hotel)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold"
                                >
                                  Details
                                </button>
                                <button
                                  onClick={() => onBookHotel(hotel)}
                                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1"
                                >
                                  <span>Book Now</span>
                                  <ArrowRight size={10} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Attached Booking Summary Card */}
                      {m.bookingCard && (
                        <div className="mt-3 bg-amber-50/80 rounded-xl p-3 border border-amber-200 text-slate-900">
                          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                              Active Stay Pass
                            </span>
                            <span className="font-mono text-xs font-bold">{m.bookingCard.id}</span>
                          </div>
                          <div className="mt-2 text-xs">
                            <div className="font-bold">{m.bookingCard.hotelName}</div>
                            <div className="text-slate-600 text-[11px] mt-0.5">
                              Room {m.bookingCard.roomNumber} ({m.bookingCard.roomType})
                            </div>
                            <div className="mt-1 font-semibold text-slate-800">
                              {m.bookingCard.checkIn} to {m.bookingCard.checkOut}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-slate-700 mt-1 px-1">{m.timestamp}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-fit">
                    <Bot size={14} className="text-amber-600 animate-spin" />
                    <span className="text-xs text-slate-700 font-medium">Aura is curating recommendations...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-600 whitespace-nowrap font-medium transition-colors border border-slate-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Aura anything about hotels, rooms, or trips..."
                  className="flex-1 py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold transition-all shadow-md"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
