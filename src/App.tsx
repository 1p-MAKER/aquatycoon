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
  const lightMode = useGameStore((state) => state.environment.lightMode);
  const toggleLightMode = useGameStore((state) => state.toggleLightMode);
  const marketTrend = useGameStore((state) => state.marketTrend);

  const isViewMode = useUIStore((state) => state.isViewMode);
  const toggleViewMode = useUIStore((state) => state.toggleViewMode);
  const toggleSettings = useUIStore((state) => state.toggleSettings);

  // Update market on load
  const updateMarket = useGameStore((state) => state.updateMarket);
  if (useGameStore.getState().marketTrend === 1.0) {
    updateMarket();
  }

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
        </div>
      )}

      {/* Visual Control Panel (Always visible or toggleable via specific gesture, here we keep it simple) */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 20
      }}>
        {/* Settings Button */}
        {!isViewMode && (
          <button onClick={toggleSettings} style={{ fontSize: '1.5rem', padding: '8px 12px' }}>
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
