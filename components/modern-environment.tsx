"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Cloud, Stars } from "@react-three/drei";
import * as THREE from "three";

interface ModernEnvironmentProps {
  emotion: string;
  timeOfDay: "morning" | "day" | "evening" | "night";
}

export function ModernEnvironment({
  emotion,
  timeOfDay,
}: ModernEnvironmentProps) {
  // Create a more modern, playful environment based on emotion and time of day

  // Get environment colors based on time of day
  const getEnvironmentColors = () => {
    switch (timeOfDay) {
      case "morning":
        return {
          ground: "#88c97e", // Fresh grass
          sky: "#87ceeb", // Light blue sky
          ambient: "#fff4e0", // Warm morning light
        };
      case "day":
        return {
          ground: "#7ec97e", // Vibrant grass
          sky: "#4a99e9", // Bright blue sky
          ambient: "#ffffff", // Bright daylight
        };
      case "evening":
        return {
          ground: "#5a8c70", // Darker grass
          sky: "#ff7e50", // Sunset orange
          ambient: "#ffe0b5", // Warm evening light
        };
      case "night":
        return {
          ground: "#2c3e50", // Dark ground
          sky: "#0a1929", // Dark blue sky
          ambient: "#b5c9e0", // Cool night light
        };
      default:
        return {
          ground: "#7ec97e",
          sky: "#4a99e9",
          ambient: "#ffffff",
        };
    }
  };

  const colors = getEnvironmentColors();

  // Adjust environment based on emotion
  const getEmotionAdjustments = () => {
    switch (emotion) {
      case "happy":
        return {
          particles: true,
          particleColor: "#ffff80",
          lightIntensity: 1.2,
        };
      case "excited":
        return {
          particles: true,
          particleColor: "#ff80ff",
          lightIntensity: 1.3,
        };
      case "sad":
        return {
          particles: false,
          lightIntensity: 0.8,
        };
      case "scared":
        return {
          particles: false,
          lightIntensity: 0.7,
        };
      case "sleepy":
        return {
          particles: false,
          lightIntensity: 0.6,
        };
      default:
        return {
          particles: false,
          lightIntensity: 1.0,
        };
    }
  };

  const emotionSettings = getEmotionAdjustments();

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={colors.ground} roughness={0.8} />
      </mesh>

      {/* Pet play area - circular platform */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.99, 0]}
        receiveShadow
      >
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial
          color={
            emotion === "happy" || emotion === "excited" ? "#f8e9a1" : "#e6e6e6"
          }
          roughness={0.5}
        />
      </mesh>

      {/* Decorative elements based on time of day */}
      {timeOfDay === "night" && (
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      )}

      {/* Clouds that move slowly */}
      <group position={[0, 15, 0]}>
        <Cloud
          opacity={timeOfDay === "night" ? 0.3 : 0.8}
          speed={0.4}
          width={20}
          depth={1.5}
          segments={20}
        />
      </group>

      {/* Ambient light based on time of day */}
      <ambientLight
        intensity={
          emotionSettings.lightIntensity * (timeOfDay === "night" ? 0.5 : 1)
        }
        color={colors.ambient}
      />

      {/* Directional light simulating sun/moon */}
      <directionalLight
        position={
          timeOfDay === "morning"
            ? [5, 5, 5]
            : timeOfDay === "day"
            ? [10, 10, 5]
            : timeOfDay === "evening"
            ? [-5, 3, 5]
            : [0, 10, -10]
        }
        intensity={
          emotionSettings.lightIntensity * (timeOfDay === "night" ? 0.3 : 1)
        }
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color={
          timeOfDay === "morning"
            ? "#ffe0b5"
            : timeOfDay === "day"
            ? "#ffffff"
            : timeOfDay === "evening"
            ? "#ff9e7d"
            : "#b5c9e0"
        }
      />

      {/* Environment preset based on time of day */}
      <Environment
        preset={
          timeOfDay === "morning"
            ? "dawn"
            : timeOfDay === "day"
            ? "park"
            : timeOfDay === "evening"
            ? "sunset"
            : "night"
        }
      />

      {/* Emotion-based particles */}
      {emotionSettings.particles && (
        <EmotionParticles color={emotionSettings.particleColor} />
      )}
    </group>
  );
}

// Particle system for happy/excited emotions
function EmotionParticles({ color = "#ffff80" }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  const speeds = new Float32Array(particleCount);

  // Initialize particle positions and speeds
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = Math.random() * 5;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
    speeds[i] = 0.01 + Math.random() * 0.02;
  }

  useFrame((state) => {
    if (!particlesRef.current) return;

    const particles = particlesRef.current;
    const positions = (
      particles.geometry.attributes.position as THREE.BufferAttribute
    ).array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Move particles upward
      positions[i3 + 1] += speeds[i];

      // Reset particles that go too high
      if (positions[i3 + 1] > 5) {
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = -1;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
      }
    }

    particles.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color={color} transparent opacity={0.8} />
    </points>
  );
}

// Emotion-specific visual effects
export function Hearts() {
  const heartsRef = useRef<THREE.Group>(null);
  const heartCount = 5;

  useFrame((state) => {
    if (!heartsRef.current) return;

    heartsRef.current.children.forEach((heart, i) => {
      heart.position.y = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3;
      heart.rotation.z = Math.sin(state.clock.elapsedTime + i) * 0.2;
    });
  });

  return (
    <group ref={heartsRef}>
      {Array.from({ length: heartCount }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / heartCount) * Math.PI * 2) * 0.5,
            1,
            Math.cos((i / heartCount) * Math.PI * 2) * 0.5,
          ]}
        >
          <heartGeometry args={[0.2, 0.2]} />
          <meshStandardMaterial color="#ff6b6b" />
        </mesh>
      ))}
    </group>
  );
}

// Custom heart geometry
function heartGeometry({ args = [0.5, 0.5] }) {
  const shape = new THREE.Shape();
  const x = 0,
    y = 0;
  const width = args[0],
    height = args[1];

  shape.moveTo(x, y + height / 4);
  shape.bezierCurveTo(
    x,
    y + (height / 4) * 3,
    x + width / 4,
    y + height,
    x + width / 2,
    y + height
  );
  shape.bezierCurveTo(
    x + (width / 4) * 3,
    y + height,
    x + width,
    y + (height / 4) * 3,
    x + width,
    y + height / 4
  );
  shape.bezierCurveTo(
    x + width,
    y - height / 4,
    x + width / 2,
    y - height / 2,
    x + width / 2,
    y - height / 2
  );
  shape.bezierCurveTo(
    x + width / 2,
    y - height / 2,
    x,
    y - height / 4,
    x,
    y + height / 4
  );

  const geometry = new THREE.ShapeGeometry(shape);
  return geometry;
}

export function ThoughtBubble() {
  const bubbleRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!bubbleRef.current) return;
    bubbleRef.current.position.y =
      1.2 + Math.sin(state.clock.elapsedTime) * 0.05;
  });

  return (
    <group ref={bubbleRef} position={[0, 1.2, 0]}>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.15, -0.15, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.25, -0.25, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export function ShockLines() {
  const linesRef = useRef<THREE.Group>(null);
  const lineCount = 6;

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.1;
  });

  return (
    <group ref={linesRef} position={[0, 1.2, 0]}>
      {Array.from({ length: lineCount }).map((_, i) => (
        <mesh
          key={i}
          position={[0, 0, 0]}
          rotation={[0, 0, ((Math.PI * 2) / lineCount) * i]}
        >
          <boxGeometry args={[0.4, 0.03, 0.03]} />
          <meshStandardMaterial color="#ffcc00" />
        </mesh>
      ))}
    </group>
  );
}

export function MusicNotes() {
  const notesRef = useRef<THREE.Group>(null);
  const noteCount = 4;

  useFrame((state) => {
    if (!notesRef.current) return;
    notesRef.current.children.forEach((note, i) => {
      note.position.y =
        1 + i * 0.2 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;
      note.position.x = Math.sin(state.clock.elapsedTime * 3 + i) * 0.3;
      note.rotation.z = Math.sin(state.clock.elapsedTime + i) * 0.2;
    });
  });

  return (
    <group ref={notesRef}>
      {Array.from({ length: noteCount }).map((_, i) => (
        <mesh key={i} position={[0.3, 1 + i * 0.2, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#9c88ff" : "#ff6b81"} />
          <mesh position={[0.08, -0.1, 0]}>
            <boxGeometry args={[0.02, 0.2, 0.02]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#9c88ff" : "#ff6b81"} />
          </mesh>
        </mesh>
      ))}
    </group>
  );
}

export function SleepZs() {
  const zsRef = useRef<THREE.Group>(null);
  const zCount = 3;

  useFrame((state) => {
    if (!zsRef.current) return;
    zsRef.current.children.forEach((z, i) => {
      z.position.y = 1 + i * 0.2 + Math.sin(state.clock.elapsedTime + i) * 0.05;
      z.position.x = 0.3 + i * 0.1;
      z.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.1;
    });
  });

  return (
    <group ref={zsRef}>
      {Array.from({ length: zCount }).map((_, i) => (
        <mesh key={i} position={[0.3 + i * 0.1, 1 + i * 0.2, 0]}>
          <textGeometry
            args={["Z", { font: undefined, size: 0.2, height: 0.05 }]}
          />
          <meshStandardMaterial color="#b8c1ec" />
        </mesh>
      ))}
    </group>
  );
}
