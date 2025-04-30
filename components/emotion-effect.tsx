"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Mesh, Vector3 } from "three";
import { HeartGeometry } from "./heart-geometry";

// Emotion-specific visual effects
export function Hearts() {
  const heartsRef = useRef<Mesh[]>([]);
  const heartCount = 5;

  const positions = useMemo(() => {
    return Array.from({ length: heartCount }, () => ({
      position: new Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 2
      ),
      velocity: new Vector3(
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.02 + 0.01,
        (Math.random() - 0.5) * 0.02
      ),
      scale: Math.random() * 0.2 + 0.1,
    }));
  }, []);

  useFrame((state) => {
    positions.forEach((pos, i) => {
      pos.position.add(pos.velocity);
      if (pos.position.y > 2) {
        pos.position.set(
          (Math.random() - 0.5) * 2,
          -1,
          (Math.random() - 0.5) * 2
        );
      }
      if (heartsRef.current[i]) {
        heartsRef.current[i].position.copy(pos.position);
        heartsRef.current[i].rotation.y += 0.01;
      }
    });
  });

  return (
    <group>
      {positions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => (heartsRef.current[i] = el)}
          position={pos.position}
          scale={[pos.scale, pos.scale, pos.scale]}
        >
          <HeartGeometry />
          <meshStandardMaterial color="#ff69b4" />
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
  const bubbleRef = useRef();

  useFrame((state) => {
    if (!bubbleRef.current) return;
    bubbleRef.current.position.y =
      1.2 + Math.sin(state.clock.elapsedTime) * 0.05;
  });

  return (
    <motion.group
      ref={bubbleRef}
      position={[0, 1.2, 0]}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
    </motion.group>
  );
}

export function ShockLines() {
  const linesRef = useRef();
  const lineCount = 6;

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.1;
  });

  return (
    <motion.group
      ref={linesRef}
      position={[0, 1.2, 0]}
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.3 }}
    >
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
    </motion.group>
  );
}

export function MusicNotes() {
  const notesRef = useRef();
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
        <motion.mesh
          key={i}
          position={[0.3, 1 + i * 0.2, 0]}
          initial={{ y: 0.5, opacity: 0 }}
          animate={{ y: 1 + i * 0.2, opacity: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#9c88ff" : "#ff6b81"} />
          <mesh position={[0.08, -0.1, 0]}>
            <boxGeometry args={[0.02, 0.2, 0.02]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#9c88ff" : "#ff6b81"} />
          </mesh>
        </motion.mesh>
      ))}
    </group>
  );
}

export function SleepZs() {
  const zsRef = useRef();
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
        <motion.mesh
          key={i}
          position={[0.3 + i * 0.1, 1 + i * 0.2, 0]}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.3, duration: 0.5 }}
        >
          <boxGeometry args={[0.1, 0.1, 0.02]} />
          <meshStandardMaterial color="#b8c1ec" />
        </motion.mesh>
      ))}
    </group>
  );
}
