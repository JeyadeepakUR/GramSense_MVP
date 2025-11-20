import { getUnsyncedReports, markSynced } from './storage';
import type { Report } from './types';

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:8000';

/**
 * Sync unsynced reports to backend
 * Returns number of reports synced
 */
export async function syncReports(): Promise<number> {
  // Check if online
  if (!navigator.onLine) {
    console.log('Offline: Skipping sync');
    return 0;
  }

  try {
    const unsyncedReports = await getUnsyncedReports();
    
    if (unsyncedReports.length === 0) {
      console.log('No reports to sync');
      return 0;
    }

    console.log(`Syncing ${unsyncedReports.length} reports to backend...`);
    
    let syncedCount = 0;
    
    for (const report of unsyncedReports) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/reports`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report),
        });

        if (response.ok) {
          await markSynced(report.id);
          syncedCount++;
          console.log(`✓ Synced report ${report.id}`);
        } else {
          console.error(`✗ Failed to sync report ${report.id}:`, response.statusText);
        }
      } catch (error) {
        console.error(`✗ Error syncing report ${report.id}:`, error);
        // Continue with next report
      }
    }
    
    console.log(`Sync complete: ${syncedCount}/${unsyncedReports.length} reports synced`);
    return syncedCount;
    
  } catch (error) {
    console.error('Sync error:', error);
    return 0;
  }
}

/**
 * Setup automatic sync when online
 */
export function setupAutoSync() {
  // Sync when coming back online
  window.addEventListener('online', () => {
    console.log('Network online - triggering sync');
    syncReports();
  });

  // Sync periodically if online (every 5 minutes)
  setInterval(() => {
    if (navigator.onLine) {
      syncReports();
    }
  }, 5 * 60 * 1000);

  // Initial sync if online
  if (navigator.onLine) {
    setTimeout(() => syncReports(), 2000); // Wait 2s after app load
  }
}

/**
 * Manual sync trigger
 */
export async function triggerManualSync(): Promise<{ success: boolean; count: number; message: string }> {
  if (!navigator.onLine) {
    return {
      success: false,
      count: 0,
      message: 'Cannot sync: Device is offline'
    };
  }

  try {
    const count = await syncReports();
    return {
      success: true,
      count,
      message: count > 0 ? `Successfully synced ${count} reports` : 'No reports to sync'
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
      message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
