// geoCodes.js
// Geocode an address (city and country) to get latitude and longitude
/**
 * Represents a geocoding result.
 * @typedef {Object} GeocodeResult
 * @property {number} lat - The latitude.
 * @property {number} lon - The longitude.
 */

/**
 * Geocode an address to get latitude and longitude.
 * @param {string} query - The address to geocode.
 * @returns {Promise<GeocodeResult>} The geocoding result.
 */
export async function geocode(query) {
  const baseUrl = 'https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=';
  let lat;
  let lon;

  try {
    const response = await fetch(baseUrl + query);
    const results = await response.json();

    if (results.length > 0) {
      lat = +results[0].lat;
      lon = +results[0].lon;
    } else {
      throw new Error("No geocoding results found");
    }
  } catch (error) {
    console.error("Error geocoding address:", error);
    throw error;
  }

  return { lat, lon };
}

/**
 * Geocode an address with rate limiting.
 * @param {string} query - The address to geocode.
 * @returns {Promise<GeocodeResult>} The geocoding result.
 */
export async function geocodeWithRateLimit(query) {
  const delay = () => new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
  await delay();
  return await geocode(query);

  
}
