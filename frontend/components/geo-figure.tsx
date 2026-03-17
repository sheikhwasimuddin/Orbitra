"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { AdditiveBlending, CanvasTexture, Color, DoubleSide, SRGBColorSpace } from "three";

function hashNoise(x: number, y: number, seed = 1337): number {
  const s = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return s - Math.floor(s);
}

function createEarthTexture(size = 1024): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to create 2D context for Earth texture.");
  }

  const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGradient.addColorStop(0, "#0a2741");
  oceanGradient.addColorStop(0.45, "#0c3f6f");
  oceanGradient.addColorStop(1, "#0b2138");
  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const nx = x / canvas.width;
      const ny = y / canvas.height;

      const n1 = hashNoise(nx * 6, ny * 6);
      const n2 = hashNoise(nx * 17, ny * 17, 77);
      const n3 = hashNoise(nx * 45, ny * 45, 222);
      const landMask = n1 * 0.6 + n2 * 0.3 + n3 * 0.1;

      if (landMask > 0.56) {
        const latitudeFactor = Math.abs(ny - 0.5) * 2;
        const isDry = landMask > 0.7;
        let color = "#3f7f40";

        if (latitudeFactor > 0.78) {
          color = "#c8d8dd";
        } else if (latitudeFactor > 0.62) {
          color = "#6a8c57";
        } else if (isDry) {
          color = "#96764a";
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createCloudTexture(size = 1024): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to create 2D context for cloud texture.");
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const nx = x / canvas.width;
      const ny = y / canvas.height;
      const cloudNoise = hashNoise(nx * 10, ny * 20, 991) * 0.7 + hashNoise(nx * 30, ny * 35, 512) * 0.3;
      if (cloudNoise > 0.67) {
        const alpha = Math.min(0.85, (cloudNoise - 0.67) * 3.2);
        ctx.fillStyle = `rgba(245, 252, 255, ${alpha})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function EarthGlobe() {
  const groupRef = useRef<Group>(null);
  const cloudRef = useRef<Mesh>(null);

  const earthTexture = useMemo(() => createEarthTexture(1400), []);
  const cloudTexture = useMemo(() => createCloudTexture(1400), []);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }
    groupRef.current.rotation.y += delta * 0.08;
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.11;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.17, -0.7, 0]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.3, 96, 96]} />
        <meshStandardMaterial map={earthTexture} roughness={0.95} metalness={0.05} />
      </mesh>

      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.33, 96, 96]} />
        <meshStandardMaterial map={cloudTexture} transparent opacity={0.45} depthWrite={false} />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.42, 64, 64]} />
        <meshBasicMaterial
          color={new Color("#6fd0ff")}
          transparent
          opacity={0.2}
          side={DoubleSide}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function SatelliteNearEarth() {
  const orbitRef = useRef<Group>(null);
  const satelliteRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.32;
    }
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y += delta * 1.4;
      satelliteRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.08;
    }
  });

  return (
    <group rotation={[0.25, 0.4, 0.12]}>
      <mesh>
        <torusGeometry args={[2.16, 0.012, 16, 160]} />
        <meshBasicMaterial color="#6cc9ff" transparent opacity={0.45} />
      </mesh>

      <group ref={orbitRef}>
        <group ref={satelliteRef} position={[2.16, 0.02, 0]}>
          <mesh>
            <boxGeometry args={[0.16, 0.16, 0.24]} />
            <meshStandardMaterial color="#c3cfde" metalness={0.78} roughness={0.22} />
          </mesh>

          <mesh position={[0.17, 0, 0]}>
            <boxGeometry args={[0.28, 0.02, 0.16]} />
            <meshStandardMaterial color="#2f5f9f" metalness={0.25} roughness={0.5} emissive="#17345a" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[-0.17, 0, 0]}>
            <boxGeometry args={[0.28, 0.02, 0.16]} />
            <meshStandardMaterial color="#2f5f9f" metalness={0.25} roughness={0.5} emissive="#17345a" emissiveIntensity={0.35} />
          </mesh>

          <mesh position={[0, 0.09, 0.12]} rotation={[-0.45, 0, 0]}>
            <coneGeometry args={[0.05, 0.08, 16]} />
            <meshStandardMaterial color="#dbe7f5" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function FigureFallback() {
  return <div className="h-full w-full animate-pulse rounded-2xl bg-white/5" />;
}

export function GeoFigure() {
  return (
    <div className="relative h-[290px] w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-950/40">
      <Suspense fallback={<FigureFallback />}>
        <Canvas camera={{ position: [0, 0, 4.6], fov: 42 }}>
          <color attach="background" args={["#071a24"]} />
          <fog attach="fog" args={["#071a24", 5.8, 8.8]} />
          <ambientLight intensity={0.32} />
          <directionalLight position={[3.5, 1.5, 2]} intensity={1.3} color="#ffffff" />
          <pointLight position={[-3, -2, -1]} intensity={0.3} color="#72d7ff" />
          <Stars radius={30} depth={22} count={1000} factor={1.7} fade speed={0.4} />
          <EarthGlobe />
          <SatelliteNearEarth />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} />
        </Canvas>
      </Suspense>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/70 to-transparent" />
    </div>
  );
}
