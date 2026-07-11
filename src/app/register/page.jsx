"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, UserPlus, AlertCircle, Eye, EyeOff } from "lucide-react";
import * as THREE from "three";

export default function RegisterPage() {
  const router = useRouter();
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // ========== Three.js 3D Background (Blue/Cyan/Purple tones) ==========
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null; // transparent

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Main object: Torus Knot with cyan/blue gradient material
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.28, 200, 32, 3, 4);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00b4d8,
      emissive: 0x0077b6,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
    });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);
    knotRef.current = knot;

    // Orbiting rings
    const ringGeo = new THREE.TorusGeometry(1.9, 0.05, 64, 200);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x00b4d8, emissive: 0x0077b6, emissiveIntensity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);
    ringRef.current = ring;

    const ring2Geo = new THREE.TorusGeometry(2.2, 0.03, 64, 200);
    const ring2Mat = new THREE.MeshStandardMaterial({ color: 0x7209b7, emissive: 0x4c0d6e, emissiveIntensity: 0.4 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    scene.add(ring2);

    // Floating particles (cyan and purple)
    const particleCount = 800;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00b4d8,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    // Lighting
    const ambient = new THREE.AmbientLight(0x303030);
    scene.add(ambient);
    const light1 = new THREE.PointLight(0x00b4d8, 1);
    light1.position.set(2, 3, 4);
    scene.add(light1);
    const light2 = new THREE.PointLight(0x7209b7, 0.8);
    light2.position.set(-2, 1, 3);
    scene.add(light2);
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 0, -5);
    scene.add(backLight);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.008;
      if (knotRef.current) {
        knotRef.current.rotation.x = time * 0.5;
        knotRef.current.rotation.y = time * 0.7;
      }
      if (ringRef.current) {
        ringRef.current.rotation.x = Math.sin(time * 0.5) * 0.5;
        ringRef.current.rotation.z = time * 0.4;
        ring2.rotation.x = Math.cos(time * 0.4) * 0.3;
        ring2.rotation.z = time * 0.3;
      }
      if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.05;
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

  // Refs for Three.js
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const knotRef = useRef(null);
  const ringRef = useRef(null);
  const particlesRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");

    if (name === "password") {
      let strength = 0;
      if (value.length >= 6) strength++;
      if (value.match(/[a-z]/) && value.match(/[A-Z]/)) strength++;
      if (value.match(/[0-9]/)) strength++;
      if (value.match(/[^a-zA-Z0-9]/)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://d-entertainment-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }
      alert("Registration successful! Please log in.");
      router.push("/login");
    } catch (error) {
      console.error(error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A] px-4">
      {/* 3D Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 bg-black/40 backdrop-blur-sm border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-6">
          <motion.h1
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "100% 50%" }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            className="text-3xl font-extrabold bg-gradient-to-r from-[#E11D48] via-[#FBBF24] to-[#E11D48] bg-clip-text text-transparent bg-[length:200%_auto]"
          >
            Join D Entertainment
          </motion.h1>
          <p className="text-gray-400 mt-2">Create an account to book events</p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#E11D48] to-[#FBBF24] mx-auto mt-3 rounded-full" />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-[#E11D48] text-[#E11D48] text-sm p-3 rounded-xl mb-5 flex items-center gap-2"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm block mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black/60 border border-white/10 focus:border-[#E11D48] focus:outline-none transition-colors text-white"
              required
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-1">Email</label>
            <input
              type="email"
              name="email"
              inputMode="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black/60 border border-white/10 focus:border-[#E11D48] focus:outline-none transition-colors text-white"
              required
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-black/60 border border-white/10 focus:border-[#E11D48] focus:outline-none transition-colors text-white pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FBBF24] transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      passwordStrength >= level
                        ? level <= 2
                          ? "bg-[#E11D48]"
                          : "bg-[#FBBF24]"
                        : "bg-white/20"
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-400 ml-2">
                  {passwordStrength === 0 && "Weak"}
                  {passwordStrength === 1 && "Fair"}
                  {passwordStrength === 2 && "Good"}
                  {passwordStrength >= 3 && "Strong"}
                </span>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all duration-300 py-3 rounded-xl font-semibold shadow-lg shadow-red-900/30 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Register
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#FBBF24] hover:text-[#E11D48] transition-colors font-medium"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}