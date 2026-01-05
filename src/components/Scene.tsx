import { Canvas } from '@react-three/fiber';
import { Aquarium } from './Aquarium';
import { Suspense } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { useGameStore } from '../store/gameStore';

export const Scene = () => {
    const lightMode = useGameStore((state) => state.environment.lightMode);

    return (
        <>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: lightMode === 'day' ? '#4fc3f7' : '#0d47a1',
                    zIndex: 0
                }}
            >


                <ambientLight intensity={lightMode === 'day' ? 0.8 : 0.2} />
                <directionalLight position={[10, 10, 5]} intensity={lightMode === 'day' ? 1 : 0.5} />

                {lightMode === 'night' && (
                    <pointLight position={[0, 0, 2]} intensity={1.5} color="#ffd700" distance={10} />
                )}

                <Suspense fallback={null}>
                    <Aquarium />
                </Suspense>
            </Canvas>
            <LoadingScreen />
        </>
    );
};
