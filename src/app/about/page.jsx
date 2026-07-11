"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MapPin,
  Music,
  Users,
  Award,
  Headphones,
  Calendar,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export default function AboutDJPage() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereRef = useRef(null);
  const ringRef = useRef(null);
  const particlesRef = useRef(null);

  const djData = {
    name: "D Entertainment",
    genre: "Electronic / House / Techno",
    price: 150,
    rating: 4.9,
    reviews: 342,
    location: "Colombo 01, Sri Lanka",
    experience: "5+ years",
    events: "150+ events",
    bio: "D Entertainment is an internationally acclaimed DJ with over a decade of experience performing at top venues worldwide. Specializing in electronic, house, and techno music, he delivers high-energy performances designed to create unforgettable experiences.",
  };

  const handleBookNow = () => {
    const user = localStorage.getItem("userInfo");
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/login");
  };

  // ========== Three.js 3D Scene ==========
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null; // transparent
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // --- Create Central Glowing Sphere ---
    const geometry = new THREE.SphereGeometry(1.2, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      emissive: 0xe11d48,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;

    // Add a wireframe sphere around it
    const wireframeGeo = new THREE.SphereGeometry(1.25, 32, 32);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const wireframe = new THREE.Mesh(wireframeGeo, wireframeMat);
    scene.add(wireframe);
    sphereRef.current.wireframe = wireframe;

    // --- Orbiting Rings ---
    const ringGeo = new THREE.TorusGeometry(1.8, 0.05, 64, 200);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xfbbf24, emissiveIntensity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);
    ringRef.current = ring;

    const ring2Geo = new THREE.TorusGeometry(2.1, 0.03, 64, 200);
    const ring2Mat = new THREE.MeshStandardMaterial({ color: 0xe11d48, emissive: 0xe11d48, emissiveIntensity: 0.2 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    scene.add(ring2);

    // --- Vinyl Disc (beneath) ---
    const discGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.05, 128);
    const discMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4, metalness: 0.8 });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.z = -0.3;
    scene.add(disc);

    // --- Floating Music Note Particles ---
    const particleCount = 400;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    // --- Lighting ---
    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);
    const light1 = new THREE.PointLight(0xe11d48, 1);
    light1.position.set(2, 3, 4);
    scene.add(light1);
    const light2 = new THREE.PointLight(0xfbbf24, 0.8);
    light2.position.set(-2, 1, 3);
    scene.add(light2);
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 0, -5);
    scene.add(backLight);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.008;
      if (sphereRef.current) {
        sphereRef.current.rotation.y = time * 0.3;
        sphereRef.current.rotation.x = Math.sin(time * 0.2) * 0.2;
        if (sphereRef.current.wireframe) sphereRef.current.wireframe.rotation.copy(sphereRef.current.rotation);
      }
      if (ringRef.current) {
        ringRef.current.rotation.x = Math.sin(time * 0.5) * 0.5;
        ringRef.current.rotation.z = time * 0.4;
        ring2.rotation.x = Math.cos(time * 0.4) * 0.3;
        ring2.rotation.z = time * 0.3;
      }
      disc.rotation.z = time * 0.2;
      if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.05;
        particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, []);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const cardHover = {
    hover: { scale: 1.05, y: -5, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A] text-white overflow-hidden relative">
      {/* 3D Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ objectFit: "cover" }}
      />

      {/* Main Content with staggered animations (overlay) */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto px-6 py-12"
      >
        {/* Header Section */}
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between gap-6 mb-10">
          <div>
            <motion.h1
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              className="text-5xl font-extrabold bg-gradient-to-r from-[#E11D48] via-[#FBBF24] to-[#E11D48] bg-clip-text text-transparent bg-[length:200%_auto]"
            >
              {djData.name}
            </motion.h1>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-300 text-sm">
              <span className="flex items-center gap-1">
                <Music size={16} className="text-[#E11D48]" /> {djData.genre}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={16} className="text-[#FBBF24]" /> {djData.location}
              </span>
              <span className="flex items-center gap-1">
                <Star size={16} className="text-[#FBBF24] fill-[#FBBF24]" /> {djData.rating}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #E11D48" }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: ["0 0 0px #E11D48", "0 0 12px #E11D48", "0 0 0px #E11D48"],
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            onClick={handleBookNow}
            className="bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all duration-300 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-red-900/30"
          >
            <Calendar size={18} />
            Book Now
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Users, label: djData.events, sub: "Events", color: "#FBBF24" },
            { icon: Award, label: djData.experience, sub: "Experience", color: "#E11D48" },
            { icon: Star, label: djData.reviews, sub: "Reviews", color: "#FBBF24" },
            { icon: Headphones, label: "DJ", sub: "Artist", color: "#E11D48" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={cardHover}
              whileHover="hover"
              className="bg-black/40 backdrop-blur-sm border border-white/10 p-4 rounded-xl text-center hover:border-[#E11D48] transition-all"
            >
              <stat.icon className="mx-auto mb-2" style={{ color: stat.color }} />
              <p className="text-lg font-bold text-white">{stat.label}</p>
              <p className="text-gray-400 text-sm">{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bio Section */}
        <motion.div
          variants={fadeUp}
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-xl mb-10"
        >
          <h2 className="text-2xl font-bold mb-3 border-l-4 border-[#E11D48] pl-3">
            About <span className="text-[#FBBF24]">D Entertainment</span>
          </h2>
          <p className="text-gray-300 leading-relaxed">{djData.bio}</p>
        </motion.div>

        {/* Social Links with Bounce */}
        <motion.div variants={fadeUp} className="flex gap-4">
          {[FaInstagram, FaFacebook, FaTwitter].map((Icon, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Icon
                className={`text-2xl text-gray-400 hover:text-[${idx === 2 ? "#FBBF24" : "#E11D48"}] cursor-pointer transition-colors`}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = idx === 2 ? "#FBBF24" : "#E11D48")
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}