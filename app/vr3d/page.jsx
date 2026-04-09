'use client'

import './styles.css'
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment, OrbitControls } from '@react-three/drei'
// Removed wouter dependency - using React state instead
import { easing } from 'maath'
import getUuid from 'uuid-by-string'
import Navbar from '@/components/Navbar'

const GOLDENRATIO = 1.61803398875
// const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`

const images = [
  // Front center
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: '/vault/Characters for AR_Art Collection/Cleansing Rite.jpg' },
  // Front left and right
  { position: [-1.2, 0, 1.2], rotation: [0, Math.PI / 6, 0], url: '/vault/Characters for AR_Art Collection/Exorcise Me Whole.jpg' },
  { position: [1.2, 0, 1.2], rotation: [0, -Math.PI / 6, 0], url: '/vault/Characters for AR_Art Collection/Homebound Galaxy.jpg' },
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: '/vault/Characters for AR_Art Collection/Let Go.jpg' },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: '/vault/Characters for AR_Art Collection/Liquid Desire.jpg' },
  // Left side
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: '/vault/Characters for AR_Art Collection/My Freak Family.jpg' },
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: '/vault/Characters for AR_Art Collection/Necroflora.jpg' },
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: '/vault/Characters for AR_Art Collection/Planet of Love.jpg' },
  // Right side
  { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: '/vault/Characters for AR_Art Collection/Taste the Power.jpg' },
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: '/vault/Characters for AR_Art Collection/The Unburied Ones.jpg' },
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: '/vault/Characters for AR_Art Collection/Ugly is Beautiful.jpg' }
]

// VR/AR Controls Component - handles WebXR session management
function XRControls({ isVR, isAR }) {
  const { gl } = useThree()
  const sessionRef = useRef(null)
  
  useEffect(() => {
    // Check if WebXR is available
    if (typeof navigator === 'undefined' || !navigator.xr) {
      return
    }
    
    // Get the XR manager from the renderer
    // gl is the WebGLRenderer, and xr should be the WebXRManager
    const xrManager = gl.xr
    
    // Check if xrManager exists and is an object (not a boolean)
    if (!xrManager || typeof xrManager !== 'object' || typeof xrManager.setSession !== 'function') {
      return
    }
    
    const requestSession = async (mode) => {
      try {
        // End existing session if any
        if (sessionRef.current) {
          await sessionRef.current.end()
          sessionRef.current = null
        }
        
        // Request new session
        const session = await navigator.xr.requestSession(mode, {
          requiredFeatures: mode === 'immersive-ar' ? ['local-floor'] : [],
          optionalFeatures: ['bounded-floor', 'hand-tracking']
        })
        
        sessionRef.current = session
        
        // Set up session end handler
        session.addEventListener('end', () => {
          sessionRef.current = null
        })
        
        // Set the session on the WebGL renderer's XR manager
        await xrManager.setSession(session)
      } catch (error) {
        console.warn(`${mode} session request failed:`, error)
      }
    }
    
    // Enable VR mode
    if (isVR) {
      xrManager.enabled = true
      requestSession('immersive-vr')
    }
    // Enable AR mode
    else if (isAR) {
      xrManager.enabled = true
      requestSession('immersive-ar')
    }
    // Disable XR
    else {
      if (sessionRef.current) {
        sessionRef.current.end().catch(console.error)
        sessionRef.current = null
      }
      if (xrManager) {
        xrManager.enabled = false
      }
    }
    
    return () => {
      if (sessionRef.current) {
        sessionRef.current.end().catch(console.error)
        sessionRef.current = null
      }
    }
  }, [gl, isVR, isAR])
  
  return null
}

// Component to handle camera position updates based on screen size
// Only sets initial position on mount, doesn't interfere with artwork selection animations
function CameraController({ isDesktop }) {
  const { camera } = useThree()
  const hasSetInitialPosition = useRef(false)
  
  useEffect(() => {
    // Only set initial camera position once on mount
    // The Frames component handles all camera animations including deselection
    if (!hasSetInitialPosition.current) {
      const targetZ = isDesktop ? 8 : 15
      camera.position.set(0, 2, targetZ)
      hasSetInitialPosition.current = true
    }
  }, [camera, isDesktop])
  
  return null
}

const App = ({ images, vrMode, arMode, isDesktop }) => {
  const controlsRef = useRef()
  // Closer camera position for desktop (more zoom), original position for mobile
  const initialCameraPosition = isDesktop ? [0, 2, 8] : [0, 2, 15]

  return (
    <Canvas 
      dpr={[1, 1.5]} 
      camera={{ fov: 70, position: initialCameraPosition }}
      gl={{ 
        antialias: true,
        alpha: arMode, // Transparent background for AR
        powerPreference: 'high-performance'
      }}
      frameloop="always"
    >
      <CameraController isDesktop={isDesktop} />
      <XRControls isVR={vrMode} isAR={arMode} />
        <color attach="background" args={arMode ? ['transparent'] : ['#191920']} />
        {!arMode && <fog attach="fog" args={['#191920', 0, 15]} />}
        <group position={[0, -0.5, 0]}>
          <Frames images={images} vrMode={vrMode} arMode={arMode} controlsRef={controlsRef} isDesktop={isDesktop} />
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={2048}
              mixBlur={1}
              mixStrength={80}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#050505"
              metalness={0.5}
            />
          </mesh>
        </group>
        <Environment preset="city" />
        {/* Add orbit controls for desktop navigation when not in VR/AR */}
        {!vrMode && !arMode && (
          <OrbitControls 
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={isDesktop ? 2 : 3}
            maxDistance={20}
            dampingFactor={0.05}
            enableDamping={true}
          />
        )}
      </Canvas>
  )
}

function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3(), vrMode, arMode, controlsRef, isDesktop }) {
  const ref = useRef()
  const clicked = useRef()
  const [selectedId, setSelectedId] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const previousSelectedId = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    clicked.current = ref.current.getObjectByName(selectedId)
    
    if (clicked.current) {
      // Temporarily disable OrbitControls when animating to a frame
      if (controlsRef?.current && !vrMode && !arMode) {
        controlsRef.current.enabled = false
        setIsAnimating(true)
      }
      
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
      previousSelectedId.current = selectedId
    } else {
      // When deselecting, animate back to initial position
      if (previousSelectedId.current !== null && !vrMode && !arMode) {
        setIsAnimating(true)
        if (controlsRef?.current) {
          controlsRef.current.enabled = false
        }
      }
      // Set initial position based on desktop/mobile
      const initialZ = isDesktop ? 8 : 15
      p.set(0, 2, initialZ)
      q.identity()
      previousSelectedId.current = null
    }
  }, [selectedId, controlsRef, vrMode, arMode, isDesktop])

  useFrame((state, dt) => {
    // Don't animate in VR/AR - head tracking handles it
    if (vrMode || arMode) {
      return
    }
    
    // Animate camera when selecting or deselecting artwork
    if (isAnimating) {
      easing.damp3(state.camera.position, p, 0.4, dt)
      easing.dampQ(state.camera.quaternion, q, 0.4, dt)
      
      // Check if animation is complete
      const distance = state.camera.position.distanceTo(p)
      if (distance < 0.1) {
        setIsAnimating(false)
        // Re-enable controls after animation completes
        if (controlsRef?.current) {
          controlsRef.current.enabled = true
        }
      }
    }
  })

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        const newId = clicked.current === e.object ? null : e.object.name
        setSelectedId(newId)
      }}
      onPointerMissed={() => {
        setSelectedId(null)
        // Re-enable controls when clicking away
        if (controlsRef?.current && !vrMode && !arMode) {
          controlsRef.current.enabled = true
          setIsAnimating(false)
        }
      }}>
      {images.map((props) => <Frame key={props.url} {...props} selectedId={selectedId} /> /* prettier-ignore */)}
    </group>
  )
}

function Frame({ url, c = new THREE.Color(), selectedId, ...props }) {
  const image = useRef()
  const frame = useRef()
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const name = getUuid(url)
  const isActive = selectedId === name

  useCursor(hovered)

  useFrame((state, dt) => {
    if (!image.current || !frame.current) return
    if (image.current.material) {
      image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
    }
    if (image.current.scale) {
      easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt)
    }
    if (frame.current.material && frame.current.material.color) {
      easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt)
    }
  })

  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
      <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
        {name.split('-').join(' ')}
      </Text>
    </group>
  )
}

export default function VR3DPage() {
  const [vrMode, setVRMode] = useState(false)
  const [arMode, setARMode] = useState(false)
  const [xrSupported, setXRSupported] = useState({ vr: false, ar: false })
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Check if desktop (screen width > 768px)
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    // Check WebXR support
    const checkXRSupport = async () => {
      if (typeof navigator === 'undefined' || !navigator.xr) {
        return
      }

      // Check for WebXR API
      try {
        const vrSupported = await navigator.xr.isSessionSupported('immersive-vr')
        setXRSupported(prev => ({ ...prev, vr: vrSupported }))
      } catch (error) {
        // Silently fail - VR not available
      }
      
      try {
        const arSupported = await navigator.xr.isSessionSupported('immersive-ar')
        setXRSupported(prev => ({ ...prev, ar: arSupported }))
      } catch (error) {
        // Silently fail - AR not available
      }
    }
    
    // Small delay to ensure navigator is ready
    const timeout = setTimeout(() => {
      checkXRSupport()
    }, 100)
    
    return () => clearTimeout(timeout)
  }, [])

  const handleVRClick = async () => {
    if (vrMode) {
      setVRMode(false)
    } else {
      setARMode(false) // Disable AR if enabled
      setVRMode(true)
    }
  }

  const handleARClick = async () => {
    if (arMode) {
      setARMode(false)
    } else {
      setVRMode(false) // Disable VR if enabled
      setARMode(true)
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', position: 'relative' }}>
      {/* <Navbar /> */}
      
      {/* VR/AR Control Buttons */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        flexDirection: 'column'
      }}>
        {xrSupported.vr && (
          <button
            onClick={handleVRClick}
            style={{
              padding: '12px 24px',
              backgroundColor: vrMode ? '#ff6b35' : 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!vrMode) e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.8)'
            }}
            onMouseLeave={(e) => {
              if (!vrMode) e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
            }}
          >
            <span>🥽</span>
            {vrMode ? 'Exit VR' : 'Enter VR'}
          </button>
        )}
        
        {xrSupported.ar && (
          <button
            onClick={handleARClick}
            style={{
              padding: '12px 24px',
              backgroundColor: arMode ? '#00d4ff' : 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!arMode) e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.8)'
            }}
            onMouseLeave={(e) => {
              if (!arMode) e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
            }}
          >
            <span>📱</span>
            {arMode ? 'Exit AR' : 'Enter AR'}
          </button>
        )}

      </div>

      <App images={images} vrMode={vrMode} arMode={arMode} isDesktop={isDesktop} />
    </div>
  )
}

