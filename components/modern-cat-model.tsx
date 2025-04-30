"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ModernCatModelProps {
  color: string;
  secondaryColor: string;
  emotion: string;
  blinking: boolean;
  mouthOpen: boolean;
  activeAccessory: string | null;
}

export function ModernCatModel({
  color,
  secondaryColor,
  emotion,
  blinking,
  mouthOpen,
  activeAccessory,
}: ModernCatModelProps) {
  // Create refs for animatable parts
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Group>(null);
  const leftEarRef = useRef<THREE.Mesh>(null);
  const rightEarRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  // Animate parts based on emotion
  useFrame((state) => {
    if (
      !bodyRef.current ||
      !headRef.current ||
      !tailRef.current ||
      !leftEarRef.current ||
      !rightEarRef.current ||
      !mouthRef.current
    )
      return;

    // Tail animation based on emotion
    if (emotion === "happy" || emotion === "excited") {
      tailRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 8) * 0.5 + 0.5;
    } else if (emotion === "sad" || emotion === "scared") {
      tailRef.current.rotation.z = -0.2;
    } else {
      tailRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.2;
    }

    // Ear animation
    if (emotion === "curious" || emotion === "alert") {
      leftEarRef.current.rotation.z =
        Math.PI / 4 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      rightEarRef.current.rotation.z =
        -Math.PI / 4 - Math.sin(state.clock.elapsedTime * 2) * 0.1;
    } else if (emotion === "sad" || emotion === "scared") {
      leftEarRef.current.rotation.z = Math.PI / 6;
      rightEarRef.current.rotation.z = -Math.PI / 6;
    } else {
      leftEarRef.current.rotation.z = Math.PI / 4;
      rightEarRef.current.rotation.z = -Math.PI / 4;
    }

    // Head animation
    if (emotion === "curious") {
      headRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    } else if (emotion === "sad") {
      headRef.current.rotation.x = -0.2;
    } else if (emotion === "excited" || emotion === "happy") {
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }

    // Mouth animation
    mouthRef.current.scale.y =
      mouthOpen ||
      emotion === "happy" ||
      emotion === "excited" ||
      emotion === "laughing"
        ? 0.3 + Math.sin(state.clock.elapsedTime * 8) * 0.2
        : 0.1;
  });

  return (
    <group>
      {/* Body */}
      <mesh
        ref={bodyRef}
        position={[0, 0, 0]}
        scale={[1.2, 0.8, 1.8]}
        castShadow
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Head - connected to body with proper positioning */}
      <group ref={headRef} position={[0, 0.3, 0.8]}>
        <mesh castShadow>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>

        {/* Eyes - almond shaped for cats with expressions */}
        <group position={[0, 0.1, 0.3]}>
          {/* Left eye */}
          <mesh
            position={[-0.2, 0, 0]}
            scale={blinking ? [1, 0.1, 1] : [1, 0.5, 1]}
            rotation={[0, 0, Math.PI / 4]}
            castShadow
          >
            <sphereGeometry args={[0.08, 32, 16]} />
            <meshStandardMaterial
              color={emotion === "scared" ? "#000000" : "#4CAF50"}
            />
          </mesh>

          {/* Right eye */}
          <mesh
            position={[0.2, 0, 0]}
            scale={blinking ? [1, 0.1, 1] : [1, 0.5, 1]}
            rotation={[0, 0, -Math.PI / 4]}
            castShadow
          >
            <sphereGeometry args={[0.08, 32, 16]} />
            <meshStandardMaterial
              color={emotion === "scared" ? "#000000" : "#4CAF50"}
            />
          </mesh>

          {/* Pupils that change with emotion */}
          <mesh
            position={[-0.2, 0, 0.05]}
            scale={
              blinking
                ? [0, 0, 0]
                : [
                    emotion === "excited" || emotion === "scared" ? 0.5 : 0.25,
                    emotion === "excited" || emotion === "scared" ? 1 : 0.5,
                    1,
                  ]
            }
            castShadow
          >
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh
            position={[0.2, 0, 0.05]}
            scale={
              blinking
                ? [0, 0, 0]
                : [
                    emotion === "excited" || emotion === "scared" ? 0.5 : 0.25,
                    emotion === "excited" || emotion === "scared" ? 1 : 0.5,
                    1,
                  ]
            }
            castShadow
          >
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>

        {/* Nose */}
        <mesh position={[0, -0.05, 0.4]} castShadow>
          <coneGeometry args={[0.05, 0.05, 3]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#FFC0CB" />
        </mesh>

        {/* Mouth with expression */}
        <mesh
          ref={mouthRef}
          position={[0, -0.15, 0.4]}
          scale={[1, mouthOpen ? 0.3 : 0.1, 0.1]}
          castShadow
        >
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Ears with proper attachment to head */}
        <mesh
          ref={leftEarRef}
          position={[-0.25, 0.4, -0.1]}
          rotation={[0, 0, Math.PI / 4]}
          castShadow
        >
          <coneGeometry args={[0.15, 0.3, 3]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        <mesh
          ref={rightEarRef}
          position={[0.25, 0.4, -0.1]}
          rotation={[0, 0, -Math.PI / 4]}
          castShadow
        >
          <coneGeometry args={[0.15, 0.3, 3]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>

        {/* Inner ears */}
        <mesh
          position={[-0.25, 0.4, -0.1]}
          rotation={[0, 0, Math.PI / 4]}
          scale={[0.8, 0.8, 0.8]}
          castShadow
        >
          <coneGeometry args={[0.1, 0.2, 3]} />
          <meshStandardMaterial color="#FFC0CB" />
        </mesh>
        <mesh
          position={[0.25, 0.4, -0.1]}
          rotation={[0, 0, -Math.PI / 4]}
          scale={[0.8, 0.8, 0.8]}
          castShadow
        >
          <coneGeometry args={[0.1, 0.2, 3]} />
          <meshStandardMaterial color="#FFC0CB" />
        </mesh>

        {/* Whiskers */}
        <group position={[0, -0.1, 0.3]}>
          {/* Left whiskers */}
          <mesh position={[-0.25, 0, 0]} rotation={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.3]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh
            position={[-0.25, 0, 0]}
            rotation={[0, 0, Math.PI / 12]}
            castShadow
          >
            <cylinderGeometry args={[0.005, 0.005, 0.3]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh
            position={[-0.25, 0, 0]}
            rotation={[0, 0, -Math.PI / 12]}
            castShadow
          >
            <cylinderGeometry args={[0.005, 0.005, 0.3]} />
            <meshStandardMaterial color="white" />
          </mesh>

          {/* Right whiskers */}
          <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.3]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh
            position={[0.25, 0, 0]}
            rotation={[0, 0, Math.PI - Math.PI / 12]}
            castShadow
          >
            <cylinderGeometry args={[0.005, 0.005, 0.3]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh
            position={[0.25, 0, 0]}
            rotation={[0, 0, Math.PI + Math.PI / 12]}
            castShadow
          >
            <cylinderGeometry args={[0.005, 0.005, 0.3]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>

        {/* Accessories */}
        {activeAccessory === "party_hat" && (
          <mesh position={[0, 0.5, 0]} rotation={[0.2, 0, 0]} castShadow>
            <coneGeometry args={[0.3, 0.5, 32]} />
            <meshStandardMaterial color="#FF5E5B" />
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="#FFED66" />
            </mesh>
          </mesh>
        )}

        {activeAccessory === "crown" && (
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
            <meshStandardMaterial
              color="#FFD700"
              metalness={0.7}
              roughness={0.3}
            />
            <group position={[0, 0.1, 0]}>
              {[0, 1, 2, 3, 4].map((i) => (
                <mesh
                  key={i}
                  position={[
                    Math.sin((i / 5) * Math.PI * 2) * 0.3,
                    0.05,
                    Math.cos((i / 5) * Math.PI * 2) * 0.3,
                  ]}
                  castShadow
                >
                  <coneGeometry args={[0.05, 0.1, 8]} />
                  <meshStandardMaterial
                    color="#FFD700"
                    metalness={0.7}
                    roughness={0.3}
                  />
                </mesh>
              ))}
            </group>
          </mesh>
        )}

        {activeAccessory === "sunglasses" && (
          <group position={[0, 0.1, 0.41]} castShadow>
            <mesh position={[-0.2, 0, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0.2, 0, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.1, 0.03, 0.03]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
          </group>
        )}
      </group>

      {/* Neck - connecting head and body */}
      <mesh position={[0, 0.15, 0.4]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Legs - properly connected to body */}
      <group position={[0, 0, 0]}>
        {/* Front left leg */}
        <mesh position={[-0.3, -0.3, 0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.5]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* Front right leg */}
        <mesh position={[0.3, -0.3, 0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.5]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* Back left leg */}
        <mesh position={[-0.3, -0.3, -0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.5]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* Back right leg */}
        <mesh position={[0.3, -0.3, -0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.5]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>

        {/* Paws */}
        <mesh position={[-0.3, -0.55, 0.3]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.3, -0.55, 0.3]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.7} />
        </mesh>
        <mesh position={[-0.3, -0.55, -0.3]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.3, -0.55, -0.3]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.7} />
        </mesh>
      </group>

      {/* Tail - curved for cats with animation */}
      <group
        ref={tailRef}
        position={[0, 0, -0.8]}
        rotation={[0, 0, Math.PI / 4]}
      >
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.05, 0.03, 0.8]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        <mesh position={[0.2, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      </group>

      {/* Body accessories */}
      {activeAccessory === "sweater" && (
        <mesh position={[0, 0, 0]} scale={[1.22, 0.82, 1.82]} castShadow>
          <sphereGeometry args={[0.52, 32, 32]} />
          <meshStandardMaterial color="#FF9F1C" roughness={0.8} />
        </mesh>
      )}

      {activeAccessory === "superhero" && (
        <group>
          {/* Cape */}
          <mesh
            position={[0, 0.2, -0.5]}
            rotation={[Math.PI / 4, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.8, 0.05, 1]} />
            <meshStandardMaterial
              color="#FF5E5B"
              roughness={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Logo */}
          <mesh position={[0, 0.3, 0.55]} rotation={[0, 0, 0]} castShadow>
            <circleGeometry args={[0.15, 32]} />
            <meshStandardMaterial color="#FFED66" roughness={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
}
