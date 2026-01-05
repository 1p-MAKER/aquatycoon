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
        <div className="ui-overlay" style={{ paddingTop: 'env(safe-area-inset-top, 60px)' }}>
          <h1 style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            marginBottom: '10px',
            fontSize: '1.5rem'
          }}>
            {t('welcome')}
          </h1>

          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '10px 20px',
            borderRadius: '20px',
            backdropFilter: 'blur(5px)',
            display: 'inline-block',
            textAlign: 'left'
          }}>
            <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
              💰 コイン: {coins}
            </p>
            <p style={{ margin: '4px 0', fontSize: '0.9rem', opacity: 0.9 }}>
              📈 市場価値: x{marketTrend.toFixed(2)}
            </p>
            {fishes.length === 0 && (
              <p style={{ color: '#ffbd33', marginTop: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                ⚠️ 魚がいません！<br />(コインがない場合は自動補給されます)
              </p>
            )}
          </div>
        </div>
      )}

      {/* Visual Control Panel */}
      <div className="control-panel" style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}>
        {/* Buy Fish Button */}
        {!isViewMode && (
          <button
            onClick={() => {
              const cost = 50;
              if (useGameStore.getState().spendCoins(cost)) {
                useGameStore.getState().addFish('Goldfish');
                soundManager.playSE('bubble');
              } else {
                alert(t('not_enough_coins') || "コインが足りません！");
              }
            }}
            style={{
              fontSize: '1.1rem',
              padding: '10px 20px',
              marginRight: '12px',
              background: 'linear-gradient(135deg, #ff9800, #f57c00)',
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(245, 124, 0, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🛒</span> 買う (-50)
          </button>
        )}

        {/* Settings Button */}
        {!isViewMode && (
          <button onClick={toggleSettings} className="game-btn" style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            ⚙️
          </button>
        )}

        <button onClick={toggleLightMode} style={{
          fontSize: '1.2rem',
          padding: '0',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          border: '1px solid rgba(255,255,255,0.3)',
          marginLeft: '8px'
        }}>
          {lightMode === 'day' ? '🌙' : '☀️'}
        </button>

        {/* Emergency Spawn Button (Hidden feature for stability) */}
        <button
          onClick={() => {
            useGameStore.getState().addFish('Goldfish');
            soundManager.playSE('bubble');
          }}
          style={{
            fontSize: '1.2rem',
            padding: '0',
            background: 'rgba(0, 255, 100, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            border: '1px solid rgba(255,255,255,0.3)',
            marginLeft: '8px'
          }}
          title="Force Spawn Fish"
        >
          🐟
        </button>
      </div>
    </div>
  );
}

export default App;
