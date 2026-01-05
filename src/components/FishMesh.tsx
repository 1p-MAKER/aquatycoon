import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, DoubleSide } from 'three';
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

    // Load Texture
    const texture = useTexture('/textures/goldfish.png');

    // Random initial position
    const positionRef = useRef(new Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
        0
    ));

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Idle floating movement
        const time = state.clock.getElapsedTime();
        meshRef.current.position.y = positionRef.current.y + Math.sin(time + parseFloat(fish.id)) * 0.2;
        meshRef.current.position.x = positionRef.current.x + Math.sin(time * 0.5 + parseFloat(fish.id)) * 0.5;

        // Spin animation
        if (isSpinning) {
            meshRef.current.rotation.y += delta * 10;
            if (meshRef.current.rotation.y > Math.PI * 4) {
                setIsSpinning(false);
                meshRef.current.rotation.y = 0;
            }
        } else {
            // Face direction of movement (Flip sprite)
            // For a plane, we rotate 180 degrees to flip. 
            // 0 is facing right (usually), PI is facing left.
            const isMovingRight = Math.cos(time * 0.5 + parseFloat(fish.id)) > 0;
            // Adjust rotation based on texture orientation. Assuming texture faces Left by default? 
            // Usually fish textures face Left. If so, 0 is Left.
            // Let's assume Left.
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
        <group position={positionRef.current}>
            <mesh ref={meshRef} onClick={handleClick}>
                {/* 2D Plane for Realistic Sprite */}
                <planeGeometry args={[1.5, 1.5]} />
                <meshBasicMaterial map={texture} transparent={true} side={DoubleSide} />
            </mesh>

            {/* Signal Overlay */}
            {signal && (
                <Html position={[0, 1, 0]} center>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#333',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap'
                    }}>
                        {signal}
                    </div>
                </Html>
            )}
        </group>
    );
};
