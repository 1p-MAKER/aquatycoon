import { useTranslation } from 'react-i18next';
import { Scene } from './components/Scene';
import { useGameStore } from './store/gameStore';
import { FishInfoModal } from './components/ui/FishInfoModal';
import './App.css';

function App() {
  const { t } = useTranslation();
  const coins = useGameStore((state) => state.user.coins);

  return (
    <div className="app-container">
      <Scene />
      <FishInfoModal />
      <div className="ui-overlay">
        <h1>{t('welcome')}</h1>
        <p style={{ marginTop: 10 }}>Coins: {coins}</p>
      </div>
    </div>
  );
}

export default App;
