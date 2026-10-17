// ============================================================================
// LuxeStay — Hospitality Authentication & Role-Based Access Control (RBAC)
// ============================================================================

export type UserRole = 'guest' | 'manager' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  country?: string;
  loyaltyTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond VIP';
  managedHotelId?: string;
  token?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const STORAGE_KEY_USER = 'luxestay_auth_user';
const STORAGE_KEY_TOKEN = 'luxestay_auth_token';
const STORAGE_KEY_CUSTOM_USERS = 'luxestay_custom_users';

// Pre-seeded verified demo accounts for 1-click presentation testing
export const DEMO_USERS: (User & { password: string; title: string; hotelName?: string })[] = [
  {
    id: 'USR-GUEST-1',
    name: 'Arun Kumar',
    email: 'arun.traveler@example.com',
    password: 'Password@123',
    role: 'guest',
    phone: '+91 98401 23456',
    country: 'India',
    loyaltyTier: 'Diamond VIP',
    title: 'Frequent Traveler (Diamond VIP Member)',
  },
  {
    id: 'USR-MGR-1',
    name: 'Vikramaditya Singhania',
    email: 'manager.mumbai@luxestay.com',
    password: 'Password@123',
    role: 'manager',
    phone: '+91 98200 11223',
    country: 'India',
    managedHotelId: 'HTL-1001',
    title: 'General Manager — The Grand Mumbai Palace',
    hotelName: 'The Grand Mumbai Palace & Spa',
  },
  {
    id: 'USR-STAFF-1',
    name: 'Sneha Rao',
    email: 'frontdesk@luxestay.com',
    password: 'Password@123',
    role: 'staff',
    phone: '+91 98200 44556',
    country: 'India',
    managedHotelId: 'HTL-1001',
    title: 'Front Office Lead & Concierge',
    hotelName: 'The Grand Mumbai Palace & Spa',
  },
  {
    id: 'USR-ADM-1',
    name: 'Sophia Sterling',
    email: 'admin@luxestay.com',
    password: 'Password@123',
    role: 'admin',
    phone: '+1 (415) 880-9921',
    country: 'United States',
    title: 'Global Platform Executive Administrator',
  },
];

type AuthListener = (state: AuthState) => void;

class HotelAuthService {
  private listeners: Set<AuthListener> = new Set();
  private currentUser: User | null = null;

  constructor() {
    this.loadSession();
  }

  private memoryStorage: Record<string, string> = {};

  private getItem(key: string): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch {
        return this.memoryStorage[key] || null;
      }
    }
    return this.memoryStorage[key] || null;
  }

  private setItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, value);
        return;
      } catch {}
    }
    this.memoryStorage[key] = value;
  }

  private removeItem(key: string): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(key);
        return;
      } catch {}
    }
    delete this.memoryStorage[key];
  }

  private loadSession() {
    try {
      const rawUser = this.getItem(STORAGE_KEY_USER);
      if (rawUser) {
        this.currentUser = JSON.parse(rawUser);
      }
    } catch {
      this.currentUser = null;
    }
  }

  private persistSession(user: User | null, token?: string) {
    if (user) {
      this.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      if (token) this.setItem(STORAGE_KEY_TOKEN, token);
    } else {
      this.removeItem(STORAGE_KEY_USER);
      this.removeItem(STORAGE_KEY_TOKEN);
    }
    this.currentUser = user;
    this.notify();
  }

  private notify() {
    const state: AuthState = {
      user: this.currentUser,
      isAuthenticated: !!this.currentUser,
    };
    this.listeners.forEach((listener) => listener(state));
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    listener({
      user: this.currentUser,
      isAuthenticated: !!this.currentUser,
    });
    return () => this.listeners.delete(listener);
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getUser(): User | null {
    return this.currentUser;
  }

  public async loginAsDemo(role: UserRole): Promise<User> {
    const matched = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    return this.login(matched.email, matched.password);
  }

  public async login(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Attempt backend REST call
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const user: User = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            phone: data.user.phone,
            loyaltyTier: data.user.loyaltyTier || 'Gold',
            managedHotelId: data.user.managedHotelId,
            token: data.token,
          };
          this.persistSession(user, data.token);
          return user;
        }
      }
    } catch {
      // Backend offline, fallback to local accounts
    }

    // 2. Verified Local Demo Accounts
    const matchedDemo = DEMO_USERS.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (matchedDemo) {
      if (password !== matchedDemo.password) {
        throw new Error('Incorrect password. Please verify your credentials.');
      }
      const user: User = {
        id: matchedDemo.id,
        name: matchedDemo.name,
        email: matchedDemo.email,
        role: matchedDemo.role,
        phone: matchedDemo.phone,
        country: matchedDemo.country,
        loyaltyTier: matchedDemo.loyaltyTier,
        managedHotelId: matchedDemo.managedHotelId,
        token: `jwt-luxestay-${Date.now()}`,
      };
      this.persistSession(user, user.token);
      return user;
    }

    // 3. Registered Custom Users
    const customUsersRaw = this.getItem(STORAGE_KEY_CUSTOM_USERS);
    if (customUsersRaw) {
      try {
        const customUsers = JSON.parse(customUsersRaw);
        const found = customUsers.find((u: any) => u.email.toLowerCase() === normalizedEmail);
        if (found) {
          if (found.password !== password) {
            throw new Error('Incorrect password entered.');
          }
          const user: User = {
            id: found.id,
            name: found.name,
            email: found.email,
            role: found.role || 'guest',
            phone: found.phone,
            country: found.country || 'India',
            loyaltyTier: found.loyaltyTier || 'Silver',
            token: `jwt-custom-${Date.now()}`,
          };
          this.persistSession(user, user.token);
          return user;
        }
      } catch {}
    }

    throw new Error('No LuxeStay account found with this email. Please check your spelling or register a new account.');
  }

  public async register(payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country?: string;
    role?: UserRole;
  }): Promise<User> {
    const normalizedEmail = payload.email.trim().toLowerCase();

    // Prevent duplicate demo accounts
    if (DEMO_USERS.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    // Check custom users
    const customUsersRaw = this.getItem(STORAGE_KEY_CUSTOM_USERS);
    let customUsers = customUsersRaw ? JSON.parse(customUsersRaw) : [];
    if (customUsers.some((u: any) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    // Attempt backend registration
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, email: normalizedEmail }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const user: User = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || 'guest',
            phone: data.user.phone,
            loyaltyTier: 'Silver',
            token: data.token,
          };
          this.persistSession(user, data.token);
          return user;
        }
      }
    } catch {}

    const newUser: User & { password: string } = {
      id: `USR-${Date.now().toString().slice(-5)}`,
      name: payload.name.trim(),
      email: normalizedEmail,
      phone: payload.phone,
      country: payload.country || 'India',
      role: payload.role || 'guest',
      loyaltyTier: 'Silver',
      password: payload.password,
      token: `jwt-reg-${Date.now()}`,
    };

    customUsers.push(newUser);
    this.setItem(STORAGE_KEY_CUSTOM_USERS, JSON.stringify(customUsers));

    const safeUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      country: newUser.country,
      role: newUser.role,
      loyaltyTier: newUser.loyaltyTier,
      token: newUser.token,
    };
    this.persistSession(safeUser, safeUser.token);
    return safeUser;
  }

  public logout(): void {
    this.persistSession(null);
  }

  public async forgotPassword(email: string): Promise<{ token: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return { token: code };
  }

  public async resetPassword(email: string, token: string, newPass: string): Promise<boolean> {
    return true;
  }
}

export const hotelAuth = new HotelAuthService();
