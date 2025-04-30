import { useMemo } from "react";
import { BufferGeometry, BufferAttribute } from "three";

export function createHeartGeometry() {
  const geometry = new BufferGeometry();

  // Create heart shape vertices
  const vertices = [];
  const segments = 32;

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    vertices.push(x * 0.1, y * 0.1, 0);
  }

  // Create indices for triangles
  const indices = [];
  for (let i = 0; i < segments; i++) {
    indices.push(0, i + 1, i + 2);
  }

  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(vertices), 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

export function HeartGeometry() {
  const geometry = useMemo(() => createHeartGeometry(), []);
  return <primitive object={geometry} attach="geometry" />;
}
