import { openDB } from 'idb';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export class DeviceSynchronization {
  constructor() {
    this.db = null;
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
    this.deviceId = localStorage.getItem('deviceId') || uuidv4();
    this.initializeDB();
  }

  async initializeDB() {
    this.db = await openDB('copaDubaiDB', 1, {
      upgrade(db) {
        // Create stores for different data types
        db.createObjectStore('attendance', { keyPath: 'id' });
        db.createObjectStore('syncQueue', { keyPath: 'id' });
        db.createObjectStore('auditLogs', { keyPath: 'id' });
        db.createObjectStore('members', { keyPath: 'id' });
      }
    });
  }

  // Handle real-time synchronization
  async syncData(data, type) {
    if (this.isOnline) {
      try {
        const response = await this.sendToServer(data, type);
        if (response.success) {
          await this.updateLocalDB(data, type);
        }
      } catch (error) {
        await this.queueForSync(data, type);
      }
    } else {
      await this.queueForSync(data, type);
    }
  }

  // Process sync queue when online
  async processSyncQueue() {
    const queue = await this.db.getAll('syncQueue');
    for (const item of queue) {
      try {
        await this.sendToServer(item.data, item.type);
        await this.db.delete('syncQueue', item.id);
      } catch (error) {
        console.error('Sync failed for item:', item.id);
      }
    }
  }

  // Real-time data conflict resolution
  async resolveConflicts(serverData, localData) {
    const conflicts = [];
    for (const [key, value] of Object.entries(serverData)) {
      if (localData[key] && localData[key].timestamp > value.timestamp) {
        conflicts.push({
          key,
          server: value,
          local: localData[key]
        });
      }
    }

    return conflicts.map(conflict => ({
      ...conflict.server,
      resolved: true,
      resolution: 'server_version_accepted'
    }));
  }
} 