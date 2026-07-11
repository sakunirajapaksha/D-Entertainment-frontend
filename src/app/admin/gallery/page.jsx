"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Trash2,
  Image,
  Loader2,
  Plus,
} from "lucide-react";

export default function AdminGalleryPage() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH IMAGES
  // ======================
  const fetchImages = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://d-entertainment-backend.onrender.com/api/gallery"
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setGallery(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // ======================
  // HANDLE IMAGE SELECT
  // ======================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ======================
  // UPLOAD
  // ======================
  const handleUpload = async () => {
    if (!title || !image) {
      alert("Title and Image required");
      return;
    }

    const userInfo = JSON.parse(
      localStorage.getItem("userInfo") || "{}"
    );

    if (!userInfo?.token) {
      alert("Not authorized");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    try {
      const res = await fetch(
        "https://d-entertainment-backend.onrender.com/api/gallery",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setTitle("");
      setImage(null);
      setPreview(null);
      fetchImages();

      alert("Upload successful");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    if (!confirm("Delete this image?")) return;

    const userInfo = JSON.parse(
      localStorage.getItem("userInfo") || "{}"
    );

    try {
      const res = await fetch(
        `https://d-entertainment-backend.onrender.com/api/gallery/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      fetchImages();
    } catch (err) {
      console.error(err);
      alert("Delete error");
    }
  };

  // ======================
  // ANIMATION
  // ======================
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold text-red-600">
            Gallery Management
          </h1>
        </motion.div>

        {/* UPLOAD BOX */}
        <div className="bg-white border p-6 rounded-2xl mb-10">

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-xl mb-3"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mb-3"
          />

          {/* PREVIEW */}
          {preview && (
            <img
              src={preview}
              className="w-40 h-40 object-cover rounded-xl mb-3"
            />
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-red-600 text-white px-5 py-2 rounded-xl"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* GALLERY */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <motion.div
                key={item._id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="border rounded-2xl overflow-hidden"
              >
                <img
                  src={item.imageUrl}
                  className="w-full h-60 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <button
                    onClick={() =>
                      handleDelete(item._id)
                    }
                    className="mt-2 bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}