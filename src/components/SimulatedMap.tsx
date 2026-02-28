import { useEffect, useRef, useState } from 'react';
import { useSimulationStore, ThreatType, THREAT_LABELS, THREAT_ICONS } from '@/store/simulationStore';

const usvVelocities: { [key: string]: { vLat: number; vLng: number } } = {};

const THREAT_TYPES: ThreatType[] = ['illegal_fishing', 'smuggling', 'rescue', 'terror', 'unauthorized'];

const SimulatedMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedThreatType, setSelectedThreatType] = useState<ThreatType>('unauthorized');
  const [isThreatPanelOpen, setIsThreatPanelOpen] = useState(false);

  const {
    usvs, ships, threats, restrictedZones,
    isRunning, updateUSV, injectThreat
  } = useSimulationStore();

  const [mapBounds] = useState({
    minLat: 12.6,
    maxLat: 13.4,
    minLng: 80.2,
    maxLng: 80.8,
  });

  useEffect(() => {
    usvs.forEach(usv => {
      if (!usvVelocities[usv.id]) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.001 + Math.random() * 0.001;
        usvVelocities[usv.id] = {
          vLat: Math.sin(angle) * speed,
          vLng: Math.cos(angle) * speed,
        };
      }
    });
  }, [usvs]);

  const toPixel = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x, y };
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const lng = mapBounds.minLng + (x / 100) * (mapBounds.maxLng - mapBounds.minLng);
    const lat = mapBounds.maxLat - (y / 100) * (mapBounds.maxLat - mapBounds.minLat);

    injectThreat({ lat, lng }, selectedThreatType);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      usvs.forEach(usv => {
        const vel = usvVelocities[usv.id];
        if (!vel) return;

        if (Math.random() < 0.08) {
          const angleChange = (Math.random() - 0.5) * 0.6;
          const currentAngle = Math.atan2(vel.vLat, vel.vLng);
          const newAngle = currentAngle + angleChange;
          const speed = 0.0006 + Math.random() * 0.0006;
          vel.vLat = Math.sin(newAngle) * speed;
          vel.vLng = Math.cos(newAngle) * speed;
        }

        let newLat = usv.position.lat + vel.vLat;
        let newLng = usv.position.lng + vel.vLng;

        if (newLat < 12.7 || newLat > 13.3) {
          vel.vLat *= -1;
          newLat = Math.max(12.7, Math.min(13.3, newLat));
        }
        if (newLng < 80.28 || newLng > 80.72) {
          vel.vLng *= -1;
          newLng = Math.max(80.28, Math.min(80.72, newLng));
        }

        updateUSV(usv.id, { position: { lat: newLat, lng: newLng } });
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isRunning, usvs, updateUSV]);

  return (
    <div
      ref={mapRef}
      className="h-full w-full relative overflow-hidden cursor-crosshair rounded-xl shadow-inner"
      onClick={handleMapClick}
      style={{
        background: 'linear-gradient(180deg, #bfdbfe 0%, #93c5fd 25%, #60a5fa 50%, #3b82f6 100%)',
      }}
    >
      {/* Ocean waves effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.3) 60px, rgba(255,255,255,0.3) 62px)`,
        }} />
      </div>

      {/* Coordinate grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[0, 25, 50, 75, 100].map((y) => (
          <g key={`h${y}`}>
            <line x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#1e40af" strokeWidth="0.5" opacity="0.2" />
            <text x="8" y={`${y + 3}%`} fill="#1e3a8a" fontSize="10" fontWeight="500" opacity="0.8">
              {(mapBounds.maxLat - (y / 100) * (mapBounds.maxLat - mapBounds.minLat)).toFixed(2)}°N
            </text>
          </g>
        ))}
        {[0, 25, 50, 75, 100].map((x) => (
          <g key={`v${x}`}>
            <line x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#1e40af" strokeWidth="0.5" opacity="0.2" />
            <text x={`${x + 0.5}%`} y="97%" fill="#1e3a8a" fontSize="10" fontWeight="500" opacity="0.8">
              {(mapBounds.minLng + (x / 100) * (mapBounds.maxLng - mapBounds.minLng)).toFixed(2)}°E
            </text>
          </g>
        ))}
      </svg>

      {/* Indian Coastline */}
      <div className="absolute left-0 top-0 bottom-0 w-[10%] pointer-events-none"
           style={{ background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 60%, transparent 100%)' }}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-800 tracking-wider"
             style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          INDIA
        </div>
      </div>

      {/* Restricted Zones */}
      {restrictedZones.map(zone => {
        const topLeft = toPixel(zone.coordinates[0].lat, zone.coordinates[0].lng);
        const bottomRight = toPixel(zone.coordinates[2].lat, zone.coordinates[2].lng);
        const width = Math.abs(bottomRight.x - topLeft.x);
        const height = Math.abs(bottomRight.y - topLeft.y);

        return (
          <div
            key={zone.id}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: `${Math.min(topLeft.x, bottomRight.x)}%`,
              top: `${Math.min(topLeft.y, bottomRight.y)}%`,
              width: `${width}%`,
              height: `${height}%`,
              background: 'repeating-linear-gradient(45deg, rgba(239,68,68,0.15), rgba(239,68,68,0.15) 10px, rgba(239,68,68,0.25) 10px, rgba(239,68,68,0.25) 20px)',
              border: '2px dashed #dc2626',
              borderRadius: '8px',
            }}
          >
            <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-md border border-red-200">
              <span className="text-xs font-bold text-red-600">🚫 {zone.name}</span>
            </div>
          </div>
        );
      })}

      {/* Threats */}
      {threats.map(threat => {
        const pos = toPixel(threat.position.lat, threat.position.lng);
        const isDetected = !!threat.detectedBy;

        return (
          <div
            key={threat.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: 30 }}
          >
            {/* Pulse rings */}
            <div className="absolute w-32 h-32 -left-16 -top-16">
              <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping" style={{ animationDuration: '1.5s' }} />
              <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping" style={{ animationDelay: '0.5s', animationDuration: '1.5s' }} />
              <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping" style={{ animationDelay: '1s', animationDuration: '1.5s' }} />
            </div>
            {/* Threat marker */}
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-2 ${
                isDetected
                  ? 'bg-red-500 border-white'
                  : 'bg-orange-400 border-orange-200'
              }`}>
                <span className="text-white text-xl">{THREAT_ICONS[threat.type]}</span>
              </div>
              <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap ${
                isDetected
                  ? 'bg-red-500 text-white'
                  : 'bg-orange-400 text-white'
              }`}>
                {THREAT_LABELS[threat.type]}
              </div>
            </div>
          </div>
        );
      })}

      {/* USVs */}
      {usvs.map(usv => {
        const pos = toPixel(usv.position.lat, usv.position.lng);
        const isAlert = usv.status === 'Alert';

        const targetThreat = threats.find(t => t.id === usv.targetThreatId);
        const threatPos = targetThreat ? toPixel(targetThreat.position.lat, targetThreat.position.lng) : null;

        return (
          <div key={usv.id}>
            {/* Connection line to threat */}
            {threatPos && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 20 }}>
                <defs>
                  <linearGradient id={`line-${usv.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
                <line
                  x1={`${pos.x}%`}
                  y1={`${pos.y}%`}
                  x2={`${threatPos.x}%`}
                  y2={`${threatPos.y}%`}
                  stroke={`url(#line-${usv.id})`}
                  strokeWidth="3"
                  strokeDasharray="8,4"
                />
              </svg>
            )}

            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: 35 }}
            >
              {/* Range circle */}
              <div
                className={`absolute rounded-full border-2 pointer-events-none transition-all ${
                  isAlert ? 'border-red-400 bg-red-400/10' : 'border-blue-400 bg-blue-400/10'
                }`}
                style={{
                  width: '100px',
                  height: '100px',
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%',
                  borderStyle: 'dashed',
                }}
              />

              {/* USV body */}
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-xl transition-all ${
                  isAlert
                    ? 'bg-gradient-to-br from-red-500 to-red-600 border-white'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 border-white'
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L19 21H5L12 2Z"/>
                </svg>
              </div>

              {/* Alert pulse */}
              {isAlert && (
                <div className="absolute inset-0 w-10 h-10 rounded-full bg-red-500 animate-ping opacity-40" />
              )}

              {/* Label */}
              <div
                className={`absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] font-bold whitespace-nowrap px-2.5 py-1 rounded-full shadow-lg ${
                  isAlert ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                {usv.id}
              </div>
            </div>
          </div>
        );
      })}

      {/* Ships */}
      {ships.map(ship => {
        const pos = toPixel(ship.position.lat, ship.position.lng);
        const icons: Record<string, string> = { navy: '🚢', cargo: '📦', fishing: '🎣' };
        const colors: Record<string, string> = { navy: 'border-blue-600', cargo: 'border-violet-600', fishing: 'border-green-600' };

        return (
          <div
            key={ship.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: 25 }}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-lg border-2 text-lg ${
                ship.isAlerted ? 'bg-amber-100 border-amber-500' : `bg-white ${colors[ship.type]}`
              }`}
            >
              {icons[ship.type]}
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-gray-700 bg-white/90 px-1.5 rounded whitespace-nowrap shadow">
              {ship.name.split(' ').slice(-1)[0]}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl p-4 shadow-xl border border-gray-100">
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

      {/* Title */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-xl px-5 py-3 shadow-xl border border-gray-100">
        <div className="text-sm font-bold text-gray-800">Bay of Bengal</div>
        <div className="text-xs text-gray-500">Chennai Coastal Sector</div>
      </div>

      {/* Compass */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white/95 shadow-xl flex items-center justify-center border border-gray-100">
        <div className="absolute w-1 h-4 bg-red-500 top-1 rounded-full" />
        <span className="text-xs font-bold text-gray-800">N</span>
      </div>

      {/* Threat Type Selector */}
      <div className="absolute bottom-4 right-4">
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

export default SimulatedMap;
