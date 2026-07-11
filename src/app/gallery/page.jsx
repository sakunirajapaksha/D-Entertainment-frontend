"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // FETCH GALLERY (SAFE)
  // =========================
  const fetchImages = async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://d-entertainment-backend.onrender.com/api/gallery",
        { signal }
      );

      if (!res.ok) throw new Error("Failed to fetch gallery");

      const data = await res.json();
      setGallery(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchImages(controller.signal);

    return () => controller.abort();
  }, []);

  // =========================
  // ANIMATIONS
  // =========================
  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-[#120000] text-white px-6 py-12">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent">
          D Entertainment Gallery
        </h1>

        <p className="text-gray-400 mt-3">
          Moments from epic events 🎧🔥
        </p>

        <div className="w-24 h-1 mx-auto mt-4 bg-gradient-to-r from-red-600 to-yellow-400 rounded-full" />
      </motion.div>

      {/* LOADING */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-20"
          >
            <Loader2 className="animate-spin w-12 h-12 text-red-500" />
            <p className="text-gray-400 mt-3">
              Loading gallery...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERROR */}
      {!loading && error && (
        <div className="text-center py-20">
          <AlertCircle className="mx-auto w-14 h-14 text-red-500 mb-4" />

          <p className="text-red-400 mb-2">
            Failed to load gallery
          </p>

          <button
            onClick={() => fetchImages()}
            className="flex items-center gap-2 mx-auto bg-red-600 px-5 py-2 rounded-full"
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && gallery.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Image className="mx-auto w-16 h-16 mb-3 opacity-40" />
          No images found
        </div>
      )}

      {/* GRID */}
      {!loading && !error && gallery.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {gallery.map((item) => (
            <motion.div
              key={item._id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden group"
            >
              {/* IMAGE */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/600x400?text=No+Image")
                  }
                />
              </div>

              {/* INFO */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-red-400">
                  {item.title || "Event"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
