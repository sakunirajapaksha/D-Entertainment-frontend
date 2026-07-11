"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("userInfo");

        if (!storedUser) {
          router.push("/login");
          return;
        }

        const userInfo = JSON.parse(storedUser);

        const res = await fetch(
          "https://d-entertainment-backend.onrender.com/api/bookings/my",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        const data = await res.json();

        setBookings(Array.isArray(data) ? data : []);

        setNotifications([
          {
            id: 1,
            text: "Your booking is pending approval",
          },
          {
            id: 2,
            text: "New DJ slots available",
          },
        ]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-400";

      case "Rejected":
        return "text-red-500";

      case "Paid":
        return "text-blue-400";

      default:
        return "text-yellow-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-500/10 blur-3xl rounded-full"></div>
      </div>

      <div className="relative z-10 p-6 md:p-10">

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: -30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-col md:flex-row justify-between items-center mb-10"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
              Client Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Manage your DJ bookings and payments
            </p>
          </div>

          <button
            onClick={() => router.push("/notifications")}
            className="relative mt-5 md:mt-0 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-2xl transition"
          >
            🔔 Notifications

            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black font-bold px-2 rounded-full text-xs">
                {notifications.length}
              </span>
            )}
          </button>
        </motion.div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-3xl shadow-xl"
          >
            <h3 className="text-gray-200">
              Total Bookings
            </h3>

            <p className="text-4xl font-bold mt-3">
              {bookings.length}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-6 rounded-3xl shadow-xl text-black"
          >
            <h3>
              Pending Bookings
            </h3>

            <p className="text-4xl font-bold mt-3">
              {
                bookings.filter(
                  (b) => b.status === "Pending"
                ).length
              }
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-white to-gray-300 p-6 rounded-3xl shadow-xl text-black"
          >
            <h3>
              Approved Bookings
            </h3>

            <p className="text-4xl font-bold mt-3">
              {
                bookings.filter(
                  (b) => b.status === "Approved"
                ).length
              }
            </p>
          </motion.div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => router.push("/booking")}
            className="bg-red-600 hover:bg-red-700 p-5 rounded-2xl font-bold text-lg"
          >
            ➕ New Booking
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() =>
              router.push("/availability")
            }
            className="bg-yellow-500 hover:bg-yellow-600 text-black p-5 rounded-2xl font-bold text-lg"
          >
            📅 Availability
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() =>
              router.push("/payment")
            }
            className="bg-white hover:bg-gray-200 text-black p-5 rounded-2xl font-bold text-lg"
          >
            💳 Payment
          </motion.button>

        </div>

        {/* BOOKINGS */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-yellow-400">
            Your Bookings
          </h2>
        </div>

        <div className="space-y-6">

          {bookings.length === 0 ? (

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">
              <p className="text-gray-400 text-lg">
                No bookings found
              </p>
            </div>

          ) : (

            bookings.map((booking, index) => (

              <motion.div
                key={booking._id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  scale: 1.02,
                }}
                className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-3xl p-6 shadow-xl"
              >
                <div className="grid md:grid-cols-4 gap-6">

                  <div>
                    <p className="text-gray-400">
                      Event Type
                    </p>

                    <h3 className="font-bold text-xl">
                      {booking.eventType}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-400">
                      Event Date
                    </p>

                    <h3 className="font-bold">
                      {new Date(
                        booking.eventDate
                      ).toLocaleDateString()}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-400">
                      Location
                    </p>

                    <h3 className="font-bold">
                      {booking.location}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-400">
                      Status
                    </p>

                    <h3
                      className={`font-bold text-lg ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </h3>
                  </div>

                </div>
              </motion.div>

            ))

          )}

        </div>

      </div>
    </div>
  );
}