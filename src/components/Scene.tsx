import { Canvas } from '@react-three/fiber';
import { Aquarium } from './Aquarium';
import { Suspense } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { useGameStore } from '../store/gameStore';

export const Scene = () => {
    const lightMode = useGameStore((state) => state.environment.lightMode);
    const bgColor = lightMode === 'day' ? '#87CEEB' : '#111122';

    return (
        <>
            <Canvas
                camera={{ position: [0, 2, 5], fov: 75 }}
                style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0, background: bgColor, transition: 'background 1s ease' }}
            >
                <ambientLight intensity={lightMode === 'day' ? 0.7 : 0.2} />
                <directionalLight position={[10, 10, 5]} intensity={lightMode === 'day' ? 1 : 0.2} />
                {lightMode === 'night' && (
                    <>
                        <pointLight position={[-5, 2, 0]} color="#00ff00" intensity={2} distance={10} />
                        <pointLight position={[5, 2, 0]} color="#ff00ff" intensity={2} distance={10} />
                    </>
                )}
                <Suspense fallback={null}>
                    <Aquarium />
                </Suspense>
                <gridHelper args={[20, 20, 0xff0000, 0x222222]} visible={false} />
                <axesHelper args={[5]} visible={false} />
            </Canvas>
            <LoadingScreen />
        </>
    );
};
