import { describe, it, expect, beforeEach } from 'vitest';
import { hotelAuth, DEMO_USERS } from '../lib/hotel-auth';

describe('LuxeStay Authentication & RBAC Service', () => {
  beforeEach(() => {
    hotelAuth.logout();
  });

  it('should have 4 pre-seeded 1-click verified demo accounts', () => {
    expect(DEMO_USERS.length).toBe(4);
    const roles = DEMO_USERS.map((u) => u.role);
    expect(roles).toContain('guest');
    expect(roles).toContain('manager');
    expect(roles).toContain('staff');
    expect(roles).toContain('admin');
  });

  it('should authenticate demo guest with Diamond VIP tier', async () => {
    const user = await hotelAuth.loginAsDemo('guest');
    expect(user.role).toBe('guest');
    expect(user.email).toBe('arun.traveler@example.com');
    expect(user.loyaltyTier).toBe('Diamond VIP');
  });

  it('should authenticate demo admin', async () => {
    const user = await hotelAuth.loginAsDemo('admin');
    expect(user.role).toBe('admin');
    expect(user.name).toBe('Sophia Sterling');
  });

  it('should authenticate demo manager with managed hotel ID', async () => {
    const user = await hotelAuth.loginAsDemo('manager');
    expect(user.role).toBe('manager');
    expect(user.managedHotelId).toBe('HTL-1001');
  });

  it('should handle registration of a new traveler', async () => {
    const newUser = await hotelAuth.register({
      name: 'Rohan Kapoor',
      email: 'rohan.kapoor@example.com',
      password: 'Password@123',
      phone: '+91 99887 76655',
      country: 'India',
      role: 'guest',
    });
    expect(newUser.email).toBe('rohan.kapoor@example.com');
    expect(newUser.name).toBe('Rohan Kapoor');
    expect(hotelAuth.getUser()?.email).toBe('rohan.kapoor@example.com');
  });

  it('should clear session upon logout', async () => {
    await hotelAuth.loginAsDemo('guest');
    expect(hotelAuth.getUser()).not.toBeNull();
    hotelAuth.logout();
    expect(hotelAuth.getUser()).toBeNull();
  });
});
