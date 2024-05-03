export async function createMap(mapElement) {
  const leaflet = await import('leaflet');

  const map = leaflet.map(mapElement).setView([50.8283, 10.5795], 4); //[39.8283, -98.5795] Adjust the view to focus on Europe

  leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const countries = ["BE", "HR", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IT", "LV", "LT", "NL", "NO", "PL", "PT", "SI", "ES", "SE", "CH", "GB"];

  try {
    // Fetch GeoJSON data for the specified countries
    const response = await fetch(`https://nominatim.openstreetmap.org/search?countrycodes=${countries.join(",")}&format=geojson`);
    if (!response.ok) {
      throw new Error(`Failed to fetch GeoJSON data: ${response.statusText}`);
    }
    const geoJsonData = await response.json();

    // Add a GeoJSON layer with the boundaries of the specified countries
    leaflet.geoJSON(geoJsonData, {
        style: {
            color: "blue", // Customize the boundary color
            weight: 2, // Customize the boundary weight
            fillOpacity: 0 // Set fill opacity to 0 to hide country fill
        }
    }).addTo(map);
  } catch (error) {
    console.error('Error fetching or processing GeoJSON data:', error.message);
  }

  return map;
}
