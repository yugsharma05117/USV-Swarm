import { create } from 'zustand';
import * as turf from '@turf/turf';

export interface Position {
  lat: number;
  lng: number;
}

export interface USV {
  id: string;
  name: string;
  position: Position;
  range: number; // km
  status: 'Patrolling' | 'Alert';
  speed: number;
  targetThreatId?: string;
}

export interface Ship {
  id: string;
  name: string;
  position: Position;
  heading: number;
  speed: number;
  type: 'navy' | 'cargo' | 'fishing';
  isAlerted: boolean;
}

export type ThreatType = 'illegal_fishing' | 'smuggling' | 'rescue' | 'terror' | 'unauthorized';

export const THREAT_LABELS: Record<ThreatType, string> = {
  illegal_fishing: 'Illegal Fishing',
  smuggling: 'Smuggling',
  rescue: 'Rescue Operation',
  terror: 'Terror Activity',
  unauthorized: 'Unauthorized Entry',
};

export const THREAT_ICONS: Record<ThreatType, string> = {
  illegal_fishing: '🎣',
  smuggling: '📦',
  rescue: '🆘',
  terror: '💣',
  unauthorized: '🚫',
};

export interface Threat {
  id: string;
  position: Position;
  radius: number;
  timestamp: Date;
  detectedBy?: string;
  type: ThreatType;
}

export interface Alert {
  id: string;
  timestamp: Date;
  usvId: string;
  threatId: string;
  affectedShips: string[];
  message: string;
}

export interface RestrictedZone {
  id: string;
  name: string;
  coordinates: Position[];
}

interface SimulationState {
  isRunning: boolean;

  usvs: USV[];
  ships: Ship[];
  threats: Threat[];
  alerts: Alert[];
  restrictedZones: RestrictedZone[];

  totalAlerts: number;
  activeThreats: number;

  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  updateUSV: (id: string, updates: Partial<USV>) => void;
  updateShip: (id: string, updates: Partial<Ship>) => void;
  injectThreat: (position?: Position, type?: ThreatType) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
}

// Indian coastline - Bay of Bengal / Chennai region
// INCREASED RANGE to 25-35km for better detection across the map
const initialUSVs: USV[] = [
  {
    id: 'USV-1',
    name: 'INS Guardian Alpha',
    position: { lat: 13.08, lng: 80.40 },
    range: 30,
    status: 'Patrolling',
    speed: 15,
  },
  {
    id: 'USV-2',
    name: 'INS Sentinel Beta',
    position: { lat: 12.85, lng: 80.50 },
    range: 28,
    status: 'Patrolling',
    speed: 18,
  },
  {
    id: 'USV-3',
    name: 'INS Watcher Gamma',
    position: { lat: 13.20, lng: 80.55 },
    range: 32,
    status: 'Patrolling',
    speed: 16,
  },
  {
    id: 'USV-4',
    name: 'INS Defender Delta',
    position: { lat: 12.75, lng: 80.42 },
    range: 28,
    status: 'Patrolling',
    speed: 17,
  },
  {
    id: 'USV-5',
    name: 'INS Scout Epsilon',
    position: { lat: 13.00, lng: 80.60 },
    range: 30,
    status: 'Patrolling',
    speed: 14,
  },
];

const initialShips: Ship[] = [
  {
    id: 'SHIP-1',
    name: 'INS Vikrant',
    position: { lat: 13.15, lng: 80.48 },
    heading: 225,
    speed: 12,
    type: 'navy',
    isAlerted: false,
  },
  {
    id: 'SHIP-2',
    name: 'MV Chennai Star',
    position: { lat: 12.78, lng: 80.58 },
    heading: 45,
    speed: 8,
    type: 'cargo',
    isAlerted: false,
  },
  {
    id: 'SHIP-3',
    name: 'FV Blue Marlin',
    position: { lat: 13.05, lng: 80.68 },
    heading: 180,
    speed: 5,
    type: 'fishing',
    isAlerted: false,
  },
  {
    id: 'SHIP-4',
    name: 'INS Kolkata',
    position: { lat: 12.92, lng: 80.35 },
    heading: 90,
    speed: 15,
    type: 'navy',
    isAlerted: false,
  },
];

const restrictedZones: RestrictedZone[] = [
  {
    id: 'RZ-1',
    name: 'Naval Base Alpha',
    coordinates: [
      { lat: 13.02, lng: 80.32 },
      { lat: 13.02, lng: 80.44 },
      { lat: 12.92, lng: 80.44 },
      { lat: 12.92, lng: 80.32 },
    ],
  },
  {
    id: 'RZ-2',
    name: 'Port Security Zone',
    coordinates: [
      { lat: 13.18, lng: 80.50 },
      { lat: 13.18, lng: 80.60 },
      { lat: 13.10, lng: 80.60 },
      { lat: 13.10, lng: 80.50 },
    ],
  },
];

// Helper function to calculate distance in km using turf.js
export const calculateDistance = (pos1: Position, pos2: Position): number => {
  const from = turf.point([pos1.lng, pos1.lat]);
  const to = turf.point([pos2.lng, pos2.lat]);
  return turf.distance(from, to, { units: 'kilometers' });
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  isRunning: false,
  usvs: initialUSVs,
  ships: initialShips,
  threats: [],
  alerts: [],
  restrictedZones,

  totalAlerts: 0,
  activeThreats: 0,

  startSimulation: () => set({ isRunning: true }),
  pauseSimulation: () => set({ isRunning: false }),

  resetSimulation: () => set({
    isRunning: false,
    usvs: initialUSVs.map(u => ({ ...u, status: 'Patrolling' as const, targetThreatId: undefined })),
    ships: initialShips.map(s => ({ ...s, isAlerted: false })),
    threats: [],
    alerts: [],
    totalAlerts: 0,
    activeThreats: 0,
  }),

  updateUSV: (id, updates) => set((state) => ({
    usvs: state.usvs.map((usv) =>
      usv.id === id ? { ...usv, ...updates } : usv
    ),
  })),

  updateShip: (id, updates) => set((state) => ({
    ships: state.ships.map((ship) =>
      ship.id === id ? { ...ship, ...updates } : ship
    ),
  })),

  injectThreat: (position, type = 'unauthorized') => {
    const state = get();

    // Random position in ocean area if not provided
    const threatPos = position || {
      lat: 12.80 + Math.random() * 0.35,
      lng: 80.38 + Math.random() * 0.28,
    };

    const newThreat: Threat = {
      id: `THREAT-${Date.now()}`,
      position: threatPos,
      radius: 7,
      timestamp: new Date(),
      type,
    };

    // Find the nearest USV that can detect this threat
    // Detection range is the USV's range (25-35km)
    let nearestUSV: USV | null = null;
    let minDistance = Infinity;

    state.usvs.forEach(usv => {
      const distance = calculateDistance(usv.position, threatPos);
      // USV can detect if threat is within its range
      if (distance <= usv.range && distance < minDistance) {
        minDistance = distance;
        nearestUSV = usv;
      }
    });

    // If no USV in range, find the closest one anyway and alert it
    if (!nearestUSV) {
      state.usvs.forEach(usv => {
        const distance = calculateDistance(usv.position, threatPos);
        if (distance < minDistance) {
          minDistance = distance;
          nearestUSV = usv;
        }
      });
    }

    // Find affected ships within 25km of threat
    const affectedShipIds: string[] = [];
    state.ships.forEach(ship => {
      const distance = calculateDistance(ship.position, threatPos);
      if (distance < 25) {
        affectedShipIds.push(ship.id);
      }
    });

    if (nearestUSV) {
      const detectedThreat = { ...newThreat, detectedBy: nearestUSV.id };

      set({
        threats: [...state.threats, detectedThreat],
        activeThreats: state.activeThreats + 1,
        usvs: state.usvs.map(usv =>
          usv.id === nearestUSV!.id
            ? { ...usv, status: 'Alert' as const, targetThreatId: newThreat.id }
            : usv
        ),
        ships: state.ships.map(ship =>
          affectedShipIds.includes(ship.id)
            ? { ...ship, isAlerted: true }
            : ship
        ),
        alerts: [
          {
            id: `ALERT-${Date.now()}`,
            timestamp: new Date(),
            usvId: nearestUSV.id,
            threatId: newThreat.id,
            affectedShips: affectedShipIds,
            message: `${THREAT_LABELS[type]} at (${threatPos.lat.toFixed(3)}°N, ${threatPos.lng.toFixed(3)}°E) detected by ${nearestUSV.id}`,
          },
          ...state.alerts,
        ].slice(0, 50),
        totalAlerts: state.totalAlerts + 1,
      });
    } else {
      // No USV in range - threat appears but undetected (shown differently)
      set({
        threats: [...state.threats, newThreat],
        activeThreats: state.activeThreats + 1,
      });
    }
  },

  addAlert: (alert) => set((state) => ({
    alerts: [
      {
        ...alert,
        id: `ALERT-${Date.now()}`,
        timestamp: new Date(),
      },
      ...state.alerts,
    ].slice(0, 50),
    totalAlerts: state.totalAlerts + 1,
  })),
}));
