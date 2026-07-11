"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CreditCard,
  Loader2,
  AlertCircle,
  ArrowRight,
  Lock,
} from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // LOAD BOOKING
  useEffect(() => {
    const saved = localStorage.getItem("latestBooking");

    if (!saved) {
      setError("No booking found. Please create a booking first.");
      return;
    }

    try {
      const data = JSON.parse(saved);
      setBooking(data);
    } catch (err) {
      setError("Invalid booking data");
    }
  }, []);

  const handlePayment = async () => {
    if (!booking?._id) {
      setError("Booking ID missing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userInfoRaw = localStorage.getItem("userInfo");
      if (!userInfoRaw) {
        router.push("/login");
        return;
      }

      const userInfo = JSON.parse(userInfoRaw);

      const response = await fetch(
        "http://https://d-entertainment-backend.onrender.com/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({
            bookingId: booking._id,
            amount: booking.totalPrice, // 🔥 IMPORTANT FIX
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-6 text-white">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl p-8"
      >

        {/* TITLE */}
        <div className="text-center mb-6">
          <CreditCard className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-red-500">
            Complete Payment
          </h1>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-xl flex items-center gap-2 mb-4">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* LOADING */}
        {!booking && !error && (
          <div className="text-center text-gray-400">
            Loading booking...
            <Loader2 className="animate-spin mx-auto mt-2" />
          </div>
        )}

        {/* BOOKING SUMMARY */}
        {booking && (
          <div className="bg-black border border-white/10 rounded-xl p-4 mb-6 space-y-2">

            <p className="text-gray-400">
              Event: <span className="text-white">{booking.eventType}</span>
            </p>

            <p className="text-gray-400">
              Hours: <span className="text-white">{booking.hours}</span>
            </p>

            <p className="text-gray-400">
              Rate: <span className="text-white">${booking.rate}/hour</span>
            </p>

            <p className="text-lg font-bold text-yellow-400">
              Total: ${booking.totalPrice}
            </p>

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Booking ID</span>
              <span className="text-yellow-400 font-mono">
                {booking._id}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Lock size={12} />
              Secure Stripe Payment
            </div>
          </div>
        )}

        {/* PAY BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
          disabled={loading || !booking || !!error}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 ${
            loading || !booking || !!error
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Redirecting...
            </>
          ) : (
            <>
              Pay Now <ArrowRight size={18} />
            </>
          )}
        </motion.button>

        <p className="text-center text-gray-500 text-xs mt-5">
          You will be redirected to a secure payment gateway.
        </p>

      </motion.div>
    </div>
  );
}