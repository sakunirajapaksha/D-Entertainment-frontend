"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, CreditCard, Download, Loader2, AlertCircle } from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userInfoRaw = localStorage.getItem("userInfo");
        if (!userInfoRaw) {
          setError("Please log in to view bookings");
          setLoading(false);
          return;
        }
        const userInfo = JSON.parse(userInfoRaw);

        const response = await fetch(
          "http://https://d-entertainment-backend.onrender.com/api/bookings/mybookings",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch bookings");

        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Download Invoice
  const downloadInvoice = async (bookingId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const response = await fetch(
        `http://https://d-entertainment-backend.onrender.com/api/invoices/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Invoice download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      alert("Failed to download invoice");
    }
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

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "approved") {
      return "bg-green-500/20 text-green-400 border-green-500/30";
    }
    if (statusLower === "rejected") {
      return "bg-[#E11D48]/20 text-[#E11D48] border-[#E11D48]/30";
    }
    return "bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/30";
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A]">
          <div className="relative">
            <Loader2 className="animate-spin w-12 h-12 text-[#E11D48]" />
            <div className="absolute inset-0 animate-pulse rounded-full bg-[#FBBF24]/20 blur-md" />
          </div>
          <p className="text-gray-400 mt-4">Loading your bookings...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A] p-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 backdrop-blur-sm border border-[#E11D48]/50 rounded-2xl p-8 text-center max-w-md"
          >
            <AlertCircle className="w-16 h-16 text-[#E11D48] mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Unable to load bookings</h2>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all px-6 py-2 rounded-full"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A] text-white p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent">
              My Bookings
            </h1>
            <p className="text-gray-400 mt-2">Manage your event reservations</p>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E11D48] to-[#FBBF24] mt-3 rounded-full" />
          </motion.div>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center"
            >
              <Calendar className="w-16 h-16 text-[#FBBF24] mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 text-lg">No bookings found</p>
              <button
                onClick={() => (window.location.href = "/booking")}
                className="mt-4 text-[#FBBF24] hover:text-[#E11D48] transition-colors"
              >
                Create your first booking →
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {bookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  variants={fadeUp}
                  whileHover={{ y: -2, borderColor: "#E11D48" }}
                  className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-5">
                    {/* Left: Booking Info */}
                    <div className="flex-1 space-y-2">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#FBBF24] bg-clip-text text-transparent">
                        {booking.eventType}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-300">
                          <Calendar size={16} className="text-[#FBBF24]" />
                          {new Date(booking.eventDate).toLocaleDateString(undefined, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="flex items-center gap-2 text-gray-300">
                          <MapPin size={16} className="text-[#E11D48]" />
                          {booking.location}
                        </p>
                        <p className="flex items-center gap-2 text-gray-300">
                          <Users size={16} className="text-[#FBBF24]" />
                          Guests: {booking.guests}
                        </p>
                        <p className="flex items-center gap-2 text-gray-300">
                          <CreditCard size={16} className="text-[#E11D48]" />
                          Payment:{" "}
                          <span className={booking.paymentStatus === "Paid" ? "text-green-400" : "text-yellow-400"}>
                            {booking.paymentStatus || "Pending"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Status + Actions */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusBadge(booking.status)}`}>
                        {booking.status || "Pending"}
                      </span>
                      {booking.paymentStatus === "Paid" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => downloadInvoice(booking._id)}
                          className="bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold"
                        >
                          <Download size={16} /> Invoice
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}