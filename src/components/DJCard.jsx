"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Music, Calendar, Eye, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function DJCard({ dj = {} }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Safe default values
  const {
    name = "DJ MASTERMIND",
    genre = "Wedding / Corporate",
    price = 150,
    rating = 4.8,
    reviews = 124,
    location = "New York, NY",
    image = "",
    experience = "8+ years"
  } = dj;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative group bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse" />
        <div className="p-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
      suppressHydrationWarning
    >
      {/* Gradient Border Animation */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur" />
      
      {/* Card Content */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400x400?text=DJ+Image";
              }}
              suppressHydrationWarning
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-12 h-12 text-white/50" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Badge */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
            <Music className="w-3 h-3" />
            {genre?.split(" ")[0] || "DJ"}
          </div>
          
          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg"
            suppressHydrationWarning
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </motion.button>
          
          {/* Experience Badge */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-medium">
            ⚡ {experience}
          </div>
          
          {/* Rating Badge */}
          <div className="absolute bottom-3 right-3 bg-yellow-500/90 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            {rating} ({reviews})
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div>
            <h3 className="font-bold text-gray-800 text-lg truncate">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{location}</span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {genre?.split(" / ").map((g, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Starting from</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${price}
                <span className="text-xs text-gray-400">/hr</span>
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden group/btn"
              suppressHydrationWarning
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left" />
              <div className="relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md group-hover/btn:shadow-xl transition-all">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </div>
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
              <button 
                className="flex-1 text-xs py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition flex items-center justify-center gap-1"
                suppressHydrationWarning
              >
                <Calendar className="w-3 h-3" />
                Quick Book
              </button>
              <button 
                className="flex-1 text-xs py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-600 transition flex items-center justify-center gap-1"
                suppressHydrationWarning
              >
                <Music className="w-3 h-3" />
                Mixes
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}