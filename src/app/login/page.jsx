"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import * as THREE from "three";

export default function LoginPage() {
  const router = useRouter();
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ========== Three.js 3D Background (Blue/Cyan/Purple tones) ==========
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null; // transparent

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    const cameraRef = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Main object: Icosahedron with wireframe + inner glow
    const geometry = new THREE.IcosahedronGeometry(1.1, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00b4d8,
      emissive: 0x0077b6,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(geometry, material);
    scene.add(core);

    // Wireframe shell
    const wireframeGeo = new THREE.IcosahedronGeometry(1.25, 0);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x7209b7,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const wireframe = new THREE.Mesh(wireframeGeo, wireframeMat);
    scene.add(wireframe);

    // Orbiting rings
    const ringGeo = new THREE.TorusGeometry(1.8, 0.05, 64, 200);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x00b4d8, emissive: 0x0077b6, emissiveIntensity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(2.1, 0.03, 64, 200);
    const ring2Mat = new THREE.MeshStandardMaterial({ color: 0x7209b7, emissive: 0x4c0d6e, emissiveIntensity: 0.4 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    scene.add(ring2);

    // Floating particles
    const particleCount = 600;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00b4d8,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

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
      core.rotation.x = time * 0.4;
      core.rotation.y = time * 0.6;
      wireframe.rotation.x = time * 0.42;
      wireframe.rotation.y = time * 0.62;
      ring.rotation.x = Math.sin(time * 0.5) * 0.5;
      ring.rotation.z = time * 0.4;
      ring2.rotation.x = Math.cos(time * 0.4) * 0.3;
      ring2.rotation.z = time * 0.3;
      particles.rotation.y = time * 0.05;
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
      renderer.dispose();
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://d-entertainment-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("userInfo", JSON.stringify(data));
      alert("Login Successful");

      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A] px-4">
      {/* 3D Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 bg-black/40 backdrop-blur-sm border border-white/10 p-10 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-6">
          <motion.h1
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "100% 50%" }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            className="text-4xl font-extrabold bg-gradient-to-r from-[#E11D48] via-[#FBBF24] to-[#E11D48] bg-clip-text text-transparent bg-[length:200%_auto]"
          >
            Welcome Back
          </motion.h1>
          <p className="text-gray-400 mt-2">Sign in to continue your booking</p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-300 text-sm block mb-1">Email</label>
            <input
              type="email"
              name="email"
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
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[#FBBF24] hover:text-[#E11D48] transition-colors font-medium"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}