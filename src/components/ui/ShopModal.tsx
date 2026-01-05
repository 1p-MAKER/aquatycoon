import { useUIStore } from '../../store/uiStore';
import { useGameStore, FISH_TYPES } from '../../store/gameStore';
import { useSound } from '../../hooks/useSound';

export const ShopModal = () => {
    const isShopOpen = useUIStore((state) => state.isShopOpen);
    const toggleShop = useUIStore((state) => state.toggleShop);
    const coins = useGameStore((state) => state.user.coins);
    const buyFish = useGameStore((state) => state.addFish);
    const spendCoins = useGameStore((state) => state.spendCoins);
    const { playSE } = useSound();

    if (!isShopOpen) return null;

    const handleBuy = (speciesKey: string) => {
        const cost = FISH_TYPES[speciesKey].cost;
        if (spendCoins(cost)) {
            buyFish(speciesKey);
            playSE('bubble');
        } else {
            alert('コインが足りません！');
        }
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99
        }}>
            <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '400px',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                color: '#333'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🛒 おさかなショップ</h2>
                <p style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>所持コイン: {coins}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {Object.entries(FISH_TYPES).map(([key, data]) => (
                        <div key={key} style={{
                            border: '2px solid #ddd',
                            borderRadius: '12px',
                            padding: '10px',
                            textAlign: 'center',
                            background: '#f9f9f9'
                        }}>
                            <div style={{ fontSize: '3rem' }}>
                                {key === 'Goldfish' ? '🐠' : '🐟'}
                            </div>
                            <h3 style={{ margin: '5px 0', fontSize: '1rem' }}>{data.name}</h3>
                            <button
                                onClick={() => handleBuy(key)}
                                disabled={coins < data.cost}
                                style={{
                                    marginTop: '8px',
                                    padding: '8px 16px',
                                    background: coins >= data.cost ? '#4caf50' : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    width: '100%',
                                    cursor: coins >= data.cost ? 'pointer' : 'not-allowed'
                                }}
                            >
                                {data.cost} G
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button onClick={toggleShop} style={{
                        padding: '10px 20px',
                        background: '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer'
                    }}>
                        とじる
                    </button>
                </div>
            </div>
        </div>
    );
};
