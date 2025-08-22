
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Upload, Calendar, ShieldCheck, Pill, Apple, Camera, Plus, Bell, Clock, Star, ChevronRight, Zap, Shield, Brain, Menu, X, ArrowRight, Play, CheckCircle, TrendingUp, Search, Filter, Grid, List, SortAsc, SortDesc, Eye, Edit, Trash2, ChevronDown, User, Phone, Lock, LogIn, UserPlus, Home, Package } from 'lucide-react';

const ProductsPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Products page states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('expiryDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Base API URL
  const API_BASE_URL =  'http://localhost:3000/api';

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to get token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Function to calculate days left until expiry
  const calculateDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to determine category based on product name/brand
  const determineCategory = (name, brand) => {
    const nameAndBrand = (name + ' ' + (brand || '')).toLowerCase();
    
    if (nameAndBrand.includes('paracetamol') || 
        nameAndBrand.includes('ibuprofen') || 
        nameAndBrand.includes('medicine') ||
        nameAndBrand.includes('pharma') ||
        nameAndBrand.includes('tablet') ||
        nameAndBrand.includes('capsule') ||
        nameAndBrand.includes('mg')) {
      return 'medicine';
    }
    
    if (nameAndBrand.includes('milk') || 
        nameAndBrand.includes('yogurt') || 
        nameAndBrand.includes('cheese') ||
        nameAndBrand.includes('dairy')) {
      return 'dairy';
    }
    
    if (nameAndBrand.includes('fresh') || 
        nameAndBrand.includes('salmon') || 
        nameAndBrand.includes('banana') ||
        nameAndBrand.includes('spinach') ||
        nameAndBrand.includes('egg')) {
      return 'fresh';
    }
    
    // Default to pantry for other items
    return 'pantry';
  };

  // Fetch products from API with authentication
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication required. Please login again.');
        // Redirect to login page or show login modal
        // window.location.href = '/login';
        return;
      }

      // Make authenticated request to get user products
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        const apiProducts = response.data.products.map((product, index) => {
          const daysLeft = calculateDaysLeft(product.expiryDate);
          const category = determineCategory(product.name, product.brand);
          
          return {
            id: index + 1,
            name: product.name || 'Unknown Product',
            brand: product.brand || 'Unknown Brand',
            category: category,
            expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : new Date().toISOString().split('T')[0],
            daysLeft: daysLeft,
            quantity: 1, // Always set to 1 as requested
            urgent: daysLeft <= 7, // Consider urgent if 7 days or less
            image: product.imageUrl || '/api/placeholder/150/150',
            addedDate: new Date().toISOString().split('T')[0] // Current date as added date
          };
        });
        
        setProducts(apiProducts);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login
        // window.location.href = '/login';
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view this data.');
      } else if (err.code === 'ECONNREFUSED') {
        setError('Unable to connect to server. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'Failed to load products. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', name: 'All Items', count: products.length },
    { id: 'medicine', name: 'Medicine', count: products.filter(p => p.category === 'medicine').length },
    { id: 'dairy', name: 'Dairy', count: products.filter(p => p.category === 'dairy').length },
    { id: 'fresh', name: 'Fresh Food', count: products.filter(p => p.category === 'fresh').length },
    { id: 'pantry', name: 'Pantry', count: products.filter(p => p.category === 'pantry').length }
  ];

  const sortOptions = [
    { id: 'expiryDate', name: 'Expiry Date' },
    { id: 'daysLeft', name: 'Days Left' },
    { id: 'addedDate', name: 'Date Added' },
    { id: 'quantity', name: 'Quantity' }
  ];

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'expiryDate' || sortBy === 'addedDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });



  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Products</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-[system-ui,-apple-system,sans-serif]">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-10 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gray-400/10 via-gray-300/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '10s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s', animationDuration: '12s' }}></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
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

      {/* Products Page Content */}
      <div className="relative z-10">
        <div className="pt-24 pb-20 px-6 lg:px-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight mb-3">
                    All Products
                  </h1>
                  <p className="text-gray-400 text-lg font-light">
                    Manage and track your inventory with AI-powered intelligence
                  </p>
                  {error && (
                    <div className="mt-2 text-red-400 text-sm bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2">
                      {error}
                    </div>
                  )}
                </div>
                
              
              </div>
            </div>

            {/* Filters and Search */}
            <div className="mb-8">
              <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-300/30 hover:bg-white/8 transition-all duration-700 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-xl"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="relative">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-xl appearance-none cursor-pointer"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id} className="bg-gray-900">
                          {category.name} ({category.count})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Sort By */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-xl appearance-none cursor-pointer"
                    >
                      {sortOptions.map(option => (
                        <option key={option.id} value={option.id} className="bg-gray-900">
                          Sort by {option.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Controls */}
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-lg p-1">
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className={`p-2 rounded-md transition-all duration-300 ${
                          sortOrder === 'asc' 
                            ? 'bg-white/10 text-white border border-white/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all duration-300 ${
                          viewMode === 'grid' 
                            ? 'bg-white/10 text-white border border-white/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all duration-300 ${
                          viewMode === 'list' 
                            ? 'bg-white/10 text-white border border-white/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              // Loading State
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-400/10 backdrop-blur-xl rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl border border-blue-400/20 animate-pulse">
                  <Package className="w-12 h-12 text-blue-400 animate-bounce" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Loading products...</h3>
                <p className="text-gray-400">Please wait while we fetch your inventory</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                {filteredAndSortedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`group backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl hover:border-blue-300/30 hover:bg-white/8 transition-all duration-500 hover:scale-105 shadow-xl ${
                      viewMode === 'list' ? 'p-4' : 'p-6'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="relative mb-4 overflow-hidden rounded-xl">
                          {product.image && !product.image.includes('unsplash.com') && (
                            <Image
                              src={product.image} 
                              width={400} 
                              height={192}
                              alt={product.name}
                              className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                              priority={index < 4} // Priority loading for first 4 images
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                          <div className="absolute top-3 right-3">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-xl border ${
                              product.urgent 
                                ? 'bg-red-500/20 border-red-400/30 text-red-200' 
                                : 'bg-blue-500/20 border-blue-400/30 text-blue-200'
                            }`}>
                              {product.daysLeft} days
                            </div>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <div className="px-2 py-1 bg-black/50 backdrop-blur-xl rounded-full text-xs font-medium text-white border border-white/20">
                              Qty: {product.quantity}
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-blue-100 transition-colors duration-300">
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 truncate">{product.brand}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              Exp: {new Date(product.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className={`w-2 h-2 rounded-full animate-pulse ${
                            product.urgent ? 'bg-red-400' : 'bg-blue-400'
                          }`}></div>
                        </div>

                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <button className="flex-1 bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm font-medium flex items-center justify-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                          <button className="bg-blue-500/20 border border-blue-400/30 text-blue-200 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center">
                            <Edit className="w-3 h-3" />
                          </button>
                          <button className="bg-red-500/20 border border-red-400/30 text-red-200 px-3 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20">
                          {product.image && !product.image.includes('unsplash.com') && (
                            <Image
                              src={product.image} 
                              width={64}
                              height={64}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              sizes="64px"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-1 truncate">{product.name}</h3>
                          <p className="text-gray-400 text-sm truncate">{product.brand}</p>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-sm font-medium text-white">Qty: {product.quantity}</div>
                            <div className="text-xs text-gray-400">Stock</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-sm font-medium ${product.urgent ? 'text-red-300' : 'text-blue-300'}`}>
                              {product.daysLeft} days
                            </div>
                            <div className="text-xs text-gray-400">Left</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-white">
                              {new Date(product.expiryDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-400">Expiry</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300">
                              <Eye className="w-4 h-4 text-white" />
                            </button>
                            <button className="p-2 bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300">
                              <Edit className="w-4 h-4 text-blue-200" />
                            </button>
                            <button className="p-2 bg-red-500/20 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-all duration-300">
                              <Trash2 className="w-4 h-4 text-red-200" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl border border-white/20">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">No products found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                  }}
                  className="bg-gradient-to-r from-white/90 to-white/80 text-black px-6 py-3 rounded-lg font-medium hover:from-white hover:to-white transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Stats Summary */}
            {!loading && products.length > 0 && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-blue-300/30 hover:bg-white/8 transition-all duration-500">
                  <div className="text-3xl font-bold text-white mb-2">{products.length}</div>
                  <div className="text-gray-400 text-sm">Total Items</div>
                </div>
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-red-300/30 hover:bg-white/8 transition-all duration-500">
                  <div className="text-3xl font-bold text-red-300 mb-2">{products.filter(p => p.urgent).length}</div>
                  <div className="text-gray-400 text-sm">Urgent Items</div>
                </div>
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-blue-300/30 hover:bg-white/8 transition-all duration-500">
                  <div className="text-3xl font-bold text-blue-300 mb-2">{products.filter(p => p.category === 'medicine').length}</div>
                  <div className="text-gray-400 text-sm">Medicines</div>
                </div>
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-green-300/30 hover:bg-white/8 transition-all duration-500">
                  <div className="text-3xl font-bold text-green-300 mb-2">{products.filter(p => !p.urgent).length}</div>
                  <div className="text-gray-400 text-sm">Safe Items</div>
                </div>
              </div>
            )}
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
      `}</style>
    </div>
  );
};

export default ProductsPage;