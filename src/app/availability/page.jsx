"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, AlertCircle, CheckCircle, RefreshCw, Loader2 } from "lucide-react";

export default function AvailabilityPage() {
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAvailability = async () => {
    try {
      const res = await fetch("https://d-entertainment-backend.onrender.com/api/availability");
      const data = await res.json();
      setBlockedDates(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();

    // 🔥 REAL-TIME polling (every 5 sec)
    const interval = setInterval(() => {
      fetchAvailability();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A] text-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with live indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent">
            DJ Availability
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-gray-400">Real-time calendar status</p>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 bg-[#FBBF24] rounded-full animate-pulse" />
              <span className="text-gray-500">Live</span>
            </div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-[#E11D48] to-[#FBBF24] mt-3 rounded-full" />
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Calendar className="text-[#E11D48]" />
                <span className="bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent">
                  Unavailable Dates
                </span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <RefreshCw size={12} className="animate-spin-slow" />
                <span>Auto‑refreshes every 5s</span>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <Loader2 className="animate-spin w-10 h-10 text-[#E11D48]" />
                  <div className="absolute inset-0 animate-pulse rounded-full bg-[#FBBF24]/20 blur-md" />
                </div>
                <p className="text-gray-400 mt-3">Checking calendar...</p>
              </div>
            )}

            {/* Empty State (all available) */}
            {!loading && blockedDates.length === 0 && (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="bg-green-500/10 rounded-full p-4 mb-4">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">All Dates Available!</h3>
                <p className="text-gray-400 mt-2">No blocked dates found. You can book any date.</p>
                <div className="mt-4 text-[#FBBF24] text-sm">✨ Ready for your event</div>
              </motion.div>
            )}

            {/* Blocked Dates List */}
            {!loading && blockedDates.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {blockedDates.map((item, idx) => (
                  <motion.div
                    key={item._id || idx}
                    variants={fadeUp}
                    whileHover={{ x: 4, borderColor: "#FBBF24" }}
                    className="bg-red-500/5 border border-[#E11D48]/40 rounded-xl p-4 transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-[#E11D48]" />
                          <p className="text-lg font-semibold text-white">
                            {new Date(item.blockedDate).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        {item.reason && (
                          <p className="text-gray-300 mt-1 ml-6 text-sm">
                            Reason: {item.reason}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-[#E11D48]/20 px-3 py-1 rounded-full">
                          <span className="text-[#E11D48] font-semibold text-sm flex items-center gap-1">
                            <AlertCircle size={14} /> NOT AVAILABLE
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Decorative red/yellow accent line at bottom */}
                    <div className="mt-3 h-0.5 bg-gradient-to-r from-[#E11D48] to-[#FBBF24] opacity-30 rounded-full" />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Last updated timestamp */}
            {!loading && (
              <div className="mt-6 text-right text-xs text-gray-500 border-t border-white/10 pt-4">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}