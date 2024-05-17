const place = feature ? JSON.parse(feature) : "";
const lat = place?.geometry?.coordinates[0] ?? 0;
const lng = place?.geometry?.coordinates[1] ?? 0;

const style = {
    'version': 8,
    'sources': {
        'raster-tiles': {
            'type': 'raster',
            'tiles': [
                // NOTE: Layers from Stadia Maps do not require an API key for localhost development or most production
                // web deployments. See https://docs.stadiamaps.com/authentication/ for details.
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            'tileSize': 256,
        }
    },
    'layers': [
        {
            'id': 'simple-tiles',
            'type': 'raster',
            'source': 'raster-tiles',
            'minzoom': 0,
            'maxzoom': 22
        }
    ]
}

const map = new maplibregl.Map({
    container: 'map', // container id
    style,
    center: [lng, lat], // [lng, lat]
    zoom: 3
});

const marker = new maplibregl.Marker({ color: "#FF0000" })
    .setLngLat([lng, lat])
    .addTo(map)