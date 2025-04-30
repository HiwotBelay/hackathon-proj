"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function MagicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Create particles
    const particlesArray: Particle[] = [];
    const numberOfParticles = 50;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;

        // Create a gradient color
        const hue = Math.random() * 60 + 200; // Blue to purple range
        this.color = `hsla(${hue}, 70%, 60%, 0.8)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }

        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    init();

    const connectParticles = () => {
      if (!ctx) return;

      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const opacity = 1 - distance / 200;
            ctx.strokeStyle = `rgba(148, 130, 238, ${opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "rgba(238, 240, 255, 0.01)");
      gradient.addColorStop(1, "rgba(236, 230, 255, 0.01)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      connectParticles();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10 opacity-70 pointer-events-none"
      />
      <div className="fixed top-0 left-0 w-full h-full -z-20 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950 dark:to-purple-950" />

      {/* Floating shapes for additional visual interest */}
      <motion.div
        className="fixed top-[20%] left-[10%] w-32 h-32 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-900/20 dark:to-purple-900/20 blur-3xl -z-10 opacity-30"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed top-[60%] right-[15%] w-40 h-40 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-900/20 dark:to-indigo-900/20 blur-3xl -z-10 opacity-30"
        animate={{
          x: [0, -40, 0],
          y: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed bottom-[10%] left-[30%] w-36 h-36 rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 dark:from-yellow-900/20 dark:to-orange-900/20 blur-3xl -z-10 opacity-20"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: "easeInOut",
        }}
      />
    </>
  );
}
