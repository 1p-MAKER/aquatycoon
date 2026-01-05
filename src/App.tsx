import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Scene } from './components/Scene';
import { useGameStore } from './store/gameStore';
import { FishInfoModal } from './components/ui/FishInfoModal';
import { SettingsModal } from './components/ui/SettingsModal';
import { useUIStore } from './store/uiStore';
import { soundManager } from './managers/SoundManager';
import './App.css';

function App() {
  const { t } = useTranslation();
  const coins = useGameStore((state) => state.user.coins);
  const fishes = useGameStore((state) => state.fishes);
  const addFish = useGameStore((state) => state.addFish);
  const lightMode = useGameStore((state) => state.environment.lightMode);
  const toggleLightMode = useGameStore((state) => state.toggleLightMode);
  const marketTrend = useGameStore((state) => state.marketTrend);

  const isViewMode = useUIStore((state) => state.isViewMode);
  const toggleViewMode = useUIStore((state) => state.toggleViewMode);
  const toggleSettings = useUIStore((state) => state.toggleSettings);

  // Update market on load
  const updateMarket = useGameStore((state) => state.updateMarket);

  useEffect(() => {
    // Market Logic
    if (useGameStore.getState().marketTrend === 1.0) {
      updateMarket();
    }
    // Auto-Spawn Fish if empty
    if (fishes.length === 0) {
      // console.log("No fish found. Spawning initial fish.");
      addFish('Goldfish');
    }
  }, [fishes, addFish, updateMarket]); // Correct dependencies

  // Handle BGM
  useEffect(() => {
    soundManager.playBGM(lightMode);
  }, [lightMode]);

  return (
    <div className="app-container">
      <Scene />
      <FishInfoModal />
      <SettingsModal />

      {!isViewMode && (
        <div className="ui-overlay">
          <h1>{t('welcome')}</h1>
          <p style={{ marginTop: 10 }}>Coins: {coins}</p>
          <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Market: x{marketTrend.toFixed(2)}</p>
          {fishes.length === 0 && <p style={{ color: 'orange' }}>Searching for fish...</p>}
        </div>
      )}

      {/* Visual Control Panel */}
      <div className="control-panel">
        {/* Buy Fish Button - INLINE STYLES ENSURED */}
        {!isViewMode && (
          <button
            onClick={() => {
              const cost = 50;
              if (useGameStore.getState().spendCoins(cost)) {
                useGameStore.getState().addFish('Goldfish');
                soundManager.playSE('bubble');
              } else {
                alert(t('not_enough_coins') || "Not enough coins!");
              }
            }}
            style={{
              fontSize: '1.2rem',
              padding: '8px 12px',
              marginRight: '10px',
              background: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              cursor: 'pointer'
            }}
          >
            🛒 Buy (-50)
          </button>
        )}

        {/* Settings Button */}
        {!isViewMode && (
          <button onClick={toggleSettings} className="game-btn">
            ⚙️
          </button>
        )}

        <button onClick={toggleLightMode} style={{ fontSize: '1.5rem', padding: '8px 12px' }}>
          {lightMode === 'day' ? '🌙' : '☀️'}
        </button>
        <button onClick={toggleViewMode} style={{ fontSize: '1.5rem', padding: '8px 12px' }}>
          {isViewMode ? '👁️' : '🚫'}
        </button>
      </div>
    </div>
  );
}

export default App;
