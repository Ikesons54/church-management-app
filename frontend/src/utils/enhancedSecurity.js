import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

// Add these functions before the SecuritySystem object
const getDeviceInfo = async () => {
  return {
    browser: navigator.userAgent,
    platform: navigator.userAgentData?.platform || 
             navigator.userAgent.match(/\(([^)]+)\)/)?.[1]?.split(';')[0] || 'Unknown',
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`
  };
};

const getCurrentLocation = async () => {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  } catch {
    return null;
  }
};

const storeAuditLog = async (logEntry) => {
  const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
  logs.push(logEntry);
  localStorage.setItem('auditLogs', JSON.stringify(logs));
};

export const SecuritySystem = {
  // Enhanced token generation with device fingerprinting
  generateSecureToken: (memberData, deviceInfo) => {
    const payload = {
      memberId: memberData.id,
      deviceId: deviceInfo.deviceId,
      timestamp: new Date().getTime(),
      random: uuidv4(),
      expiry: new Date().getTime() + (5 * 60 * 1000),
      fingerprint: {
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        location: deviceInfo.location,
        ipAddress: deviceInfo.ipAddress
      }
    };

    // Multi-layer encryption
    const primaryEncryption = CryptoJS.AES.encrypt(
      JSON.stringify(payload),
      process.env.REACT_APP_PRIMARY_KEY
    ).toString();

    const finalToken = CryptoJS.AES.encrypt(
      primaryEncryption,
      process.env.REACT_APP_SECONDARY_KEY
    ).toString();

    return finalToken;
  },

  // Biometric verification (if available)
  biometricAuth: async () => {
    if (window.PublicKeyCredential) {
      try {
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: { name: "COPABUDHABI" },
            user: {
              id: new Uint8Array(16),
              name: "user@example.com",
              displayName: "User"
            },
            pubKeyCredParams: [{
              type: "public-key",
              alg: -7
            }]
          }
        });
        return credential;
      } catch (error) {
        console.error('Biometric auth failed:', error);
        return null;
      }
    }
    return null;
  },

  // Activity logging with detailed metadata
  auditLog: async (action, data) => {
    const logEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      action,
      data,
      metadata: {
        deviceInfo: await getDeviceInfo(),
        location: await getCurrentLocation(),
        userAgent: navigator.userAgent,
        networkInfo: {
          type: navigator.connection?.type,
          effectiveType: navigator.connection?.effectiveType
        }
      }
    };

    // Store locally and queue for sync
    await storeAuditLog(logEntry);
    return logEntry;
  }
}; 