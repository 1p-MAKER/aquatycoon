import { useProgress } from '@react-three/drei';
import { useTranslation } from 'react-i18next';

export const LoadingScreen = () => {
    const { active, progress } = useProgress();
    const { t } = useTranslation();

    // If not active (loading done), opacity 0. else 1.
    const opacity = active ? 1 : 0;

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#242424',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            transition: 'opacity 0.5s ease-out',
            pointerEvents: 'none',
            opacity: opacity, // Controllable opacity
        }}>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>{t('loading')}</h2>
            <div style={{ width: '200px', height: '4px', background: '#333', borderRadius: '2px' }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: '#646cff',
                    borderRadius: '2px',
                    transition: 'width 0.2s'
                }} />
            </div>
            <p style={{ color: '#888', marginTop: '0.5rem' }}>{progress.toFixed(0)}%</p>
        </div>
    );
};
