"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Home() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const torusRef = useRef(null);

  // State for 3D tilt effect
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Variants for staggered text reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  const glowVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  // Floating particles data
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
    color: Math.random() > 0.6 ? "#E11D48" : "#FBBF24",
  }));

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

    // Create a glowing torus knot
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.3, 200, 32, 3, 4);
    const material = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      emissive: 0xe11d48,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);
    torusRef.current = torus;

    // Add a secondary ring with yellow color
    const ringGeometry = new THREE.TorusGeometry(1.6, 0.08, 64, 200);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    scene.add(ring);

    // Add some floating particles in 3D space
    const particleCount = 800;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 20;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0xe11d48, 1);
    pointLight1.position.set(2, 3, 4);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xfbbf24, 0.8);
    pointLight2.position.set(-2, 1, 3);
    scene.add(pointLight2);
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 0, -5);
    scene.add(backLight);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.008;
      if (torusRef.current) {
        torusRef.current.rotation.x = time * 0.5;
        torusRef.current.rotation.y = time * 0.8;
      }
      ring.rotation.x = time * 0.3;
      ring.rotation.y = time * 0.5;
      particleSystem.rotation.y = time * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // ========== 3D Tilt Effect on Hero Content ==========
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRotate = 8; // degrees
    const rotateYVal = ((e.clientX - centerX) / (rect.width / 2)) * maxRotate;
    const rotateXVal = ((e.clientY - centerY) / (rect.height / 2)) * -maxRotate;
    setRotateY(rotateYVal);
    setRotateX(rotateXVal);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A0A0A] text-white relative overflow-hidden">
      {/* Three.js Canvas (3D Background) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ objectFit: "cover" }}
      />

      {/* Animated background particles (2D, over canvas) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              left: p.left,
              top: p.top,
              filter: "blur(2px)",
            }}
            animate={{
              y: [0, -40, 0, 40, 0],
              x: [0, 30, 0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating animated shapes (2D) */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-r from-[#E11D48]/10 to-[#FBBF24]/10 blur-3xl"
        animate={{
          x: [0, 30, 0, -30, 0],
          y: [0, -20, 0, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-[#FBBF24]/10 to-[#E11D48]/10 blur-3xl"
        animate={{
          x: [0, -20, 0, 20, 0],
          y: [0, 30, 0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hero Section with 3D Tilt */}
      <section
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 flex flex-col justify-center items-center text-center h-screen px-5"
        style={{
          perspective: "1000px",
        }}
      >
        <motion.div
          className="max-w-4xl mx-auto"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          {/* Pulsing glow behind heading */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-red-600/20 blur-[120px] rounded-full -z-10"
            variants={glowVariants}
            animate="animate"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6"
            >
              <span className="bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent">
                D Entertainment
              </span>{" "}
              <span className="text-white">Sound & Entertainment</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-white/80 max-w-2xl mx-auto mb-8 text-lg md:text-xl"
            >
              Professional DJ booking platform for weddings, parties, musical shows,
              and special events. Experience the rhythm with red-hot energy.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Link
                href="/login"
                className="group relative px-10 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 overflow-hidden shadow-lg shadow-red-900/50 hover:shadow-red-600/50 inline-flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #E11D48, #B91C1C)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book Now
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-[#FBBF24] to-[#E11D48] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                  animate={{}}
                />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Animated decorative line */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 rounded-full"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 128, opacity: 1 }}
          transition={{ delay: 1, duration: 1, ease: "easeOut" }}
        />
      </section>
    </main>
  );
}