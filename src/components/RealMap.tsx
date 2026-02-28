import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import { useSimulationStore, ThreatType, THREAT_LABELS, THREAT_ICONS } from '@/store/simulationStore';

const THREAT_TYPES: ThreatType[] = ['illegal_fishing', 'smuggling', 'rescue', 'terror', 'unauthorized'];

// Map boundaries for animation
const MAP_BOUNDS = {
  minLat: 12.70,
  maxLat: 13.25,
  minLng: 80.30,
  maxLng: 80.75,
};

interface Velocity {
  lat: number;
  lng: number;
}

const RealMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const velocitiesRef = useRef<{ [key: string]: Velocity }>({});
  const animationRef = useRef<number | null>(null);

  const [mapboxToken, setMapboxToken] = useState(() => localStorage.getItem('mapbox_token') || '');
  const [isTokenSet, setIsTokenSet] = useState(() => !!localStorage.getItem('mapbox_token'));
  const [selectedThreatType, setSelectedThreatType] = useState<ThreatType>('unauthorized');
  const [isThreatPanelOpen, setIsThreatPanelOpen] = useState(false);

  const {
    usvs, ships, threats, restrictedZones,
    injectThreat, updateUSV, isRunning
  } = useSimulationStore();

  const handleSetToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken.trim());
      setIsTokenSet(true);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !isTokenSet) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [80.5, 13.0], // Bay of Bengal, Chennai coast
      zoom: 9,
      pitch: 30,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add restricted zones when style loads
    map.current.on('style.load', () => {
      restrictedZones.forEach(zone => {
        const coordinates = zone.coordinates.map(c => [c.lng, c.lat]);
        coordinates.push(coordinates[0]); // Close the polygon

        map.current?.addSource(`zone-${zone.id}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { name: zone.name },
            geometry: {
              type: 'Polygon',
              coordinates: [coordinates],
            },
          },
        });

        map.current?.addLayer({
          id: `zone-fill-${zone.id}`,
          type: 'fill',
          source: `zone-${zone.id}`,
          paint: {
            'fill-color': '#ef4444',
            'fill-opacity': 0.2,
          },
        });

        map.current?.addLayer({
          id: `zone-line-${zone.id}`,
          type: 'line',
          source: `zone-${zone.id}`,
          paint: {
            'line-color': '#dc2626',
            'line-width': 2,
            'line-dasharray': [2, 2],
          },
        });
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [isTokenSet, mapboxToken, restrictedZones]);

  // Handle map click for threat injection - uses ref to avoid stale closure
  const selectedThreatTypeRef = useRef(selectedThreatType);
  selectedThreatTypeRef.current = selectedThreatType;

  useEffect(() => {
    if (!map.current) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      // Use ref to get current threat type
      useSimulationStore.getState().injectThreat({ lat, lng }, selectedThreatTypeRef.current);
    };

    map.current.on('click', handleClick);

    return () => {
      map.current?.off('click', handleClick);
    };
  }, [isTokenSet]); // Only re-register when map is ready

  // Initialize USV velocities on mount
  useEffect(() => {
    const store = useSimulationStore.getState();
    store.usvs.forEach(usv => {
      if (!velocitiesRef.current[usv.id]) {
        velocitiesRef.current[usv.id] = {
          lat: (Math.random() - 0.5) * 0.5,
          lng: (Math.random() - 0.5) * 0.5,
        };
      }
    });
  }, []);

  // Animate USVs when simulation is running - smoother animation
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    animationRef.current = window.setInterval(() => {
      const store = useSimulationStore.getState();

      store.usvs.forEach(usv => {
        let vel = velocitiesRef.current[usv.id];
        if (!vel) {
          vel = { lat: (Math.random() - 0.5) * 0.5, lng: (Math.random() - 0.5) * 0.5 };
          velocitiesRef.current[usv.id] = vel;
        }

        // Calculate new position
        const step = 0.002;
        let newLat = usv.position.lat + vel.lat * step;
        let newLng = usv.position.lng + vel.lng * step;

        // Bounce off boundaries
        if (newLat <= MAP_BOUNDS.minLat || newLat >= MAP_BOUNDS.maxLat) {
          velocitiesRef.current[usv.id].lat *= -1;
          newLat = Math.max(MAP_BOUNDS.minLat + 0.02, Math.min(MAP_BOUNDS.maxLat - 0.02, newLat));
        }
        if (newLng <= MAP_BOUNDS.minLng || newLng >= MAP_BOUNDS.maxLng) {
          velocitiesRef.current[usv.id].lng *= -1;
          newLng = Math.max(MAP_BOUNDS.minLng + 0.02, Math.min(MAP_BOUNDS.maxLng - 0.02, newLng));
        }

        // Add slight random variation for natural movement
        velocitiesRef.current[usv.id].lat += (Math.random() - 0.5) * 0.02;
        velocitiesRef.current[usv.id].lng += (Math.random() - 0.5) * 0.02;

        // Clamp velocity
        const maxVel = 0.8;
        velocitiesRef.current[usv.id].lat = Math.max(-maxVel, Math.min(maxVel, velocitiesRef.current[usv.id].lat));
        velocitiesRef.current[usv.id].lng = Math.max(-maxVel, Math.min(maxVel, velocitiesRef.current[usv.id].lng));

        store.updateUSV(usv.id, { position: { lat: newLat, lng: newLng } });
      });
    }, 50);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isRunning]);

  // Update USV range circles and detection lines
  useEffect(() => {
    if (!map.current || !isTokenSet) return;

    const updateLayers = () => {
      if (!map.current?.isStyleLoaded()) return;

      // Update range circles for each USV
      usvs.forEach(usv => {
        const sourceId = `usv-range-${usv.id}`;
        const layerId = `usv-range-layer-${usv.id}`;

        // Create circle geometry using turf - 8km display radius
        const center = turf.point([usv.position.lng, usv.position.lat]);
        const displayRadius = 8; // 8km display radius
        const circle = turf.circle(center, displayRadius, { steps: 64, units: 'kilometers' });

        try {
          if (map.current?.getSource(sourceId)) {
            (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(circle);
            // Keep blue for patrolling, red only when alert
            map.current.setPaintProperty(layerId, 'fill-color', '#3b82f6');
            map.current.setPaintProperty(`${layerId}-outline`, 'line-color', '#2563eb');
          } else {
            map.current?.addSource(sourceId, {
              type: 'geojson',
              data: circle,
            });

            map.current?.addLayer({
              id: layerId,
              type: 'fill',
              source: sourceId,
              paint: {
                'fill-color': '#3b82f6',
                'fill-opacity': 0.08,
              },
            });

            map.current?.addLayer({
              id: `${layerId}-outline`,
              type: 'line',
              source: sourceId,
              paint: {
                'line-color': '#2563eb',
                'line-width': 2,
                'line-opacity': 0.5,
                'line-dasharray': [3, 3],
              },
            });
          }
        } catch (e) {
          // Layer might already exist
        }
      });

      // Update detection lines from USV to targeted threats
      usvs.forEach(usv => {
        const lineSourceId = `usv-detection-line-${usv.id}`;
        const lineLayerId = `usv-detection-line-layer-${usv.id}`;

        if (usv.targetThreatId) {
          const threat = threats.find(t => t.id === usv.targetThreatId);
          if (threat) {
            const lineData: GeoJSON.Feature<GeoJSON.LineString> = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [usv.position.lng, usv.position.lat],
                  [threat.position.lng, threat.position.lat],
                ],
              },
            };

            try {
              if (map.current?.getSource(lineSourceId)) {
                (map.current.getSource(lineSourceId) as mapboxgl.GeoJSONSource).setData(lineData);
              } else {
                map.current?.addSource(lineSourceId, {
                  type: 'geojson',
                  data: lineData,
                });

                map.current?.addLayer({
                  id: lineLayerId,
                  type: 'line',
                  source: lineSourceId,
                  paint: {
                    'line-color': '#ef4444',
                    'line-width': 4,
                    'line-opacity': 1,
                  },
                });
              }
            } catch (e) {
              // Layer might already exist
            }
          }
        } else {
          // Remove line if no target
          try {
            if (map.current?.getLayer(lineLayerId)) {
              map.current.removeLayer(lineLayerId);
            }
            if (map.current?.getSource(lineSourceId)) {
              map.current.removeSource(lineSourceId);
            }
          } catch (e) {
            // Ignore cleanup errors
          }
        }
      });
    };

    // Run immediately if style is loaded
    if (map.current.isStyleLoaded()) {
      updateLayers();
    }

    // Also listen for style load
    map.current.on('idle', updateLayers);

    return () => {
      map.current?.off('idle', updateLayers);
    };
  }, [usvs, threats, isTokenSet]);

  // Update USV markers
  useEffect(() => {
    if (!map.current || !isTokenSet) return;

    usvs.forEach(usv => {
      const isAlert = usv.status === 'Alert';
      const markerId = usv.id;

      if (markersRef.current[markerId]) {
        markersRef.current[markerId].setLngLat([usv.position.lng, usv.position.lat]);
        // Update marker element for alert state
        const el = markersRef.current[markerId].getElement();
        const innerDiv = el.querySelector('.usv-inner');
        const labelDiv = el.querySelector('.usv-label');
        if (innerDiv) {
          (innerDiv as HTMLElement).style.backgroundColor = isAlert ? '#ef4444' : '#3b82f6';
        }
        if (labelDiv) {
          (labelDiv as HTMLElement).style.backgroundColor = isAlert ? '#ef4444' : '#2563eb';
        }
      } else {
        const el = document.createElement('div');
        el.className = 'usv-marker';
        el.style.zIndex = '1000';
        el.innerHTML = `
          <div class="relative" style="z-index: 1000;">
            <div class="usv-inner" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); background-color: ${isAlert ? '#ef4444' : '#3b82f6'};">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L19 21H5L12 2Z"/>
              </svg>
            </div>
            <div class="usv-label" style="position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: bold; white-space: nowrap; padding: 2px 8px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); background-color: ${isAlert ? '#ef4444' : '#2563eb'}; color: white;">
              ${usv.id}
            </div>
          </div>
        `;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([usv.position.lng, usv.position.lat])
          .addTo(map.current!);

        markersRef.current[markerId] = marker;
      }
    });
  }, [usvs, isTokenSet]);

  // Update ship markers
  useEffect(() => {
    if (!map.current || !isTokenSet) return;

    const icons: Record<string, string> = { navy: '🚢', cargo: '📦', fishing: '🎣' };

    ships.forEach(ship => {
      const markerId = `ship-${ship.id}`;

      if (markersRef.current[markerId]) {
        markersRef.current[markerId].setLngLat([ship.position.lng, ship.position.lat]);
      } else {
        const el = document.createElement('div');
        el.className = 'ship-marker';
        el.innerHTML = `
          <div style="width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid ${ship.isAlerted ? '#f59e0b' : '#2563eb'}; background-color: ${ship.isAlerted ? '#fef3c7' : 'white'}; font-size: 16px;">
            ${icons[ship.type]}
          </div>
        `;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([ship.position.lng, ship.position.lat])
          .addTo(map.current!);

        markersRef.current[markerId] = marker;
      }
    });
  }, [ships, isTokenSet]);

  // Update threat markers and radius circles
  useEffect(() => {
    if (!map.current || !isTokenSet) return;

    // Clean up old threat markers that no longer exist
    Object.keys(markersRef.current).forEach(markerId => {
      if (markerId.startsWith('threat-')) {
        const threatId = markerId.replace('threat-', '');
        if (!threats.find(t => t.id === threatId)) {
          markersRef.current[markerId].remove();
          delete markersRef.current[markerId];
        }
      }
    });

    threats.forEach(threat => {
      const markerId = `threat-${threat.id}`;
      const radiusSourceId = `threat-radius-${threat.id}`;
      const radiusLayerId = `threat-radius-layer-${threat.id}`;

      // Create/update threat radius circle - RED circle
      if (map.current?.isStyleLoaded()) {
        const center = turf.point([threat.position.lng, threat.position.lat]);
        const threatRadius = 4; // 4km threat radius
        const circle = turf.circle(center, threatRadius, { steps: 64, units: 'kilometers' });

        if (map.current.getSource(radiusSourceId)) {
          (map.current.getSource(radiusSourceId) as mapboxgl.GeoJSONSource).setData(circle);
        } else {
          map.current.addSource(radiusSourceId, {
            type: 'geojson',
            data: circle,
          });

          map.current.addLayer({
            id: radiusLayerId,
            type: 'fill',
            source: radiusSourceId,
            paint: {
              'fill-color': '#ef4444',
              'fill-opacity': 0.2,
            },
          });

          map.current.addLayer({
            id: `${radiusLayerId}-outline`,
            type: 'line',
            source: radiusSourceId,
            paint: {
              'line-color': '#dc2626',
              'line-width': 2,
              'line-opacity': 0.8,
            },
          });
        }
      }

      // Create threat marker if not exists
      if (!markersRef.current[markerId]) {
        const el = document.createElement('div');
        el.className = 'threat-marker';
        el.innerHTML = `
          <div class="relative">
            <div style="width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid ${threat.detectedBy ? 'white' : '#fed7aa'}; background-color: ${threat.detectedBy ? '#ef4444' : '#fb923c'};">
              <span style="font-size: 20px;">${THREAT_ICONS[threat.type]}</span>
            </div>
            <div style="position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: bold; white-space: nowrap; padding: 4px 8px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); background-color: ${threat.detectedBy ? '#ef4444' : '#fb923c'}; color: white;">
              ${THREAT_LABELS[threat.type]}
            </div>
            <div style="position: absolute; inset: 0; width: 48px; height: 48px; border-radius: 50%; background-color: #ef4444; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.3;"></div>
          </div>
        `;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([threat.position.lng, threat.position.lat])
          .addTo(map.current!);

        markersRef.current[markerId] = marker;
      }
    });

    // Clean up threat radius layers for removed threats
    const existingThreatIds = new Set(threats.map(t => t.id));
    if (map.current?.isStyleLoaded()) {
      const style = map.current.getStyle();
      style?.layers?.forEach(layer => {
        if (layer.id.startsWith('threat-radius-layer-')) {
          const threatId = layer.id.replace('threat-radius-layer-', '').replace('-outline', '');
          if (!existingThreatIds.has(threatId)) {
            if (map.current?.getLayer(layer.id)) {
              map.current.removeLayer(layer.id);
            }
          }
        }
      });
      Object.keys(style?.sources || {}).forEach(sourceId => {
        if (sourceId.startsWith('threat-radius-')) {
          const threatId = sourceId.replace('threat-radius-', '');
          if (!existingThreatIds.has(threatId)) {
            if (map.current?.getSource(sourceId)) {
              // Remove layers first
              if (map.current.getLayer(`threat-radius-layer-${threatId}`)) {
                map.current.removeLayer(`threat-radius-layer-${threatId}`);
              }
              if (map.current.getLayer(`threat-radius-layer-${threatId}-outline`)) {
                map.current.removeLayer(`threat-radius-layer-${threatId}-outline`);
              }
              map.current.removeSource(sourceId);
            }
          }
        }
      });
    }
  }, [threats, isTokenSet]);

  if (!isTokenSet) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-cyan-500/20 rounded-full" />
        </div>

        {/* Main card */}
        <div className="relative z-10 bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-white/20">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Connect to Mapbox
          </h2>
          <p className="text-gray-500 text-center text-sm mb-6">
            Real-time maritime surveillance requires Mapbox
          </p>

          {/* Steps */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 mb-6 border border-blue-100">
            <div className="text-xs font-semibold text-blue-700 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">?</span>
              How to get your token
            </div>
            <ol className="text-xs text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">1</span>
                <span>Go to <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">mapbox.com</a> and create a free account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">2</span>
                <span>Navigate to <strong>Account → Tokens</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">3</span>
                <span>Copy your <strong>Default public token</strong></span>
              </li>
            </ol>
          </div>

          {/* Input */}
          <div className="relative mb-4">
            <input
              type="text"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="pk.eyJ1Ijoi..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleSetToken}
            disabled={!mapboxToken.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Load Maritime Map
          </button>

          {/* Footer note */}
          <p className="text-[10px] text-gray-400 text-center mt-4">
            Your token is stored locally and never shared
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-xl" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl p-4 shadow-xl border border-gray-100 z-10">
        <div className="text-xs font-bold text-gray-800 mb-3">Map Legend</div>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <span>USV Patrolling</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span>USV Alert</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🚢</span>
            <span>Navy Ship</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">📦</span>
            <span>Cargo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🎣</span>
            <span>Fishing</span>
          </div>
        </div>
      </div>

      {/* Threat Type Selector */}
      <div className="absolute bottom-4 right-4 z-10">
        {isThreatPanelOpen ? (
          <div className="bg-white/95 backdrop-blur rounded-xl p-3 shadow-xl border border-gray-100 animate-scale-in">
            <div className="text-xs font-bold text-gray-700 mb-2">Select Threat Type</div>
            <div className="flex flex-col gap-1.5">
              {THREAT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedThreatType(type);
                    setIsThreatPanelOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedThreatType === type
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{THREAT_ICONS[type]}</span>
                  <span>{THREAT_LABELS[type]}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsThreatPanelOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-all"
          >
            <span>{THREAT_ICONS[selectedThreatType]}</span>
            <span className="text-xs font-medium">{THREAT_LABELS[selectedThreatType]}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default RealMap;
