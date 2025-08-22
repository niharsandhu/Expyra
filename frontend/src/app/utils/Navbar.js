'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Bell, Plus, Menu, X, Brain, Home, Package, TrendingUp, Shield, LogIn, UserPlus, User, LogOut, Upload, Camera } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get user data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userData && token) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setShowUserMenu(false);
      window.location.href = '/login';
    }
  };

  // Handle file selection and upload
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    await uploadImage(file);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload image to scan API
  const uploadImage = async (file) => {
    setIsScanning(true);
    setShowAddProduct(false);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to scan products');
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      // Make API call
      const response = await axios.post('http://localhost:3000/api/products/scan', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle success
      if (response.data) {
        alert(`Product scanned successfully! 
Product: ${response.data.product.name}
Brand: ${response.data.product.brand}
Type: ${response.data.product.productType}
Expiry: ${new Date(response.data.userProduct.expiryDate).toLocaleDateString()}`);
        
        // Optionally redirect to products page or refresh data
        // window.location.href = '/products';
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        handleLogout();
      } else if (error.response?.data?.error) {
        alert(`Scan failed: ${error.response.data.error}`);
      } else {
        alert('Failed to scan product. Please try again.');
      }
    } finally {
      setIsScanning(false);
    }
  };

  // Trigger file input
  const handleAIScanClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
      if (showAddProduct && !event.target.closest('.add-product-menu')) {
        setShowAddProduct(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showAddProduct]);

  const navigationItems = [
    { name: 'Overview', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Intelligence', href: '/intelligence', icon: Brain },
    { name: 'Enterprise', href: '/enterprise', icon: Shield }
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/10" 
      style={{ transform: `translateY(${scrollY > 100 ? -100 : 0}px)` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-gray-900/30 to-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">

          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                    isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <div className={`absolute inset-0 rounded-lg backdrop-blur-xl transition-all duration-500 ${
                    isActive 
                      ? 'bg-gradient-to-r from-white/10 via-white/15 to-white/10 border border-white/20' 
                      : 'bg-gradient-to-r from-white/0 via-white/0 to-white/0 group-hover:from-white/5 group-hover:via-white/10 group-hover:to-white/5 border border-transparent group-hover:border-white/10'
                  }`}></div>
                  <div className="relative flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions (notifications, add button, user, mobile menu) */}
          <div className="flex items-center space-x-3">
            
            {/* Notifications Button */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-400/10 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-all duration-500"></div>
              <button className="relative p-2 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl rounded-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300 group-hover:scale-105">
                <Bell className="w-4 h-4 text-white" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </button>
            </div>

            {user ? (
              <>
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Add Product Button */}
                <div className="relative add-product-menu">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-all duration-500"></div>
                    <button 
                      onClick={() => setShowAddProduct(!showAddProduct)}
                      disabled={isScanning}
                      className={`relative backdrop-blur-xl px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 group-hover:scale-105 shadow-xl flex items-center space-x-2 border ${
                        isScanning 
                          ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed border-gray-400/20' 
                          : 'bg-gradient-to-r from-white/90 to-white/80 text-black hover:from-white hover:to-white border-white/20'
                      }`}
                    >
                      {isScanning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin"></div>
                          <span>Scanning...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                          <span>Add Product</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Add Product Dropdown */}
                  {showAddProduct && !isScanning && (
                    <div className="absolute top-12 right-0 mt-2 w-56 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-2">
                        <Link
                          href="/add-product"
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                          onClick={() => setShowAddProduct(false)}
                        >
                          <Package className="w-4 h-4" />
                          <span>Manual Entry</span>
                        </Link>
                        <button
                          onClick={handleAIScanClick}
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 w-full text-left"
                        >
                          <Camera className="w-4 h-4" />
                          <span>AI Scan Image</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl rounded-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/80 to-blue-600/60 rounded-lg flex items-center justify-center border border-white/20">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-sm font-medium text-white truncate max-w-24">
                        {user.name || user.username || 'User'}
                      </span>
                      <span className="text-xs text-gray-400 truncate max-w-24">
                        {user.email || user.phone || ''}
                      </span>
                    </div>
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute top-12 right-0 mt-2 w-64 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/80 to-blue-600/60 rounded-lg flex items-center justify-center border border-white/20">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {user.name || user.username || 'User'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {user.email || user.phone || 'No contact info'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-all duration-300 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Login/Signup Buttons */
              <>
                <Link
                  href="/login"
                  className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl rounded-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:scale-105"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-all duration-500"></div>
                  <Link
                    href="/signup"
                    className="relative bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-xl text-black px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 group-hover:scale-105 shadow-xl flex items-center space-x-2 border border-white/20 hover:from-white hover:to-white"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 backdrop-blur-xl border border-white/0 hover:border-white/10 transition-all duration-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 backdrop-blur-xl">
            <div className="flex flex-col space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg backdrop-blur-xl ${
                      isActive 
                        ? 'text-white bg-white/10 border border-white/20' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile User Section */}
              <div className="pt-4 border-t border-white/10">
                {user ? (
                  <>
                    <div className="px-4 py-3 mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500/80 to-blue-600/60 rounded-lg flex items-center justify-center border border-white/20">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {user.name || user.username || 'User'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {user.email || user.phone || 'No contact info'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      href="/add-product"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleAIScanClick();
                        setMobileMenuOpen(false);
                      }}
                      disabled={isScanning}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 w-full text-left ${
                        isScanning 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isScanning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin"></div>
                          <span>Scanning...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4" />
                          <span>AI Scan Image</span>
                        </>
                      )}
                    </button>
                    
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-all duration-300 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                    
                    <Link
                      href="/signup"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg transition-all duration-300 hover:from-white/20 hover:to-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;