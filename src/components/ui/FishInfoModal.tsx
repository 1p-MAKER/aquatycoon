import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../store/uiStore';
import { useGameStore } from '../../store/gameStore';
import { EconomySystem } from '../../systems/EconomySystem';
import { useSound } from '../../hooks/useSound';

export const FishInfoModal = () => {
    const { t } = useTranslation();
    const { selectedFishId, isModalOpen, closeFishInfo } = useUIStore();
    const fishes = useGameStore((state) => state.fishes);
    const toggleFavorite = useGameStore((state) => state.toggleFavorite);
    const sellFish = useGameStore((state) => state.sellFish);
    const marketTrend = useGameStore((state) => state.marketTrend);
    const { playSE } = useSound();

    if (!isModalOpen || !selectedFishId) return null;

    const fish = fishes.find(f => f.id === selectedFishId);
    if (!fish) return null;

    const value = EconomySystem.calculateFishValue(fish, marketTrend);

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px', // Above control panel
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '600px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 90,
            gap: '12px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, overflow: 'hidden' }}>
                <span style={{ fontSize: '1.2rem' }}>🐟</span>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {fish.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>
                        {t('species')}: {fish.species} | {t('value')}: {value} G
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => toggleFavorite(fish.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '4px'
                }}>
                    {fish.isFavorite ? '🔒' : '🔓'}
                </button>
                <button onClick={() => {
                    sellFish(fish.id);
                    playSE('click');
                    closeFishInfo();
                }} style={{
                    background: '#ff4444', color: 'white', border: 'none',
                    borderRadius: '12px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer'
                }}>
                    売る ({value}G)
                </button>
                <button onClick={closeFishInfo} style={{
                    background: '#ccc', color: '#333', border: 'none',
                    borderRadius: '12px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer'
                }}>
                    ✕
                </button>
            </div>
        </div>
    );
};
