export interface Position {
  lat: number;
  lng: number;
}

export interface USV {
  id: string;
  name: string;
  position: Position;
  targetPosition: Position;
  route: Position[];
  routeIndex: number;
  status: 'safe' | 'alert' | 'patrolling';
  battery: number;
  speed: number;
  distanceCovered: number;
  routeName: string;
}

export interface DangerZone {
  id: string;
  name: string;
  center: Position;
  radius: number; // in km
  type: 'piracy' | 'weather' | 'restricted' | 'navigation' | 'congestion' | 'environmental';
  threatLevel: 'low' | 'medium' | 'high';
  icon: string;
}

export interface SeaRoute {
  id: string;
  name: string;
  points: Position[];
  color: string;
}

export interface Alert {
  id: string;
  usvId: string;
  usvName: string;
  zoneName: string;
  type: 'danger_zone_entry' | 'threat_detected' | 'low_battery';
  message: string;
  timestamp: Date;
  severity: 'warning' | 'critical';
}

export interface SystemStats {
  totalUSVs: number;
  activeAlerts: number;
  dangerZones: number;
  totalDistanceCovered: number;
  systemUptime: number;
  averageBattery: number;
}
