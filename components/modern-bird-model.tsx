"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ModernBirdModelProps {
  color: string;
  secondaryColor: string;
  emotion: string;
  blinking: boolean;
  mouthOpen: boolean;
  activeAccessory: string | null;
}

export function ModernBirdModel({
  color,
  secondaryColor,
  emotion,
  blinking,
  mouthOpen,
  activeAccessory,
}: ModernBirdModelProps) {
  // Create refs for animatable parts
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const beakRef = useRef<THREE.Mesh>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  // Animate parts based on emotion
  useFrame((state) => {
    if (
      !bodyRef.current ||
      !headRef.current ||
      !beakRef.current ||
      !leftWingRef.current ||
      !rightWingRef.current ||
      !tailRef.current
    )
      return;

    // Wing animation based on emotion
    if (emotion === "excited" || emotion === "dancing") {
      leftWingRef.current.rotation.z =
        -Math.PI / 4 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
      rightWingRef.current.rotation.z =
        Math.PI / 4 - Math.sin(state.clock.elapsedTime * 10) * 0.5;
    } else if (emotion === "happy") {
      leftWingRef.current.rotation.z =
        -Math.PI / 8 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      rightWingRef.current.rotation.z =
        Math.PI / 8 - Math.sin(state.clock.elapsedTime * 3) * 0.1;
    } else {
      leftWingRef.current.rotation.z = -Math.PI / 8;
      rightWingRef.current.rotation.z = Math.PI / 8;
    }

    // Beak animation
    if (mouthOpen || emotion === "singing" || emotion === "laughing") {
      beakRef.current.rotation.x =
        -0.2 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
    } else {
      beakRef.current.rotation.x = 0;
    }

    // Head animation
    if (emotion === "curious") {
      headRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    } else if (emotion === "sad") {
      headRef.current.rotation.x = -0.2;
    } else if (emotion === "excited" || emotion === "happy") {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }

    // Tail animation
    if (emotion === "happy" || emotion === "excited") {
      tailRef.current.rotation.x =
        Math.PI / 6 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
    } else {
      tailRef.current.rotation.x = Math.PI / 6;
    }
  });

  return (
    <group>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0, 0]} scale={[1, 1.2, 1.4]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head - connected to body with proper positioning */}
      <group ref={headRef} position={[0, 0.7, 0.4]}>
        <mesh castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Eyes with expressions */}
        <group position={[0, 0.1, 0.3]}>
          {/* Left eye */}
          <mesh
            position={[-0.15, 0, 0]}
            scale={blinking ? [1, 0.1, 1] : [1, 1, 1]}
            castShadow
          >
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>

          {/* Right eye */}
          <mesh
            position={[0.15, 0, 0]}
            scale={blinking ? [1, 0.1, 1] : [1, 1, 1]}
            castShadow
          >
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>

          {/* Eye expressions based on emotion */}
          {(emotion === "happy" || emotion === "excited") && (
            <>
              <mesh
                position={[-0.15, -0.06, 0.01]}
                rotation={[0, 0, Math.PI / 4]}
                castShadow
              >
                <cylinderGeometry args={[0.01, 0.01, 0.04]} />
                <meshStandardMaterial color="white" />
              </mesh>
              <mesh
                position={[0.15, -0.06, 0.01]}
                rotation={[0, 0, -Math.PI / 4]}
                castShadow
              >
                <cylinderGeometry args={[0.01, 0.01, 0.04]} />
                <meshStandardMaterial color="white" />
              </mesh>
            </>
          )}
        </group>

        {/* Beak with animation */}
        <mesh
          ref={beakRef}
          position={[0, -0.05, 0.4]}
          rotation={[mouthOpen ? -0.2 : 0, 0, 0]}
          castShadow
        >
          <coneGeometry args={[0.1, 0.3, 4]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>

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
            <mesh position={[-0.15, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0.15, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
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
      <mesh position={[0, 0.35, 0.2]} rotation={[Math.PI / 6, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Wings with proper attachment */}
      <mesh
        ref={leftWingRef}
        position={[-0.5, 0, 0]}
        rotation={[0, 0, -Math.PI / 8]}
        scale={[0.1, 0.4, 0.3]}
        castShadow
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh
        ref={rightWingRef}
        position={[0.5, 0, 0]}
        rotation={[0, 0, Math.PI / 8]}
        scale={[0.1, 0.4, 0.3]}
        castShadow
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Tail feathers with animation */}
      <mesh
        ref={tailRef}
        position={[0, -0.5, -0.5]}
        rotation={[Math.PI / 6, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.4, 0.1, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Feet - properly connected to body */}
      <group position={[0, -0.8, 0]}>
        {/* Left foot */}
        <mesh position={[-0.2, 0, 0.1]} rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.2]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
        <mesh position={[-0.2, -0.1, 0.2]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.02, 0.15]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>

        {/* Right foot */}
        <mesh position={[0.2, 0, 0.1]} rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.2]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
        <mesh position={[0.2, -0.1, 0.2]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.02, 0.15]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
      </group>

      {/* Body accessories */}
      {activeAccessory === "sweater" && (
        <mesh position={[0, 0, 0]} scale={[1.02, 1.22, 1.42]} castShadow>
          <sphereGeometry args={[0.52, 32, 32]} />
          <meshStandardMaterial color="#06D6A0" roughness={0.8} />
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
