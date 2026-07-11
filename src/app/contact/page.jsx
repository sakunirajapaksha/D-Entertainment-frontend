"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Clock,
  User,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const err = {};

    if (!form.name) err.name = "Name required";
    if (!form.email) err.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      err.email = "Invalid email";

    if (!form.subject) err.subject = "Subject required";
    if (!form.message) err.message = "Message required";

    return err;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setLoading(true);

    try {
      // 👉 CONNECT TO BACKEND (optional)
      // await fetch("http://localhost:5000/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });

      await new Promise((r) => setTimeout(r, 1200));

      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const contacts = [
    {
      icon: Mail,
      title: "Email",
      value: "shanentertainment10@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+94 75 365 9325",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Colombo, Sri Lanka",
    },
    {
      icon: Clock,
      title: "Hours",
      value: "24/7 Support",
    },
  ];

  const social = [
    { Icon: FaFacebook, color: "#E11D48" },
    { Icon: FaInstagram, color: "#E11D48" },
    { Icon: FaTwitter, color: "#FBBF24" },
    { Icon: FaYoutube, color: "#E11D48" },
  ];

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A] text-white">
      {/* HEADER with animated gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-gray-400 mt-3">We reply within 24 hours</p>
        <div className="w-24 h-1 bg-gradient-to-r from-[#E11D48] to-[#FBBF24] mx-auto mt-4 rounded-full" />
      </motion.div>

      {/* CONTACT GRID */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-10"
      >
        {/* FORM SECTION */}
        <motion.div variants={fadeUp} className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-[#E11D48] pl-3">
            Send Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 bg-black/50 border border-white/10 rounded-lg focus:border-[#E11D48] focus:outline-none transition-colors"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[#E11D48] text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={14} /> {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <input
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 bg-black/50 border border-white/10 rounded-lg focus:border-[#E11D48] focus:outline-none transition-colors"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[#E11D48] text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={14} /> {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <input
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full p-3 bg-black/50 border border-white/10 rounded-lg focus:border-[#E11D48] focus:outline-none transition-colors"
              />
              <AnimatePresence>
                {errors.subject && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[#E11D48] text-sm mt-1"
                  >
                    {errors.subject}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 bg-black/50 border border-white/10 rounded-lg focus:border-[#E11D48] focus:outline-none transition-colors resize-none"
              />
              <AnimatePresence>
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[#E11D48] text-sm mt-1"
                  >
                    {errors.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all duration-300 py-3 rounded-lg font-bold shadow-lg shadow-red-900/30 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">...</svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send Message <Send size={18} />
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {success && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-[#FBBF24] flex items-center justify-center gap-2 mt-2"
                >
                  <CheckCircle size={18} /> Message sent successfully!
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* INFO & SOCIAL */}
        <div className="space-y-6">
          {/* Contact Info Card */}
          <motion.div variants={fadeUp} className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 border-l-4 border-[#E11D48] pl-3">
              Contact Info
            </h2>
            <div className="space-y-3">
              {contacts.map((c, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
                >
                  <c.icon className="text-[#E11D48]" />
                  <span className="text-gray-300">{c.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Media Card */}
          <motion.div variants={fadeUp} className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 border-l-4 border-[#FBBF24] pl-3">
              Social Media
            </h2>
            <div className="flex gap-5">
              {social.map(({ Icon, color }, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Icon
                    className="text-3xl text-gray-400 hover:text-[color] cursor-pointer transition-colors"
                    style={{ hover: { color } }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Map placeholder (optional) */}
          <motion.div variants={fadeUp} className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-2xl overflow-hidden">
            <h2 className="text-xl font-bold mb-3 border-l-4 border-[#E11D48] pl-3">
              Find Us
            </h2>
            <div className="w-full h-48 bg-black/50 rounded-lg flex items-center justify-center text-gray-500 border border-white/10">
              <MapPin className="text-[#E11D48] mr-2" /> Colombo, Sri Lanka
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}