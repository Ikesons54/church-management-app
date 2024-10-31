import { openDB } from 'idb';
import { message } from 'antd';

const DB_NAME = 'churchAttendanceDB';
const DB_VERSION = 1;

export class SyncService {
  constructor() {
    this.dbPromise = this.initDB();
  }

  async initDB() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Attendance store
        if (!db.objectStoreNames.contains('attendance')) {
          const attendanceStore = db.createObjectStore('attendance', {
            keyPath: 'id',
            autoIncrement: true
          });
          attendanceStore.createIndex('date', 'date');
          attendanceStore.createIndex('serviceType', 'serviceType');
          attendanceStore.createIndex('syncStatus', 'syncStatus');
        }

        // Pending changes store
        if (!db.objectStoreNames.contains('pendingChanges')) {
          const pendingStore = db.createObjectStore('pendingChanges', {
            keyPath: 'id',
            autoIncrement: true
          });
          pendingStore.createIndex('timestamp', 'timestamp');
          pendingStore.createIndex('type', 'type');
        }
      }
    });
  }

  async saveAttendanceOffline(attendanceData) {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction('attendance', 'readwrite');
      await tx.store.add({
        ...attendanceData,
        syncStatus: 'pending',
        timestamp: Date.now()
      });
      await tx.done;
      message.success('Attendance saved offline');
    } catch (error) {
      message.error('Error saving attendance offline: ' + error.message);
      throw error;
    }
  }

  async getPendingChanges() {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction('attendance', 'readonly');
      return await tx.store.index('syncStatus').getAll('pending');
    } catch (error) {
      message.error('Error getting pending changes: ' + error.message);
      throw error;
    }
  }

  async syncPendingChanges() {
    try {
      const pendingChanges = await this.getPendingChanges();
      if (!pendingChanges.length) return;

      const results = await Promise.allSettled(
        pendingChanges.map(async (change) => {
          try {
            const response = await fetch('/api/attendance/sync', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(change)
            });

            if (!response.ok) throw new Error('Sync failed');

            const db = await this.dbPromise;
            const tx = db.transaction('attendance', 'readwrite');
            await tx.store.put({
              ...change,
              syncStatus: 'synced',
              syncedAt: Date.now()
            });
            await tx.done;

            return response.json();
          } catch (error) {
            throw error;
          }
        })
      );

      const succeeded = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      if (failed > 0) {
        message.warning(`Sync completed with ${failed} errors. ${succeeded} records synced successfully.`);
      } else {
        message.success(`${succeeded} records synced successfully`);
      }
    } catch (error) {
      message.error('Error syncing changes: ' + error.message);
      throw error;
    }
  }

  async clearSyncedRecords(olderThan = 30) {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction('attendance', 'readwrite');
      const store = tx.store;
      const cutoffDate = Date.now() - (olderThan * 24 * 60 * 60 * 1000);

      const records = await store.index('syncStatus').getAll('synced');
      const oldRecords = records.filter(r => r.syncedAt < cutoffDate);

      await Promise.all(
        oldRecords.map(record => store.delete(record.id))
      );

      await tx.done;
    } catch (error) {
      console.error('Error clearing synced records:', error);
    }
  }
} 