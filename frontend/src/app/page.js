'use client';
import React, { useState, useEffect } from 'react';
import { Upload, Calendar, ShieldCheck, Pill, Apple, Camera, Plus, Bell, Clock, Star, ChevronRight, Zap, Shield, Brain, Menu, X, ArrowRight, Play, CheckCircle, TrendingUp } from 'lucide-react';
import Image from 'next/image';
const HomePage = () => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const stats = [
    { label: 'Items Tracked', value: '2,847', trend: '+12%', icon: Apple, color: 'from-blue-500/20 to-blue-600/20' },
    { label: 'Alerts Sent', value: '12,459', trend: '+23%', icon: Bell, color: 'from-gray-500/20 to-gray-600/20' },
    { label: 'Medicines', value: '1,234', trend: '+8%', icon: Pill, color: 'from-blue-400/20 to-blue-500/20' },
    { label: 'Accuracy', value: '99.8%', trend: '+0.2%', icon: Brain, color: 'from-gray-400/20 to-gray-500/20' }
  ];

  const recentAlerts = [
    { name: 'Amoxicillin 500mg', brand: 'GSK Pharmaceuticals', type: 'Prescription Medicine', daysLeft: 2, urgent: true, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center' },
    { name: 'Organic Milk', brand: 'Horizon Organic', type: 'Dairy Product', daysLeft: 4, urgent: true, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop&crop=center' },
    { name: 'Greek Yogurt', brand: 'Chobani', type: 'Dairy Product', daysLeft: 7, urgent: false, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100&h=100&fit=crop&crop=center' }
  ];

  const features = [
    { 
      icon: Brain, 
      title: 'Neural Vision AI', 
      desc: 'Advanced computer vision with 99.8% accuracy in expiry date recognition across 50+ languages and date formats.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center'
    },
    { 
      icon: Zap, 
      title: 'Real-time Intelligence', 
      desc: 'Instant synchronization across all devices with millisecond-precision alerts and smart notification scheduling.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center'
    },
    { 
      icon: Shield, 
      title: 'Enterprise Security', 
      desc: 'Bank-level encryption with zero-knowledge architecture. Your data remains completely private and secure.',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop&crop=center'
    }
  ];


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
            suppressHydrationWarning
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

      <div className="relative z-10">
        {/* Revolutionary Hero Section */}
        <section className="pt-24 pb-20 px-6 lg:px-8 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Content */}
              <div className="lg:col-span-6 space-y-8">
                {/* Premium Badge */}
                <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-xl rounded-full border border-blue-500/20">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100 font-medium text-xs tracking-wide">AI-POWERED EXPIRY INTELLIGENCE</span>
                  <Brain className="w-3 h-3 text-blue-300" />
                </div>

                {/* Hero Headline */}
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                    <span className="block bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                      Never Let
                    </span>
                    <span className="block bg-gradient-to-r from-blue-200 via-blue-100 to-white bg-clip-text text-transparent">
                      Anything
                    </span>
                    <span className="block text-4xl lg:text-6xl bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 bg-clip-text text-transparent font-light">
                      expire again
                    </span>
                  </h1>
                  
                  <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-2xl font-light">
                    Enterprise-grade AI vision that <span className="text-white font-medium">instantly recognizes</span> expiry dates from any image. 
                    Protect your inventory with <span className="text-blue-200 font-medium">military-grade precision.</span>
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-blue-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-80 transition-all duration-500"></div>
                    <button className="relative bg-gradient-to-r from-white to-gray-100 backdrop-blur-xl text-black px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 group-hover:scale-105 shadow-xl flex items-center space-x-3 border border-white/20 hover:from-white hover:to-white">
                      <Camera className="w-5 h-5 group-hover:rotate-6 transition-transform duration-300" />
                      <span>Start Scanning</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                  
                  <button className="group backdrop-blur-xl bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-medium text-sm hover:border-white/20 hover:bg-white/10 transition-all duration-300 flex items-center space-x-3 hover:scale-105">
                    <Play className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                    <span>Watch Demo</span>
                  </button>
                </div>

                {/* Social Proof */}
                <div className="flex items-center space-x-8 pt-6 border-t border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-blue-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-white font-semibold text-sm">4.9</span>
                    <span className="text-gray-400 text-sm">from 2.1k reviews</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
                        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'].map((src, i) => (
                        <Image key={i} src={src} alt={`User ${i + 1}`}  width={32}  height={32} className="w-8 h-8 rounded-full border-2 border-black object-cover" />
                      ))}
                    </div>
                    <span className="text-white font-medium text-sm">50K+ professionals</span>
                  </div>
                </div>
              </div>

              {/* Right Visual - Glassmorphic Cards */}
              <div className="lg:col-span-6">
                <div className="relative h-[700px] flex items-center justify-center">
                  
                  {/* Central AI Hub */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full blur-3xl animate-pulse scale-150"></div>
                    <div className="relative w-48 h-48 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                      <div className="w-32 h-32 bg-gradient-to-br from-black/20 to-transparent backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
                        <Brain className="w-16 h-16 text-white animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl"></div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Glassmorphic Product Cards */}
                  {[
                    { name: 'Medicine', count: '1.2K', pos: 'top-0 left-0', delay: '0s', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center' },
                    { name: 'Dairy', count: '856', pos: 'top-0 right-0', delay: '0.8s', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop&crop=center' },
                    { name: 'Fresh Food', count: '2.1K', pos: 'bottom-0 left-0', delay: '1.6s', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=100&h=100&fit=crop&crop=center' },
                    { name: 'Pantry', count: '945', pos: 'bottom-0 right-0', delay: '2.4s', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop&crop=center' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`absolute ${item.pos} w-36 h-36 group cursor-pointer`}
                      style={{
                        animation: `float ${4 + index * 0.5}s ease-in-out infinite`,
                        animationDelay: item.delay
                      }}
                    >
                      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-4 hover:border-blue-300/30 hover:bg-white/15 transition-all duration-500 group-hover:scale-110 text-center shadow-xl">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl mx-auto mb-3 object-cover border border-white/20" />
                        <div className="text-white font-semibold text-sm mb-1">{item.name}</div>
                        <div className="text-xs text-blue-200 font-medium">{item.count} tracked</div>
                        <div className="text-[10px] text-gray-400 mt-1">AI Monitored</div>
                      </div>
                    </div>
                  ))}

                  {/* Scanning Animation Rings */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i}
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-blue-400/20 rounded-full animate-ping`}
                        style={{ 
                          width: `${300 + i * 50}px`, 
                          height: `${300 + i * 50}px`,
                          animationDelay: `${i * 0.5}s`,
                          animationDuration: '3s'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Glassmorphic Stats Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{
                    animation: `float ${3 + index * 0.3}s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-all duration-500`}></div>
                  <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-300/30 hover:bg-white/10 transition-all duration-500 group-hover:scale-105 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl mx-auto mb-4 flex items-center justify-center shadow-xl border border-white/20">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400 font-medium text-sm mb-2">{stat.label}</div>
                    <div className="flex items-center justify-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-blue-300 font-semibold">{stat.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Upload Section with Glassmorphism */}
              <div className="lg:col-span-8">
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-blue-300/30 hover:bg-white/8 transition-all duration-700 shadow-2xl">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-3">
                      Upload & Analyze
                    </h2>
                    <p className="text-gray-400 text-lg font-light">Advanced AI processes images with 99.8% accuracy in milliseconds</p>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-500 backdrop-blur-xl ${
                      dragOver 
                        ? 'border-blue-400/50 bg-blue-500/10 scale-[1.02] shadow-2xl shadow-blue-500/20' 
                        : 'border-white/20 hover:border-white/30 hover:bg-white/5'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl border border-white/20">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">Drop images here</h3>
                    <p className="text-gray-400 text-base font-light mb-8">Support for JPG, PNG, HEIC, WebP formats</p>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="bg-gradient-to-r from-white to-gray-100 text-black px-8 py-3 rounded-xl hover:from-white hover:to-white transition-all duration-300 cursor-pointer inline-flex items-center justify-center space-x-3 shadow-xl hover:scale-105 font-semibold text-sm border border-white/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Select Files</span>
                      </label>
                      <button className="backdrop-blur-xl bg-white/5 border border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 inline-flex items-center justify-center space-x-3 hover:scale-105 font-medium text-sm">
                        <Camera className="w-4 h-4" />
                        <span>Camera</span>
                      </button>
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-semibold text-white mb-4 text-lg">Processing {uploadedFiles.length} files...</h4>
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/8 transition-all duration-300">
                            <span className="text-white font-medium text-sm truncate">{file.name}</span>
                            <button 
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-white font-medium transition-colors duration-300 px-3 py-1 hover:bg-white/5 rounded-lg text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-6 bg-gradient-to-r from-blue-600/80 to-blue-500/70 backdrop-blur-xl text-white py-4 rounded-xl hover:from-blue-600 hover:to-blue-500 transition-all duration-300 font-semibold shadow-xl hover:scale-105 border border-blue-400/20 hover:border-blue-400/40">
                        Process with AI Vision
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Glassmorphic Alerts Panel */}
              <div className="lg:col-span-4">
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-6 h-full hover:border-blue-300/30 hover:bg-white/8 transition-all duration-700 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">
                      Live Alerts
                    </h2>
                    <div className="relative">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-blue-400/30 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {recentAlerts.map((alert, index) => (
                      <div 
                        key={index} 
                        className="group p-4 rounded-xl border backdrop-blur-xl transition-all duration-500 hover:scale-105 cursor-pointer"
                        style={{
                          backgroundColor: alert.urgent ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          borderColor: alert.urgent ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                          animationDelay: `${index * 0.2}s`
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <img src={alert.image} alt={alert.name} className="w-12 h-12 rounded-xl object-cover border border-white/20 shadow-lg" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm mb-1 truncate">{alert.name}</h4>
                            <p className="text-gray-400 text-xs mb-2 truncate">{alert.brand}</p>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className={`text-xs font-medium ${alert.urgent ? 'text-red-300' : 'text-gray-300'}`}>
                                {alert.daysLeft} days left
                              </span>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full animate-pulse ${alert.urgent ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-6 backdrop-blur-xl bg-white/5 border border-white/20 text-white py-3 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 font-medium text-sm hover:scale-105">
                    View All Alerts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Features Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-xl rounded-full border border-blue-500/20 mb-8">
                <Zap className="w-4 h-4 text-blue-300" />
                <span className="text-blue-100 font-medium text-sm tracking-wide">ENTERPRISE-GRADE TECHNOLOGY</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
                Beyond Innovation
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                Experience the future of inventory management with cutting-edge AI that learns, adapts, and protects your assets
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-blue-300/30 hover:bg-white/8 transition-all duration-700 hover:scale-105 shadow-2xl"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <div className="relative mb-6 overflow-hidden rounded-xl">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-xl border border-white/20 group-hover:scale-110 transition-all duration-500">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-100 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-light text-sm">{feature.desc}</p>
                  
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
                    <div className="flex items-center justify-center mt-4 space-x-2 text-blue-300">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Enterprise Ready</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-blue-500/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl"></div>
                <div className="relative">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent tracking-tight">
                    Ready to Transform Your Inventory?
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 font-light leading-relaxed">
                    Join thousands of professionals who trust Expyra to protect their valuable assets
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-xl blur-xl opacity-50 group-hover:opacity-80 transition-all duration-500"></div>
                      <button className="relative bg-gradient-to-r from-white to-gray-100 text-black px-10 py-4 rounded-xl font-semibold transition-all duration-300 group-hover:scale-105 shadow-xl flex items-center space-x-3 border border-white/20">
                        <span>Start Free Trial</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                    
                    <button className="backdrop-blur-xl bg-white/5 border border-white/20 text-white px-10 py-4 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 font-medium flex items-center space-x-3 hover:scale-105">
                      <span>Schedule Demo</span>
                      <Calendar className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-8 mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-gray-300">No credit card required</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-gray-300">14-day free trial</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-gray-300">Cancel anytime</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-lg flex items-center justify-center border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-white">Expyra</span>
                </div>
                <p className="text-gray-400 text-sm font-light leading-relaxed mb-6 max-w-md">
                  Enterprise-grade AI platform for intelligent inventory management and expiry tracking. 
                  Trusted by professionals worldwide.
                </p>
                <div className="flex space-x-4">
                  {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                    <a key={social} href="#" className="w-8 h-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-gray-400 hover:text-white text-xs">
                      {social[0]}
                    </a>
                  ))}
                </div>
              </div>
              
              {[
                { title: 'Product', items: ['Features', 'Pricing', 'Security', 'API'] },
                { title: 'Company', items: ['About', 'Blog', 'Careers', 'Contact'] }
              ].map((column, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-white mb-4 text-sm">{column.title}</h4>
                  <ul className="space-y-3">
                    {column.items.map((item) => (
                      <li key={item}>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Expyra. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                {['Privacy', 'Terms', 'Cookies'].map((item) => (
                  <a key={item} href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
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

export default HomePage;