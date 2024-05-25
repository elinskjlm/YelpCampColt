import { createMapAndMarker, createMap } from './mapRender.js';
feature ? createMapAndMarker(feature) : createMap(0, 0);