// import { createMap } from './mapRender.js'
// const map = createMap(-31, 45);



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
        },
    ],
    // 'glyphs': 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
}

const map = new maplibregl.Map({
    container: 'map', // container id
    style,
    center: [-31, 45],
    zoom: 1.4,
    minZoom: 1.4
});


map.on('load', () => {

    map.addSource('campgroundsSource', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: geofeatures
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 10
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campgroundsSource',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://maplibre.org/maplibre-style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                100,
                '#f1f075',
                750,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
            ]
        }
    });

    // map.addLayer({
    //     id: 'cluster-count',
    //     type: 'symbol',
    //     source: 'campgroundsSource',
    //     filter: ['has', 'point_count'],
    //     layout: {
    //         'text-field': '{point_count_abbreviated}',
    //         'text-font': ['Arial'],
    //         'text-size': 12,
    //     },
    // });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgroundsSource',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        const zoom = await map.getSource('campgroundsSource').getClusterExpansionZoom(clusterId);
        map.easeTo({
            center: features[0].geometry.coordinates,
            zoom
        });
    });

    map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();

        // // Ensure that if the map is zoomed out such that
        // // multiple copies of the feature are visible, the
        // // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(
                `${e.features[0].properties.title}<br><a href="/campgrounds/${e.features[0].properties.id}">Check Out 👀</a>`
            )
            .addTo(map);
    });




    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });
    map.on('click', e => {
        // console.log(e)
        // console.log(map.getZoom())
        console.log(map.style)
    })



})


// // REALLY BAD, FLICKERS. TODO
// const expendButton = document.getElementById('btnExpend');
// const mapDiv = document.getElementById('map');
// let mapHeight = 300;

// mapDiv.style.transition = `height 0.5s`;
// mapDiv.style.backfaceVisibility = 'hidden';
// mapDiv.style.transform = 'translateZ(0)';

// expendButton.addEventListener('click', () => {
//     if (mapHeight === 300){
//         mapHeight = 600;
//         expendButton.innerHTML = 'Retract map'
//     } else {
//         mapHeight = 300;
//         expendButton.innerHTML = 'Expend map'
//     }
//     mapDiv.style.height = `${mapHeight}px`;

// })