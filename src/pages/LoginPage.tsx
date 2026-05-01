import { useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup' | 'phone'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleSendOTP = async () => {
    if (!phone) return alert('Enter phone number!');
    setLoading(true);
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      window.confirmationResult = confirmation;
      setOtpSent(true);
      alert('OTP sent!');
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp) return alert('Enter OTP!');
    setLoading(true);
    try {
      await window.confirmationResult.confirm(otp);
      navigate('/');
    } catch (err: any) {
      alert('Wrong OTP!');
    }
    setLoading(false);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-black mb-2 tracking-tight">
          {mode === 'signup' ? 'Create Account' : mode === 'phone' ? 'Phone Login' : 'Welcome Back'}
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          {mode === 'signup' ? 'Join Aaru Store' : 'Sign in to continue'}
        </p>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-2xl">
          {[
            { id: 'login', label: 'Login' },
            { id: 'signup', label: 'Sign Up' },
            { id: 'phone', label: 'Phone' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setMode(tab.id as any)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
                mode === tab.id ? 'bg-white shadow text-black' : 'text-gray-400'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Email/Password Form */}
        {mode !== 'phone' && (
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email Address" required
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-black transition" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password" required
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-black transition" />
            <button type="submit" disabled={loading}
              className="w-full bg-black text-white font-black py-4 rounded-full hover:bg-gray-800 transition disabled:opacity-50">
              {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Login'}
            </button>
          </form>
        )}

        {/* Phone Form */}
        {mode === 'phone' && (
          <div className="flex flex-col gap-4">
            <div id="recaptcha-container"></div>
            {!otpSent ? (
              <>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210" 
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-black transition" />
                <button onClick={handleSendOTP} disabled={loading}
                  className="w-full bg-black text-white font-black py-4 rounded-full hover:bg-gray-800 transition disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-black transition" />
                <button onClick={handleVerifyOTP} disabled={loading}
                  className="w-full bg-black text-white font-black py-4 rounded-full hover:bg-gray-800 transition disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button onClick={() => setOtpSent(false)}
                  className="text-sm text-gray-400 hover:text-black transition font-bold">
                  Change number
                </button>
              </>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-[1px] bg-gray-100"></div>
          <span className="text-xs text-gray-400 font-bold">OR</span>
          <div className="flex-1 h-[1px] bg-gray-100"></div>
        </div>

        {/* Google Login */}
        <button onClick={handleGoogleLogin} disabled={loading}
          className="w-full border-2 border-gray-200 font-bold py-4 rounded-full hover:border-black transition flex items-center justify-center gap-3 disabled:opacity-50">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

      </motion.div>
    </div>
  );
}