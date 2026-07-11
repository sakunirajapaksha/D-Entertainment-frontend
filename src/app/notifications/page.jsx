"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Loader2, ArrowLeft, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

export default function NotificationPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userInfoRaw = localStorage.getItem("userInfo");
        if (!userInfoRaw) {
          router.push("/login");
          return;
        }
        const userInfo = JSON.parse(userInfoRaw);

        const res = await fetch(
          "https://d-entertainment-backend.onrender.com/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch notifications");

        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [router]);

  // MARK AS READ
  const markAsRead = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await fetch(
        `https://d-entertainment-backend.onrender.com/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // PAYMENT NAV
  const goToPayment = (e, notificationId) => {
    e.stopPropagation();
    router.push("/payment");
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A]">
        <div className="relative">
          <Loader2 className="animate-spin w-12 h-12 text-[#E11D48]" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-[#FBBF24]/20 blur-md" />
        </div>
        <p className="text-gray-400 mt-4">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A] p-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/40 backdrop-blur-sm border border-[#E11D48]/50 rounded-2xl p-8 text-center max-w-md"
        >
          <AlertCircle className="w-16 h-16 text-[#E11D48] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Unable to load notifications</h2>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all px-6 py-2 rounded-full"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A] text-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-gray-400 text-sm mt-1">Stay updated on your bookings</p>
            <div className="w-16 h-1 bg-gradient-to-r from-[#E11D48] to-[#FBBF24] mt-2 rounded-full" />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            className="bg-black/40 backdrop-blur-sm border border-white/10 hover:border-[#E11D48] transition-all px-5 py-2.5 rounded-xl flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </motion.button>
        </motion.div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center"
          >
            <Bell className="w-16 h-16 text-[#FBBF24] mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg">No notifications</p>
            <p className="text-gray-500 text-sm mt-1">You're all caught up!</p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {notifications.map((notification) => (
              <motion.div
                key={notification._id}
                variants={fadeUp}
                whileHover={{ y: -2 }}
                onClick={() => !notification.read && markAsRead(notification._id)}
                className={`relative cursor-pointer transition-all duration-300 ${
                  !notification.read
                    ? "bg-black/60 backdrop-blur-sm border-l-4 border-[#FBBF24] hover:border-[#E11D48]"
                    : "bg-black/40 backdrop-blur-sm border-l-4 border-transparent"
                } border border-white/10 rounded-xl p-5 overflow-hidden group`}
              >
                {/* Unread indicator glow */}
                {!notification.read && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FBBF24]/5 to-transparent pointer-events-none" />
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell size={16} className={`${!notification.read ? "text-[#FBBF24]" : "text-gray-500"}`} />
                      <h3 className={`font-semibold ${!notification.read ? "text-white" : "text-gray-300"}`}>
                        {notification.title || "Notification"}
                      </h3>
                      {!notification.read && (
                        <span className="text-[10px] bg-[#FBBF24] text-black px-2 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{notification.message}</p>
                  </div>
                  
                  {/* Action buttons based on type */}
                  {notification.type === "payment" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => goToPayment(e, notification._id)}
                      className="bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
                    >
                      <CreditCard size={16} /> Pay Now
                    </motion.button>
                  )}
                </div>
                
                {/* Read/unread footer hint */}
                {!notification.read && (
                  <p className="text-xs text-[#FBBF24] mt-3 flex items-center gap-1">
                    <CheckCircle size={12} /> Click to mark as read
                  </p>
                )}
                {notification.read && (
                  <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                    <CheckCircle size={12} /> Read
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}