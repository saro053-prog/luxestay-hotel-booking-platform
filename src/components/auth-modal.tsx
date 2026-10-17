import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  UserPlus,
  LogIn,
  ArrowRight,
  Globe,
  Compass,
  Award,
  X,
} from 'lucide-react';
import { hotelAuth, DEMO_USERS, User, UserRole } from '@/lib/hotel-auth';

interface AuthModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: (user: User) => void;
  initialTab?: 'login' | 'register' | 'forgot';
  defaultRole?: 'guest' | 'manager' | 'staff' | 'admin';
}

export function AuthModal({ open, isOpen, onClose, onSuccess, initialTab = 'login', defaultRole }: AuthModalProps) {
  const isModalOpen = isOpen !== undefined ? isOpen : open ?? false;
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Register multi-step state
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountry, setRegCountry] = useState('India');
  const [regRole, setRegRole] = useState<UserRole>('guest');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);

  if (!isModalOpen) return null;

  const switchTab = (t: 'login' | 'register' | 'forgot') => {
    setTab(t);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const user = await hotelAuth.login(loginEmail, loginPassword);
      setSuccessMessage(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess(user);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password entry.');
      return;
    }

    setLoading(true);
    try {
      const user = await hotelAuth.register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        country: regCountry,
        role: regRole,
        password: regPassword,
      });

      setSuccessMessage(`LuxeStay member account created for ${user.name}!`);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess(user);
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (acc: (typeof DEMO_USERS)[0]) => {
    setTab('login');
    setLoginEmail(acc.email);
    setLoginPassword(acc.password);
    setErrorMessage('');
    setSuccessMessage(`Loaded ${acc.title}`);
  };

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { label: 'Empty', color: 'bg-slate-200', percent: 0 };
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) score += 25;

    if (score <= 25) return { label: 'Weak', color: 'bg-red-500', percent: 25 };
    if (score <= 50) return { label: 'Fair', color: 'bg-amber-500', percent: 50 };
    if (score <= 75) return { label: 'Good', color: 'bg-emerald-500', percent: 75 };
    return { label: 'Strong (Enterprise Protected)', color: 'bg-emerald-600', percent: 100 };
  };

  const strength = calculatePasswordStrength(regPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
        >
          <X size={16} />
        </button>

        {/* ===================================================================== */}
        {/* LEFT PANE: BRANDING, TRAVEL PERKS & VERIFIED ACCOUNTS                 */}
        {/* ===================================================================== */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white p-6 sm:p-7 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={16} />
              <span>LuxeStay Hospitality Club</span>
            </div>
            <h2 className="font-luxury text-2xl font-bold tracking-tight text-white mb-2">
              Bespoke Luxury Stays & Escapes
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Unlock exclusive member privileges, VIP room upgrades, zero cancellation penalties, and 24/7 AI travel concierge.
            </p>

            {/* Scale badges */}
            <div className="grid grid-cols-2 gap-2 text-left mb-6">
              <div className="bg-white/10 rounded-xl p-2.5 border border-white/10 backdrop-blur-xs">
                <div className="text-base font-bold text-amber-300">100+</div>
                <div className="text-[10px] text-slate-300">Luxury Hotels</div>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 border border-white/10 backdrop-blur-xs">
                <div className="text-base font-bold text-amber-300">15+</div>
                <div className="text-[10px] text-slate-300">Global Destinations</div>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 border border-white/10 backdrop-blur-xs">
                <div className="text-base font-bold text-amber-300">24/7</div>
                <div className="text-[10px] text-slate-300">Travel Concierge</div>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 border border-white/10 backdrop-blur-xs">
                <div className="text-base font-bold text-amber-300">5-Star</div>
                <div className="text-[10px] text-slate-300">Verified Quality</div>
              </div>
            </div>

            {/* 1-Click Demo Accounts */}
            <div>
              <div className="text-[11px] font-semibold text-amber-200 mb-2 flex items-center justify-between">
                <span>⚡ 1-Click Role Logins:</span>
                <span className="text-[10px] text-amber-300">Password: Password@123</span>
              </div>
              <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                {DEMO_USERS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => fillDemoAccount(acc)}
                    className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition flex items-center justify-between text-xs group"
                  >
                    <div>
                      <div className="font-semibold text-white group-hover:text-amber-200">
                        {acc.name}
                      </div>
                      <div className="text-[10px] text-slate-300/80 truncate max-w-[180px]">
                        {acc.title}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {acc.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 text-[10px] text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-amber-400" />
              PCI-DSS Secure Booking
            </span>
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT PANE: SIGN IN & REGISTRATION FORMS                             */}
        {/* ===================================================================== */}
        <div className="w-full md:w-7/12 p-6 sm:p-7 overflow-y-auto max-h-[92vh] flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-1">
                <Lock size={15} />
                Secure Travel Authentication
              </div>
              <h3 className="font-luxury text-2xl font-bold text-slate-900">
                {tab === 'login' && 'Sign In to LuxeStay'}
                {tab === 'register' && 'Join LuxeStay Rewards'}
                {tab === 'forgot' && 'Reset Account Password'}
              </h3>
              <p className="text-xs text-slate-500">
                {tab === 'login' && 'Guests access trips & rewards; managers access their property dashboard.'}
                {tab === 'register' && 'Earn points with every completed stay and enjoy personalized travel rates.'}
                {tab === 'forgot' && 'Enter your registered email address to receive password recovery code.'}
              </p>
            </div>

            {/* Tab switchers */}
            <div className="flex border-b border-slate-200 mb-4">
              <button
                type="button"
                className={`pb-2.5 px-3 text-xs font-semibold transition-colors border-b-2 ${
                  tab === 'login'
                    ? 'border-amber-600 text-amber-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => switchTab('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`pb-2.5 px-3 text-xs font-semibold transition-colors border-b-2 ${
                  tab === 'register'
                    ? 'border-amber-600 text-amber-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => switchTab('register')}
              >
                Create Account
              </button>
              <button
                type="button"
                className={`pb-2.5 px-3 text-xs font-semibold transition-colors border-b-2 ${
                  tab === 'forgot'
                    ? 'border-amber-600 text-amber-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => switchTab('forgot')}
              >
                Password Recovery
              </button>
            </div>

            {/* Alerts */}
            {errorMessage && (
              <div className="p-3 mb-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 mb-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {tab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. arun.traveler@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => switchTab('forgot')}
                      className="text-[11px] text-amber-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter account password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <LogIn size={15} />
                  {loading ? 'Verifying Member...' : 'Sign In to Account'}
                </button>
              </form>
            )}

            {/* 2. REGISTRATION FORM (MULTI-STEP) */}
            {tab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                {regStep === 1 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Full Legal Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Maya Krishnan"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98401 23456"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Email Address (LuxeStay ID)
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="maya.k@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Country of Residence
                        </label>
                        <input
                          type="text"
                          value={regCountry}
                          onChange={(e) => setRegCountry(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Account Profile
                        </label>
                        <select
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value as UserRole)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none bg-white"
                        >
                          <option value="guest">Guest Traveler (Rewards)</option>
                          <option value="manager">Hotel General Manager</option>
                          <option value="staff">Front Desk & Concierge</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!regName || !regEmail || !regPhone) {
                          setErrorMessage('Please fill in your name, email, and phone number.');
                          return;
                        }
                        setErrorMessage('');
                        setRegStep(2);
                      }}
                      className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                    >
                      Next: Password & Preferences
                      <ArrowRight size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Create Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 6 characters, mixed alphanumeric"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Password Strength indicator */}
                    {regPassword && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Password Strength:</span>
                          <span className="font-semibold text-slate-800">{strength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${strength.color} transition-all duration-300`}
                            style={{ width: `${strength.percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter password to verify"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setRegStep(1)}
                        className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                      >
                        <UserPlus size={14} />
                        {loading ? 'Creating Member File...' : 'Complete Registration'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {/* 3. FORGOT PASSWORD FORM */}
            {tab === 'forgot' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (resetStep === 1) {
                    const res = await hotelAuth.forgotPassword(forgotEmail);
                    setResetToken(res.token);
                    setResetStep(2);
                    setSuccessMessage(`Recovery token: ${res.token}. Please enter your new password.`);
                  } else {
                    setSuccessMessage('Password reset successfully! Please sign in with your new password.');
                    setTimeout(() => switchTab('login'), 1200);
                  }
                }}
                className="space-y-3.5 text-xs"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter the email associated with your account"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {resetStep === 2 && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        6-Digit Security Token
                      </label>
                      <input
                        type="text"
                        required
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        New Secure Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                >
                  <KeyRound size={15} />
                  {resetStep === 1 ? 'Generate Reset Code' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 mt-4 text-[11px] text-slate-500 text-center">
            {tab === 'login' ? (
              <span>
                Not a member yet?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('register')}
                  className="text-amber-800 font-bold hover:underline"
                >
                  Join LuxeStay Rewards
                </button>
              </span>
            ) : (
              <span>
                Already have a member account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="text-amber-800 font-bold hover:underline"
                >
                  Sign In to Account
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
