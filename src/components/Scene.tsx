import { Canvas } from '@react-three/fiber';
import { Aquarium } from './Aquarium';
import { Suspense } from 'react';

export const Scene = () => {
    return (
        <Canvas
            camera={{ position: [0, 2, 5], fov: 75 }}
            style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
                <Aquarium />
            </Suspense>
            <gridHelper args={[20, 20, 0xff0000, 0x222222]} />
            <axesHelper args={[5]} />
        </Canvas>
    );
};
