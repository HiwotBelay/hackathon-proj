"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Float } from "@react-three/drei";
import { ModernEnvironment } from "./modern-environment";
import { ModernDogModel } from "./modern-dog-model";
import { ModernCatModel } from "./modern-cat-model";
import { ModernBirdModel } from "./modern-bird-model";
import {
  Hearts,
  ThoughtBubble,
  ShockLines,
  MusicNotes,
  SleepZs,
} from "./modern-environment";
import * as THREE from "three";

interface ModernPetDisplayProps {
  petType: string;
  petColor: string;
  emotion: string;
  petName: string;
  activeAccessory?: string | null;
  timeOfDay?: "morning" | "day" | "evening" | "night";
  onInteract?: () => void;
}

export function ModernPetDisplay({
  petType,
  petColor,
  emotion,
  petName,
  activeAccessory = null,
  timeOfDay = "day",
  onInteract,
}: ModernPetDisplayProps) {
  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-xl">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        <ModernEnvironment emotion={emotion} timeOfDay={timeOfDay} />
        <ContactShadows
          opacity={0.5}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
        <Float
          speed={1} // Animation speed, defaults to 1
          rotationIntensity={0.2} // XYZ rotation intensity, defaults to 1
          floatIntensity={0.5} // Up/down float intensity, defaults to 1
          floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
        >
          <ModernPet
            petType={petType}
            petColor={petColor}
            emotion={emotion}
            petName={petName}
            activeAccessory={activeAccessory}
            onInteract={onInteract}
          />
        </Float>
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}

function ModernPet({
  petType,
  petColor,
  emotion,
  petName,
  activeAccessory,
  onInteract,
}: ModernPetDisplayProps) {
  const { scene } = useThree();
  const petRef = useRef<THREE.Group>(null);
  const [blinking, setBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [emotionState, setEmotionState] = useState(emotion);
  const [bounce, setBounce] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Set up blink interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    }, 3000 + Math.random() * 2000); // Random blink interval

    return () => clearInterval(blinkInterval);
  }, []);

  // Set up mouth movement for speaking
  useEffect(() => {
    if (speaking) {
      const speakInterval = setInterval(() => {
        setMouthOpen((prev) => !prev);
      }, 150);

      return () => clearInterval(speakInterval);
    }
  }, [speaking]);

  // Update emotion with smooth transition
  useEffect(() => {
    setEmotionState(emotion);

    // Add a bounce effect when emotion changes
    setBounce(0.2);
    const timer = setTimeout(() => setBounce(0), 300);

    return () => clearTimeout(timer);
  }, [emotion]);

  // Animation loop
  useFrame((state, delta) => {
    if (!petRef.current) return;

    // Base idle animation - gentle bobbing
    const idleBob = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;

    // Emotion-specific animations
    let emotionMovement = { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0 };

    switch (emotionState) {
      case "happy":
        // Gentle tail wag and happy bounce
        emotionMovement = {
          x: 0,
          y: Math.sin(state.clock.elapsedTime * 3) * 0.08 + bounce,
          z: 0,
          rotX: Math.sin(state.clock.elapsedTime) * 0.05,
          rotY: Math.sin(state.clock.elapsedTime * 2) * 0.1,
          rotZ: 0,
        };
        break;
      case "excited":
        // More energetic movement
        emotionMovement = {
          x: Math.sin(state.clock.elapsedTime * 5) * 0.1,
          y: Math.sin(state.clock.elapsedTime * 6) * 0.15 + bounce,
          z: 0,
          rotX: Math.sin(state.clock.elapsedTime * 3) * 0.08,
          rotY: Math.sin(state.clock.elapsedTime * 4) * 0.2,
          rotZ: Math.sin(state.clock.elapsedTime * 2) * 0.05,
        };
        break;
      case "playful":
        // Playful spin and bounce
        emotionMovement = {
          x: Math.sin(state.clock.elapsedTime * 3) * 0.1,
          y: Math.abs(Math.sin(state.clock.elapsedTime * 4)) * 0.15 + bounce,
          z: Math.cos(state.clock.elapsedTime * 3) * 0.1,
          rotX: 0,
          rotY: delta * 0.5,
          rotZ: Math.sin(state.clock.elapsedTime * 2) * 0.1,
        };
        break;
      case "dancing":
        // Dancing movement
        emotionMovement = {
          x: Math.sin(state.clock.elapsedTime * 5) * 0.15,
          y: Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.2 + bounce,
          z: Math.cos(state.clock.elapsedTime * 5) * 0.15,
          rotX: Math.sin(state.clock.elapsedTime * 2) * 0.1,
          rotY: Math.sin(state.clock.elapsedTime * 3) * 0.1,
          rotZ: Math.sin(state.clock.elapsedTime * 4) * 0.15,
        };
        break;
      case "sad":
        // Drooping movement
        emotionMovement = {
          x: 0,
          y: Math.sin(state.clock.elapsedTime) * 0.03 - 0.1 + bounce,
          z: 0,
          rotX: -0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03,
          rotY: 0,
          rotZ: Math.sin(state.clock.elapsedTime * 0.5) * 0.02,
        };
        break;
      case "scared":
        // Trembling
        emotionMovement = {
          x: Math.sin(state.clock.elapsedTime * 15) * 0.05,
          y: Math.sin(state.clock.elapsedTime * 10) * 0.03 - 0.05 + bounce,
          z: Math.sin(state.clock.elapsedTime * 12) * 0.03,
          rotX: Math.sin(state.clock.elapsedTime * 10) * 0.02,
          rotY: Math.sin(state.clock.elapsedTime * 8) * 0.02,
          rotZ: Math.sin(state.clock.elapsedTime * 12) * 0.02,
        };
        break;
      case "loving":
        // Gentle swaying with slight bounce
        emotionMovement = {
          x: 0,
          y: Math.sin(state.clock.elapsedTime * 2) * 0.05 + bounce,
          z: 0,
          rotX: 0,
          rotY: 0,
          rotZ: Math.sin(state.clock.elapsedTime * 1.5) * 0.08,
        };
        break;
      case "sleepy":
        // Slow, drowsy movement
        emotionMovement = {
          x: 0,
          y: Math.sin(state.clock.elapsedTime * 0.8) * 0.03 - 0.05 + bounce,
          z: 0,
          rotX: Math.sin(state.clock.elapsedTime * 0.5) * 0.05 - 0.05,
          rotY: 0,
          rotZ: Math.sin(state.clock.elapsedTime * 0.3) * 0.03,
        };
        break;
      case "laughing":
        // Laughing shake
        emotionMovement = {
          x: Math.sin(state.clock.elapsedTime * 10) * 0.03,
          y: Math.sin(state.clock.elapsedTime * 8) * 0.05 + 0.05 + bounce,
          z: 0,
          rotX: Math.sin(state.clock.elapsedTime * 8) * 0.03,
          rotY: 0,
          rotZ: Math.sin(state.clock.elapsedTime * 8) * 0.05,
        };
        break;
      case "hungry":
        // Hungry movement - looking around for food
        emotionMovement = {
          x: Math.sin(state.clock.elapsedTime * 1.5) * 0.1,
          y: Math.sin(state.clock.elapsedTime * 2) * 0.05 - 0.02 + bounce,
          z: 0,
          rotX: 0,
          rotY: Math.sin(state.clock.elapsedTime * 1.5) * 0.2,
          rotZ: 0,
        };
        break;
      case "curious":
        // Curious movement - head tilting and looking around
        emotionMovement = {
          x: Math.sin(state.clock.elapsedTime * 1.2) * 0.08,
          y: Math.sin(state.clock.elapsedTime * 1.5) * 0.05 + bounce,
          z: 0,
          rotX: Math.sin(state.clock.elapsedTime * 0.8) * 0.05,
          rotY: Math.sin(state.clock.elapsedTime * 1) * 0.15,
          rotZ: Math.sin(state.clock.elapsedTime * 1.2) * 0.1,
        };
        break;
      default:
        // Default idle animation
        emotionMovement = {
          x: 0,
          y: idleBob + bounce,
          z: 0,
          rotX: 0,
          rotY: Math.sin(state.clock.elapsedTime) * 0.05,
          rotZ: 0,
        };
    }

    // Apply all movements
    petRef.current.position.y = emotionMovement.y;
    petRef.current.position.x = emotionMovement.x;
    petRef.current.position.z = emotionMovement.z;

    // Apply rotations with damping for smoother transitions
    petRef.current.rotation.x +=
      (emotionMovement.rotX - petRef.current.rotation.x) * 0.1;
    petRef.current.rotation.y +=
      (emotionMovement.rotY - petRef.current.rotation.y) * 0.1;
    petRef.current.rotation.z +=
      (emotionMovement.rotZ - petRef.current.rotation.z) * 0.1;

    // Add hover effect
    if (hovered) {
      petRef.current.scale.x = THREE.MathUtils.lerp(
        petRef.current.scale.x,
        1.05,
        0.1
      );
      petRef.current.scale.y = THREE.MathUtils.lerp(
        petRef.current.scale.y,
        1.05,
        0.1
      );
      petRef.current.scale.z = THREE.MathUtils.lerp(
        petRef.current.scale.z,
        1.05,
        0.1
      );
    } else {
      petRef.current.scale.x = THREE.MathUtils.lerp(
        petRef.current.scale.x,
        1,
        0.1
      );
      petRef.current.scale.y = THREE.MathUtils.lerp(
        petRef.current.scale.y,
        1,
        0.1
      );
      petRef.current.scale.z = THREE.MathUtils.lerp(
        petRef.current.scale.z,
        1,
        0.1
      );
    }
  });

  // Get color based on petColor
  const getColor = () => {
    switch (petColor) {
      case "golden":
        return "#FFD700";
      case "brown":
        return "#8B4513";
      case "black":
        return "#2D2D2D";
      case "white":
        return "#F5F5F5";
      case "gray":
        return "#808080";
      case "red":
        return "#FF6B6B";
      case "green":
        return "#4CAF50";
      case "yellow":
        return "#FFEB3B";
      case "blue":
        return "#4F86F7";
      default:
        return "#F7D08A";
    }
  };

  // Get secondary color
  const getSecondaryColor = () => {
    switch (petColor) {
      case "golden":
        return "#DAA520";
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
        return "#DAA520";
    }
  };

  // Render different pet types
  const renderPet = () => {
    switch (petType) {
      case "dog":
        return (
          <ModernDogModel
            color={getColor()}
            secondaryColor={getSecondaryColor()}
            emotion={emotionState}
            blinking={blinking}
            mouthOpen={mouthOpen}
            activeAccessory={activeAccessory}
          />
        );
      case "cat":
        return (
          <ModernCatModel
            color={getColor()}
            secondaryColor={getSecondaryColor()}
            emotion={emotionState}
            blinking={blinking}
            mouthOpen={mouthOpen}
            activeAccessory={activeAccessory}
          />
        );
      case "bird":
        return (
          <ModernBirdModel
            color={getColor()}
            secondaryColor={getSecondaryColor()}
            emotion={emotionState}
            blinking={blinking}
            mouthOpen={mouthOpen}
            activeAccessory={activeAccessory}
          />
        );
      default:
        return (
          <ModernDogModel
            color={getColor()}
            secondaryColor={getSecondaryColor()}
            emotion={emotionState}
            blinking={blinking}
            mouthOpen={mouthOpen}
            activeAccessory={activeAccessory}
          />
        );
    }
  };

  // Render emotion indicators
  const renderEmotionIndicator = () => {
    switch (emotionState) {
      case "loving":
        return <Hearts />;
      case "thinking":
        return <ThoughtBubble />;
      case "shocked":
        return <ShockLines />;
      case "dancing":
        return <MusicNotes />;
      case "sleepy":
        return <SleepZs />;
      default:
        return null;
    }
  };

  return (
    <group
      ref={petRef}
      position={[0, 0, 0]}
      onClick={onInteract}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {renderPet()}
      {renderEmotionIndicator()}

      {/* Pet name label */}
      <Html position={[0, 1.5, 0]} center>
        <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-bold text-slate-800 border-2 border-blue-300">
          {petName}
        </div>
      </Html>
    </group>
  );
}
