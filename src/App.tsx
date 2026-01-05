import { useEffect, useState } from 'react';
import { Scene } from './components/Scene';
import { useGameStore } from './store/gameStore';
import { FishInfoModal } from './components/ui/FishInfoModal';
import { SettingsModal } from './components/ui/SettingsModal';
import { ShopModal } from './components/ui/ShopModal';
import { useUIStore } from './store/uiStore';
import { soundManager } from './managers/SoundManager';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fishes = useGameStore((state) => state.fishes);
  const addFish = useGameStore((state) => state.addFish);
  const lightMode = useGameStore((state) => state.environment.lightMode);
  const toggleLightMode = useGameStore((state) => state.toggleLightMode);
  const marketTrend = useGameStore((state) => state.marketTrend);
  const coins = useGameStore((state) => state.user.coins);

  const isViewMode = useUIStore((state) => state.isViewMode);
  const toggleSettings = useUIStore((state) => state.toggleSettings);
  const toggleShop = useUIStore((state) => state.toggleShop);

  const updateMarket = useGameStore((state) => state.updateMarket);

  useEffect(() => {
    if (useGameStore.getState().marketTrend === 1.0) {
      updateMarket();
    }
    if (fishes.length === 0) {
      addFish('NeonTetra');
    }
  }, [fishes, addFish, updateMarket]);

  useEffect(() => {
    if (started) {
      soundManager.playBGM(lightMode);
    }
  }, [lightMode, started]);

  const handleStart = () => {
    setStarted(true);
    soundManager.playSE('click');
    soundManager.playBGM(lightMode);
  };

  if (!started) {
    return (
      <div className="title-screen" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #001f3f, #0074D9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        zIndex: 9999
      }}>
        <h1 style={{
          fontSize: '4rem',
          marginBottom: '40px',
          textShadow: '0 4px 10px rgba(0,0,0,0.5)',
          fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
        }}>
          Aqua Tycoon
        </h1>
        <button
          onClick={handleStart}
          style={{
            fontSize: '1.5rem',
            padding: '16px 48px',
            background: 'linear-gradient(to bottom, #2ECC40, #0074D9)',
            border: 'none',
            borderRadius: '30px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
            transition: 'transform 0.1s'
          }}
        >
          START
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Scene />
      <FishInfoModal />
      <SettingsModal />
      <ShopModal />

      {/* Menu Toggle Button (Bottom Right) */}
      {!isViewMode && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: 'max(20px, env(safe-area-inset-right))',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isMenuOpen ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.5)',
            color: isMenuOpen ? '#333' : 'white',
            fontSize: '1.5rem',
            zIndex: 100,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Collapsible UI Container */}
      {!isViewMode && (
        <div style={{
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? 'auto' : 'none',
          transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.3s ease',
          position: 'absolute',
          bottom: '90px',
          right: 'max(20px, env(safe-area-inset-right))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px',
          zIndex: 99
        }}>
          {/* Stats Panel */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '12px 20px',
            borderRadius: '16px',
            backdropFilter: 'blur(5px)',
            textAlign: 'right',
            color: 'white',
            minWidth: '160px'
          }}>
            <p style={{ margin: '4px 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
              💰 {coins}
            </p>
            <p style={{ margin: '4px 0', fontSize: '0.8rem', opacity: 0.8 }}>
              📈 Market: x{marketTrend.toFixed(2)}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <button
              onClick={() => { toggleShop(); setIsMenuOpen(false); }}
              style={{
                fontSize: '1rem',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(245, 124, 0, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🛒</span> ショップ
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={toggleSettings} style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}>
                ⚙️
              </button>

              <button onClick={toggleLightMode} style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}>
                {lightMode === 'day' ? '🌙' : '☀️'}
              </button>

              <button
                onClick={() => {
                  useGameStore.getState().addFish('Goldfish');
                  soundManager.playSE('bubble');
                }}
                style={{
                  background: 'rgba(0, 255, 100, 0.3)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                🐟
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
