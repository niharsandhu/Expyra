'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Phone, LogIn, UserPlus, ArrowRight, AlertCircle, Loader, CheckCircle, Mail } from 'lucide-react';
import axios from 'axios';

const AuthPages = () => {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'signup'
  const router = useRouter();

  const API_BASE_URL = 'http://localhost:3000/api';

  // Login form state
  const [loginData, setLoginData] = useState({
    phone: '',
    email: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        phone: loginData.phone || undefined,
        email: loginData.email || undefined
      });

      const { token, user } = response.data;
      setSuccess('Login successful!');

      // Store token & user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect after short delay
      setTimeout(() => {
        router.push('/');  // redirect to home/dashboard
      }, 1200);

    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.code === 'ECONNREFUSED') {
        setError('Unable to connect to server. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        name: signupData.name,
        phone: signupData.phone,
        email: signupData.email
      });

      setSuccess('Account created successfully! Please login to continue.');

      setSignupData({
        name: '',
        phone: '',
        email: ''
      });

      setTimeout(() => {
        setCurrentPage('login');
        setSuccess('');
      }, 2000);

    } catch (error) {
      console.error('Signup error:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.code === 'ECONNREFUSED') {
        setError('Unable to connect to server. Please try again later.');
      } else {
        setError('Account creation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-[system-ui,-apple-system,sans-serif]">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-10 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gray-400/10 via-gray-300/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '10s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s', animationDuration: '12s' }}></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Ultra Professional Navigation with Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-gray-900/30 to-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            
            {/* Premium Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-blue-600/20 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-all duration-500"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-110 transition-all duration-500">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent tracking-tight">
                  Expyra
                </span>
                <span className="text-[10px] text-gray-400 font-medium tracking-[0.15em] uppercase">AI Platform</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => setCurrentPage('login')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    currentPage === 'login'
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentPage('signup')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    currentPage === 'signup'
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="pt-24 pb-20 px-6 lg:px-8 min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full">
            
            {/* Login Form */}
            {currentPage === 'login' && (
              <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl hover:border-blue-300/30 hover:bg-white/8 transition-all duration-700">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl border border-blue-400/20">
                    <LogIn className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-gray-400">Sign in to your Expyra account</p>
                </div>

                {/* Error and Success Messages */}
                {(error || success) && (
                  <div className={`mb-6 p-4 rounded-lg border backdrop-blur-xl ${
                    error 
                      ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                      : 'bg-green-500/10 border-green-500/30 text-green-300'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {error ? (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium">
                        {error || success}
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                        placeholder="Enter your email address"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={loginData.phone}
                        onChange={(e) => setLoginData({...loginData, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                        placeholder="Enter your phone number"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-2 border-white/20 bg-white/5 text-blue-500 focus:border-blue-400/50 focus:ring-blue-400/20 focus:ring-2 transition-all duration-300" 
                      />
                      <span className="ml-2 text-sm text-gray-300">Remember me</span>
                    </label>
                    <button 
                      type="button" 
                      className="text-sm text-blue-300 hover:text-blue-200 transition-colors font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-500/10 rounded-xl blur-xl opacity-50 group-hover:opacity-80 transition-all duration-500"></div>
                    <button
                      type="submit"
                      disabled={loading || (!loginData.email && !loginData.phone)}
                      className="relative w-full bg-gradient-to-r from-white to-gray-100 text-black py-3 rounded-xl font-semibold transition-all duration-300 group-hover:scale-105 shadow-xl border border-white/20 hover:from-white hover:to-white flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <span className="text-gray-400">Don't have an account? </span>
                    <button 
                      type="button"
                      onClick={() => {
                        setCurrentPage('signup');
                        setError('');
                        setSuccess('');
                      }}
                      className="text-blue-300 hover:text-blue-200 transition-colors font-medium"
                      disabled={loading}
                    >
                      Sign up
                    </button>
                  </div>
                </form>

                {/* Features */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 bg-blue-500/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-blue-400/30">
                        <ShieldCheck className="w-4 h-4 text-blue-300" />
                      </div>
                      <span className="text-xs text-gray-400">Secure Login</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 bg-blue-500/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-blue-400/30">
                        <User className="w-4 h-4 text-blue-300" />
                      </div>
                      <span className="text-xs text-gray-400">AI Powered</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Signup Form */}
            {currentPage === 'signup' && (
              <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl hover:border-blue-300/30 hover:bg-white/8 transition-all duration-700">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl border border-blue-400/20">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2">
                    Create Account
                  </h1>
                  <p className="text-gray-400">Join Expyra and protect your inventory</p>
                </div>

                {/* Error and Success Messages */}
                {(error || success) && (
                  <div className={`mb-6 p-4 rounded-lg border backdrop-blur-xl ${
                    error 
                      ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                      : 'bg-green-500/10 border-green-500/30 text-green-300'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {error ? (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium">
                        {error || success}
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSignupSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                        placeholder="Enter your full name"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                        placeholder="Enter your email address"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={signupData.phone}
                        onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                        placeholder="Enter your phone number"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-500/10 rounded-xl blur-xl opacity-50 group-hover:opacity-80 transition-all duration-500"></div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative w-full bg-gradient-to-r from-white to-gray-100 text-black py-3 rounded-xl font-semibold transition-all duration-300 group-hover:scale-105 shadow-xl border border-white/20 hover:from-white hover:to-white flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <span className="text-gray-400">Already have an account? </span>
                    <button 
                      type="button"
                      onClick={() => {
                        setCurrentPage('login');
                        setError('');
                        setSuccess('');
                      }}
                      className="text-blue-300 hover:text-blue-200 transition-colors font-medium"
                      disabled={loading}
                    >
                      Sign in
                    </button>
                  </div>
                </form>

                {/* Benefits */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-medium text-white mb-4 text-center">What you get with Expyra</h4>
                  <div className="space-y-3">
                    {[
                      { icon: User, text: 'AI-powered expiry tracking' },
                      { icon: ShieldCheck, text: 'Enterprise-grade security' },
                      { icon: CheckCircle, text: 'Smart notifications' }
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-500/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-blue-400/30 flex-shrink-0">
                          <benefit.icon className="w-3 h-3 text-blue-300" />
                        </div>
                        <span className="text-xs text-gray-300">{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Social Login Options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="group w-full inline-flex justify-center items-center py-3 px-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2 text-sm font-medium text-white">Google</span>
                </button>

                <button className="group w-full inline-flex justify-center items-center py-3 px-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="ml-2 text-sm font-medium text-white">Apple</span>
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>SOC 2 Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Custom checkbox styling */
        input[type="checkbox"]:checked {
          background-color: rgb(59 130 246);
          border-color: rgb(59 130 246);
        }

        /* Focus ring enhancement */
        input:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Form validation styles */
        input:invalid {
          border-color: rgba(239, 68, 68, 0.3);
        }

        input:valid {
          border-color: rgba(34, 197, 94, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AuthPages;