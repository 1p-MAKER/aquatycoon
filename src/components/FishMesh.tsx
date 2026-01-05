import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, DoubleSide } from 'three';
import { Html, useTexture } from '@react-three/drei';
import type { Fish } from '../types/schema';
import { useUIStore } from '../store/uiStore';
import { useSound } from '../hooks/useSound';

interface FishMeshProps {
    fish: Fish;
}

// Shader to remove black background and apply tint
const ChromaKeyShader = {
    uniforms: {
        texture1: { value: null },
        uColor: { value: new Vector3(1, 1, 1) }, // Default white (no tint)
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
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      vec4 texColor = texture2D(texture1, vUv);
      float brightness = length(texColor.rgb);
      // If pixel is black (low brightness), discard it
      if (brightness < 0.2) discard;
      
      // Apply tint (multiply texture color by gene color)
      // Mix original with tinted based on how strong we want the effect. 
      // For now, simple multiplication.
      gl_FragColor = vec4(texColor.rgb * uColor, texColor.a); 
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

    // Parse gene color (hex to normalized rgb)
    const geneColor = useMemo(() => {
        const hex = fish.genes.color || '#ffffff';
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return new Vector3(r, g, b);
    }, [fish.genes.color]);

    // Create shader material
    const shaderArgs = useMemo(() => ({
        uniforms: {
            texture1: { value: texture },
            uColor: { value: geneColor }
        },
        vertexShader: ChromaKeyShader.vertexShader,
        fragmentShader: ChromaKeyShader.fragmentShader,
        transparent: true,
        side: DoubleSide
    }), [texture, geneColor]);

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
        // Wider boundaries for Landscape mode (X: -6 to 6, Y: -3 to 3)
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
                {/* Scaled down plane for clean look - SMALLER SIZE as requested */}
                <planeGeometry args={[0.8, 0.8]} />
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
