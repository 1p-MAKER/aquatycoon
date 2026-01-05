import { useUIStore } from '../../store/uiStore';
import { useGameStore } from '../../store/gameStore';

export const FishInfoModal = () => {
    const { selectedFishId, isModalOpen, closeFishInfo } = useUIStore();
    const fishes = useGameStore((state) => state.fishes);
    const setFishName = useGameStore((state) => state.setFishName);
    const toggleFavorite = useGameStore((state) => state.toggleFavorite);

    if (!isModalOpen || !selectedFishId) return null;

    const fish = fishes.find(f => f.id === selectedFishId);
    if (!fish) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }} onClick={closeFishInfo}>
            <div style={{
                background: '#333',
                padding: '24px',
                borderRadius: '16px',
                minWidth: '300px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                color: 'white'
            }} onClick={e => e.stopPropagation()}>
                <h2 style={{ marginTop: 0 }}>Fish Details</h2>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '4px' }}>Name</label>
                    <input
                        type="text"
                        value={fish.name}
                        onChange={(e) => setFishName(fish.id, e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: '#444',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            color: 'white',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '1rem' }}>Favorite (Lock)</label>
                    <input
                        type="checkbox"
                        checked={fish.isFavorite}
                        onChange={() => toggleFavorite(fish.id)}
                        style={{ width: '20px', height: '20px' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={closeFishInfo} style={{
                        background: '#646cff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
