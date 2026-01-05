import { useGameStore } from '../store/gameStore';
import { FishMesh } from './FishMesh';

export const Aquarium = () => {
    const fishes = useGameStore((state) => state.fishes);

    return (
        <group>
            {/* Water Volume (Visual only) */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[12, 8, 8]} />
                <meshStandardMaterial
                    color="#44aa88"
                    transparent
                    opacity={0.1}
                    roughness={0.1}
                    metalness={0.1}
                />
            </mesh>

            {/* Render Fishes */}
            {fishes.map((fish) => (
                <FishMesh key={fish.id} fish={fish} />
            ))}
        </group>
    );
};
