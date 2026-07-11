"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Star,
  Headphones,
  Calendar,
  User,
  LogIn,
  LogOut,
  Bell,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.token) setUser(parsed);
        else setUser(null);
      } catch {
        setUser(null);
      }
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Star },
    { href: "/about", label: "About", icon: User },
    { href: "/contact", label: "Contact", icon: Headphones },
    { href: "/gallery", label: "Gallery", icon: Calendar },
  ];

  const handleBooking = () => {
    if (!user) {
      router.push("/login");
      setIsMobileMenuOpen(false);
      return;
    }
    if (user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/gallery");
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* DJSHAN Brand Colors: Red, Yellow, White, Black */}
      <style jsx global>{`
        :root {
          --dj-red: #E11D48;      /* bold red - primary */
          --dj-yellow: #FBBF24;    /* energetic yellow - accent */
          --dj-white: #FFFFFF;
          --dj-black: #0A0A0A;
          --dj-gray: #1A1A1A;
        }
      `}</style>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[var(--dj-black)]/95 backdrop-blur-xl border-b border-red-900/50 shadow-2xl py-3"
            : "bg-[var(--dj-black)]/80 backdrop-blur-md py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LOGO - DJSHAN SOUND & ENTERTAINMENT */}
            <Link href="/logo.jpg" className="flex items-center gap-3 group">
              <div
                className="rounded-full p-2 shadow-lg group-hover:scale-105 transition-transform"
                style={{
                  background: `linear-gradient(135deg, var(--dj-red), var(--dj-yellow))`,
                }}
              >
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <h1
                  className="text-2xl font-extrabold tracking-tight"
                  style={{
                    background: `linear-gradient(to right, var(--dj-red), var(--dj-yellow))`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  D Entertainment
                </h1>
                <span className="text-[10px] font-medium text-white/70 tracking-wider -mt-1">
                  SOUND & ENTERTAINMENT
                </span>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all relative ${
                        isActive
                          ? "text-[var(--dj-red)] bg-red-500/10 shadow-[0_0_8px_var(--dj-red)]"
                          : "text-white/70 hover:text-[var(--dj-yellow)]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="active-indicator"
                          className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[var(--dj-red)]"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}

              <button className="relative p-2 rounded-full hover:bg-white/10 transition">
                <Bell className="w-5 h-5 text-white/70" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--dj-yellow)] rounded-full animate-pulse" />
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                className="ml-4"
              >
                <div
                  className="px-7 py-3 rounded-full text-white font-semibold flex items-center gap-2 shadow-lg shadow-red-900/40"
                  style={{
                    background: `linear-gradient(135deg, var(--dj-red), #B91C1C)`,
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  {user ? (user.role === "admin" ? "Admin Panel" : "Book Now") : "Login to Book"}
                </div>
              </motion.button>

              {user ? (
                <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/20">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, var(--dj-red), var(--dj-yellow))`,
                    }}
                  >
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-white/80 hidden lg:inline">
                    {user.name?.split(" ")[0] || "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-white/10 transition"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              ) : (
                <Link href="/login">
                  <div className="p-2 rounded-full hover:bg-white/10 transition ml-2">
                    <LogIn className="w-5 h-5 text-white/70" />
                  </div>
                </Link>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 bg-[var(--dj-gray)] rounded-lg backdrop-blur-sm border border-white/10"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 w-[80%] max-w-sm h-full bg-[var(--dj-black)] z-50 p-6 shadow-2xl border-l border-red-900/50"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-end mb-6">
                  <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                    <X className="text-white" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-lg py-4 px-3 rounded-xl transition ${
                        pathname === link.href
                          ? "bg-red-500/10 text-[var(--dj-red)] border-l-4 border-[var(--dj-red)]"
                          : "text-white/70 hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <button
                    onClick={handleBooking}
                    className="mt-4 text-white py-3 rounded-xl font-medium shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, var(--dj-red), #B91C1C)`,
                    }}
                  >
                    {user ? (user.role === "admin" ? "Admin Panel" : "Book Now") : "Login to Book"}
                  </button>

                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="mt-2 flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/40 text-red-400"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mt-2 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/20 text-white/80"
                    >
                      <LogIn className="w-4 h-4" /> Login
                    </Link>
                  )}
                </div>

                <div className="pt-6 text-center text-xs text-white/40 border-t border-white/10">
                  D Entertainment SOUND & ENTERTAINMENT
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-24" />
    </>
  );
}