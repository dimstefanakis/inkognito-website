'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl, { type Map as MapboxMap } from 'mapbox-gl';

const mapboxToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type MarkerConfig = {
  lngLat: [number, number];
  gender: 'male' | 'female';
  bubbleSide: 'left' | 'right';
  confession: string;
};

const markers: MarkerConfig[] = [
  {
    lngLat: [23.7275, 37.984],
    gender: 'female',
    bubbleSide: 'right',
    confession: "I’ve dated 2 guys at once.",
  },
  {
    lngLat: [-0.1276, 51.5072],
    gender: 'male',
    bubbleSide: 'left',
    confession: 'I kinda want to separate from my wife',
  },
  {
    lngLat: [13.405, 52.52],
    gender: 'female',
    bubbleSide: 'right',
    confession: 'I’m in love with my bestfriend',
  },
  {
    lngLat: [2.3522, 48.8566],
    gender: 'male',
    bubbleSide: 'left',
    confession: 'I’m gay but I’m not',
  },
  {
    lngLat: [18.0686, 59.3293],
    gender: 'female',
    bubbleSide: 'left',
    confession: 'I know his friend secretly wants me but I just can’t tell him!',
  },
  {
    lngLat: [-74.006, 40.7128],
    gender: 'female',
    bubbleSide: 'right',
    confession: 'I’m dating someone locked up',
  },
  {
    lngLat: [-118.2437, 34.0522],
    gender: 'male',
    bubbleSide: 'left',
    confession: 'I want to have a threesome',
  },
  {
    lngLat: [-87.6298, 41.8781],
    gender: 'female',
    bubbleSide: 'right',
    confession: 'my soul tie comes in and out of my life like I’m a bus station',
  },
  {
    lngLat: [139.6917, 35.6895],
    gender: 'female',
    bubbleSide: 'left',
    confession: 'I’m addicted to her',
  },
  {
    lngLat: [103.8198, 1.3521],
    gender: 'male',
    bubbleSide: 'right',
    confession: 'I have stalked someone before',
  },
];

const INITIAL_CENTER: [number, number] = [18, 35];
const GLOBE_SPIN_DEGREES_PER_SECOND = 6.6;
const LATITUDE_SWAY_DEGREES = 11;
const LATITUDE_SWAY_SECONDS = 38;

type RenderedMarker = MarkerConfig & {
  element: HTMLDivElement;
  content: HTMLSpanElement;
  probeElement: HTMLDivElement;
};

if (mapboxToken) {
  mapboxgl.accessToken = mapboxToken;
}

export function LiveMapHero() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerLayerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const rotationFrameRef = useRef<number | null>(null);
  const [mapUnavailable, setMapUnavailable] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || !markerLayerRef.current || mapRef.current) {
      return;
    }

    if (!mapboxToken || !mapboxgl.supported()) {
      setMapUnavailable(true);
      return;
    }

    const markerLayer = markerLayerRef.current;
    let map: MapboxMap;

    try {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: INITIAL_CENTER,
        zoom: 1.85,
        pitch: 0,
        bearing: -18,
        projection: 'globe',
        interactive: false,
        attributionControl: false,
      });
    } catch {
      setMapUnavailable(true);
      return;
    }

    mapRef.current = map;
    const renderedMarkers: RenderedMarker[] = [];

    const updateMarkerVisibility = () => {
      renderedMarkers.forEach((marker) => {
        const position = map.project(marker.lngLat);
        const probeOpacity = Number.parseFloat(marker.probeElement.style.opacity || '1');
        const isVisible = probeOpacity > 0;

        marker.element.style.transform = `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`;
        marker.content.style.display = isVisible ? 'grid' : 'none';
        marker.content.style.opacity = isVisible ? '1' : '0';
        marker.content.style.visibility = isVisible ? 'visible' : 'hidden';
        marker.element.dataset.visible = isVisible ? 'true' : 'false';
      });
    };

    const rotateCamera = (timestamp: number) => {
      const elapsedSeconds = timestamp / 1000;
      const longitude =
        ((((INITIAL_CENTER[0] + elapsedSeconds * GLOBE_SPIN_DEGREES_PER_SECOND) + 180) % 360) + 360) % 360 - 180;
      const latitude =
        INITIAL_CENTER[1] + Math.sin(elapsedSeconds / LATITUDE_SWAY_SECONDS) * LATITUDE_SWAY_DEGREES;

      map.jumpTo({
        center: [longitude, latitude],
      });
      updateMarkerVisibility();

      rotationFrameRef.current = window.requestAnimationFrame(rotateCamera);
    };

    markers.forEach((marker) => {
      const element = document.createElement('div');
      element.className = `live-map-marker live-map-marker-${marker.bubbleSide} live-map-marker-${marker.gender}`;
      element.dataset.visible = 'true';

      const probeElement = document.createElement('div');
      probeElement.className = 'live-map-marker-probe';

      const content = document.createElement('span');
      content.className = 'live-map-marker-content';

      const avatar = document.createElement('span');
      avatar.className = 'live-map-avatar';
      avatar.setAttribute('aria-hidden', 'true');

      const bubble = document.createElement('span');
      bubble.className = 'live-map-bubble';
      bubble.textContent = marker.confession;

      content.append(avatar, bubble);
      element.append(content);

      new mapboxgl.Marker({ element: probeElement, anchor: 'center', occludedOpacity: 0 })
        .setLngLat(marker.lngLat)
        .addTo(map);

      markerLayer.appendChild(element);
      renderedMarkers.push({ ...marker, element, content, probeElement });
    });

    updateMarkerVisibility();

    map.on('render', updateMarkerVisibility);

    map.on('style.load', () => {
      map.setFog({
        color: 'rgb(18, 18, 18)',
        'high-color': 'rgb(26, 26, 26)',
        'horizon-blend': 0.08,
        'space-color': 'rgb(0, 0, 0)',
        'star-intensity': 0,
      });
    });

    map.on('load', () => {
      setMapUnavailable(false);
      map.resize();
      updateMarkerVisibility();
      map.easeTo({
        center: INITIAL_CENTER,
        zoom: 2.02,
        bearing: 8,
        pitch: 0,
        duration: 900,
        essential: true,
      });

      rotationFrameRef.current = window.requestAnimationFrame(rotateCamera);
    });

    return () => {
      if (rotationFrameRef.current) {
        window.cancelAnimationFrame(rotationFrameRef.current);
      }

      map.remove();
      mapRef.current = null;
      markerLayer.replaceChildren();
    };
  }, []);

  return (
    <div className="live-map-frame">
      <div ref={mapContainerRef} className="live-map-canvas" />
      <div ref={markerLayerRef} className="live-map-marker-layer" aria-hidden="true" />
      {mapUnavailable && (
        <div className="live-map-fallback" aria-hidden="true">
          Map preview unavailable
        </div>
      )}
    </div>
  );
}
