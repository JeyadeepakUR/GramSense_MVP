import { useState } from 'react';
import { processAudioWithTranscript } from '@core/pipeline';
import { translations, type AppLanguage } from '@core/i18n';
import type { Report } from '@core/types';
import './Home.css';

interface HomeProps {
  onRecordingComplete: (report: Report) => void;
  onViewHistory: () => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
}

const languageMap: Record<AppLanguage, 'hi-IN' | 'ta-IN' | 'en-IN'> = {
  hi: 'hi-IN',
  ta: 'ta-IN',
  en: 'en-IN'
};

export default function Home({ onRecordingComplete, onViewHistory, language, onLanguageChange }: HomeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const t = translations[language];
  const selectedLanguage = languageMap[language];

  const startRecording = async () => {
    try {
      // Check if Web Speech API is available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('Speech recognition not supported in this browser. Please use Chrome or Edge.');
        return;
      }

      const recognition = new SpeechRecognition();
      
      // Configure for multilingual recognition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      
      // Use selected language
      recognition.lang = selectedLanguage;
      
      let finalTranscript = '';
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        console.log('Current transcript:', finalTranscript + interimTranscript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error !== 'no-speech') {
          alert('Speech recognition error. Please try again.');
        }
      };
      
      recognition.onend = async () => {
        setIsRecording(false);
        
        if (finalTranscript.trim()) {
          setIsProcessing(true);
          
          try {
            // Create a dummy blob (not used, but required by current pipeline)
            const dummyBlob = new Blob([''], { type: 'audio/webm' });
            
            // Override the transcription in the pipeline
            const report = await processAudioWithTranscript(dummyBlob, finalTranscript.trim());
            onRecordingComplete(report);
          } catch (error) {
            console.error('Processing error:', error);
            alert('Failed to process audio. Please try again.');
          } finally {
            setIsProcessing(false);
          }
        } else {
          alert('No speech detected. Please try again.');
        }
      };
      
      recognition.start();
      setIsRecording(true);
      
      // Store recognition instance
      (window as any).currentRecognition = recognition;
      
    } catch (error) {
      console.error('Speech recognition error:', error);
      alert('Could not start speech recognition. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      const recognition = (window as any).currentRecognition;
      if (recognition) {
        recognition.stop();
      }
      setIsRecording(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="logo-container">
          <div className="logo-icon">🌾</div>
          <h1 className="logo-text">{t.appName}</h1>
          <p className="subtitle">{t.tagline}</p>
        </div>

        <div className="language-selector">
          <label className="lang-label">{t.languageLabel}</label>
          <div className="lang-buttons">
            <button 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => onLanguageChange('en')}
              disabled={isRecording || isProcessing}
            >
              English
            </button>
            <button 
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => onLanguageChange('hi')}
              disabled={isRecording || isProcessing}
            >
              हिंदी
            </button>
            <button 
              className={`lang-btn ${language === 'ta' ? 'active' : ''}`}
              onClick={() => onLanguageChange('ta')}
              disabled={isRecording || isProcessing}
            >
              தமிழ்
            </button>
          </div>
        </div>

        <div className="record-section">
          {!isRecording && !isProcessing && (
            <button 
              className="record-button" 
              onClick={startRecording}
              aria-label="Start Recording"
            >
              <span className="record-icon">🎙️</span>
              <span className="record-text">{t.recordButton}</span>
            </button>
          )}

          {isRecording && (
            <button 
              className="stop-button" 
              onClick={stopRecording}
              aria-label="Stop Recording"
            >
              <span className="stop-icon">⬛</span>
              <span className="stop-text">{t.stopButton}</span>
            </button>
          )}

          {isProcessing && (
            <div className="processing">
              <div className="spinner"></div>
              <p>{t.processing}</p>
            </div>
          )}
        </div>

        <div className="instructions">
          <p>📍 {t.instruction}</p>
          <p className="geo-note">Location auto-captured</p>
        </div>

        <button 
          className="history-btn"
          onClick={onViewHistory}
          disabled={isRecording || isProcessing}
        >
          📊 {t.history}
        </button>
      </div>
    </div>
  );
}
