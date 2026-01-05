import { useGameStore } from '../store/gameStore';
import { FishMesh } from './FishMesh';

export const Aquarium = () => {
    const fishes = useGameStore((state) => state.fishes);

    return (
        <group>


            {/* Render Fishes */}
            {fishes.map((fish) => (
                <FishMesh key={fish.id} fish={fish} />
            ))}
        </group>
    );
};
