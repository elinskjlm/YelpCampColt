
const style = {
    'version': 8,
    'sources': {
        'raster-tiles': {
            'type': 'raster',
            'tiles': [
                // NOTE: Layers from Stadia Maps do not require an API key for localhost development or most production
                // web deployments. See https://docs.stadiamaps.com/authentication/ for details.
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                // 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg'
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

const parseFeature = (feature) => {
    const place = feature ? JSON.parse(feature) : "";
    const lat = place?.geometry?.coordinates[0] ?? 0;
    const lng = place?.geometry?.coordinates[1] ?? 0;
    return { lng, lat };
}

export const createMap = (lng, lat) => {
    const map = new maplibregl.Map({
        container: 'map', // container id
        style,
        center: [lng, lat],
        zoom: 3
    });
    return map;
}

export const createMarker = (map, lng, lat) => {
    const marker = new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([lng, lat])
        .addTo(map)
    return marker;
}

export const createMapAndMarker = (feature) => {
    const { lng, lat } = parseFeature(feature);
    const map = createMap(lng, lat);
    const marker = createMarker(map, lng, lat);
    return { map, marker };
}