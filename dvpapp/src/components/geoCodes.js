// Geocode an address (city and country) to get latitude and longitude
async function geocodeCity(city, country) {
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
  const address = `${city}, ${country}`;
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;
      return { lat: latitude, lon: longitude };
    } else {
      console.error(`Error geocoding address: ${address}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
    return null;
  }
}

// Example usage:
const { lat, lon } = await geocodeCity('New York', 'USA');
console.log(`Coordinates for New York: Lat ${lat}, Lng ${lon}`);
