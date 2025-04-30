"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { Pet3DModel } from "@/components/pet-3d-model";
import { Badge } from "@/components/ui/badge";

interface Pet3DDisplayProps {
  petType: string;
  petColor: string;
  emotion: string;
  petName: string;
  activeAccessory?: string | null;
  onInteract?: () => void;
}

export function Pet3DDisplay({
  petType,
  petColor,
  emotion,
  petName,
  activeAccessory = null,
  onInteract,
}: Pet3DDisplayProps) {
  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-slate-200 shadow-md">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        {/* Simple environment with good lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Environment preset="sunset" />
        <ContactShadows
          opacity={0.5}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />

        {/* Pet model */}
        <Pet3DModel
          petType={petType}
          petColor={petColor}
          emotion={emotion}
          petName={petName}
          activeAccessory={activeAccessory}
          onInteract={onInteract}
        />

        {/* Camera controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          dampingFactor={0.1}
          rotateSpeed={0.5}
        />
      </Canvas>

      {/* Pet name and emotion display */}
      <div className="absolute top-4 left-4 z-10">
        <Badge
          variant="outline"
          className="bg-white/80 backdrop-blur-sm text-sm font-medium"
        >
          {emotion}
        </Badge>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Badge
          variant="outline"
          className="bg-white/80 backdrop-blur-sm px-4 py-1.5 text-base font-bold"
        >
          {petName}
        </Badge>
      </div>
    </div>
  );
}
