import { useState, useEffect } from 'react';
import Home from './components/Home';
import Summary from './components/Summary';
import History from './components/History';
import { setupAutoSync } from '@core/sync';
import type { Report } from '@core/types';
import type { AppLanguage } from '@core/i18n';

type Screen = 'home' | 'summary' | 'history';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [appLanguage, setAppLanguage] = useState<AppLanguage>('en');

  // Setup automatic sync on app load
  useEffect(() => {
    setupAutoSync();
  }, []);

  const handleRecordingComplete = (report: Report) => {
    setCurrentReport(report);
    setScreen('summary');
  };

  const handleConfirm = () => {
    setCurrentReport(null);
    setScreen('home');
  };

  const handleBack = () => {
    setCurrentReport(null);
    setScreen('home');
  };

  const handleViewHistory = () => {
    setScreen('history');
  };

  const handleViewReport = (report: Report) => {
    setCurrentReport(report);
    setScreen('summary');
  };

  const handleBackToHome = () => {
    setCurrentReport(null);
    setScreen('home');
  };

  return (
    <>
      {screen === 'home' && (
        <Home 
          onRecordingComplete={handleRecordingComplete}
          onViewHistory={handleViewHistory}
          language={appLanguage}
          onLanguageChange={setAppLanguage}
        />
      )}
      {screen === 'summary' && currentReport && (
        <Summary 
          report={currentReport} 
          onConfirm={handleConfirm}
          onBack={handleBack}
          language={appLanguage}
        />
      )}
      {screen === 'history' && (
        <History
          onBack={handleBackToHome}
          onViewReport={handleViewReport}
          language={appLanguage}
        />
      )}
    </>
  );
}

export default App;
