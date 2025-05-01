"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Environment,
  ContactShadows,
  Sky,
} from "@react-three/drei";
import * as THREE from "three";

const ENVIRONMENTS = {
  park: "park",
  forest: "forest",
  beach: "beach",
  home: "apartment",
  space: "night",
};

interface PetDisplayProps {
  petType: string;
  petColor: string;
  emotion: string;
  petName: string;
}

export function PetDisplay3D({
  petType,
  petColor,
  emotion,
  petName,
}: PetDisplayProps) {
  const [environmentTheme, setEnvironmentTheme] = useState("park"); // Default to park theme
  const [timeOfDay, setTimeOfDay] = useState("day"); // Can be "morning", "day", "evening", or "night"
  const [weather, setWeather] = useState("clear"); // Can be "clear", "rainy", or "snowy"
  const [particles, setParticles] = useState([]);
  const [activeAccessory, setActiveAccessory] = useState<string | null>(null);
  const [previewAccessory, setPreviewAccessory] = useState<string | null>(null);

  // Listen for accessory changes
  useEffect(() => {
    // Get initial accessory from localStorage if available
    const savedAccessory = localStorage.getItem("activeAccessory");
    if (savedAccessory) {
      setActiveAccessory(savedAccessory);
    }

    // Listen for accessory changes
    const handleAccessoryChange = (event: CustomEvent) => {
      setActiveAccessory(event.detail.accessory);
      setPreviewAccessory(null);
    };

    // Listen for accessory preview changes
    const handleAccessoryPreview = (event: CustomEvent) => {
      setPreviewAccessory(event.detail.accessory);
    };

    // Add event listeners
    window.addEventListener(
      "accessoryChange",
      handleAccessoryChange as EventListener
    );
    window.addEventListener(
      "accessoryPreviewChange",
      handleAccessoryPreview as EventListener
    );

    // Clean up
    return () => {
      window.removeEventListener(
        "accessoryChange",
        handleAccessoryChange as EventListener
      );
      window.removeEventListener(
        "accessoryPreviewChange",
        handleAccessoryPreview as EventListener
      );
    };
  }, []);


  // Simulate day/night cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay((prev) => {
        const cycle = ["morning", "day", "evening", "night"];
        const currentIndex = cycle.indexOf(prev);
        return cycle[(currentIndex + 1) % cycle.length];
      });
    }, 60000); // Change every minute for demo purposes

    return () => clearInterval(interval);
  }, []);

  // Occasionally change weather
  useEffect(() => {
    const interval = setInterval(() => {
      const weathers = ["clear", "rainy", "snowy"];
      setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
    }, 120000); // Change every 2 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        <DynamicEnvironment
          theme={environmentTheme}
          timeOfDay={timeOfDay}
          weather={weather}
        />

        {/* New environment components */}
        <EnhancedGround theme={environmentTheme} />

        {/* Scatter some trees around */}
        <Tree position={[-5, 0, -3]} scale={1.2} />
        <Tree position={[4, 0, -4]} scale={1} />
        <Tree position={[6, 0, 2]} scale={0.8} />

        {/* Add some mountains in the background */}
        <Mountain position={[-10, 0, -15]} scale={3} color="#6b7280" />
        <Mountain position={[8, 0, -12]} scale={2.5} color="#4b5563" />

        <ContactShadows
          opacity={0.5}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
        <Pet
          petType={petType}
          petColor={petColor}
          emotion={emotion}
          petName={petName}
          activeAccessory={previewAccessory || activeAccessory}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>

      {/* Weather and time of day indicator */}
    {/* Weather and time of day indicator */}
<div className="absolute top-2 right-32 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-sm">
  <div className="flex items-center gap-2">
    <span className="font-medium">Time:</span>
    <span className="capitalize">{timeOfDay}</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="font-medium">Weather:</span>
    <span className="capitalize">{weather}</span>
    
  </div>
  <div className="flex items-center gap-2">
    <span className="font-medium">Wait and watch the dynamic changes</span>

  </div>
</div>
    </div>
  );
}

// Tree component for environment
const Tree = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 1, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Foliage */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.5, 1.2, 8]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[0.4, 1, 8]} />
        <meshStandardMaterial color="#3CB371" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshStandardMaterial color="#32CD32" roughness={0.8} />
      </mesh>
    </group>
  );
};

// Mountain component for environment
const Mountain = ({ position, scale = 1, color = "#A9A9A9" }) => {
  return (
    <mesh position={position} scale={[scale, scale, scale]}>
      <coneGeometry args={[1, 2, 4, 1]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
};

// Sun component for environment
const Sun = ({ timeOfDay }) => {
  const isVisible = timeOfDay !== "night";
  const position =
    timeOfDay === "morning"
      ? [10, 3, -15]
      : timeOfDay === "evening"
      ? [-10, 3, -15]
      : [0, 15, -15];

  const sunColor =
    timeOfDay === "morning"
      ? "#FF9E5E"
      : timeOfDay === "evening"
      ? "#FF5E5E"
      : "#FFFF00";

  if (!isVisible) return null;

  return (
    <mesh position={position}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color={sunColor} />
      <pointLight
        color={timeOfDay === "evening" ? "#FF8C66" : "#FFFFFF"}
        intensity={timeOfDay === "evening" ? 0.8 : 1}
        distance={100}
        decay={2}
      />
    </mesh>
  );
};

// Enhanced ground with better textures
const EnhancedGround = ({ theme }) => {
  // Different ground colors based on environment theme
  const groundColors = {
    forest: "#2d5a27", // Deep green
    beach: "#f5deb3", // Sandy color
    park: "#4a7c3a", // Grass green
    home: "#8b7d6b", // Indoor floor
    space: "#1a1a2e", // Dark space color
  };

  const groundColor = groundColors[theme] || "#4a7c3a"; // Default to park grass

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[30, 30, 32, 32]} />
      <meshStandardMaterial
        color={groundColor}
        roughness={0.8}
        metalness={0.1}
        wireframe={false}
      />
    </mesh>
  );
};

// Dynamic environment with weather  metalness={0.1} wireframe={false} />

// Dynamic environment with weather effects and day/night cycle
const DynamicEnvironment = ({ theme, timeOfDay, weather }) => {
  const [particles, setParticles] = useState([]);

  // Dynamic environment effects
  useEffect(() => {
    const interval = setInterval(() => {
      if (weather === "rainy") {
        setParticles((prev) => [
          ...prev,
          {
            position: [
              (Math.random() - 0.5) * 10,
              5,
              (Math.random() - 0.5) * 10,
            ],
            velocity: [0, -0.1, 0],
            lifetime: 100,
          },
        ]);
      } else if (weather === "snowy") {
        setParticles((prev) => [
          ...prev,
          {
            position: [
              (Math.random() - 0.5) * 10,
              5,
              (Math.random() - 0.5) * 10,
            ],
            velocity: [
              (Math.random() - 0.5) * 0.02,
              -0.05,
              (Math.random() - 0.5) * 0.02,
            ],
            lifetime: 200,
          },
        ]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [weather]);

  useFrame(() => {
    setParticles((prev) =>
      prev
        .map((p) => ({
          ...p,
          position: [
            p.position[0] + p.velocity[0],
            p.position[1] + p.velocity[1],
            p.position[2] + p.velocity[2],
          ],
          lifetime: p.lifetime - 1,
        }))
        .filter((p) => p.lifetime > 0)
    );
  });

  return (
    <>
      {/* Sun */}
      <Sun timeOfDay={timeOfDay} />
      <Environment preset={ENVIRONMENTS[theme]} />
      <ambientLight
        intensity={
          timeOfDay === "night" ? 0.3 : timeOfDay === "evening" ? 0.5 : 0.7
        }
      />
      <directionalLight
        position={[5, 5, 5]}
        intensity={
          timeOfDay === "night" ? 0.2 : timeOfDay === "evening" ? 0.6 : 1
        }
        castShadow
      />
      <Sky
        sunPosition={
          timeOfDay === "night"
            ? [0, -1, 0]
            : timeOfDay === "morning"
            ? [-1, 0.5, 1]
            : timeOfDay === "evening"
            ? [1, 0.2, -1]
            : [1, 1, 1]
        }
        turbidity={timeOfDay === "evening" ? 10 : 1}
        rayleigh={timeOfDay === "evening" ? 3 : 1}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color={weather === "snowy" ? "white" : "#6495ED"}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </>
  );
};

function Pet({
  petType,
  petColor,
  emotion,
  petName,
  activeAccessory,
}: {
  petType: string;
  petColor: string;
  emotion: string;
  petName: string;
  activeAccessory: string | null;
}) {
  const { scene } = useThree();
  const petRef = useRef<THREE.Group>(null);
  const [blinking, setBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [emotionState, setEmotionState] = useState(emotion);
  const [bounce, setBounce] = useState(0);

  // New walking/jumping state
  const [isWalking, setIsWalking] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [walkDirection, setWalkDirection] = useState([0, 0]);
  const [jumpHeight, setJumpHeight] = useState(0);
  const [walkCycle, setWalkCycle] = useState(0);
  const [breathingScale, setBreathingScale] = useState(1);
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [showParticles, setShowParticles] = useState(false);

  // Idle walking behavior
  useEffect(() => {
    const idleTimeout = setTimeout(() => {
      if (!isJumping && emotion !== "dancing") {
        setIsWalking(true);
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        setWalkDirection([Math.sin(angle) * 0.01, Math.cos(angle) * 0.01]);
        setRotation([0, angle, 0]);

        // Walk for a random duration
        const walkDuration = Math.random() * 5000 + 3000;
        setTimeout(() => {
          setIsWalking(false);
        }, walkDuration);
      }
    }, Math.random() * 30000 + 15000); // Random timeout
    return () => clearTimeout(idleTimeout);
  }, [isWalking, isJumping, emotion]);

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
  });

  // Get color based on petColor
  const getColor = () => {
    switch (petColor) {
      case "golden":
        return "#D4A464";
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
        return "#D4A464";
    }
  };

  // Get secondary color
  const getSecondaryColor = () => {
    switch (petColor) {
      case "golden":
        return "#A37B3B";
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
        return "#A37B3B";
    }
  };

  // Render different pet types
  const renderPet = () => {
    switch (petType) {
      case "dog":
        return (
          <DogModel
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
          <CatModel
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
          <BirdModel
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
          <DogModel
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
    <group ref={petRef} position={[0, 0, 0]}>
      {renderPet()}
      {renderEmotionIndicator()}

      {/* Pet name label */}
      <Html position={[0, 1.5, 0]} center>
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-sm font-medium text-slate-800">
          {petName}
        </div>
      </Html>
    </group>
  );
}

// Dog 3D Model
function DogModel({
  color,
  secondaryColor,
  emotion,
  blinking,
  mouthOpen,
  activeAccessory,
}: {
  color: string;
  secondaryColor: string;
  emotion: string;
  blinking: boolean;
  mouthOpen: boolean;
  activeAccessory: string | null;
}) {
  // Create refs for animatable parts
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);
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
        Math.sin(state.clock.elapsedTime * 10) * 0.5 + 0.5;
    } else if (emotion === "sad" || emotion === "scared") {
      tailRef.current.rotation.z = -0.2;
    } else {
      tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }

    // Ear animation
    if (emotion === "curious" || emotion === "alert") {
      leftEarRef.current.rotation.z =
        -0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      rightEarRef.current.rotation.z =
        0.5 - Math.sin(state.clock.elapsedTime * 2) * 0.1;
    } else if (emotion === "sad") {
      leftEarRef.current.rotation.z = -0.2;
      rightEarRef.current.rotation.z = 0.2;
    } else {
      leftEarRef.current.rotation.z = -0.3;
      rightEarRef.current.rotation.z = 0.3;
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
        ? 0.5 + Math.sin(state.clock.elapsedTime * 8) * 0.2
        : 0.1;
  });

  // Render accessories based on activeAccessory
  const renderAccessory = () => {
    if (!activeAccessory) return null;

    // Hat accessories
    if (activeAccessory === "party_hat") {
      return (
        <group position={[0, 0.6, 0]}>
          <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.3, 0.5, 32]} />
            <meshStandardMaterial color="#FF5555" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.3, 0.05, 16, 32]} />
            <meshStandardMaterial color="#5555FF" />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "crown") {
      return (
        <group position={[0, 0.6, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
            <meshStandardMaterial
              color="#FFD700"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={i}
              position={[
                0.25 * Math.sin((i * Math.PI * 2) / 5),
                0.2,
                0.25 * Math.cos((i * Math.PI * 2) / 5),
              ]}
            >
              <coneGeometry args={[0.05, 0.15, 8]} />
              <meshStandardMaterial
                color="#FFD700"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
      );
    } else if (activeAccessory === "wizard_hat") {
      return (
        <group position={[0, 0.6, 0]}>
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.25, 0.7, 32]} />
            <meshStandardMaterial color="#5555AA" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.3, 0.05, 16, 32]} />
            <meshStandardMaterial color="#5555AA" />
          </mesh>
          {/* Stars on the hat */}
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              position={[
                0.15 * Math.sin((i * Math.PI * 2) / 3),
                0.3 + i * 0.15,
                0.15 * Math.cos((i * Math.PI * 2) / 3),
              ]}
            >
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial
                color="#FFFF00"
                emissive="#FFFF00"
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
        </group>
      );
    } else if (activeAccessory === "cowboy_hat") {
      return (
        <group position={[0, 0.6, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2, 32]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.4, 0.1, 16, 32]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "beanie") {
      return (
        <group position={[0, 0.5, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.35, 32, 16]} />
            <meshStandardMaterial color="#E74C3C" />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "flower_crown") {
      return (
        <group position={[0, 0.6, 0]}>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.3, 0.03, 16, 32]} />
            <meshStandardMaterial color="#7D5A4F" />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <group
              key={i}
              position={[
                0.3 * Math.sin((i * Math.PI * 2) / 6),
                0.05,
                0.3 * Math.cos((i * Math.PI * 2) / 6),
              ]}
            >
              <mesh>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial
                  color={
                    i % 3 === 0
                      ? "#FF69B4"
                      : i % 3 === 1
                      ? "#FFFF00"
                      : "#FF6347"
                  }
                />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshStandardMaterial color="#FFFF00" />
              </mesh>
            </group>
          ))}
        </group>
      );
    } else if (activeAccessory === "pirate_hat") {
      return (
        <group position={[0, 0.6, 0]}>
          <mesh position={[0, 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.6, 0.2, 0.4]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.15, 0.2, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.15, 0.2, 0]}>
            <ringGeometry args={[0.03, 0.05, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      );
    }

    // Outfit accessories
    else if (activeAccessory === "sweater") {
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0, 0]} scale={[1.2, 0.8, 1.2]}>
            <cylinderGeometry args={[0.5, 0.4, 0.8, 32]} />
            <meshStandardMaterial color="#3498DB" />
          </mesh>
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.3, 0.05, 16, 32]} />
            <meshStandardMaterial color="#2980B9" />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "raincoat") {
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0, 0]} scale={[1.2, 0.8, 1.2]}>
            <cylinderGeometry args={[0.5, 0.4, 0.8, 32]} />
            <meshStandardMaterial color="#F1C40F" />
          </mesh>
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.3, 0.05, 16, 32]} />
            <meshStandardMaterial color="#F39C12" />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <coneGeometry args={[0.3, 0.3, 32]} />
            <meshStandardMaterial color="#F1C40F" />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "tuxedo") {
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0, 0]} scale={[1.2, 0.8, 1.2]}>
            <cylinderGeometry args={[0.5, 0.4, 0.8, 32]} />
            <meshStandardMaterial color="#2C3E50" />
          </mesh>
          <mesh position={[0, 0.1, 0.4]} scale={[0.3, 0.3, 0.1]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0, -0.1, 0.4]} scale={[0.1, 0.1, 0.1]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#E74C3C" />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "superhero") {
      return (
        <group position={[0, 0, -0.5]}>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
            <planeGeometry args={[1, 0.8]} />
            <meshStandardMaterial color="#E74C3C" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.3, 0.05, 16, 32]} />
            <meshStandardMaterial color="#F1C40F" />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "space_suit") {
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0, 0]} scale={[1.3, 0.9, 1.3]}>
            <cylinderGeometry args={[0.5, 0.4, 0.8, 32]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.3, 0.1, 16, 32]} />
            <meshStandardMaterial color="#CCCCCC" />
          </mesh>
          {/* Oxygen tank */}
          <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
            <meshStandardMaterial color="#CCCCCC" metalness={0.5} />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "hawaiian_shirt") {
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0, 0]} scale={[1.2, 0.8, 1.2]}>
            <cylinderGeometry args={[0.5, 0.4, 0.8, 32]} />
            <meshStandardMaterial color="#3498DB" />
          </mesh>
          {/* Flower patterns */}
          {[0, 1, 2, 3, 4].map((i) => (
            <group
              key={i}
              position={[
                (Math.random() - 0.5) * 0.6,
                (Math.random() - 0.5) * 0.4,
                0.4,
              ]}
            >
              <mesh>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#FF6347" />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshStandardMaterial color="#FFFF00" />
              </mesh>
            </group>
          ))}
        </group>
      );
    }

    // Special accessories
    else if (activeAccessory === "jetpack") {
      return (
        <group position={[0, 0, -0.5]}>
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
            <meshStandardMaterial
              color="#7F8C8D"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[-0.2, 0, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
            <meshStandardMaterial
              color="#7F8C8D"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {/* Flames */}
          <mesh position={[0.2, -0.4, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.1, 0.3, 16]} />
            <meshStandardMaterial
              color="#E74C3C"
              emissive="#E74C3C"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[-0.2, -0.4, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.1, 0.3, 16]} />
            <meshStandardMaterial
              color="#E74C3C"
              emissive="#E74C3C"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "sunglasses") {
      return (
        <group position={[0, 0.1, 0.5]}>
          <mesh position={[-0.15, 0, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry
              args={[0.12, 0.12, 0.05, 16]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.15, 0, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry
              args={[0.12, 0.12, 0.05, 16]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.05, 0.05]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "wings") {
      return (
        <group position={[0, 0.2, -0.3]}>
          <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[1, 0.8]} />
            <meshStandardMaterial
              color="#FFFFFF"
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[-0.5, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <planeGeometry args={[1, 0.8]} />
            <meshStandardMaterial
              color="#FFFFFF"
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "guitar") {
      return (
        <group position={[0.6, -0.2, 0.3]} rotation={[0, 0, Math.PI / 4]}>
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.05]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.25, 0.4, 0.1]} />
            <meshStandardMaterial color="#D2691E" />
          </mesh>
          {/* Strings */}
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              position={[(i - 1.5) * 0.05, 0, 0.06]}
              rotation={[0, 0, 0]}
            >
              <boxGeometry args={[0.01, 0.7, 0.01]} />
              <meshStandardMaterial color="#CCCCCC" metalness={0.8} />
            </mesh>
          ))}
        </group>
      );
    }

    // Seasonal accessories
    else if (activeAccessory === "santa_hat") {
      return (
        <group position={[0, 0.6, 0]}>
          <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0.2]}>
            <coneGeometry args={[0.3, 0.6, 32]} />
            <meshStandardMaterial color="#E74C3C" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.3, 0.08, 16, 32]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.15, 0.5, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "bunny_ears") {
      return (
        <group position={[0, 0.6, 0]}>
          <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.08, 0.05, 0.6, 16]} />
            <meshStandardMaterial color="#FFC0CB" />
          </mesh>
          <mesh position={[-0.2, 0.3, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.08, 0.05, 0.6, 16]} />
            <meshStandardMaterial color="#FFC0CB" />
          </mesh>
          <mesh position={[0.2, 0.5, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[-0.2, 0.5, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      );
    }

    // Default case - return null if accessory not found
    return null;
  };

  return (
    <group>
      {/* Body - main body with proper connection points for legs */}
      <mesh ref={bodyRef} position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head - connected to body with proper positioning */}
      <group ref={headRef} position={[0, 0.3, 0.8]}>
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Eyes with expressions based on emotion */}
        <group position={[0, 0.1, 0.4]}>
          {/* Left eye */}
          <mesh
            position={[-0.2, 0, 0]}
            scale={blinking ? [1, 0.1, 1] : [1, 1, 1]}
            castShadow
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>

          {/* Right eye */}
          <mesh
            position={[0.2, 0, 0]}
            scale={blinking ? [1, 0.1, 1] : [1, 1, 1]}
            castShadow
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>

          {/* Eye expressions based on emotion */}
          {(emotion === "happy" ||
            emotion === "excited" ||
            emotion === "laughing") && (
            <>
              <mesh
                position={[-0.2, -0.1, 0]}
                rotation={[0, 0, Math.PI / 4]}
                castShadow
              >
                <cylinderGeometry args={[0.01, 0.01, 0.1]} />
                <meshStandardMaterial color="black" />
              </mesh>
              <mesh
                position={[0.2, -0.1, 0]}
                rotation={[0, 0, -Math.PI / 4]}
                castShadow
              >
                <cylinderGeometry args={[0.01, 0.01, 0.1]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </>
          )}

          {(emotion === "sad" || emotion === "scared") && (
            <>
              <mesh
                position={[-0.2, 0.1, 0]}
                rotation={[0, 0, -Math.PI / 4]}
                castShadow
              >
                <cylinderGeometry args={[0.01, 0.01, 0.1]} />
                <meshStandardMaterial color="black" />
              </mesh>
              <mesh
                position={[0.2, 0.1, 0]}
                rotation={[0, 0, Math.PI / 4]}
                castShadow
              >
                <cylinderGeometry args={[0.01, 0.01, 0.1]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </>
          )}
        </group>

        {/* Nose */}
        <mesh position={[0, -0.1, 0.5]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Mouth with expression */}
        <mesh
          ref={mouthRef}
          position={[0, -0.2, 0.45]}
          scale={[1, mouthOpen ? 0.5 : 0.1, 0.1]}
          castShadow
        >
          <boxGeometry args={[0.3, 0.1, 0.1]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Ears with proper attachment to head */}
        <mesh
          ref={leftEarRef}
          position={[-0.3, 0.3, -0.1]}
          rotation={[0, 0, -0.3]}
          scale={[0.15, 0.25, 0.1]}
          castShadow
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
        <mesh
          ref={rightEarRef}
          position={[0.3, 0.3, -0.1]}
          rotation={[0, 0, 0.3]}
          scale={[0.15, 0.25, 0.1]}
          castShadow
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
      </group>

      {/* Neck - connecting head and body */}
      <mesh position={[0, 0.15, 0.4]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Legs - properly connected to body */}
      <group position={[0, 0, 0]}>
        {/* Front left leg */}
        <mesh position={[-0.3, -0.3, 0.3]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.6]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Front right leg */}
        <mesh position={[0.3, -0.3, 0.3]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.6]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Back left leg */}
        <mesh position={[-0.3, -0.3, -0.3]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.6]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Back right leg */}
        <mesh position={[0.3, -0.3, -0.3]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.6]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Paws */}
        <mesh position={[-0.3, -0.6, 0.3]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
        <mesh position={[0.3, -0.6, 0.3]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
        <mesh position={[-0.3, -0.6, -0.3]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
        <mesh position={[0.3, -0.6, -0.3]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
      </group>

      {/* Tail with animation */}
      <group position={[0, 0, -0.5]}>
        <mesh
          ref={tailRef}
          position={[0, -0.2, -0.01]}
          rotation={[0, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.05, 0.01, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>

       
      </group>

      {/* Render the active accessory */}
      {renderAccessory()}
    </group>
  );
}

// Cat 3D Model
function CatModel({
  color,
  secondaryColor,
  emotion,
  blinking,
  mouthOpen,
  activeAccessory,
}: {
  color: string;
  secondaryColor: string;
  emotion: string;
  blinking: boolean;
  mouthOpen: boolean;
  activeAccessory: string | null;
}) {
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

  // Render accessories based on activeAccessory
  const renderAccessory = () => {
    if (!activeAccessory) return null;

    // Reuse the same accessory rendering logic as in DogModel
    // This ensures consistent appearance across pet types
    // For cat-specific positioning, adjust the position values as needed

    // Hat accessories
    if (activeAccessory === "party_hat") {
      return (
        <group position={[0, 0.6, 0]}>
          <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.3, 0.5, 32]} />
            <meshStandardMaterial color="#FF5555" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.3, 0.05, 16, 32]} />
            <meshStandardMaterial color="#5555FF" />
          </mesh>
        </group>
      );
    } else if (activeAccessory === "crown") {
      return (
        <group position={[0, 0.6, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
            <meshStandardMaterial
              color="#FFD700"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={i}
              position={[
                0.25 * Math.sin((i * Math.PI * 2) / 5),
                0.2,
                0.25 * Math.cos((i * Math.PI * 2) / 5),
              ]}
            >
              <coneGeometry args={[0.05, 0.15, 8]} />
              <meshStandardMaterial
                color="#FFD700"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
      );
    }

    // Outfit accessories - adjusted for cat body shape
    else if (activeAccessory === "sweater") {
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0, 0]} scale={[1.2, 0.7, 1.8]}>
            <cylinderGeometry args={[0.4, 0.3, 0.7, 32]} />
            <meshStandardMaterial color="#3498DB" />
          </mesh>
          <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.25, 0.05, 16, 32]} />
            <meshStandardMaterial color="#2980B9" />
          </mesh>
        </group>
      );
    }

    // Special accessories
    else if (activeAccessory === "sunglasses") {
      return (
        <group position={[0, 0.1, 0.4]}>
          <mesh position={[-0.15, 0, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry
              args={[0.1, 0.1, 0.05, 16]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.15, 0, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry
              args={[0.1, 0.1, 0.05, 16]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.05, 0.05]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      );
    }

    // Default case - return null if accessory not found
    return null;
  };

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
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head - connected to body with proper positioning */}
      <group ref={headRef} position={[0, 0.3, 0.8]}>
        <mesh castShadow>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial color={color} />
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
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh
          ref={rightEarRef}
          position={[0.25, 0.4, -0.1]}
          rotation={[0, 0, -Math.PI / 4]}
          castShadow
        >
          <coneGeometry args={[0.15, 0.3, 3]} />
          <meshStandardMaterial color={color} />
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
      </group>

      {/* Neck - connecting head and body */}
      <mesh position={[0, 0.15, 0.4]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Legs - properly connected to body */}
      <group position={[0, 0, 0]}>
        {/* Front left leg */}
        <mesh position={[-0.3, -0.3, 0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Front right leg */}
        <mesh position={[0.3, -0.3, 0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Back left leg */}
        <mesh position={[-0.3, -0.3, -0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Back right leg */}
        <mesh position={[0.3, -0.3, -0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Paws */}
        <mesh position={[-0.3, -0.55, 0.3]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
        <mesh position={[0.3, -0.55, 0.3]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
        <mesh position={[-0.3, -0.55, -0.3]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
        <mesh position={[0.3, -0.55, -0.3]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={secondaryColor} />
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
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.2, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

// Bird 3D Model
function BirdModel({
  color,
  secondaryColor,
  emotion,
  blinking,
  mouthOpen,
}: {
  color: string;
  secondaryColor: string;
  emotion: string;
  blinking: boolean;
  mouthOpen: boolean;
}) {
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
    </group>
  );
}

// Hearts for loving emotion
function Hearts() {
  const hearts = Array(5)
    .fill(null)
    .map((_, i) => ({
      position: [Math.sin(i * 1.5) * 1.2, 1 + i * 0.3, Math.cos(i * 1.2) * 1.2],
      scale: 0.2 + Math.random() * 0.1,
      rotation: [0, (i * Math.PI) / 5, 0],
    }));

  return (
    <group>
      {hearts.map((heart, i) => (
        <mesh
          key={i}
          position={heart.position as [number, number, number]}
          scale={heart.scale}
        >
          <heartGeometry />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      ))}
    </group>
  );
}

// Custom heart geometry
function heartGeometry() {
  const shape = new THREE.Shape();

  shape.moveTo(0, 0);
  shape.bezierCurveTo(0, -0.5, -1, -1, -2, 0);
  shape.bezierCurveTo(-3, 1, -3, 2, 0, 4);
  shape.bezierCurveTo(3, 2, 3, 1, 2, 0);
  shape.bezierCurveTo(1, -1, 0, -0.5, 0, 0);

  const extrudeSettings = {
    steps: 2,
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3,
  };

  return <extrudeGeometry args={[shape, extrudeSettings]} />;
}

// Thought bubble for thinking emotion
function ThoughtBubble() {
  return (
    <group position={[1, 1, 0]}>
      {/* Small bubbles */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.2, 0.2, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Main thought bubble */}
      <mesh position={[0.5, 0.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Question mark */}
      <Text position={[0.5, 0.5, 0.2]} fontSize={0.2} color="black">
        ?
      </Text>
    </group>
  );
}

// Shock lines for shocked emotion
function ShockLines() {
  const lines = Array(8)
    .fill(null)
    .map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return {
        start: [Math.cos(angle) * 0.7, 0.7, Math.sin(angle) * 0.7],
        end: [Math.cos(angle) * 1.2, 0.7, Math.sin(angle) * 1.2],
      };
    });

  return (
    <group>
      {lines.map((line, i) => (
        <mesh key={i}>
          <cylinderGeometry
            args={[
              0.02,
              0.02,
              Math.sqrt(
                Math.pow(line.end[0] - line.start[0], 2) +
                  Math.pow(line.end[1] - line.start[1], 2) +
                  Math.pow(line.end[2] - line.start[2], 2)
              ),
            ]}
            position={[
              (line.start[0] + line.end[0]) / 2,
              (line.start[1] + line.end[1]) / 2,
              (line.start[2] + line.end[2]) / 2,
            ]}
            rotation={[
              Math.atan2(
                line.end[2] - line.start[2],
                Math.sqrt(
                  Math.pow(line.end[0] - line.start[0], 2) +
                    Math.pow(line.end[1] - line.start[1], 2)
                )
              ),
              0,
              Math.atan2(
                line.end[0] - line.start[0],
                line.end[1] - line.start[1]
              ),
            ]}
          />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      ))}
    </group>
  );
}

// Music notes for dancing emotion
function MusicNotes() {
  const notes = [
    { position: [1, 0.8, 0.5], rotation: [0, 0, 0.2], scale: 0.2 },
    { position: [0.8, 1.2, 0], rotation: [0, 0, -0.3], scale: 0.25 },
    { position: [1.2, 1, -0.5], rotation: [0, 0, 0.1], scale: 0.18 },
  ];

  return (
    <group>
      {notes.map((note, i) => (
        <Text
          key={i}
          position={note.position as [number, number, number]}
          rotation={note.rotation as [number, number, number]}
          fontSize={note.scale}
          color="black"
        >
          {i % 2 === 0 ? "♪" : "♫"}
        </Text>
      ))}
    </group>
  );
}

// Z's for sleepy emotion
function SleepZs() {
  const zs = [
    { position: [0.8, 1, 0], scale: 0.2 },
    { position: [1, 1.2, 0], scale: 0.25 },
    { position: [1.2, 1.4, 0], scale: 0.3 },
  ];

  return (
    <group>
      {zs.map((z, i) => (
        <Text
          key={i}
          position={z.position as [number, number, number]}
          fontSize={z.scale}
          color="black"
        >
          Z
        </Text>
      ))}
    </group>
  );
}
