import { useState } from 'react';
import { saveReport } from '@core/storage';
import { translations, type AppLanguage } from '@core/i18n';
import type { Report } from '@core/types';
import './Summary.css';
import './location-styles.css';

interface SummaryProps {
  report: Report;
  onConfirm: () => void;
  onBack: () => void;
  language: AppLanguage;
}

export default function Summary({ report, onConfirm, onBack, language }: SummaryProps) {
  const t = translations[language];
  const [summaryLocal, setSummaryLocal] = useState(report.summary_local);
  const [summaryEn, setSummaryEn] = useState(report.summary_en);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    const updatedReport: Report = {
      ...report,
      summary_local: summaryLocal,
      summary_en: summaryEn
    };

    await saveReport(updatedReport);
    onConfirm();
  };

  const domainEmoji = {
    pest_outbreak: '🐛',
    crop_disease: '🦠',
    water_stress: '💧',
    soil_issue: '🌱',
    weather_alert: '🌤️',
    irrigation_problem: '💦'
  };

  const severityColor = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#dc2626'
  };

  return (
    <div className="summary-container">
      <div className="summary-content">
        <div className="header">
          <h1 className="title">{t.summaryTitle}</h1>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <span className="info-icon">{domainEmoji[report.domain]}</span>
            <span className="info-label">{report.domain.replace('_', ' ')}</span>
          </div>

          <div className="info-card">
            <span 
              className="severity-badge"
              style={{ backgroundColor: severityColor[report.severity] }}
            >
              {report.severity.toUpperCase()}
            </span>
            <span className="info-label">गंभीरता / தீவிரம்</span>
          </div>
        </div>

        <div className="summary-section">
          <label className="section-label">{t.localSummary}</label>
          {isEditing ? (
            <textarea
              className="summary-textarea"
              value={summaryLocal}
              onChange={(e) => setSummaryLocal(e.target.value)}
              rows={4}
            />
          ) : (
            <div className="summary-text">{summaryLocal}</div>
          )}
        </div>

        <div className="summary-section">
          <label className="section-label">{t.englishSummary}</label>
          {isEditing ? (
            <textarea
              className="summary-textarea"
              value={summaryEn}
              onChange={(e) => setSummaryEn(e.target.value)}
              rows={4}
            />
          ) : (
            <div className="summary-text">{summaryEn}</div>
          )}
        </div>

        {report.geoLocation && (
          <div className="location-section">
            <label className="section-label">📍 {t.location}</label>
            <div className="location-text">
              {report.geoLocation.latitude.toFixed(4)}°N, {report.geoLocation.longitude.toFixed(4)}°E
              <span className="accuracy-text">({t.accuracy}: ±{Math.round(report.geoLocation.accuracy)}m)</span>
            </div>
          </div>
        )}

        {report.entities.length > 0 && (
          <div className="entities-section">
            <label className="section-label">{t.entities}</label>
            <div className="entities-list">
              {report.entities.map((entity, idx) => (
                <span key={idx} className="entity-tag">
                  {entity}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="actions">
          {!isEditing ? (
            <>
              <button className="btn btn-secondary" onClick={onBack}>
                {t.backButton}
              </button>
              <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
                {t.editButton}
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {t.confirmButton}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                {t.backButton}
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {t.saveButton}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
