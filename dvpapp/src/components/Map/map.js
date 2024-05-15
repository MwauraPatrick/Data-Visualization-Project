//map.js
import 'leaflet/dist/leaflet.css';


export async function createMap(mapElement) {
  try {
    const leaflet = await import('leaflet');

    const map = leaflet.map(mapElement).setView([50.8283, 10.5795], 4);

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function countryStyle(feature) {
      let color;
      const country = feature.properties.name;
  
      const countries = {
          'Belgium': 'green',
          'Croatia': 'blue',
          'Czech Republic': 'red',
          'Denmark': 'yellow',
          'Estonia': 'orange',
          'Finland': 'purple',
          'France': 'cyan',
          'Germany': 'magenta',
          'Greece': 'lime',
          'Hungary': 'pink',
          'Italy': 'teal',
          'Latvia': 'brown',
          'Lithuania': 'olive',
          'Netherlands': 'navy',
          'Norway': 'maroon',
          'Poland': 'salmon',
          'Portugal': 'gold',
          'Slovenia': 'coral',
          'Spain': 'indigo',
          'Sweden': 'navyblue',
          'Switzerland': 'tan',
          'United Kingdom': 'darkgreen'
      };
  
      // Set the default color to 'brown' for countries not in the list
      color = countries[country] || 'brown';
  
      return {
          fillColor: color,
          weight: 1,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.7
      };
  }
  
    function highlightFeature(e) {
      const layer = e.target;

      layer.setStyle({
          weight: 2,
          color: '#666',
          fillOpacity: 1
      });

      if (!leaflet.Browser.ie && !leaflet.Browser.opera && !leaflet.Browser.edge) {
          layer.bringToFront();
      }
    }

    function resetHighlight(e) {
      geojson.resetStyle(e.target);
    }

    const fileName = 'selected_countries.geojson';
    const geojsonData = await fetch(`https://raw.githubusercontent.com/MwauraPatrick/Data-Visualization-Project/main/dvpapp/src/lib/data/selected_countries.geojson`).then(res => res.json());

    const geojson = leaflet.geoJSON(geojsonData, {
      style: countryStyle,
      onEachFeature: (feature, layer) => {
          layer.bindTooltip(feature.properties.name, { permanent: false, direction: 'center' });
          layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight
          });
      }
  }).addTo(map);
  

    return map;
  } catch (error) {
    console.error('Error creating map:', error);
    throw error;
  }
}
