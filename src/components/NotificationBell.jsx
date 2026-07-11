"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "../lib/socket";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let userInfo;

    try {
      userInfo = JSON.parse(localStorage.getItem("userInfo"));
    } catch (err) {
      console.log("Invalid userInfo");
      return;
    }

    if (!userInfo?.token || !userInfo?._id) return;

    // register user
    socket.emit("registerUser", userInfo._id);

    // fetch notifications
    fetchNotifications(userInfo.token);

    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("newNotification", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, []);

  const fetchNotifications = async (token) => {
    try {
      const res = await fetch(
        "https://d-entertainment-backend.onrender.com/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Notification fetch error:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ✅ PAYMENT NAVIGATION
  const handlePayment = (bookingId) => {
    localStorage.setItem("latestBookingId", bookingId);
    router.push("/payment");
  };

  return (
    <div className="relative">

      {/* Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative"
      >
        <Bell size={28} />

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-4 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl z-50 max-h-[500px] overflow-y-auto">

          <div className="p-5 border-b border-slate-800">
            <h2 className="text-xl font-semibold">
              Notifications
            </h2>
          </div>

          {notifications.length === 0 ? (
            <p className="p-5 text-slate-400">
              No notifications
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-5 border-b border-slate-800 ${
                  !notification.read ? "bg-slate-800" : ""
                }`}
              >

                {/* TITLE */}
                <h3 className="font-semibold">
                  {notification.title}
                </h3>

                {/* MESSAGE */}
                <p className="text-sm text-slate-400 mt-1">
                  {notification.message}
                </p>

                {/* ✅ PAYMENT BUTTON */}
                {notification.action === "PAYMENT_REQUIRED" && (
                  <button
                    onClick={() =>
                      handlePayment(notification.bookingId)
                    }
                    className="mt-3 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm"
                  >
                    💳 Pay Now
                  </button>
                )}

              </div>
            ))
          )}

        </div>
      )}
    </div>
  );
}