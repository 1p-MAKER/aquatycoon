import { useTranslation } from 'react-i18next';
import { Scene } from './components/Scene';
import './App.css';

function App() {
  const { t } = useTranslation();

  return (
    <div className="app-container">
      <Scene />
      <div className="ui-overlay">
        <h1>{t('welcome')}</h1>
      </div>
    </div>
  );
}

export default App;
