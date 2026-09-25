// Live Geo-location & Reverse Geocoding Service for SENTINEXA / CivicGrid

/**
 * Heuristic lookup for Tamil Nadu major hubs if network/reverse geocoding is slow or offline
 */
export function getTamilNaduCityHint(lat, lon) {
  // Coimbatore bounds roughly: 10.5 to 11.35 N, 76.7 to 77.25 E
  if (lat >= 10.50 && lat <= 11.35 && lon >= 76.75 && lon <= 77.25) {
    let area = 'Coimbatore District';
    let city = 'Coimbatore';
    let district = 'Coimbatore';
    let pincode = '641012';

    // Kinathukadavu bounds: lat ~10.75 - 10.88, lon ~76.95 - 77.08
    if (lat >= 10.74 && lat <= 10.89 && lon >= 76.94 && lon <= 77.09) {
      area = 'Kinathukadavu';
      city = 'Kinathukadavu, Coimbatore';
      pincode = '642109';
    } else if (lat >= 10.58 && lat <= 10.74 && lon >= 76.92 && lon <= 77.08) {
      // Pollachi bounds
      area = 'Pollachi';
      city = 'Pollachi, Coimbatore';
      pincode = '642001';
    } else if (lat >= 10.89 && lat <= 10.95 && lon >= 76.94 && lon <= 77.05) {
      // Malumichampatti / Othakkalmandapam / Eachanari
      area = 'Eachanari / Malumichampatti';
      city = 'Coimbatore';
      pincode = '641021';
    } else if (lat >= 10.88 && lat <= 10.94 && lon >= 76.88 && lon <= 76.95) {
      // Madukkarai
      area = 'Madukkarai';
      city = 'Coimbatore';
      pincode = '641105';
    } else if (lat >= 11.010 && lat <= 11.035 && lon >= 76.950 && lon <= 76.980) {
      area = 'Cross Cut Road, Gandhipuram';
    } else if (lat >= 10.995 && lat <= 11.020 && lon >= 76.930 && lon <= 76.955) {
      area = 'R.S. Puram';
    } else if (lat >= 11.015 && lat <= 11.050 && lon >= 76.980 && lon <= 77.040) {
      area = 'Peelamedu, Avinashi Road';
    } else if (lat >= 10.980 && lat <= 11.005 && lon >= 76.950 && lon <= 76.975) {
      area = 'Ukkadam / Town Hall';
    }
    return { 
      area, 
      city, 
      district,
      pincode
    };
  }

  // Chennai CMA bounds: 12.8 to 13.3 N, 80.0 to 80.4 E
  if (lat >= 12.80 && lat <= 13.30 && lon >= 80.00 && lon <= 80.40) {
    let area = 'Central Zone';
    if (lat >= 13.070 && lat <= 13.100 && lon >= 80.195 && lon <= 80.230) {
      area = 'Anna Nagar 2nd Avenue';
    } else if (lat >= 13.050 && lat <= 13.070 && lon >= 80.240 && lon <= 80.265) {
      area = 'Anna Salai, Thousand Lights';
    } else if (lat >= 13.030 && lat <= 13.050 && lon >= 80.220 && lon <= 80.250) {
      area = 'T. Nagar';
    }
    return { area, city: 'Chennai', district: 'Chennai', pincode: '600040' };
  }

  // Madurai bounds: 9.8 to 10.1 N, 78.0 to 78.3 E
  if (lat >= 9.80 && lat <= 10.15 && lon >= 78.00 && lon <= 78.30) {
    return { area: 'Mattuthavani / Goripalayam', city: 'Madurai', district: 'Madurai', pincode: '625020' };
  }

  // Tiruchirappalli: 10.7 to 10.95 N, 78.6 to 78.85 E
  if (lat >= 10.70 && lat <= 10.95 && lon >= 78.60 && lon <= 78.85) {
    return { area: 'Thillai Nagar / Central Bus Stand', city: 'Tiruchirappalli', district: 'Tiruchirappalli', pincode: '620018' };
  }

  // Salem: 11.5 to 11.8 N, 78.0 to 78.3 E
  if (lat >= 11.50 && lat <= 11.80 && lon >= 78.00 && lon <= 78.30) {
    return { area: 'Hasthampatti / Junction', city: 'Salem', district: 'Salem', pincode: '636007' };
  }

  // Tiruppur: 11.0 to 11.3 N, 77.2 to 77.5 E
  if (lat >= 11.00 && lat <= 11.30 && lon >= 77.20 && lon <= 77.50) {
    return { area: 'Kumaran Road / Tiruppur Central', city: 'Tiruppur', district: 'Tiruppur', pincode: '641601' };
  }

  return {
    area: `Coordinates: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`,
    city: 'Tamil Nadu',
    district: 'Tamil Nadu',
    pincode: ''
  };
}

// In-memory cache for recent reverse geocode requests to prevent API spam
const geocodeCache = new Map();

/**
 * Reverse geocode latitude and longitude to street, area, city, and district.
 */
export async function reverseGeocode(lat, lon) {
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  const hint = getTamilNaduCityHint(lat, lon);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      { 
        headers: { 
          'Accept': 'application/json',
          'Accept-Language': 'en-IN,en;q=0.9,ta;q=0.8'
        },
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const addr = data.address || {};

    const road = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || addr.quarter || '';
    const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || '';
    const city = addr.city || addr.town || addr.municipality || addr.village || addr.county || hint.city;
    const district = addr.state_district || addr.county || city;
    const state = addr.state || 'Tamil Nadu';
    const postcode = addr.postcode ? ` - ${addr.postcode}` : (hint.pincode ? ` - ${hint.pincode}` : '');

    // Construct human-readable string
    const parts = [];
    if (road) parts.push(road);
    if (locality && locality !== road) parts.push(locality);
    if (city && city !== locality && city !== road) parts.push(city);
    parts.push(state);

    const formattedAddress = parts.length > 0 
      ? parts.join(', ') + postcode 
      : (data.display_name || `${hint.area}, ${hint.city}, Tamil Nadu`);

    const result = {
      address: formattedAddress,
      city: city || hint.city,
      district: district || hint.district,
      state: state || 'Tamil Nadu',
      road: road || hint.area,
      postcode: addr.postcode || hint.pincode
    };

    geocodeCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn('Live reverse geocoding fallback to offline Tamil Nadu hint:', err.message);
    const fallbackResult = {
      address: `${hint.area}, ${hint.city}, Tamil Nadu${hint.pincode ? ' - ' + hint.pincode : ''}`,
      city: hint.city,
      district: hint.district,
      state: 'Tamil Nadu',
      road: hint.area,
      postcode: hint.pincode
    };
    geocodeCache.set(cacheKey, fallbackResult);
    return fallbackResult;
  }
}

/**
 * Start continuous high-accuracy location tracking with dual-phase resolution.
 * Returns an unwatch cleanup function.
 */
export function startLiveLocationTracking(onLocationUpdate, onStatusChange) {
  if (!('geolocation' in navigator)) {
    if (onStatusChange) onStatusChange({ isSupported: false, error: 'Geolocation not supported by device' });
    return () => {};
  }

  let active = true;
  let hasLocked = false;
  if (onStatusChange) onStatusChange({ isLocating: true, message: 'Requesting device GPS & cell triangulation...' });

  const handlePosition = async (pos) => {
    if (!active) return;
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const accuracy = Math.round(pos.coords.accuracy);

    hasLocked = true;

    // Immediately resolve district/area using heuristic for 0-latency UI feedback
    const fastHint = getTamilNaduCityHint(lat, lon);
    const immediateData = {
      lat,
      long: lon,
      accuracy,
      address: `${fastHint.area}, ${fastHint.city}, Tamil Nadu`,
      city: fastHint.city,
      district: fastHint.district,
      isLocked: true,
      timestamp: new Date().toISOString()
    };

    onLocationUpdate(immediateData);
    if (onStatusChange) onStatusChange({ isLocating: false, isLocked: true, accuracy });

    // Asynchronously enrich with precise OpenStreetMap Nominatim reverse geocode
    try {
      const geoResult = await reverseGeocode(lat, lon);
      if (active) {
        onLocationUpdate({
          lat,
          long: lon,
          accuracy,
          address: geoResult.address,
          city: geoResult.city,
          district: geoResult.district,
          state: geoResult.state,
          isLocked: true,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {
      // Ignore background geocode error since immediateData is already set
    }
  };

  // Phase 1: Fast cellular/Wi-Fi fix (low accuracy, generous timeout & cached age)
  navigator.geolocation.getCurrentPosition(
    handlePosition,
    (err) => {
      console.warn('Phase 1 coarse location info:', err.message);
      if (!hasLocked && onStatusChange) {
        onStatusChange({ isLocating: true, message: 'Acquiring high-precision GPS satellite fix...' });
      }
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
  );

  // Phase 2: Continuous high-accuracy satellite stream
  const watchId = navigator.geolocation.watchPosition(
    handlePosition,
    (err) => {
      console.warn('Phase 2 GPS watch warning:', err.message);
      if (!hasLocked && onStatusChange) {
        onStatusChange({ isLocating: false, error: err.message });
      }
    },
    { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
  );

  return () => {
    active = false;
    navigator.geolocation.clearWatch(watchId);
  };
}
