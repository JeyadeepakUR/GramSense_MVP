import type { GeoLocation } from './types';

/**
 * Capture current geo-location using browser's Geolocation API
 * Essential for agricultural field reporting
 */
export async function captureGeoLocation(): Promise<GeoLocation | undefined> {
  if (!navigator.geolocation) {
    console.warn('Geolocation not supported');
    return undefined;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geoLocation: GeoLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };
        console.log('Geo-location captured:', geoLocation);
        resolve(geoLocation);
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve(undefined);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(geo: GeoLocation): string {
  return `${geo.latitude.toFixed(6)}, ${geo.longitude.toFixed(6)}`;
}
