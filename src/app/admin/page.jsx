"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Calendar, Image, Clock, Loader2, AlertCircle } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const router = useRouter();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const userInfoRaw = localStorage.getItem("userInfo");
        if (!userInfoRaw) {
          router.push("/login");
          return;
        }
        const userInfo = JSON.parse(userInfoRaw);
        if (userInfo.role !== "admin") {
          router.push("/login");
          return;
        }

        const response = await fetch(
          "https://d-entertainment-backend.onrender.com/api/analytics",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load analytics");
        }
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    router.push("/login");
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <Loader2 className="animate-spin w-12 h-12 text-[#E11D48]" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-[#FBBF24]/20 blur-md" />
        </div>
        <p className="text-gray-500 mt-4">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-[#E11D48]/30 rounded-2xl p-8 text-center max-w-md shadow-lg"
        >
          <AlertCircle className="w-16 h-16 text-[#E11D48] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to load analytics</h2>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all px-6 py-2 rounded-full text-white"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Chart data with brand colors
  const bookingStatusData = {
    labels: ["Approved", "Pending", "Cancelled"],
    datasets: [
      {
        data: [
          analytics.approvedBookings,
          analytics.pendingBookings,
          analytics.totalBookings - analytics.approvedBookings - analytics.pendingBookings,
        ],
        backgroundColor: ["#22c55e", "#FBBF24", "#E11D48"],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 8,
      },
    ],
  };

  const revenuePieData = {
    labels: ["Collected Revenue", "Pending Revenue"],
    datasets: [
      {
        data: [
          analytics.totalRevenue,
          Math.max(0, analytics.totalBookings * 5000 - analytics.totalRevenue),
        ],
        backgroundColor: ["#E11D48", "#FBBF24"],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-2">Overview & Analytics Panel</p>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E11D48] to-[#FBBF24] mt-2 rounded-full" />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#E11D48] hover:text-[#E11D48] transition-all px-5 py-2.5 rounded-xl shadow-sm"
          >
            <LogOut size={18} /> Logout
          </motion.button>
        </motion.div>

        {/* STATS CARDS */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <motion.div variants={fadeUp} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <h2 className="text-4xl font-bold text-[#E11D48] mt-2">
              {analytics.totalBookings}
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm">Approved</p>
            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {analytics.approvedBookings}
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-4xl font-bold text-[#FBBF24] mt-2">
              {analytics.pendingBookings}
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm">Revenue (LKR)</p>
            <h2 className="text-4xl font-bold text-[#E11D48] mt-2">
              {analytics.totalRevenue.toLocaleString()}
            </h2>
          </motion.div>
        </motion.div>

        {/* PIE CHARTS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-8 mb-12"
        >
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">
              Booking Status Overview
            </h2>
            <div className="h-[300px] flex justify-center items-center">
              <Doughnut data={bookingStatusData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">
              Revenue Distribution
            </h2>
            <div className="h-[300px] flex justify-center items-center">
              <Doughnut data={revenuePieData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>
        </motion.div>

        {/* QUICK ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-[#E11D48] pl-3">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/admin/bookings")}
              className="bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all p-5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <Calendar size={20} /> Manage Bookings
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/admin/gallery")}
              className="bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all p-5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <Image size={20} /> Manage Gallery
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/admin/availability")}
              className="bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all p-5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <Clock size={20} /> Manage Availability
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}