"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion-3d";

interface Pet3DModelProps {
  petType: string;
  petColor: string;
  emotion: string;
  activeAccessory?: string | null;
  onInteract?: () => void;
  isBlinking?: boolean;
  isSpeaking?: boolean;
  mouthOpen?: boolean;
}

export function Pet3DModel({
  petType,
  petColor,
  emotion,
  activeAccessory = null,
  onInteract,
  isBlinking = false,
  isSpeaking = false,
  mouthOpen = false,
}: Pet3DModelProps) {
  const modelRef = useRef<THREE.Group>(null);

  // Get color based on petColor
  const getColor = () => {
    switch (petColor) {
      case "golden":
        return "#FFD700";
      case "brown":
        return "#8B4513";
      case "black":
        return "#000000";
      case "white":
        return "#FFFFFF";
      case "gray":
        return "#808080";
      case "red":
        return "#FF0000";
      case "green":
        return "#00FF00";
      case "yellow":
        return "#FFFF00";
      case "blue":
        return "#0000FF";
      default:
        return "#FFD700";
    }
  };

  // Get secondary color
  const getSecondaryColor = () => {
    switch (petColor) {
      case "golden":
        return "#D4A464";
      case "brown":
        return "#5E2F0D";
      case "black":
        return "#1A1A1A";
      case "white":
        return "#E0E0E0";
      case "gray":
        return "#606060";
      case "red":
        return "#D32F2F";
      case "green":
        return "#388E3C";
      case "yellow":
        return "#FBC02D";
      case "blue":
        return "#1976D2";
      default:
        return "#D4A464";
    }
  };

  return (
    <group ref={modelRef} onClick={onInteract}>
      {petType === "dog" && (
        <DogModel
          color={getColor()}
          secondaryColor={getSecondaryColor()}
          emotion={emotion}
          activeAccessory={activeAccessory}
          isBlinking={isBlinking}
          isSpeaking={isSpeaking}
          mouthOpen={mouthOpen}
        />
      )}

      {petType === "cat" && (
        <CatModel
          color={getColor()}
          secondaryColor={getSecondaryColor()}
          emotion={emotion}
          activeAccessory={activeAccessory}
          isBlinking={isBlinking}
          isSpeaking={isSpeaking}
          mouthOpen={mouthOpen}
        />
      )}

      {petType === "bird" && (
        <BirdModel
          color={getColor()}
          secondaryColor={getSecondaryColor()}
          emotion={emotion}
          activeAccessory={activeAccessory}
          isBlinking={isBlinking}
          isSpeaking={isSpeaking}
          mouthOpen={mouthOpen}
        />
      )}
    </group>
  );
}

// Dog Model
function DogModel({
  color,
  secondaryColor,
  emotion,
  activeAccessory,
  isBlinking,
  isSpeaking,
  mouthOpen,
}) {
  const tailRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftEarRef = useRef<THREE.Mesh>(null);
  const rightEarRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (tailRef.current) {
      // Tail wagging animation
      if (emotion === "happy" || emotion === "excited") {
        tailRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 10) * 0.5;
      } else {
        tailRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }

    if (headRef.current) {
      // Head animation
      if (emotion === "curious") {
        headRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      } else if (emotion === "excited") {
        headRef.current.rotation.x =
          Math.sin(state.clock.elapsedTime * 3) * 0.1;
      } else if (emotion === "sad") {
        headRef.current.rotation.x = -0.2;
      }
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      // Eye blinking
      const blinkScale = isBlinking ? 0.1 : 1;
      leftEyeRef.current.scale.y = blinkScale;
      rightEyeRef.current.scale.y = blinkScale;
    }

    if (mouthRef.current) {
      // Mouth animation
      if (isSpeaking || mouthOpen) {
        mouthRef.current.scale.y =
          0.5 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
      } else {
        mouthRef.current.scale.y = 0.1;
      }
    }

    if (leftEarRef.current && rightEarRef.current) {
      // Ear animation
      if (emotion === "happy" || emotion === "excited") {
        leftEarRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 3) * 0.2 - 0.3;
        rightEarRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.3;
      } else if (emotion === "sad") {
        leftEarRef.current.rotation.z = -0.5;
        rightEarRef.current.rotation.z = 0.5;
      }
    }
  });

  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.3, 0.6]}>
        <mesh castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>

        {/* Eyes */}
        <mesh
          ref={leftEyeRef}
          position={[-0.15, 0.1, 0.3]}
          scale={0.1}
          castShadow
        >
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        <mesh
          ref={rightEyeRef}
          position={[0.15, 0.1, 0.3]}
          scale={0.1}
          castShadow
        >
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Nose */}
        <mesh position={[0, 0, 0.4]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Mouth */}
        <mesh
          ref={mouthRef}
          position={[0, -0.1, 0.4]}
          scale={[0.2, 0.1, 0.1]}
          castShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Ears */}
        <mesh
          ref={leftEarRef}
          position={[-0.25, 0.3, 0]}
          rotation={[0, 0, -0.3]}
          scale={[0.15, 0.25, 0.1]}
          castShadow
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.7} />
        </mesh>

        <mesh
          ref={rightEarRef}
          position={[0.25, 0.3, 0]}
          rotation={[0, 0, 0.3]}
          scale={[0.15, 0.25, 0.1]}
          castShadow
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.7} />
        </mesh>

        {/* Accessories */}
        {activeAccessory === "party_hat" && (
          <mesh position={[0, 0.4, 0]} rotation={[0.2, 0, 0]} castShadow>
            <coneGeometry args={[0.25, 0.4, 32]} />
            <meshStandardMaterial color="#FF5E5B" />
          </mesh>
        )}

        {activeAccessory === "sunglasses" && (
          <group position={[0, 0.1, 0.35]} castShadow>
            <mesh position={[-0.15, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0.15, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.1, 0.02, 0.02]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
          </group>
        )}
      </group>

      {/* Legs */}
      <mesh position={[-0.25, -0.4, 0.25]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      <mesh position={[0.25, -0.4, 0.25]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      <mesh position={[-0.25, -0.4, -0.25]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      <mesh position={[0.25, -0.4, -0.25]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Tail */}
      <mesh
        ref={tailRef}
        position={[0, 0, -0.5]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

// Cat Model
function CatModel({
  color,
  secondaryColor,
  emotion,
  activeAccessory,
  isBlinking,
  isSpeaking,
  mouthOpen,
}) {
  const tailRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftEarRef = useRef<THREE.Mesh>(null);
  const rightEarRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (tailRef.current) {
      // Tail animation
      if (emotion === "happy" || emotion === "excited") {
        tailRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 8) * 0.5 + 0.5;
      } else {
        tailRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.2;
      }
    }

    if (headRef.current) {
      // Head animation
      if (emotion === "curious") {
        headRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      } else if (emotion === "sad") {
        headRef.current.rotation.x = -0.1;
      }
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      // Eye blinking
      const blinkScale = isBlinking ? 0.1 : 1;
      leftEyeRef.current.scale.y = blinkScale;
      rightEyeRef.current.scale.y = blinkScale;
    }

    if (mouthRef.current) {
      // Mouth animation
      if (isSpeaking || mouthOpen) {
        mouthRef.current.scale.y =
          0.5 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
      } else {
        mouthRef.current.scale.y = 0.1;
      }
    }

    if (leftEarRef.current && rightEarRef.current) {
      // Ear animation
      if (emotion === "curious" || emotion === "alert") {
        leftEarRef.current.rotation.z =
          Math.PI / 4 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        rightEarRef.current.rotation.z =
          -Math.PI / 4 - Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else if (emotion === "sad" || emotion === "scared") {
        leftEarRef.current.rotation.z = Math.PI / 6;
        rightEarRef.current.rotation.z = -Math.PI / 6;
      }
    }
  });

  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.3, 0.6]}>
        <mesh castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>

        {/* Eyes */}
        <mesh
          ref={leftEyeRef}
          position={[-0.15, 0.1, 0.3]}
          scale={0.1}
          castShadow
        >
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        <mesh
          ref={rightEyeRef}
          position={[0.15, 0.1, 0.3]}
          scale={0.1}
          castShadow
        >
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Nose */}
        <mesh position={[0, 0, 0.4]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Mouth */}
        <mesh
          ref={mouthRef}
          position={[0, -0.1, 0.4]}
          scale={[0.2, 0.1, 0.1]}
          castShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Ears */}
        <mesh
          ref={leftEarRef}
          position={[-0.2, 0.3, 0]}
          rotation={[0, 0, Math.PI / 4]}
          castShadow
        >
          <coneGeometry args={[0.1, 0.2, 3]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.6} />
        </mesh>

        <mesh
          ref={rightEarRef}
          position={[0.2, 0.3, 0]}
          rotation={[0, 0, -Math.PI / 4]}
          castShadow
        >
          <coneGeometry args={[0.1, 0.2, 3]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.6} />
        </mesh>

        {/* Accessories */}
        {activeAccessory === "party_hat" && (
          <mesh position={[0, 0.4, 0]} rotation={[0.2, 0, 0]} castShadow>
            <coneGeometry args={[0.25, 0.4, 32]} />
            <meshStandardMaterial color="#FF5E5B" />
          </mesh>
        )}

        {activeAccessory === "sunglasses" && (
          <group position={[0, 0.1, 0.35]} castShadow>
            <mesh position={[-0.15, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0.15, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.1, 0.02, 0.02]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
          </group>
        )}
      </group>

      {/* Legs */}
      <mesh position={[-0.25, -0.4, 0.25]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      <mesh position={[0.25, -0.4, 0.25]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      <mesh position={[-0.25, -0.4, -0.25]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      <mesh position={[0.25, -0.4, -0.25]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Tail */}
      <mesh
        ref={tailRef}
        position={[0, 0, -0.5]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

// Bird Model
function BirdModel({
  color,
  secondaryColor,
  emotion,
  activeAccessory,
  isBlinking,
  isSpeaking,
  mouthOpen,
}) {
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const beakRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (leftWingRef.current && rightWingRef.current) {
      // Wing animation
      if (emotion === "excited") {
        leftWingRef.current.rotation.z =
          -Math.PI / 4 + Math.sin(state.clock.elapsedTime * 10) * 0.3;
        rightWingRef.current.rotation.z =
          Math.PI / 4 - Math.sin(state.clock.elapsedTime * 10) * 0.3;
      } else {
        leftWingRef.current.rotation.z =
          -Math.PI / 8 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        rightWingRef.current.rotation.z =
          Math.PI / 8 - Math.sin(state.clock.elapsedTime * 2) * 0.05;
      }
    }

    if (headRef.current) {
      // Head animation
      if (emotion === "curious") {
        headRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      } else if (emotion === "sad") {
        headRef.current.rotation.x = -0.1;
      }
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      // Eye blinking
      const blinkScale = isBlinking ? 0.1 : 1;
      leftEyeRef.current.scale.y = blinkScale;
      rightEyeRef.current.scale.y = blinkScale;
    }

    if (beakRef.current) {
      // Beak animation
      if (isSpeaking || mouthOpen) {
        beakRef.current.rotation.x =
          Math.sin(state.clock.elapsedTime * 8) * 0.2;
      } else {
        beakRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0, 0]} scale={[0.8, 1, 1]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.5, 0.3]}>
        <mesh castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Eyes */}
        <mesh
          ref={leftEyeRef}
          position={[-0.1, 0.05, 0.2]}
          scale={0.1}
          castShadow
        >
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        <mesh
          ref={rightEyeRef}
          position={[0.1, 0.05, 0.2]}
          scale={0.1}
          castShadow
        >
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Beak */}
        <mesh
          ref={beakRef}
          position={[0, 0, 0.3]}
          rotation={[0, 0, 0]}
          castShadow
        >
          <coneGeometry args={[0.08, 0.2, 4]} />
          <meshStandardMaterial color="#FFA500" />
        </mesh>

        {/* Accessories */}
        {activeAccessory === "party_hat" && (
          <mesh position={[0, 0.3, 0]} rotation={[0.2, 0, 0]} castShadow>
            <coneGeometry args={[0.15, 0.3, 32]} />
            <meshStandardMaterial color="#FF5E5B" />
          </mesh>
        )}

        {activeAccessory === "sunglasses" && (
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
      </group>

      {/* Wings */}
      <mesh
        ref={leftWingRef}
        position={[-0.4, 0, 0]}
        rotation={[0, 0, -Math.PI / 8]}
        scale={[0.1, 0.3, 0.25]}
        castShadow
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh
        ref={rightWingRef}
        position={[0.4, 0, 0]}
        rotation={[0, 0, Math.PI / 8]}
        scale={[0.1, 0.3, 0.25]}
        castShadow
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>

      <mesh position={[0.1, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
    </group>
  );
}
