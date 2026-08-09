'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Palette for clothing so each person looks distinct
const SHIRT_COLORS = ['#00467F', '#B91C1C', '#047857', '#B45309', '#6D28D9', '#0E7490', '#BE185D']
const PANTS_COLORS = ['#1F2937', '#374151', '#3F3F46', '#111827']
const SKIN_COLORS = ['#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#FFDBAC']

// A single low-poly person. Legs and arms swing while walking.
function Person({
  shirt,
  pants,
  skin,
  phaseOffset,
}: {
  shirt: string
  pants: string
  skin: string
  phaseOffset: number
}) {
  const leftLeg = useRef<THREE.Mesh>(null)
  const rightLeg = useRef<THREE.Mesh>(null)
  const leftArm = useRef<THREE.Mesh>(null)
  const rightArm = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime * 6 + phaseOffset
    const swing = Math.sin(t) * 0.5
    if (leftLeg.current) leftLeg.current.rotation.x = swing
    if (rightLeg.current) rightLeg.current.rotation.x = -swing
    if (leftArm.current) leftArm.current.rotation.x = -swing
    if (rightArm.current) rightArm.current.rotation.x = swing
  })

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={skin} roughness={0.7} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.42, 0.6, 0.24]} />
        <meshStandardMaterial color={shirt} roughness={0.8} />
      </mesh>
      {/* Arms (pivot at shoulder) */}
      <group position={[-0.28, 1.35, 0]}>
        <mesh ref={leftArm} position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.55, 0.12]} />
          <meshStandardMaterial color={shirt} roughness={0.8} />
        </mesh>
      </group>
      <group position={[0.28, 1.35, 0]}>
        <mesh ref={rightArm} position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.55, 0.12]} />
          <meshStandardMaterial color={shirt} roughness={0.8} />
        </mesh>
      </group>
      {/* Legs (pivot at hip) */}
      <group position={[-0.12, 0.75, 0]}>
        <mesh ref={leftLeg} position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.15, 0.7, 0.15]} />
          <meshStandardMaterial color={pants} roughness={0.8} />
        </mesh>
      </group>
      <group position={[0.12, 0.75, 0]}>
        <mesh ref={rightLeg} position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.15, 0.7, 0.15]} />
          <meshStandardMaterial color={pants} roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

// A person that walks left-and-right along the sidewalk (X axis) in front of the restaurant
function WalkingPerson({
  zPosition,
  startX,
  endX,
  speed,
  delay,
  appearance,
}: {
  zPosition: number
  startX: number
  endX: number
  speed: number
  delay: number
  appearance: { shirt: string; pants: string; skin: string; phaseOffset: number }
}) {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(-delay)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    timeRef.current += delta * speed

    // Ping-pong between 0 and 1 so people walk along the sidewalk and back
    const cycle = timeRef.current % 2
    const forward = cycle < 1
    const p = forward ? cycle : 2 - cycle
    const x = THREE.MathUtils.lerp(startX, endX, p)

    groupRef.current.position.set(x, 0, zPosition)
    // Face the direction of travel (along X)
    groupRef.current.rotation.y = forward ? Math.PI / 2 : -Math.PI / 2
  })

  return (
    <group ref={groupRef}>
      <Person {...appearance} />
    </group>
  )
}

// A crowd of people walking along the sidewalk in front of the restaurant
export function WalkingPeople() {
  const people = useMemo(() => {
    // Different lanes across the sidewalk depth (sidewalk is centered at z = 27)
    const lanes = [24.5, 26, 27.5, 25, 27, 24, 28]
    return lanes.map((z, i) => {
      const goingRight = i % 2 === 0
      return {
        key: `person-${i}`,
        zPosition: z,
        startX: goingRight ? -70 : 70,
        endX: goingRight ? 70 : -70,
        speed: 0.05 + (i % 3) * 0.015,
        delay: i * 2.2,
        appearance: {
          shirt: SHIRT_COLORS[i % SHIRT_COLORS.length],
          pants: PANTS_COLORS[i % PANTS_COLORS.length],
          skin: SKIN_COLORS[i % SKIN_COLORS.length],
          phaseOffset: i * 1.3,
        },
      }
    })
  }, [])

  return (
    <group>
      {people.map((p) => (
        <WalkingPerson
          key={p.key}
          zPosition={p.zPosition}
          startX={p.startX}
          endX={p.endX}
          speed={p.speed}
          delay={p.delay}
          appearance={p.appearance}
        />
      ))}
    </group>
  )
}
