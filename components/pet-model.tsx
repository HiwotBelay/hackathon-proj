"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import {
  Hearts,
  ThoughtBubble,
  ShockLines,
  MusicNotes,
  SleepZs,
} from "@/components/emotion-effect";
import { Group, Mesh, Vector3 } from "three";

interface PetModelProps {
  petType: string;
  petColor: string;
  emotion: string;
  isInteracting: boolean;
  onClick?: () => void;
  accessory?: string | null;
  isSpeaking?: boolean;
}

interface DogModelProps {
  color: string;
  emotion: string;
  accessory?: string | null;
  isInteracting: boolean;
  isSpeaking?: boolean;
}

export function PetModel({
  petType,
  petColor,
  emotion,
  isInteracting,
  onClick,
  accessory,
  isSpeaking = false,
}: PetModelProps) {
  const color = getColor(petColor);

  // Render the appropriate pet model based on type
  switch (petType) {
    case "dog":
      return (
        <DogModel
          color={color}
          emotion={emotion}
          accessory={accessory}
          isInteracting={isInteracting}
          isSpeaking={isSpeaking}
        />
      );
    case "cat":
      return (
        <CatModel
          color={color}
          emotion={emotion}
          accessory={accessory}
          isInteracting={isInteracting}
          isSpeaking={isSpeaking}
        />
      );
    case "bird":
      return (
        <BirdModel
          color={color}
          emotion={emotion}
          accessory={accessory}
          isInteracting={isInteracting}
          isSpeaking={isSpeaking}
        />
      );
    default:
      return (
        <DogModel
          color={color}
          emotion={emotion}
          accessory={accessory}
          isInteracting={isInteracting}
          isSpeaking={isSpeaking}
        />
      );
  }
}

// Get color based on petColor
function getColor(petColor: string): string {
  switch (petColor) {
    case "golden":
      return "#F7D08A";
    case "brown":
      return "#8B4513";
    case "black":
      return "#2D2D2D";
    case "white":
      return "#F5F5F5";
    default:
      return "#F7D08A";
  }
}

// Dog Model
function DogModel({
  color,
  emotion,
  accessory,
  isInteracting,
  isSpeaking = false,
}: DogModelProps) {
  const bodyRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const tailRef = useRef<Mesh>(null);
  const mouthRef = useRef<Mesh>(null);
  const leftEyeRef = useRef<Mesh>(null);
  const rightEyeRef = useRef<Mesh>(null);
  const leftEarRef = useRef<Mesh>(null);
  const rightEarRef = useRef<Mesh>(null);
  const [scale, setScale] = useState(1);

  // Handle zoom in/out with mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale((prevScale) => {
        const newScale = prevScale + (e.deltaY > 0 ? -0.1 : 0.1);
        return Math.max(0.5, Math.min(2, newScale)); // Limit scale between 0.5 and 2
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useFrame((state) => {
    if (bodyRef.current) {
      // Gentle bobbing animation
      bodyRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
    }

    if (headRef.current) {
      // Head animation based on emotion
      switch (emotion) {
        case "happy":
          headRef.current.rotation.z =
            Math.sin(state.clock.getElapsedTime() * 3) * 0.1;
          break;
        case "excited":
          headRef.current.rotation.z =
            Math.sin(state.clock.getElapsedTime() * 5) * 0.2;
          break;
        case "sad":
          headRef.current.rotation.x = -0.2;
          break;
        case "curious":
          headRef.current.rotation.z =
            Math.sin(state.clock.getElapsedTime() * 1.5) * 0.2;
          break;
        case "sleepy":
          headRef.current.rotation.x = 0.1;
          break;
        case "angry":
          headRef.current.rotation.z =
            Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
          break;
      }
    }

    if (tailRef.current) {
      // Tail wagging based on emotion
      switch (emotion) {
        case "happy":
        case "excited":
          tailRef.current.rotation.z =
            Math.sin(state.clock.getElapsedTime() * 10) * 0.5;
          break;
        case "sad":
          tailRef.current.rotation.z = -0.3;
          break;
        case "angry":
          tailRef.current.rotation.z =
            Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
          break;
        default:
          tailRef.current.rotation.z =
            Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      }
    }

    // Eye expressions based on emotion
    if (leftEyeRef.current && rightEyeRef.current) {
      const blink =
        Math.sin(state.clock.getElapsedTime() * 2) > 0.95 ? 0.01 : 0.06;

      switch (emotion) {
        case "happy":
          leftEyeRef.current.scale.y = blink;
          rightEyeRef.current.scale.y = blink;
          break;
        case "sad":
          leftEyeRef.current.scale.y = blink * 0.8;
          rightEyeRef.current.scale.y = blink * 0.8;
          leftEyeRef.current.rotation.z = -0.1;
          rightEyeRef.current.rotation.z = 0.1;
          break;
        case "angry":
          leftEyeRef.current.scale.y = blink * 0.7;
          rightEyeRef.current.scale.y = blink * 0.7;
          leftEyeRef.current.rotation.z = -0.2;
          rightEyeRef.current.rotation.z = 0.2;
          break;
        case "excited":
          leftEyeRef.current.scale.y = blink * 1.2;
          rightEyeRef.current.scale.y = blink * 1.2;
          break;
        case "sleepy":
          leftEyeRef.current.scale.y = blink * 0.5;
          rightEyeRef.current.scale.y = blink * 0.5;
          break;
        default:
          leftEyeRef.current.scale.y = blink;
          rightEyeRef.current.scale.y = blink;
      }
    }

    // Mouth expressions
    if (mouthRef.current) {
      if (isSpeaking) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
        mouthRef.current.scale.y = scale;
      } else {
        switch (emotion) {
          case "happy":
            mouthRef.current.scale.y = 1.2;
            break;
          case "sad":
            mouthRef.current.scale.y = 0.8;
            break;
          default:
            mouthRef.current.scale.y = 1;
        }
      }
    }

    // Ear movement based on emotion
    if (leftEarRef.current && rightEarRef.current) {
      switch (emotion) {
        case "happy":
        case "excited":
          leftEarRef.current.rotation.z =
            Math.sin(state.clock.getElapsedTime() * 3) * 0.2 - 0.3;
          rightEarRef.current.rotation.z =
            Math.sin(state.clock.getElapsedTime() * 3) * 0.2 + 0.3;
          break;
        case "sad":
          leftEarRef.current.rotation.z = -0.5;
          rightEarRef.current.rotation.z = 0.5;
          break;
        case "curious":
          leftEarRef.current.rotation.z =
            Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1 - 0.3;
          rightEarRef.current.rotation.z =
            Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1 + 0.3;
          break;
      }
    }
  });

  return (
    <motion.group
      ref={bodyRef}
      animate={isInteracting ? { y: [0, 0.2, 0] } : {}}
      transition={{ duration: 0.3 }}
      scale={scale}
    >
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Head */}
      <group ref={headRef}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>

        {/* Eyes */}
        <mesh ref={leftEyeRef} position={[-0.1, 0.6, 0.25]} castShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.1, 0.6, 0.25]} castShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, 0.5, 0.3]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Ears */}
        <mesh ref={leftEarRef} position={[-0.2, 0.7, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        <mesh ref={rightEarRef} position={[0.2, 0.7, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      </group>

      {/* Tail */}
      <mesh ref={tailRef} position={[0, -0.5, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </motion.group>
  );
}

// Cat Model
function CatModel({
  color,
  emotion,
  accessory,
  isInteracting,
  isSpeaking = false,
}) {
  const bodyRef = useRef();
  const headRef = useRef();
  const tailRef = useRef();
  const leftEarRef = useRef();
  const rightEarRef = useRef();
  const mouthRef = useRef();

  useFrame((state) => {
    if (bodyRef.current) {
      // Gentle bobbing animation
      bodyRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
    }

    if (headRef.current) {
      // Head animation based on emotion
      if (emotion === "happy" || emotion === "excited") {
        headRef.current.rotation.z =
          Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      } else if (emotion === "sad") {
        headRef.current.rotation.x = -0.1;
      }
    }

    if (tailRef.current) {
      // Tail animation based on emotion
      if (emotion === "happy" || emotion === "excited" || isInteracting) {
        tailRef.current.rotation.z =
          Math.sin(state.clock.getElapsedTime() * 8) * 0.5 + 0.5;
      } else {
        tailRef.current.rotation.z =
          Math.sin(state.clock.getElapsedTime() * 2) * 0.2 + 0.2;
      }
    }

    if (leftEarRef.current && rightEarRef.current) {
      // Ear animation based on emotion
      if (emotion === "curious" || emotion === "alert") {
        leftEarRef.current.rotation.z =
          Math.PI / 4 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
        rightEarRef.current.rotation.z =
          -Math.PI / 4 - Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      } else if (emotion === "sad" || emotion === "scared") {
        leftEarRef.current.rotation.z = Math.PI / 6;
        rightEarRef.current.rotation.z = -Math.PI / 6;
      }
    }

    // Add lip-syncing animation
    if (mouthRef.current) {
      if (isSpeaking) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
        mouthRef.current.scale.y = scale;
      } else {
        mouthRef.current.scale.y = 1;
      }
    }
  });

  return (
    <motion.group
      ref={bodyRef}
      animate={isInteracting ? { y: [0, 0.2, 0] } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Body */}
      <mesh position={[0, 0, 0]} scale={[1, 0.8, 1.2]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Head */}
      <motion.group
        ref={headRef}
        position={[0, 0.3, 0.6]}
        animate={isInteracting ? { rotateZ: [0, 0.2, -0.2, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <mesh castShadow>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.12, 0.1, 0.25]} castShadow>
          <sphereGeometry args={[0.05, 32, 16]} />
          <meshStandardMaterial
            color={emotion === "scared" ? "#000000" : "#4CAF50"}
          />
        </mesh>

        <mesh position={[0.12, 0.1, 0.25]} castShadow>
          <sphereGeometry args={[0.05, 32, 16]} />
          <meshStandardMaterial
            color={emotion === "scared" ? "#000000" : "#4CAF50"}
          />
        </mesh>

        {/* Nose */}
        <mesh position={[0, 0, 0.3]} castShadow>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#FFC0CB" />
        </mesh>

        {/* Ears */}
        <mesh
          ref={leftEarRef}
          position={[-0.2, 0.3, 0]}
          rotation={[0, 0, Math.PI / 4]}
          castShadow
        >
          <coneGeometry args={[0.1, 0.2, 3]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>

        <mesh
          ref={rightEarRef}
          position={[0.2, 0.3, 0]}
          rotation={[0, 0, -Math.PI / 4]}
          castShadow
        >
          <coneGeometry args={[0.1, 0.2, 3]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>

        {/* Accessories */}
        {accessory === "party_hat" && (
          <mesh position={[0, 0.4, 0]} rotation={[0.2, 0, 0]} castShadow>
            <coneGeometry args={[0.2, 0.3, 32]} />
            <meshStandardMaterial color="#FF5E5B" />
          </mesh>
        )}

        {accessory === "sunglasses" && (
          <group position={[0, 0.1, 0.3]} castShadow>
            <mesh position={[-0.12, 0, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0.12, 0, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.08, 0.02, 0.02]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
          </group>
        )}

        {accessory === "crown" && (
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 0.12, 8]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
        )}

        {accessory === "bow_tie" && (
          <mesh position={[0, -0.1, 0.3]} rotation={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.15, 0.08, 0.05]} />
            <meshStandardMaterial color="#FF0080" />
          </mesh>
        )}

        {accessory === "scarf" && (
          <mesh position={[0, -0.2, 0.2]} rotation={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.3, 0.08, 0.05]} />
            <meshStandardMaterial color="#4CAF50" />
          </mesh>
        )}

        {accessory === "backpack" && (
          <mesh position={[0, 0, -0.25]} castShadow>
            <boxGeometry args={[0.3, 0.3, 0.15]} />
            <meshStandardMaterial color="#2196F3" />
          </mesh>
        )}
      </motion.group>

      {/* Legs */}
      <mesh position={[-0.25, -0.4, 0.25]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      <mesh position={[0.25, -0.4, 0.25]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      <mesh position={[-0.25, -0.4, -0.25]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      <mesh position={[0.25, -0.4, -0.25]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Tail */}
      <motion.mesh
        ref={tailRef}
        position={[0, 0, -0.6]}
        rotation={[0, 0, Math.PI / 4]}
        castShadow
        animate={
          isInteracting
            ? { rotateZ: [Math.PI / 4, Math.PI / 2, Math.PI / 4] }
            : {}
        }
        transition={{ duration: 0.8 }}
      >
        <cylinderGeometry args={[0.04, 0.02, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </motion.mesh>

      {/* Add mouth for lip-syncing */}
      <mesh ref={mouthRef} position={[0, 0.15, 0.3]} castShadow>
        <boxGeometry args={[0.15, 0.04, 0.08]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </motion.group>
  );
}

// Bird Model
function BirdModel({
  color,
  emotion,
  accessory,
  isInteracting,
  isSpeaking = false,
}) {
  const bodyRef = useRef();
  const headRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  const beakRef = useRef();

  useFrame((state) => {
    if (bodyRef.current) {
      // Gentle bobbing animation
      bodyRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
    }

    if (headRef.current) {
      // Head animation based on emotion
      if (emotion === "happy" || emotion === "excited") {
        headRef.current.rotation.z =
          Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      } else if (emotion === "sad") {
        headRef.current.rotation.x = -0.1;
      } else if (emotion === "curious") {
        headRef.current.rotation.z =
          Math.sin(state.clock.getElapsedTime() * 1.5) * 0.2;
      }
    }

    if (leftWingRef.current && rightWingRef.current) {
      // Wing animation based on emotion
      if (emotion === "excited" || isInteracting) {
        leftWingRef.current.rotation.z =
          -Math.PI / 4 + Math.sin(state.clock.getElapsedTime() * 10) * 0.3;
        rightWingRef.current.rotation.z =
          Math.PI / 4 - Math.sin(state.clock.getElapsedTime() * 10) * 0.3;
      } else {
        leftWingRef.current.rotation.z =
          -Math.PI / 8 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
        rightWingRef.current.rotation.z =
          Math.PI / 8 - Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
      }
    }

    if (beakRef.current) {
      // Beak animation for talking or singing
      if (emotion === "happy" || emotion === "excited") {
        beakRef.current.rotation.x =
          Math.sin(state.clock.getElapsedTime() * 8) * 0.1;
      }
    }

    // Add beak animation for speaking
    if (beakRef.current) {
      if (isSpeaking) {
        const rotation = Math.sin(state.clock.elapsedTime * 10) * 0.2;
        beakRef.current.rotation.x = rotation;
      } else {
        beakRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <motion.group
      ref={bodyRef}
      animate={isInteracting ? { y: [0, 0.2, 0] } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Body */}
      <mesh position={[0, 0, 0]} scale={[0.8, 1, 1]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head */}
      <motion.group
        ref={headRef}
        position={[0, 0.5, 0.3]}
        animate={isInteracting ? { rotateZ: [0, 0.2, -0.2, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <mesh castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.1, 0.05, 0.2]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        <mesh position={[0.1, 0.05, 0.2]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Beak */}
        <motion.mesh
          ref={beakRef}
          position={[0, 0, 0.3]}
          rotation={[0, 0, 0]}
          castShadow
          animate={isInteracting ? { rotateX: [0, 0.2, 0, 0.2, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <coneGeometry args={[0.08, 0.2, 4]} />
          <meshStandardMaterial color="#FFA500" />
        </motion.mesh>

        {/* Accessories */}
        {accessory === "party_hat" && (
          <mesh position={[0, 0.3, 0]} rotation={[0.2, 0, 0]} castShadow>
            <coneGeometry args={[0.15, 0.3, 32]} />
            <meshStandardMaterial color="#FF5E5B" />
          </mesh>
        )}

        {accessory === "sunglasses" && (
          <group position={[0, 0.05, 0.25]} castShadow>
            <mesh position={[-0.1, 0, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0.1, 0, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.07, 0.02, 0.02]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
          </group>
        )}

        {accessory === "crown" && (
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 0.1, 8]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
        )}

        {accessory === "bow_tie" && (
          <mesh position={[0, -0.1, 0.25]} rotation={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.12, 0.06, 0.04]} />
            <meshStandardMaterial color="#FF0080" />
          </mesh>
        )}

        {accessory === "scarf" && (
          <mesh position={[0, -0.15, 0.15]} rotation={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.25, 0.06, 0.04]} />
            <meshStandardMaterial color="#4CAF50" />
          </mesh>
        )}

        {accessory === "backpack" && (
          <mesh position={[0, 0, -0.2]} castShadow>
            <boxGeometry args={[0.25, 0.25, 0.12]} />
            <meshStandardMaterial color="#2196F3" />
          </mesh>
        )}
      </motion.group>

      {/* Wings */}
      <motion.mesh
        ref={leftWingRef}
        position={[-0.4, 0, 0]}
        rotation={[0, 0, -Math.PI / 8]}
        scale={[0.1, 0.3, 0.25]}
        castShadow
        animate={
          isInteracting
            ? { rotateZ: [-Math.PI / 8, -Math.PI / 4, -Math.PI / 8] }
            : {}
        }
        transition={{ duration: 0.3, repeat: isInteracting ? 2 : 0 }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </motion.mesh>

      <motion.mesh
        ref={rightWingRef}
        position={[0.4, 0, 0]}
        rotation={[0, 0, Math.PI / 8]}
        scale={[0.1, 0.3, 0.25]}
        castShadow
        animate={
          isInteracting
            ? { rotateZ: [Math.PI / 8, Math.PI / 4, Math.PI / 8] }
            : {}
        }
        transition={{ duration: 0.3, repeat: isInteracting ? 2 : 0 }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </motion.mesh>

      {/* Legs */}
      <mesh position={[-0.1, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>

      <mesh position={[0.1, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
    </motion.group>
  );
}
