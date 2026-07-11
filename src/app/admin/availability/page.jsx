"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, AlertCircle, Loader2, Ban, Plus } from "lucide-react";

export default function AvailabilityPage() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // AUTH CHECK (ADMIN ONLY)
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      router.replace("/login");
      return;
    }
    const user = JSON.parse(userInfo);
    if (user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
  }, [router]);

  // FETCH BLOCKED DATES
  const fetchBlockedDates = async () => {
    try {
      setFetching(true);
      const res = await fetch("http://https://d-entertainment-backend.onrender.com/api/availability");
      if (!res.ok) throw new Error("Failed to fetch blocked dates");
      const data = await res.json();
      setBlockedDates(data);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  // BLOCK DATE
  const handleBlockDate = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const res = await fetch("http://https://d-entertainment-backend.onrender.com/api/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          blockedDate: date,
          reason: reason || "Unavailable",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to block date");
        return;
      }

      alert("Date blocked successfully 🚫");
      setDate("");
      setReason("");
      fetchBlockedDates();
    } catch (error) {
      console.log(error);
      alert("Server error");
    } finally {
      setLoading(false);
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
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent">
            Availability Management
          </h1>
          <p className="text-gray-500 mt-1">Block dates when DJ is not available</p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#E11D48] to-[#FBBF24] mt-2 rounded-full" />
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Ban size={20} className="text-[#E11D48]" /> Block a New Date
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (Optional)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Holiday, Private event, etc."
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none transition-colors"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBlockDate}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                loading
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] text-white shadow-md"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Blocking...
                </>
              ) : (
                <>
                  <Plus size={18} /> Block Date
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Blocked Dates List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 border-l-4 border-[#E11D48] pl-3">
            <Calendar size={20} className="text-[#FBBF24]" /> Blocked Dates
          </h2>

          {fetching ? (
            <div className="flex justify-center items-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E11D48]"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <AlertCircle className="w-8 h-8 text-[#E11D48] mx-auto mb-2" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : blockedDates.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No blocked dates. All dates are available.</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {blockedDates.map((item) => (
                <motion.div
                  key={item._id}
                  variants={fadeUp}
                  whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-[#E11D48]" />
                        <span className="font-semibold text-gray-800">
                          {new Date(item.blockedDate).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {item.reason && (
                        <p className="text-gray-500 text-sm mt-1 ml-6">
                          Reason: {item.reason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-[#E11D48]/10 px-3 py-1 rounded-full">
                        <span className="text-[#E11D48] text-xs font-semibold flex items-center gap-1">
                          <Ban size={12} /> BLOCKED
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}