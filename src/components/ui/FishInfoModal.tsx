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
                <h2 style={{ marginTop: 0 }}>おさかなの詳細</h2>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '4px' }}>名前</label>
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

                <div style={{ marginBottom: '16px', background: '#222', padding: '8px', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#ffd700' }}>
                        価値: {useGameStore.getState().marketTrend ?
                            Math.floor((100 + fish.status.growth * 2 + (fish.genes.scaleType === 'metallic' ? 500 : fish.genes.scaleType === 'luminescent' ? 1000 : 0)) * useGameStore.getState().marketTrend)
                            : '...'}
                        コイン (相場: x{useGameStore.getState().marketTrend?.toFixed(2)})
                    </p>
                </div>

                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '1rem' }}>お気に入り (ロック)</label>
                    <input
                        type="checkbox"
                        checked={fish.isFavorite}
                        onChange={() => toggleFavorite(fish.id)}
                        style={{ width: '20px', height: '20px' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button onClick={() => {
                        // Demo: Find another fish to breed with
                        const adults = fishes.filter(f => f.id !== fish.id); // Simple check for now
                        if (adults.length > 0) {
                            const partner = adults[Math.floor(Math.random() * adults.length)];
                            useGameStore.getState().breedFish(fish.id, partner.id);
                            closeFishInfo();
                        } else {
                            alert("パートナーがいません！");
                        }
                    }} style={{
                        background: '#e91e63',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>
                        ふやす ❤️
                    </button>

                    <button onClick={() => {
                        useGameStore.getState().sellFish(fish.id);
                        closeFishInfo();
                    }} style={{
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>
                        うる 💰
                    </button>

                    <button onClick={closeFishInfo} style={{
                        background: '#646cff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>
                        とじる
                    </button>
                </div>
            </div>
        </div>
    );
};
