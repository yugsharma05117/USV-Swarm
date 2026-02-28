import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import RealMap from '@/components/RealMap';
import SimulatedMap from '@/components/SimulatedMap';
import { useSimulationStore } from '@/store/simulationStore';
import { Play, Pause, RotateCcw, Map, Waves } from 'lucide-react';

const Index = () => {
  const [useRealMap, setUseRealMap] = useState(true);
  const { isRunning, startSimulation, pauseSimulation, resetSimulation, alerts, activeThreats, usvs } = useSimulationStore();


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16 h-screen relative">
        <div className="h-full w-full">
          {/* Map */}
          {useRealMap ? <RealMap /> : <SimulatedMap />}

          {/* Live Stats Panel */}
          <div className="absolute top-20 left-4 bg-white/95 backdrop-blur rounded-xl p-4 shadow-xl border border-gray-100 z-10">
            <div className="text-xs font-bold text-gray-800 mb-3">Live Stats</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-600">Active USVs</span>
                <span className="font-bold text-blue-600">{usvs.length}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-600">Active Threats</span>
                <span className="font-bold text-red-600">{activeThreats}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-600">Total Alerts</span>
                <span className="font-bold text-amber-600">{alerts.length}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-600">Status</span>
                <span className={`font-bold ${isRunning ? 'text-green-600' : 'text-gray-500'}`}>
                  {isRunning ? 'RUNNING' : 'PAUSED'}
                </span>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="absolute top-20 right-4 z-10 flex flex-col gap-2">
            {/* Map Toggle */}
            <div className="bg-white/95 backdrop-blur rounded-xl p-2 shadow-xl border border-gray-100 flex gap-1">
              <button
                onClick={() => setUseRealMap(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  useRealMap ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Map className="w-4 h-4" />
                Mapbox
              </button>
              <button
                onClick={() => setUseRealMap(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  !useRealMap ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Waves className="w-4 h-4" />
                Simulated
              </button>
            </div>

            {/* Simulation Controls */}
            <div className="bg-white/95 backdrop-blur rounded-xl p-2 shadow-xl border border-gray-100 flex gap-1">
              {isRunning ? (
                <button
                  onClick={pauseSimulation}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 transition-all"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={startSimulation}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition-all"
                >
                  <Play className="w-4 h-4" />
                  Start
                </button>
              )}
              <button
                onClick={resetSimulation}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Recent Alerts */}
          {alerts.length > 0 && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-500/95 backdrop-blur text-white rounded-xl px-4 py-2 shadow-xl z-10 max-w-md">
              <div className="text-xs font-bold mb-1">⚠️ Latest Alert</div>
              <div className="text-xs">{alerts[0].message}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
