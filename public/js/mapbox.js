const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoidHVsbmEiLCJhIjoiY2ticDIwaDdjMWVwZTJ2bzZ5bDN4d28xeiJ9.rHqT_3uZzU4LZ2pmia1vyg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/tulna/ckbp479j80lmk1ilonmfjmbw8',
  scrollZoom: false
  // center: [-111.11349, 54.111745],
  // zoom: 12
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup()
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
