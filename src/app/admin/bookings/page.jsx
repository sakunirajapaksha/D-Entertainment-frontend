"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { User, Calendar, Clock, MapPin } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);

  // ==========================
  // FETCH BOOKINGS
  // ==========================
  const fetchBookings = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.token) return;

      const res = await fetch("http://https://d-entertainment-backend.onrender.com/api/bookings", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ==========================
  // UPDATE STATUS (APPROVE / REJECT)
  // ==========================
  const updateStatus = async (id, newStatus) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await fetch(`http://https://d-entertainment-backend.onrender.com/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      fetchBookings(); // refresh
    } catch (err) {
      console.log(err);
    }
  };

// ==========================
// 📄 DOWNLOAD PDF
// ==========================
const downloadPDF = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const res = await fetch(
      "http://https://d-entertainment-backend.onrender.com/api/bookings/export/pdf",
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("PDF download failed");
    }

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "bookings-report.pdf";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.log("PDF Error:", error.message);
  }
};


// ==========================
// 📊 DOWNLOAD CSV
// ==========================
const downloadCSV = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const res = await fetch(
      "http://https://d-entertainment-backend.onrender.com/api/bookings/export/csv",
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("CSV download failed");
    }

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "bookings-report.csv";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.log("CSV Error:", error.message);
  }
};

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-white text-black p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Admin Booking Dashboard
          </h1>

          <div className="flex gap-3">
            <button
              onClick={downloadPDF}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              📄 Download PDF
            </button>

            <button
              onClick={downloadCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              📊 Download CSV
            </button>
          </div>
        </div>

        {/* BOOKINGS LIST */}
        {bookings.map((b) => (
          <div
            key={b._id}
            className="border p-4 mb-4 rounded-xl shadow-sm"
          >

            {/* USER */}
            <p className="flex items-center gap-2">
              <User size={16} />
              {b.user?.name} ({b.user?.email})
            </p>

            {/* EVENT */}
            <p className="mt-1">🎉 {b.eventType}</p>

            {/* DATE */}
            <p className="flex items-center gap-2 mt-1">
              <Calendar size={14} />
              {new Date(b.eventDate).toLocaleDateString()}
            </p>

            {/* TIME */}
            <p className="flex items-center gap-2 mt-1">
              <Clock size={14} />
              {b.startTime} - {b.endTime}
            </p>

            {/* LOCATION */}
            <p className="flex items-center gap-2 mt-1">
              <MapPin size={14} />
              {b.location}
            </p>

            {/* GUESTS */}
            <p className="mt-1">👥 Guests: {b.guests}</p>

            {/* NOTES */}
            <p className="mt-1">📝 {b.notes || "No notes"}</p>

            {/* STATUS */}
            <p className="mt-1 font-semibold">
              Status: {b.status}
            </p>

            <p className="mt-1 font-semibold">
              Payment: {b.paymentStatus}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => updateStatus(b._id, "Approved")}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(b._id, "Rejected")}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>

          </div>
        ))}
      </div>
    </ProtectedRoute>
  );
}