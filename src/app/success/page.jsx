"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Download,
  LayoutDashboard,
  Loader2,
  Calendar,
  MapPin,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import jsPDF from "jspdf";

export default function SuccessPage() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // PREVENT DOUBLE CALL (React Strict Mode safe)
  useEffect(() => {
    let isMounted = true;

    const confirmPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const bookingId = params.get("bookingId");

        if (!bookingId) {
          throw new Error("No booking ID found");
        }

        const userInfoRaw = localStorage.getItem("userInfo");
        if (!userInfoRaw) {
          throw new Error("Please log in again");
        }

        const userInfo = JSON.parse(userInfoRaw);

        // CONFIRM PAYMENT
        const confirmRes = await fetch(
          `https://d-entertainment-backend.onrender.com/api/payments/confirm/${bookingId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        if (!confirmRes.ok) {
          throw new Error("Payment confirmation failed");
        }

        // FETCH BOOKING
        const bookingRes = await fetch(
          `https://d-entertainment-backend.onrender.com/api/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        if (!bookingRes.ok) {
          throw new Error("Failed to fetch booking");
        }

        const data = await bookingRes.json();

        if (isMounted) {
          setBooking(data);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    confirmPayment();

    return () => {
      isMounted = false;
    };
  }, []);

  // DOWNLOAD (simple print)
 // ==========================
// DOWNLOAD RECEIPT PDF
// ==========================
const downloadPDF = () => {
  if (!booking) return;

  const doc = new jsPDF();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("SHAN ENTERTAINMENT", 105, 20, {
    align: "center",
  });

  doc.setFontSize(16);
  doc.text("DJ BOOKING RECEIPT", 105, 30, {
    align: "center",
  });

  doc.line(20, 36, 190, 36);

  // Receipt Details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  let y = 50;

  doc.text(`Receipt No : ${booking._id}`, 20, y);
  y += 10;

  doc.text(
    `Generated : ${new Date().toLocaleString()}`,
    20,
    y
  );
  y += 15;

  doc.text(`Event Type : ${booking.eventType}`, 20, y);
  y += 10;

  doc.text(
    `Event Date : ${new Date(
      booking.eventDate
    ).toLocaleDateString()}`,
    20,
    y
  );
  y += 10;

  doc.text(`Location : ${booking.location}`, 20, y);
  y += 10;

  doc.text(`Guests : ${booking.guests}`, 20, y);
  y += 10;

  doc.text(
    `Start Time : ${booking.startTime}`,
    20,
    y
  );
  y += 10;

  doc.text(
    `End Time : ${booking.endTime}`,
    20,
    y
  );
  y += 10;

  doc.text(`Booking Status : ${booking.status}`, 20, y);
  y += 10;

  doc.text(
    `Payment Status : ${booking.paymentStatus}`,
    20,
    y
  );
  y += 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);

  doc.text(
    `TOTAL : $${booking.totalPrice ?? 0}`,
    20,
    y
  );

  y += 25;

  doc.line(20, y, 190, y);

  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(
    "Thank you for choosing Shan Entertainment.",
    105,
    y,
    { align: "center" }
  );

  y += 8;

  doc.text(
    "This receipt confirms your successful booking payment.",
    105,
    y,
    { align: "center" }
  );

  y += 20;

  doc.text(
    "Authorized Signature",
    150,
    y
  );

  doc.save(`Receipt-${booking._id}.pdf`);
};

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin w-12 h-12 text-yellow-400" />
        <p className="text-gray-400 mt-3">Confirming payment...</p>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border border-red-500 rounded-2xl p-6 text-center max-w-md"
        >
          <AlertCircle className="text-red-500 w-10 h-10 mx-auto mb-3" />
          <h2 className="text-xl font-bold">Payment Error</h2>
          <p className="text-gray-400 mt-2 text-sm">{error}</p>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="mt-4 bg-red-600 px-4 py-2 rounded-xl"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-5">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-lg p-8"
      >

        {/* SUCCESS ICON */}
        <div className="text-center mb-6">
          <CheckCircle className="w-14 h-14 text-green-400 mx-auto" />
          <h1 className="text-3xl font-bold text-green-400 mt-2">
            Payment Successful
          </h1>
          <p className="text-gray-400 text-sm">
            Your booking is confirmed
          </p>
        </div>

        {/* RECEIPT */}
        <div className="bg-black border border-white/10 rounded-xl p-4 space-y-3">

          <div className="flex justify-between">
            <span className="text-gray-400">Event</span>
            <span>{booking.eventType}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Date</span>
            <span className="flex items-center gap-1">
              <Calendar size={14} className="text-yellow-400" />
              {new Date(booking.eventDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Location</span>
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-red-500" />
              {booking.location}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className="text-green-400">{booking.status}</span>
          </div>

          <div className="flex justify-between border-t border-white/10 pt-2">
            <span className="text-gray-400">Payment</span>
            <span className="text-yellow-400 font-bold">PAID</span>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-6">

          <button
            onClick={downloadPDF}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl"
          >
            <Download className="inline w-4 h-4 mr-1" />
            Receipt
          </button>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="flex-1 bg-zinc-800 border border-white/10 py-2 rounded-xl"
          >
            <LayoutDashboard className="inline w-4 h-4 mr-1" />
            Dashboard
          </button>

        </div>

      </motion.div>
    </div>
  );
}