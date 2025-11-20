import { useEffect, useState } from 'react';
import { getReports, deleteReport } from '@core/storage';
import { triggerManualSync } from '@core/sync';
import { translations, type AppLanguage } from '@core/i18n';
import type { Report } from '@core/types';
import './History.css';

interface HistoryProps {
  onBack: () => void;
  onViewReport: (report: Report) => void;
  language: AppLanguage;
}

export default function History({ onBack, onViewReport, language }: HistoryProps) {
  const t = translations[language];
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const allReports = await getReports();
      setReports(allReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm(t.confirmDelete)) {
      try {
        await deleteReport(id);
        await loadReports();
      } catch (error) {
        console.error('Failed to delete report:', error);
      }
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage('');
    
    try {
      const result = await triggerManualSync();
      setSyncMessage(result.message);
      
      if (result.success && result.count > 0) {
        // Reload reports to show updated sync status
        await loadReports();
      }
    } catch (error) {
      setSyncMessage('Sync failed');
    } finally {
      setSyncing(false);
      // Clear message after 3 seconds
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-content">
        <div className="history-header">
          <button className="back-btn" onClick={onBack}>
            ← {t.backButton}
          </button>
          <h1 className="history-title">{t.historyTitle}</h1>
          <div className="header-actions">
            <div className="report-count">{reports.length} / 10</div>
            <button 
              className="sync-btn" 
              onClick={handleSync}
              disabled={syncing || !navigator.onLine}
              title={navigator.onLine ? 'Sync reports' : 'Offline'}
            >
              {syncing ? '⏳' : '🔄'}
            </button>
          </div>
        </div>

        {syncMessage && (
          <div className="sync-message">{syncMessage}</div>
        )}

        {reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p>{t.noReports}</p>
          </div>
        ) : (
          <div className="reports-list">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="report-card"
                onClick={() => onViewReport(report)}
              >
                <div className="report-card-header">
                  <div className="report-info">
                    <span className="report-emoji">{domainEmoji[report.domain]}</span>
                    <div>
                      <div className="report-domain">{report.domain}</div>
                      <div className="report-date">{formatDate(report.timestamp)}</div>
                    </div>
                  </div>
                  <div className="report-actions">
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: severityColor[report.severity] }}
                    >
                      {report.severity}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDelete(report.id, e)}
                      title={t.deleteButton}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="report-preview">
                  {report.summary_local.substring(0, 100)}
                  {report.summary_local.length > 100 ? '...' : ''}
                </div>

                {report.synced ? (
                  <div className="sync-status synced">✓ Synced / ஒத்திசைக்கப்பட்டது</div>
                ) : (
                  <div className="sync-status pending">⏳ Pending / நிலுவையில்</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
