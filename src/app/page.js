"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DJCard from "../components/DJCard";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      {/* 🔹 HERO */}
      <section className="text-center py-20 bg-gray-200">
        <h2 className="text-3xl md:text-4xl font-bold italic">
          "Find the Perfect DJ for Your Event"
        </h2>

        <div className="mt-6 space-x-4">
          <button className="bg-blue-500 text-white px-6 py-2 rounded">
            About Us
          </button>
          <button className="bg-gray-700 text-white px-6 py-2 rounded">
            Book DJ
          </button>
        </div>
      </section>

      {/* 🔹 FEATURED */}
      <section className="px-10 py-12">
        <h3 className="text-center text-lg font-semibold italic mb-8">
          Featured DJs
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[1,2,3,4,5].map((i) => (
            <DJCard key={i} />
          ))}
        </div>
      </section>

      {/* 🔹 HOW IT WORKS */}
      <section className="text-center py-12">
        <h3 className="text-lg font-semibold italic mb-10">
          How It Works
        </h3>

        <div className="grid md:grid-cols-3 gap-8 px-10">
          
          <div>
            <div className="w-12 h-12 mx-auto bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3">
              🔍
            </div>
            <p className="text-sm font-semibold">Step 1</p>
            <p className="text-xs text-gray-500">
              Find your perfect DJ.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 mx-auto bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3">
              📅
            </div>
            <p className="text-sm font-semibold">Step 2</p>
            <p className="text-xs text-gray-500">
              Book your event date.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 mx-auto bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3">
              🎵
            </div>
            <p className="text-sm font-semibold">Step 3</p>
            <p className="text-xs text-gray-500">
              Enjoy the music!
            </p>
          </div>

        </div>
      </section>

      <Footer />

    </div>
  );
}