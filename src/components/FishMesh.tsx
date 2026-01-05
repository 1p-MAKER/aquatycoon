import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, DoubleSide } from 'three';
import { Html, useTexture } from '@react-three/drei';
import type { Fish } from '../types/schema';
import { useUIStore } from '../store/uiStore';
import { useSound } from '../hooks/useSound';

interface FishMeshProps {
    fish: Fish;
}

export const FishMesh = ({ fish }: FishMeshProps) => {
    const meshRef = useRef<Mesh>(null);
    const { playSE } = useSound();
    const openFishInfo = useUIStore((state) => state.openFishInfo);

    const [isSpinning, setIsSpinning] = useState(false);
    const [signal, setSignal] = useState<string | null>(null);

    // Phase 1: Stable Texture Loading
    // Using simple texture mapping instead of complex shaders
    const texture = useTexture(fish.genes.textureInfo || '/textures/goldfish.png');

    // Random initial position
    // Use a deterministic seed logic based on ID if possible, but random is okay for now
    const initialY = (Math.random() - 0.5) * 2;
    const initialX = (Math.random() - 0.5) * 4;

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Idle floating movement
        const time = state.clock.getElapsedTime();
        // Use fish ID to offset sine wave so they don't move in sync
        const offset = parseFloat(fish.id.replace(/[^0-9]/g, '').slice(-3) || '0');

        meshRef.current.position.y = initialY + Math.sin(time + offset) * 0.2;
        meshRef.current.position.x = initialX + Math.sin(time * 0.5 + offset) * 0.5;

        // Spin animation
        if (isSpinning) {
            meshRef.current.rotation.y += delta * 15;
            if (meshRef.current.rotation.y > Math.PI * 4) {
                setIsSpinning(false);
                meshRef.current.rotation.y = 0;
            }
        } else {
            // Face direction of movement (Flip sprite)
            // Math.sin(time * 0.5) is the velocity derivation of the x position
            const isMovingRight = Math.cos(time * 0.5 + offset) > 0;
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
            <mesh ref={meshRef} onClick={handleClick} position={[initialX, initialY, 0]}>
                {/* Phase 1: PlaneGeometry for 2D Sprite */}
                <planeGeometry args={[1.5, 1.5]} />
                <meshBasicMaterial
                    map={texture}
                    transparent={true}
                    side={DoubleSide}
                />
            </mesh>

            {/* Signal Overlay */}
            {signal && (
                <Html position={[initialX, initialY + 1, 0]} center>
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
