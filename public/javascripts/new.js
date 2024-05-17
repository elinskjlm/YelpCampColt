let results = [];
let bounds = maplibregl.LngLatBounds; // ??? TODO maybe just: let bounds;

const pointerName =         document.getElementById('pointerName');
const pointerCoords =       document.getElementById('pointerCoords');
const searchMapButton =     document.getElementById('searchMapButton');
const searchMapInput =      document.getElementById('searchMapInput');
const mapSearchResults =    document.getElementById('mapSearchResults');
const geojsonField =        document.getElementById('geojson');

const geojsonObjectDefault = {
    geometry: {
        coordinates: [],
        type: 'Point',
    }
}

let geojsonObject = geojsonObjectDefault;
geojsonField.value = JSON.stringify(geojsonObject)

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
    center: [0, 0], // [lng, lat]
    zoom: 1
});

const markerSearch = new maplibregl.Marker({
    color: "#FF0000",
    draggable: true
})
.setLngLat([0, 0])
.addTo(map);

async function reverseSearch(lng, lat) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=geojson`);
    const data = await response.json()
    return data/*.error ? undefined : data;*/
}

const colorTextAsWarning = (bool) => {
    pointerName.classList.remove(bool ? 'text-muted' : 'text-warning');
    pointerName.classList.add(bool ? 'text-warning' : 'text-muted');
}

const threeCleanDots = () => {
    colorTextAsWarning(false);
    pointerName.innerHTML = '...';
    pointerCoords.innerHTML = '...';
}

const wrapReverseSearch = async () => {
    threeCleanDots();
    const lat = markerSearch.getLngLat().lat;
    const lng = markerSearch.getLngLat().lng;
    map.easeTo(lat, lng);
    const data = await reverseSearch(lng, lat);
    if (!data.error) {
        pointerName.innerHTML = data.features[0].properties.display_name;
        geojsonObject = data.features[0];
    }
    else {
        colorTextAsWarning(true);
        pointerName.innerHTML = data.error;
        geojsonObject = geojsonObjectDefault;
    }
    geojsonObject.geometry.coordinates = [lat, lng];
    geojsonField.value = JSON.stringify(geojsonObject) // 👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻👈🏻
    pointerCoords.innerHTML = `Latitude: ${lat},<br>Longitude ${lng}`;
}

markerSearch.on('dragend', () => {
    wrapReverseSearch();
})

map.on('click', (e) => {
    markerSearch.setLngLat(e.lngLat);
    wrapReverseSearch();
})

searchMapButton.addEventListener('click', () => {
    forwardSearchAndDisplay(searchMapInput.value)
})


async function forwardSearchAndDisplay(placeName) {
    clearSearch();

    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${placeName}&format=geojson`);
    const data = await response.json();

    if (data.features.length) {
        addResultToMap(data);
        map.fitBounds(bounds, { padding: 40 })
    }
    else {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'list-group-item-action', 'text-warning');
        li.textContent = 'Could not find this place';
        mapSearchResults.appendChild(li);
    }

}

const clearSearch = () => {
    removeAllMarkers();
    results = [];
    mapSearchResults.innerHTML = '';
    bounds = new maplibregl.LngLatBounds();
}

const addResultToMap = (data) => {
    for (const feature of data.features) {
        const coords = feature.geometry.coordinates;
        const lng = coords[0];
        const lat = coords[1];
        bounds.extend(coords);

        const popup = new maplibregl.Popup()
            .setText(feature.properties.name);
        const el = document.createElement('div');
        el.id = `marker_${lng}_${lat}`;
        // TODO ADD EVENT LISTENER?

        const marker = createMarker(lng, lat, { element: el })
            .addTo(map)
            .setPopup(popup)
        results.push({ feature, marker });

        const li = document.createElement('li');
        li.classList.add('list-group-item', 'list-group-item-action');
        li.style.cursor = 'pointer';
        li.textContent = feature.properties.display_name;
        li.addEventListener('click', () => map.fitBounds(feature.bbox));
        mapSearchResults.appendChild(li)
    }
}

const createMarker = (lng, lat) => {
    const newMarker = new maplibregl.Marker({
        color: "#00FF00",
    }).setLngLat([lng, lat])
    newMarker._element.classList.add('tempMarker') // not in use
    return newMarker;
}

const removeAllMarkers = () => {
    for (let result of results) {
        result.marker.remove()
    }
}