import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { Html } from '@react-three/drei';
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
            // Face direction of movement (simplified)
            meshRef.current.rotation.y = Math.sin(time * 0.5) > 0 ? 0 : Math.PI;
        }
    });

    const handleClick = (e: any) => {
        e.stopPropagation(); // Prevent clicking through to background
        playSE('bubble');
        setIsSpinning(true);
        setSignal('Happy!');

        // Clear signal after 1.5s
        setTimeout(() => setSignal(null), 1500);

        // Open Info Modal
        openFishInfo(fish.id);
    };

    return (
        <group position={positionRef.current}>
            <mesh ref={meshRef} onClick={handleClick}>
                <boxGeometry args={[1, 0.6, 0.2]} />
                <meshStandardMaterial color={fish.genes.color} />
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
