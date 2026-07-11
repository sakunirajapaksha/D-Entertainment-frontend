"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Wallet,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function BookingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const [formData, setFormData] = useState({
    eventType: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    guests: "",
    notes: "",
  });

  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [errors, setErrors] = useState({});

  // 💰 PRICES (example: $10 per hour for wedding, $8 for birthday)
  const eventPrices = {
    Wedding: 10,
    Birthday: 8,
  };

  const eventTypes = ["Wedding", "Birthday"];

  // AUTH CHECK
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) router.replace("/login");
  }, [router]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  // ⏱ HOURS CALCULATION
  const calculateHours = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const start = new Date(`1970-01-01T${formData.startTime}:00`);
    const end = new Date(`1970-01-01T${formData.endTime}:00`);
    const diff = (end - start) / (1000 * 60 * 60);
    return diff > 0 ? diff : 0;
  };

  const hours = calculateHours();
  const rate = eventPrices[formData.eventType] || 0;
  const totalPrice = hours * rate;

  // CHECK AVAILABILITY
  const checkDateAvailability = async (selectedDate) => {
    if (!selectedDate) return;
    setChecking(true);
    setIsAvailable(false);
    try {
      const res = await fetch(
        `http://localhost:5000/api/availability/check?eventDate=${selectedDate}`
      );
      const data = await res.json();
      if (data.available === false) {
        setAvailabilityMessage("❌ Not available");
        setIsAvailable(false);
      } else {
        setAvailabilityMessage("✅ Available");
        setIsAvailable(true);
      }
    } catch {
      setAvailabilityMessage("Error checking date");
    } finally {
      setChecking(false);
    }
  };

  // VALIDATE
  const validateForm = () => {
    const newErrors = {};
    if (!formData.eventType) newErrors.eventType = "Select event type";
    if (!formData.eventDate) newErrors.eventDate = "Select date";
    if (!formData.startTime) newErrors.startTime = "Start time required";
    if (!formData.endTime) newErrors.endTime = "End time required";
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime)
      newErrors.endTime = "End time must be after start";
    if (!formData.location) newErrors.location = "Location required";
    if (!formData.guests) newErrors.guests = "Guests required";
    else if (parseInt(formData.guests) <= 0) newErrors.guests = "Must be at least 1";
    if (!isAvailable) newErrors.eventDate = "Date not available";
    return newErrors;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const payload = {
        ...formData,
        hours,
        rate,
        totalPrice,
      };
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
      localStorage.setItem(
        "latestBooking",
        JSON.stringify({ ...data, hours, rate, totalPrice })
      );
      router.push("/payment");
    } catch {
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

  const priceVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200 } },
    update: { scale: [1, 1.05, 1], transition: { duration: 0.2 } },
  };

  const inputStyle =
    "w-full p-3 rounded-xl bg-black/60 border border-white/10 focus:border-[#E11D48] focus:outline-none transition-colors text-white placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A] flex justify-center items-center p-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 md:p-10">
          {/* HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent">
              Book DJSHAN
            </h1>
            <p className="text-gray-400 mt-2">Secure your event with premium sound</p>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E11D48] to-[#FBBF24] mx-auto mt-3 rounded-full" />
          </div>

          {/* PRICE DISPLAY */}
          <AnimatePresence mode="wait">
            {formData.eventType && (
              <motion.div
                key="price"
                variants={priceVariants}
                initial="hidden"
                animate="visible"
                whileHover="update"
                className="bg-gradient-to-r from-[#E11D48]/10 to-[#FBBF24]/10 border border-white/10 rounded-xl p-4 mb-6 text-center"
              >
                <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
                  <span className="flex items-center gap-1">💰 Rate: ${rate}/hour</span>
                  <span className="flex items-center gap-1">⏱ Hours: {hours}</span>
                  <span className="flex items-center gap-1 text-[#FBBF24] font-bold text-lg">
                    Total: ${totalPrice}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EVENT TYPE BUTTONS */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <Wallet size={16} className="text-[#E11D48]" /> Event Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {eventTypes.map((type) => (
                  <motion.button
                    key={type}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData({ ...formData, eventType: type });
                      if (errors.eventType) setErrors({ ...errors, eventType: "" });
                    }}
                    className={`py-3 rounded-xl font-semibold transition-all ${
                      formData.eventType === type
                        ? "bg-gradient-to-r from-[#E11D48] to-[#B91C1C] text-white shadow-md"
                        : "bg-black/60 border border-white/10 text-gray-300 hover:border-[#E11D48]"
                    }`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
              {errors.eventType && (
                <p className="text-[#E11D48] text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.eventType}
                </p>
              )}
            </div>

            {/* DATE */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <Calendar size={16} className="text-[#FBBF24]" /> Event Date
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={(e) => {
                  handleChange(e);
                  checkDateAvailability(e.target.value);
                }}
                className={inputStyle}
              />
              <div className="mt-1 text-sm">
                {checking ? (
                  <span className="text-[#FBBF24] flex items-center gap-1">
                    <Loader2 className="animate-spin w-3 h-3" /> Checking...
                  </span>
                ) : availabilityMessage ? (
                  <span className={isAvailable ? "text-green-400" : "text-[#E11D48]"}>
                    {availabilityMessage}
                  </span>
                ) : null}
              </div>
              {errors.eventDate && (
                <p className="text-[#E11D48] text-xs mt-1">{errors.eventDate}</p>
              )}
            </div>

            {/* TIME ROW */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                  <Clock size={16} className="text-[#E11D48]" /> Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  onChange={handleChange}
                  className={inputStyle}
                />
                {errors.startTime && <p className="text-[#E11D48] text-xs mt-1">{errors.startTime}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                  <Clock size={16} className="text-[#FBBF24]" /> End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  onChange={handleChange}
                  className={inputStyle}
                />
                {errors.endTime && <p className="text-[#E11D48] text-xs mt-1">{errors.endTime}</p>}
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <MapPin size={16} className="text-[#E11D48]" /> Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Colombo, Sri Lanka"
                onChange={handleChange}
                className={inputStyle}
              />
              {errors.location && <p className="text-[#E11D48] text-xs mt-1">{errors.location}</p>}
            </div>

            {/* GUESTS */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <Users size={16} className="text-[#FBBF24]" /> Number of Guests
              </label>
              <input
                type="number"
                name="guests"
                placeholder="Approximate guest count"
                onChange={handleChange}
                className={inputStyle}
              />
              {errors.guests && <p className="text-[#E11D48] text-xs mt-1">{errors.guests}</p>}
            </div>

            {/* NOTES */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <FileText size={16} className="text-[#E11D48]" /> Special Requests (Optional)
              </label>
              <textarea
                name="notes"
                placeholder="Any special requests, song preferences..."
                rows="3"
                onChange={handleChange}
                className={inputStyle + " resize-none"}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !isAvailable || checking}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                loading || !isAvailable || checking
                  ? "bg-gray-600 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] shadow-lg shadow-red-900/30"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Processing...
                </>
              ) : (
                <>
                  <Calendar size={18} /> Continue to Payment
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}