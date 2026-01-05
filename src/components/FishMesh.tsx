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

// Standard Shader for Transparent Textures (Alpha Test)
const TransparentShader = {
    uniforms: {
        texture1: { value: null },
        uColor: { value: new Vector3(1, 1, 1) },
        uRepeat: { value: [1, 1] },
        uOffset: { value: [0, 0] }
    },
    vertexShader: `
    varying vec2 vUv;
    uniform vec2 uRepeat;
    uniform vec2 uOffset;
    void main() {
      vUv = uv * uRepeat + uOffset;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform sampler2D texture1;
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      vec4 texColor = texture2D(texture1, vUv);
      
      // Standard Alpha Test
      if (texColor.a < 0.1) discard;
      
      gl_FragColor = texColor; 
    }
  `
};

export const FishMesh = ({ fish }: FishMeshProps) => {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<any>(null); // Ref for ShaderMaterial
    const { playSE } = useSound();
    const openFishInfo = useUIStore((state) => state.openFishInfo);

    const [isSpinning, setIsSpinning] = useState(false);
    const [signal, setSignal] = useState<string | null>(null);

    const texture = useTexture(fish.genes.textureInfo || '/textures/goldfish.png');
    texture.minFilter = 1003; // NearestFilter
    texture.magFilter = 1003; // NearestFilter
    texture.needsUpdate = true;
    texture.center.set(0.5, 0.5);
    texture.repeat.set(1, 1);

    // Parse gene color (hex to normalized rgb)
    const geneColor = useMemo(() => {
        return new Vector3(1, 1, 1);
    }, [fish.genes.color]);

    const spriteConfig = fish.genes.spriteConfig;

    // Create shader material
    const shaderArgs = useMemo(() => ({
        uniforms: {
            texture1: { value: texture },
            uColor: { value: geneColor },
            uRepeat: { value: spriteConfig ? [1 / spriteConfig.cols, 1 / spriteConfig.rows] : [1, 1] },
            uOffset: { value: [0, 0] }
        },
        vertexShader: TransparentShader.vertexShader,
        fragmentShader: TransparentShader.fragmentShader,
        transparent: true,
        side: DoubleSide
    }), [texture, geneColor, spriteConfig]);

    // Deterministic random position based on ID
    const seed = parseFloat(fish.id.replace(/[^0-9]/g, '').slice(-4) || '0') / 10000;
    const initialX = (seed * 4) - 2 || (Math.random() - 0.5) * 4;
    const initialY = ((seed * 100) % 4) - 2 || (Math.random() - 0.5) * 4;

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const time = state.clock.getElapsedTime();
        const offset = seed * 10; // Unique offset

        // Organic floating movement
        meshRef.current.position.y = initialY + Math.sin(time + offset) * 0.3;
        meshRef.current.position.x = initialX + Math.sin(time * 0.3 + offset) * 0.6;

        // Handle Sprite Animation
        if (spriteConfig && materialRef.current) {
            const speed = 8; // Animation FPS
            const totalFrames = spriteConfig.frames;
            const frame = Math.floor(time * speed) % totalFrames;

            // Vertical strip animation (Top to Bottom)
            const row = frame % spriteConfig.rows;
            const offsetY = (spriteConfig.rows - 1 - row) / spriteConfig.rows;

            materialRef.current.uniforms.uOffset.value = [0, offsetY];
        }

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
                <planeGeometry args={[1.2, 0.6]} />
                <shaderMaterial ref={materialRef} args={[shaderArgs]} />
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
