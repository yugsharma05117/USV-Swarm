import { useState, useEffect, useCallback, useRef } from 'react';
import { USV, DangerZone, SeaRoute, Position } from '@/types/usv';
import { useSimulationStore } from "@/store/simulationStore";



// Real coordinates for Arabian Sea / Indian Ocean region
const SEA_ROUTES: SeaRoute[] = [
  {
    id: 'route-1',
    name: 'Mumbai → Dubai',
    points: [
      { lat: 18.9220, lng: 72.8347 }, // Mumbai
      { lat: 19.5, lng: 68.0 },
      { lat: 21.0, lng: 63.0 },
      { lat: 23.5, lng: 58.0 },
      { lat: 25.2760, lng: 55.2962 }, // Dubai
    ],
    color: '#3b82f6',
  },
  {
    id: 'route-2',
    name: 'Chennai → Singapore',
    points: [
      { lat: 13.0827, lng: 80.2707 }, // Chennai
      { lat: 10.0, lng: 85.0 },
      { lat: 7.0, lng: 90.0 },
      { lat: 5.0, lng: 95.0 },
      { lat: 1.3521, lng: 103.8198 }, // Singapore
    ],
    color: '#10b981',
  },
  {
    id: 'route-3',
    name: 'Kochi → Jeddah',
    points: [
      { lat: 9.9312, lng: 76.2673 }, // Kochi
      { lat: 10.5, lng: 70.0 },
      { lat: 12.0, lng: 60.0 },
      { lat: 15.0, lng: 50.0 },
      { lat: 21.4858, lng: 39.1925 }, // Jeddah
    ],
    color: '#f59e0b',
  },
  {
    id: 'route-4',
    name: 'Colombo → Maldives',
    points: [
      { lat: 6.9271, lng: 79.8612 }, // Colombo
      { lat: 5.5, lng: 76.0 },
      { lat: 4.1755, lng: 73.5093 }, // Maldives
    ],
    color: '#8b5cf6',
  },
  {
    id: 'route-5',
    name: 'Gwadar → Aden',
    points: [
      { lat: 25.1216, lng: 62.3254 }, // Gwadar
      { lat: 22.0, lng: 60.0 },
      { lat: 18.0, lng: 55.0 },
      { lat: 14.0, lng: 50.0 },
      { lat: 12.7797, lng: 45.0187 }, // Aden
    ],
    color: '#ec4899',
  },
];

const DANGER_ZONES: DangerZone[] = [
  {
    id: 'dz-1',
    name: 'Gulf of Aden - Piracy Zone',
    center: { lat: 12.5, lng: 47.0 },
    radius: 150,
    type: 'piracy',
    threatLevel: 'high',
    icon: '🏴‍☠️',
  },
  {
    id: 'dz-2',
    name: 'Maldives Shallow Waters',
    center: { lat: 4.5, lng: 73.0 },
    radius: 80,
    type: 'navigation',
    threatLevel: 'medium',
    icon: '⚓',
  },
  {
    id: 'dz-3',
    name: 'Omani Military Zone',
    center: { lat: 20.0, lng: 58.5 },
    radius: 120,
    type: 'restricted',
    threatLevel: 'high',
    icon: '🎖️',
  },
  {
    id: 'dz-4',
    name: 'Arabian Sea Monsoon Zone',
    center: { lat: 15.0, lng: 65.0 },
    radius: 180,
    type: 'weather',
    threatLevel: 'medium',
    icon: '🌊',
  },
];

const COMMAND_SHIP_POSITION: Position = { lat: 15.0, lng: 72.0 };

// Generate USVs along routes
const generateUSVs = (): USV[] => {
  const usvNames = [
    'INS-VIKRANT',
    'MV-ARABIAN-STAR',
    'SS-OCEAN-GUARDIAN',
    'USV-SENTINEL',
    'HMS-PROTECTOR',
    'MV-SILK-ROUTE',
    'SS-MONSOON',
    'USV-NAVIGATOR',
    'MV-TRADE-WIND',
    'INS-KOLKATA',
  ];

  return usvNames.slice(0, 5).map((name, index) => {
    const route = SEA_ROUTES[index % SEA_ROUTES.length];
    const startPoint = route.points[0];
    return {
      id: `usv-${index + 1}`,
      name,
      position: { ...startPoint },
      targetPosition: route.points[1] || startPoint,
      route: route.points,
      routeIndex: 0,
      status: 'patrolling' as const,
      battery: 75 + Math.random() * 25,
      speed: 10 + Math.random() * 5,
      distanceCovered: Math.random() * 500,
      routeName: route.name,
    };
  });
};

// Haversine distance calculation (km)
const haversineDistance = (pos1: Position, pos2: Position): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180;
  const dLon = ((pos2.lng - pos1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1.lat * Math.PI) / 180) *
      Math.cos((pos2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export function useMapSimulation() {
  const [usvs, setUSVs] = useState<USV[]>(generateUSVs());
  const { addAlert, alerts } = useSimulationStore();
  const [isRunning, setIsRunning] = useState(true);
  const [startTime] = useState<Date>(new Date());
  const alertIdRef = useRef(0);
  const alertedUSVsRef = useRef<Set<string>>(new Set());

  const isInDangerZone = useCallback((position: Position): DangerZone | null => {
    for (const zone of DANGER_ZONES) {
      const distance = haversineDistance(position, zone.center);
      if (distance < zone.radius) {
        return zone;
      }
    }
    return null;
  }, []);

  const createAlert = useCallback((usv: USV, zone: DangerZone) => {
    const alertKey = `${usv.id}-${zone.id}`;
    if (alertedUSVsRef.current.has(alertKey)) return;
    
    alertedUSVsRef.current.add(alertKey);
    
    addAlert({
      usvId: usv.id,
      threatId: zone.id,
      affectedShips: [],
      message: `${usv.name} entered ${zone.name}!`,
    });
    
    // Clear alert after USV leaves zone (simulated)
    setTimeout(() => {
      alertedUSVsRef.current.delete(alertKey);
    }, 30000);
  }, []);

useEffect(() => {
  let interval;

  if (isRunning) {
    interval = setInterval(() => {
      setUSVs(prevUSVs =>
        prevUSVs.map(usv => {
          const target = usv.targetPosition;
          const dx = target.lng - usv.position.lng;
          const dy = target.lat - usv.position.lat;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let newPosition = { ...usv.position };
          let newTarget = { ...usv.targetPosition };
          let newRouteIndex = usv.routeIndex;
          let newStatus: USV['status'] = usv.status;

          const moveSpeed = 0.02;

          if (distance > 0.1) {
            newPosition = {
              lat: usv.position.lat + (dy / distance) * moveSpeed,
              lng: usv.position.lng + (dx / distance) * moveSpeed,
            };
          } else {
            newRouteIndex = (usv.routeIndex + 1) % usv.route.length;
            newTarget = usv.route[newRouteIndex];
          }

          // Danger zone check
          const zone = isInDangerZone(newPosition);

          if (zone) {
            if (usv.status !== 'alert') {
              createAlert(usv, zone);
            }
            newStatus = 'alert';
          } else {
            newStatus = 'patrolling';
          }

          const distanceKm = haversineDistance(usv.position, newPosition);

          return {
            ...usv,
            position: newPosition,
            targetPosition: newTarget,
            routeIndex: newRouteIndex,
            status: newStatus,
            distanceCovered: isRunning
              ? usv.distanceCovered + distanceKm
              : usv.distanceCovered,
            battery: isRunning
              ? Math.max(0, usv.battery - 0.001)
              : usv.battery,
          };
        })
      );
    }, 100);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [isRunning, isInDangerZone, createAlert]);

  const startSimulation = useCallback(() => setIsRunning(true), []);
  const stopSimulation = useCallback(() => setIsRunning(false), []);
  const resetSimulation = useCallback(() => {
    setUSVs(generateUSVs());
    alertedUSVsRef.current.clear();
    setIsRunning(true);
  }, []);

  const getSystemStats = useCallback(() => {
    const now = new Date();
    const uptimeMs = now.getTime() - startTime.getTime();
    const uptimeHours = uptimeMs / (1000 * 60 * 60);

    return {
      totalUSVs: usvs.length,
      activeAlerts: usvs.filter(u => u.status === 'alert').length,
      dangerZones: DANGER_ZONES.length,
      totalDistanceCovered: usvs.reduce((sum, u) => sum + u.distanceCovered, 0),
      systemUptime: uptimeHours,
      averageBattery: usvs.reduce((sum, u) => sum + u.battery, 0) / usvs.length,
    };
  }, [usvs, startTime]);

  return {
    usvs,
    dangerZones: DANGER_ZONES,
    seaRoutes: SEA_ROUTES,
    commandShip: COMMAND_SHIP_POSITION,
    alerts: alerts,
    isRunning,
    startSimulation,
    stopSimulation,
    resetSimulation,
    getSystemStats,
  };
}
