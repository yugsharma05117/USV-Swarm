import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { USV, DangerZone, SeaRoute, Position } from '@/types/usv';

interface LeafletMapProps {
  usvs: USV[];
  dangerZones: DangerZone[];
  seaRoutes: SeaRoute[];
  commandShip: Position;
}

export function LeafletMap({ usvs, dangerZones, seaRoutes, commandShip }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const usvMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLinesRef = useRef<L.Polyline[]>([]);
  const dangerZonesRef = useRef<L.Circle[]>([]);
  const commandShipMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [15, 70], // Center on Arabian Sea
      zoom: 4,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark ocean tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Add sea routes
    seaRoutes.forEach(route => {
      const latLngs = route.points.map(p => [p.lat, p.lng] as L.LatLngTuple);
      const polyline = L.polyline(latLngs, {
        color: route.color,
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10',
      }).addTo(mapRef.current!);
      
      polyline.bindPopup(`<strong>${route.name}</strong>`);
      routeLinesRef.current.push(polyline);
    });

    // Add danger zones
    dangerZones.forEach(zone => {
      const circle = L.circle([zone.center.lat, zone.center.lng], {
        radius: zone.radius * 1000, // Convert km to meters
        color: zone.threatLevel === 'high' ? '#dc2626' : '#f59e0b',
        fillColor: zone.threatLevel === 'high' ? '#dc2626' : '#f59e0b',
        fillOpacity: 0.2,
        weight: 2,
        dashArray: '5, 5',
      }).addTo(mapRef.current!);

      circle.bindPopup(`
        <div style="text-align: center;">
          <span style="font-size: 24px;">${zone.icon}</span>
          <br><strong>${zone.name}</strong>
          <br><span style="color: ${zone.threatLevel === 'high' ? '#dc2626' : '#f59e0b'}">
            ${zone.threatLevel.toUpperCase()} RISK
          </span>
          <br>Radius: ${zone.radius} km
        </div>
      `);

      dangerZonesRef.current.push(circle);
    });

    // Add command ship
    const commandIcon = L.divIcon({
      html: `<div style="
        background: #10b981;
        border: 3px solid #34d399;
        border-radius: 8px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
      ">🎖️</div>`,
      className: 'command-ship-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    commandShipMarkerRef.current = L.marker([commandShip.lat, commandShip.lng], {
      icon: commandIcon,
    }).addTo(mapRef.current!);

    commandShipMarkerRef.current.bindPopup(`
      <div style="text-align: center;">
        <strong>🎖️ COMMAND SHIP</strong>
        <br>Central Monitoring Unit
        <br><span style="color: #10b981;">OPERATIONAL</span>
      </div>
    `);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update USV markers
  useEffect(() => {
    if (!mapRef.current) return;

    usvs.forEach(usv => {
      const existingMarker = usvMarkersRef.current.get(usv.id);
      
      const usvIcon = L.divIcon({
        html: `<div style="
          background: ${usv.status === 'alert' ? '#f59e0b' : '#3b82f6'};
          border: 2px solid ${usv.status === 'alert' ? '#fbbf24' : '#60a5fa'};
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 0 ${usv.status === 'alert' ? '15px rgba(245, 158, 11, 0.6)' : '10px rgba(59, 130, 246, 0.4)'};
          animation: ${usv.status === 'alert' ? 'pulse 1s infinite' : 'none'};
        ">🚢</div>`,
        className: 'usv-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      if (existingMarker) {
        existingMarker.setLatLng([usv.position.lat, usv.position.lng]);
        existingMarker.setIcon(usvIcon);
      } else {
        const marker = L.marker([usv.position.lat, usv.position.lng], {
          icon: usvIcon,
        }).addTo(mapRef.current!);

        marker.bindPopup(`
          <div style="text-align: center; min-width: 150px;">
            <strong>🚢 ${usv.name}</strong>
            <br>Route: ${usv.routeName}
            <br>Speed: ${usv.speed.toFixed(1)} knots
            <br>Battery: ${usv.battery.toFixed(0)}%
            <br>Status: <span style="color: ${usv.status === 'alert' ? '#f59e0b' : '#10b981'}">
              ${usv.status.toUpperCase()}
            </span>
          </div>
        `);

        usvMarkersRef.current.set(usv.id, marker);
      }
    });
  }, [usvs]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '500px' }}
    />
  );
}
