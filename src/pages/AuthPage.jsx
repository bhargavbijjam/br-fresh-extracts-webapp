// src/pages/AuthPage.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

const API_URL = 'https://br-fresh-extracts-api.onrender.com/api/auth/';

const AuthPage = () => {
  const { setToken } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(API_URL + 'send-otp/', { phone_number: phone });
      setStep(2);
    } catch (err) {
      setError('Failed to send OTP. Please check the number.');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(API_URL + 'verify-otp/', {
        phone_number: phone,
        otp: otp,
      });

      const { access, refresh } = response.data.tokens;

      localStorage.setItem('refreshToken', refresh);
      setToken(access); 
    } catch (err) {
      setError('Invalid or expired OTP. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        {/* Logo */}
        <div className="flex justify-center items-center space-x-2 mb-6">
          <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 18c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 0a9.004 9.004 0 00-4.5 1.6C5.171 5.072 3 7.828 3 11c0 3.172 2.17 5.928 4.5 6.4.5.087.918.421 1.05.934.132.512.21.974.21 1.366 0 .406-.095.79-.26 1.123" />
          </svg>
          <span className="text-3xl font-bold text-gray-800">BR Fresh Extracts</span>
        </div>

        {/* Form 1: Send OTP */}
        <form onSubmit={handleSendOtp} className={step === 1 ? '' : 'hidden'}>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Sign In or Sign Up</h2>
          <p className="text-center text-sm text-gray-600 mb-6">Enter your phone number to receive an OTP.</p>
          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="e.g. 9087654321"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3.5 rounded-xl text-lg font-semibold shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        </form>

        {/* Form 2: Verify OTP */}
        <form onSubmit={handleVerifyOtp} className={step === 2 ? '' : 'hidden'}>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Verify Your Phone</h2>
          <p className="text-center text-sm text-gray-600 mb-6">Enter the 4-digit code we sent to {phone}.</p>
          <div className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP Code</label>
              <input
                type="text"
                id="otp"
                maxLength="4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-center text-2xl tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3.5 rounded-xl text-lg font-semibold shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
            <button
              type="button"
              onClick={() => { setStep(1); setError(''); }}
              className="w-full text-center text-sm text-gray-600 hover:text-black"
            >
              Back to phone number
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};
export default AuthPage;