import { Navigation } from '@/components/layout/Navigation';
import { useMapSimulation } from '@/hooks/useMapSimulation';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

// Mock analytics data
const alertFrequencyData = [
  { time: '00:00', alerts: 2 },
  { time: '04:00', alerts: 5 },
  { time: '08:00', alerts: 8 },
  { time: '12:00', alerts: 12 },
  { time: '16:00', alerts: 7 },
  { time: '20:00', alerts: 4 },
  { time: 'Now', alerts: 6 },
];

const dangerZoneActivity = [
  { zone: 'Gulf of Aden', incidents: 15, patrols: 45 },
  { zone: 'Maldives Waters', incidents: 8, patrols: 38 },
  { zone: 'Omani Zone', incidents: 12, patrols: 52 },
  { zone: 'Arabian Sea', incidents: 6, patrols: 40 },
];

const usvPerformance = [
  { name: 'INS-VIKRANT', efficiency: 92, coverage: 85 },
  { name: 'MV-ARABIAN', efficiency: 87, coverage: 78 },
  { name: 'SS-OCEAN', efficiency: 78, coverage: 82 },
  { name: 'USV-SENTINEL', efficiency: 95, coverage: 90 },
  { name: 'HMS-PROTECTOR', efficiency: 81, coverage: 75 },
];

const routeUsageData = [
  { name: 'Mumbai-Dubai', value: 30 },
  { name: 'Chennai-Singapore', value: 25 },
  { name: 'Kochi-Jeddah', value: 20 },
  { name: 'Colombo-Maldives', value: 15 },
  { name: 'Gwadar-Aden', value: 10 },
];

const weeklyPatrolData = [
  { day: 'Mon', distance: 1200, alerts: 3 },
  { day: 'Tue', distance: 1450, alerts: 5 },
  { day: 'Wed', distance: 1350, alerts: 2 },
  { day: 'Thu', distance: 1600, alerts: 8 },
  { day: 'Fri', distance: 1550, alerts: 4 },
  { day: 'Sat', distance: 1800, alerts: 6 },
  { day: 'Sun', distance: 1700, alerts: 3 },
];

const COLORS = ['hsl(187, 85%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(270, 70%, 50%)'];

export default function Analytics() {
  const { alerts, getSystemStats } = useMapSimulation();
  const stats = getSystemStats();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground tracking-wider">
              🤖 AI-POWERED ANALYTICS
            </h1>
            <p className="text-muted-foreground mt-1">
              Advanced Machine Learning Insights for Maritime Safety
            </p>
          </div>

          {/* AI Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tactical-panel p-4"
            >
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-display font-bold text-sm text-foreground">Route Optimization</h3>
              <p className="text-2xl font-display font-bold text-primary mt-2">23.5%</p>
              <p className="text-xs text-muted-foreground mt-1">
                AI suggests route adjustments to reduce fuel and avoid danger zones
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="tactical-panel p-4"
            >
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-display font-bold text-sm text-foreground">Maintenance Alert</h3>
              <p className="text-2xl font-display font-bold text-warning mt-2">4 Days</p>
              <p className="text-xs text-muted-foreground mt-1">
                USV-SENTINEL requires maintenance based on battery patterns
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="tactical-panel p-4"
            >
              <div className="text-2xl mb-2">🌊</div>
              <h3 className="font-display font-bold text-sm text-foreground">Weather Risk</h3>
              <p className="text-2xl font-display font-bold text-destructive mt-2">High</p>
              <p className="text-xs text-muted-foreground mt-1">
                Storm predicted in Arabian Sea zone within 12 hours
              </p>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Alert Frequency Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tactical-panel p-4"
            >
              <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-4">
                📈 ALERT FREQUENCY (24H)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={alertFrequencyData}>
                    <defs>
                      <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                    <XAxis dataKey="time" stroke="hsl(215, 20%, 55%)" fontSize={10} tickLine={false} />
                    <YAxis stroke="hsl(215, 20%, 55%)" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 8%)',
                        border: '1px solid hsl(222, 30%, 18%)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area type="monotone" dataKey="alerts" stroke="hsl(38, 92%, 50%)" strokeWidth={2} fill="url(#alertGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Danger Zone Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="tactical-panel p-4"
            >
              <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-4">
                ⚠️ DANGER ZONE ACTIVITY
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dangerZoneActivity} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                    <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={10} />
                    <YAxis dataKey="zone" type="category" stroke="hsl(215, 20%, 55%)" fontSize={10} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 8%)',
                        border: '1px solid hsl(222, 30%, 18%)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="incidents" fill="hsl(0, 72%, 51%)" name="Incidents" radius={4} />
                    <Bar dataKey="patrols" fill="hsl(187, 85%, 53%)" name="Patrols" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* USV Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="tactical-panel p-4"
            >
              <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-4">
                🚢 USV PERFORMANCE METRICS
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usvPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                    <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={9} tickLine={false} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="hsl(215, 20%, 55%)" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 8%)',
                        border: '1px solid hsl(222, 30%, 18%)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="efficiency" fill="hsl(142, 71%, 45%)" name="Efficiency %" radius={4} />
                    <Bar dataKey="coverage" fill="hsl(187, 85%, 53%)" name="Coverage %" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Route Usage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="tactical-panel p-4"
            >
              <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-4">
                🛤️ ROUTE USAGE DISTRIBUTION
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={routeUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {routeUsageData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 8%)',
                        border: '1px solid hsl(222, 30%, 18%)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Weekly Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="tactical-panel p-4"
          >
            <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-4">
              📅 WEEKLY PATROL OVERVIEW
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyPatrolData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="day" stroke="hsl(215, 20%, 55%)" fontSize={11} />
                  <YAxis yAxisId="left" stroke="hsl(187, 85%, 53%)" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(38, 92%, 50%)" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 8%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="distance" stroke="hsl(187, 85%, 53%)" strokeWidth={2} dot={{ fill: 'hsl(187, 85%, 53%)', strokeWidth: 2 }} name="Distance (km)" />
                  <Line yAxisId="right" type="monotone" dataKey="alerts" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ fill: 'hsl(38, 92%, 50%)', strokeWidth: 2 }} name="Alerts" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Performance Report */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="tactical-panel p-4"
            >
              <h4 className="font-display font-bold text-sm mb-4">📊 Fleet Efficiency</h4>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Average Speed</span><span className="font-bold">11.8 knots</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Distance Covered</span><span className="font-bold">{stats.totalDistanceCovered.toFixed(0)} km</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Fuel Efficiency</span><span className="font-bold">87.2%</span></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="tactical-panel p-4"
            >
              <h4 className="font-display font-bold text-sm mb-4">⚠️ Safety Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Total Alerts (24h)</span><span className="font-bold text-warning">{alerts.length} alerts</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Critical Incidents</span><span className="font-bold">2 incidents</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Safety Score</span><span className="font-bold text-success">94.8 / 100</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
