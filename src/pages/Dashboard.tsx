import { Navigation } from '@/components/layout/Navigation';
import { StatCard } from '@/components/dashboard/StatCard';
import { useMapSimulation } from '@/hooks/useMapSimulation';
import { 
  Ship, 
  AlertTriangle, 
  ShieldAlert, 
  Navigation as NavIcon, 
  Clock, 
  Battery,
  Activity,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { usvs, dangerZones, alerts, getSystemStats } = useMapSimulation();
  const stats = getSystemStats();

  const formatUptime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground tracking-wider">
              MISSION CONTROL
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring and fleet status overview
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Active USVs"
              value={stats.totalUSVs}
              subtitle="All units operational"
              icon={Ship}
              variant="success"
            />
            <StatCard
              title="Active Alerts"
              value={stats.activeAlerts}
              subtitle={stats.activeAlerts > 0 ? 'Requires attention' : 'All clear'}
              icon={AlertTriangle}
              variant={stats.activeAlerts > 0 ? 'warning' : 'default'}
            />
            <StatCard
              title="Danger Zones"
              value={stats.dangerZones}
              subtitle="Under surveillance"
              icon={ShieldAlert}
              variant="danger"
            />
            <StatCard
              title="Distance Covered"
              value={`${stats.totalDistanceCovered.toFixed(0)}`}
              subtitle="Kilometers"
              icon={NavIcon}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="System Uptime"
              value={formatUptime(stats.systemUptime)}
              subtitle="Since deployment"
              icon={Clock}
            />
            <StatCard
              title="Avg Battery"
              value={`${stats.averageBattery.toFixed(0)}%`}
              subtitle="Fleet average"
              icon={Battery}
              variant={stats.averageBattery < 50 ? 'warning' : 'success'}
            />
            <StatCard
              title="Total Alerts"
              value={alerts.length}
              subtitle="Logged events"
              icon={Activity}
            />
            <StatCard
              title="Patrol Zones"
              value="5"
              subtitle="Active coverage"
              icon={Target}
            />
          </div>

          {/* USV Fleet Table */}
          <div className="tactical-panel overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-display text-lg font-bold tracking-wider text-foreground">
                🚢 USV FLEET STATUS
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
                      USV ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
                      Speed
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
                      Battery
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
                      Distance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {usvs.map((usv, index) => (
                    <motion.tr
                      key={usv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${
                        usv.status === 'alert' ? 'bg-warning/5' : 'hover:bg-secondary/20'
                      } transition-colors`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🚢</span>
                          <span className="font-display font-bold text-sm text-foreground">
                            {usv.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                            usv.status === 'alert'
                              ? 'bg-warning/20 text-warning'
                              : 'bg-success/20 text-success'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              usv.status === 'alert'
                                ? 'bg-warning animate-pulse'
                                : 'bg-success'
                            }`}
                          />
                          {usv.status === 'alert' ? '⚠ ALERT' : '✓ SAFE'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {usv.routeName}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {usv.speed.toFixed(1)} knots
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                usv.battery > 50
                                  ? 'bg-success'
                                  : usv.battery > 20
                                  ? 'bg-warning'
                                  : 'bg-destructive'
                              }`}
                              style={{ width: `${usv.battery}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {usv.battery.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {usv.distanceCovered.toFixed(0)} km
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Danger Zones Table */}
          <div className="tactical-panel overflow-hidden mt-6">
            <div className="p-4 border-b border-border">
              <h2 className="font-display text-lg font-bold tracking-wider text-foreground">
                ⚠️ DANGER ZONES MONITORING
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
                      Zone Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
                      Radius (KM)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dangerZones.map((zone, index) => (
                    <motion.tr
                      key={zone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{zone.icon}</span>
                          <span className="font-medium text-sm text-foreground">
                            {zone.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground capitalize">
                        {zone.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {zone.radius.toFixed(1)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            zone.threatLevel === 'high'
                              ? 'bg-destructive/20 text-destructive'
                              : 'bg-success/20 text-success'
                          }`}
                        >
                          {zone.threatLevel === 'high' ? 'HIGH RISK' : 'CLEAR'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
