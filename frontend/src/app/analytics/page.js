"use client";
import { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { TrendingUp, DollarSign, CheckCircle, XCircle, Activity } from "lucide-react";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/analytics/summary")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res);
      });
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg font-light">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const lineData = {
    labels: data.dailyData.map((d) => d._id),
    datasets: [
      {
        label: "Revenue (₹)",
        data: data.dailyData.map((d) => d.total),
        fill: true,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ["Paid", "Failed"],
    datasets: [
      {
        data: [data.paidCount, data.failedCount],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderColor: ["#16a34a", "#dc2626"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: "#9ca3af",
          font: {
            size: 12,
            family: "system-ui, -apple-system, sans-serif",
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#9ca3af",
          font: {
            size: 12,
            family: "system-ui, -apple-system, sans-serif",
          },
          padding: 20,
        },
      },
    },
  };

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-green-500/20 to-green-600/10",
      trend: "+12.5%",
    },
    {
      title: "Successful Payments",
      value: data.paidCount,
      icon: CheckCircle,
      color: "from-blue-500/20 to-blue-600/10",
      trend: "+8.2%",
    },
    {
      title: "Failed Payments",
      value: data.failedCount,
      icon: XCircle,
      color: "from-red-500/20 to-red-600/10",
      trend: "-3.1%",
    },
    {
      title: "Success Rate",
      value: `${((data.paidCount / (data.paidCount + data.failedCount)) * 100).toFixed(1)}%`,
      icon: Activity,
      color: "from-purple-500/20 to-purple-600/10",
      trend: "+2.4%",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-[system-ui,-apple-system,sans-serif]">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-10 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gray-400/10 via-gray-300/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '10s' }}></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-xl rounded-full border border-blue-500/20 mb-4">
            <Activity className="w-4 h-4 text-blue-300" />
            <span className="text-blue-100 font-medium text-xs tracking-wide">LIVE ANALYTICS</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent tracking-tight">
            Payment Analytics
          </h1>
          <p className="text-gray-400 text-lg font-light">Real-time insights into your revenue and transaction performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-300/30 hover:bg-white/10 transition-all duration-500 group-hover:scale-105">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-xl border border-white/20">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-300 font-semibold">{stat.trend}</span>
                  </div>
                </div>
                <h3 className="text-gray-400 font-medium text-sm mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Line Chart */}
          <div className="lg:col-span-2 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-blue-300/30 hover:bg-white/8 transition-all duration-700 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Daily Revenue Trend</h2>
              <p className="text-gray-400 text-sm font-light">Track your revenue performance over time</p>
            </div>
            <div className="h-[300px]">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-blue-300/30 hover:bg-white/8 transition-all duration-700 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Payment Status</h2>
              <p className="text-gray-400 text-sm font-light">Overview of transaction outcomes</p>
            </div>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-6 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-blue-300/30 hover:bg-white/8 transition-all duration-700 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Performance Insights</h2>
              <p className="text-gray-400 text-sm font-light">Key metrics from your payment data</p>
            </div>
            <div className="relative">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-blue-400/30 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {data.dailyData.slice(-3).map((day, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 hover:bg-white/8 transition-all duration-300">
                <div className="text-gray-400 text-sm font-medium mb-2">{day._id}</div>
                <div className="text-2xl font-bold text-white mb-1">₹{day.total.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-green-400 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  <span>Revenue</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}