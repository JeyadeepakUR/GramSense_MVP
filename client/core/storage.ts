import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Report } from './types';

interface GramSenseDB extends DBSchema {
  reports: {
    key: string;
    value: Report;
    indexes: { 'by-timestamp': number; 'by-synced': number };
  };
}

const DB_NAME = 'gramsense-db';
const DB_VERSION = 1;
const MAX_REPORTS = 10;

let db: IDBPDatabase<GramSenseDB> | null = null;

async function getDB(): Promise<IDBPDatabase<GramSenseDB>> {
  if (db) return db;
  
  db = await openDB<GramSenseDB>(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('reports')) {
        const reportStore = database.createObjectStore('reports', { keyPath: 'id' });
        reportStore.createIndex('by-timestamp', 'timestamp');
        reportStore.createIndex('by-synced', 'synced');
      }
    }
  });
  
  return db;
}

export async function saveReport(report: Report): Promise<void> {
  const database = await getDB();
  
  // Save the new report
  await database.put('reports', report);
  
  // Enforce max reports limit
  const allReports = await database.getAllFromIndex('reports', 'by-timestamp');
  
  if (allReports.length > MAX_REPORTS) {
    // Sort by timestamp descending
    allReports.sort((a, b) => b.timestamp - a.timestamp);
    
    // Delete oldest reports beyond the limit
    const toDelete = allReports.slice(MAX_REPORTS);
    for (const oldReport of toDelete) {
      await database.delete('reports', oldReport.id);
    }
  }
}

export async function getReports(): Promise<Report[]> {
  const database = await getDB();
  const reports = await database.getAllFromIndex('reports', 'by-timestamp');
  
  // Return in descending order (newest first)
  return reports.sort((a, b) => b.timestamp - a.timestamp);
}

export async function getReport(id: string): Promise<Report | undefined> {
  const database = await getDB();
  return database.get('reports', id);
}

export async function deleteReport(id: string): Promise<void> {
  const database = await getDB();
  await database.delete('reports', id);
}

export async function getUnsyncedReports(): Promise<Report[]> {
  const database = await getDB();
  const allReports = await database.getAll('reports');
  return allReports.filter(report => !report.synced);
}

export async function markSynced(id: string): Promise<void> {
  const database = await getDB();
  const report = await database.get('reports', id);
  
  if (report) {
    report.synced = true;
    await database.put('reports', report);
  }
}

export async function clearAllReports(): Promise<void> {
  const database = await getDB();
  await database.clear('reports');
}
