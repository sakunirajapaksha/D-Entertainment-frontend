"use client";

import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  FaChevronUp,
  FaHeadphones,
  FaDiscord,
  FaTiktok,
  FaSpotify,
} from "react-icons/fa";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await new Promise((res) => setTimeout(res, 1200));
    setLoading(false);
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const quickLinks = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/about", label: "About", icon: "🎧" },
    { href: "/contact", label: "Contact", icon: "📩" },
    { href: "/login", label: "Book DJ", icon: "📅" },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "#", color: "hover:text-[#E11D48]" },
    { icon: FaInstagram, href: "#", color: "hover:text-[#FBBF24]" },
    { icon: FaTwitter, href: "#", color: "hover:text-[#E11D48]" },
    { icon: FaYoutube, href: "#", color: "hover:text-[#E11D48]" },
    { icon: FaTiktok, href: "#", color: "hover:text-white" },
    { icon: FaSpotify, href: "#", color: "hover:text-[#1DB954]" }, // keep green for spotify brand
  ];

  const contactInfo = [
    {
      icon: FaEnvelope,
      text: "shanentertainment10@gmail.com",
      href: "mailto:shanentertainment10@gmail.com",
    },
    {
      icon: FaPhone,
      text: "+94 75 365 9325",
      href: "tel:+94753659325",
    },
    {
      icon: FaMapMarkerAlt,
      text: "Colombo 01, Sri Lanka",
      href: "#",
    },
  ];

  return (
    <>
      <footer className="relative bg-black text-white overflow-hidden">
        {/* Background glows - red and yellow instead of purple/pink */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#E11D48] blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#FBBF24] blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* TOP GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* BRAND */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-gradient-to-br from-[#E11D48] to-[#FBBF24]">
                  <FaHeadphones className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent">
                    D Entertainment
                  </h2>
                  <p className="text-[10px] text-white/50 -mt-1">SOUND & ENTERTAINMENT</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Premium DJ booking platform for events, parties & weddings.
              </p>
              <div className="flex gap-3 mt-5">
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className={`p-2 bg-white/10 rounded-full transition-all duration-300 ${s.color} hover:bg-white/20`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="font-semibold mb-4 text-[#FBBF24] border-l-3 border-[#E11D48] pl-3">
                Quick Links
              </h3>
              <div className="space-y-2">
                {quickLinks.map((l, i) => (
                  <Link
                    key={i}
                    href={l.href}
                    className="block text-gray-400 hover:text-[#FBBF24] transition"
                  >
                    <span className="mr-2">{l.icon}</span> {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="font-semibold mb-4 text-[#FBBF24] border-l-3 border-[#E11D48] pl-3">
                Contact
              </h3>
              <div className="space-y-3">
                {contactInfo.map((c, i) => (
                  <a
                    key={i}
                    href={c.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                  >
                    <c.icon className="text-[#E11D48]" />
                    <span className="text-sm">{c.text}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* NEWSLETTER */}
            <div>
              <h3 className="font-semibold mb-4 text-[#FBBF24] border-l-3 border-[#E11D48] pl-3">
                Newsletter
              </h3>
              <form onSubmit={handleSubscribe}>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full p-2 rounded bg-white/10 outline-none focus:ring-2 focus:ring-[#E11D48] transition"
                  type="email"
                  required
                />
                <button
                  disabled={loading}
                  className="w-full mt-3 bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all duration-300 p-2 rounded font-semibold"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
              <AnimatePresence>
                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[#FBBF24] text-sm mt-2"
                  >
                    ✓ Subscribed successfully!
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p className="flex items-center gap-1">
              © 2026 Made with
              <FaHeart className="text-[#E11D48] animate-pulse" />
              <span className="bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent font-medium">
                D Entertainment
              </span>
            </p>
            <div className="flex gap-3">
              <span className="hover:text-[#FBBF24] transition">Visa</span>
              <span className="hover:text-[#FBBF24] transition">Mastercard</span>
              <span className="hover:text-[#FBBF24] transition">PayHere</span>
            </div>
          </div>
        </div>
      </footer>

      {/* SCROLL TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-[#E11D48] to-[#B91C1C] p-3 rounded-full shadow-lg hover:shadow-[#E11D48]/50 transition-all duration-300 z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
          >
            <FaChevronUp className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}