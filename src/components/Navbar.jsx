"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      
      {/* Logo */}
      <h1 className="text-blue-600 font-semibold text-lg">
        D Entertainment
      </h1>

      {/* Menu */}
      <div className="flex items-center space-x-6 text-sm">
        <Link href="/" className="hover:text-blue-500">Home</Link>
        <Link href="/about" className="hover:text-blue-500">About us</Link>
        <Link href="/contact" className="hover:text-blue-500">Contact</Link>

        {/* Book Button */}
        <Link
          href="/booking"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Book
        </Link>
      </div>
    </nav>
  );
}