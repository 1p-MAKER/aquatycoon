import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, DoubleSide } from 'three';
import { Html, useTexture } from '@react-three/drei';
import type { Fish } from '../types/schema';
import { useUIStore } from '../store/uiStore';
import { useSound } from '../hooks/useSound';

interface FishMeshProps {
    fish: Fish;
}

// Shader to remove black background
const ChromaKeyShader = {
    uniforms: {
        texture1: { value: null },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform sampler2D texture1;
    varying vec2 vUv;
    void main() {
      vec4 texColor = texture2D(texture1, vUv);
      float brightness = length(texColor.rgb);
      // If pixel is black (low brightness), discard it
      if (brightness < 0.2) discard;
      gl_FragColor = texColor; 
    }
  `
};

export const FishMesh = ({ fish }: FishMeshProps) => {
    const meshRef = useRef<Mesh>(null);
    const { playSE } = useSound();
    const openFishInfo = useUIStore((state) => state.openFishInfo);

    const [isSpinning, setIsSpinning] = useState(false);
    const [signal, setSignal] = useState<string | null>(null);

    const texture = useTexture(fish.genes.textureInfo || '/textures/goldfish.png');

    // Create shader material
    const shaderArgs = useMemo(() => ({
        uniforms: {
            texture1: { value: texture },
        },
        vertexShader: ChromaKeyShader.vertexShader,
        fragmentShader: ChromaKeyShader.fragmentShader,
        transparent: true,
        side: DoubleSide
    }), [texture]);

    // Deterministic random position based on ID
    // Extract numbers from ID to use as seed, fallback to random
    const seed = parseFloat(fish.id.replace(/[^0-9]/g, '').slice(-4) || '0') / 10000;
    // Initial positions: X between -2 and 2, Y between -2 and 2
    const initialX = (seed * 4) - 2 || (Math.random() - 0.5) * 4;
    const initialY = ((seed * 100) % 4) - 2 || (Math.random() - 0.5) * 4;

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const time = state.clock.getElapsedTime();
        const offset = seed * 10; // Unique offset

        // Organic floating movement
        meshRef.current.position.y = initialY + Math.sin(time + offset) * 0.3;
        meshRef.current.position.x = initialX + Math.sin(time * 0.3 + offset) * 0.6;

        // Spin animation or Direction flip
        if (isSpinning) {
            meshRef.current.rotation.y += delta * 15;
            if (meshRef.current.rotation.y > Math.PI * 4) {
                setIsSpinning(false);
                meshRef.current.rotation.y = 0;
            }
        } else {
            // Flip based on direction
            const isMovingRight = Math.cos(time * 0.3 + offset) > 0;
            meshRef.current.rotation.y = isMovingRight ? Math.PI : 0;
        }
    });

    const handleClick = (e: any) => {
        e.stopPropagation();
        playSE('bubble');
        setIsSpinning(true);
        setSignal('Happy!');
        setTimeout(() => setSignal(null), 1500);
        openFishInfo(fish.id);
    };

    return (
        <group>
            {/* Z=2 to stick to front */}
            <mesh ref={meshRef} onClick={handleClick} position={[initialX, initialY, 2]}>
                {/* Scaled down plane for clean look */}
                <planeGeometry args={[1.2, 1.2]} />
                <shaderMaterial args={[shaderArgs]} />
            </mesh>

            {/* Signal Overlay */}
            {signal && (
                <Html position={[initialX, initialY + 0.8, 2]} center>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#333',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        {signal}
                    </div>
                </Html>
            )}
        </group>
    );
};
