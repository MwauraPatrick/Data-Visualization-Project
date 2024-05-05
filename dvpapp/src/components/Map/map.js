//map.js

export async function createMap(mapElement) {
  try {
    const leaflet = await import('leaflet');

    const map = leaflet.map(mapElement).setView([50.8283, 10.5795], 4);

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return map;
  } catch (error) {
    console.error('Error creating map:', error);
    throw error;
  }
}
