import { useStore } from '../lib/store';
import { Users, Car, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const chartData = [
  { name: 'Lun', revenue: 4000 },
  { name: 'Mar', revenue: 3000 },
  { name: 'Mer', revenue: 2000 },
  { name: 'Jeu', revenue: 2780 },
  { name: 'Ven', revenue: 1890 },
  { name: 'Sam', revenue: 2390 },
  { name: 'Dim', revenue: 3490 },
];

export default function DashboardPage() {
  const { cars, clients, reservations, currentAgency } = useStore();

  const activeReservations = reservations.filter(r => r.agencyId === currentAgency?.id && r.status === 'active').length;
  const agencyReservations = reservations.filter(r => r.agencyId === currentAgency?.id);
  const totalRevenue = agencyReservations.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const agencyCars = cars.filter(c => c.agencyId === currentAgency?.id);
  const agencyClients = clients.filter(c => c.agencyId === currentAgency?.id);

  const stats = [
    { title: 'Réservations Actives', value: activeReservations, icon: Calendar, trend: '+12%', positive: true },
    { title: 'Total Véhicules', value: agencyCars.length, icon: Car, trend: '+2%', positive: true },
    { title: 'Total Clients', value: agencyClients.length, icon: Users, trend: '+18%', positive: true },
    { title: 'Chiffre d\'Affaires', value: `${totalRevenue} MAD`, icon: DollarSign, trend: '-4%', positive: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500 mt-1">Bienvenue sur votre espace de gestion Auto Flex.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <stat.icon size={24} className="text-slate-700" />
              </div>
              <div className={`flex items-center text-sm font-medium ${stat.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.positive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Évolution des Revenus</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Disponibilité du Parc</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600 font-medium">Disponibles</span>
              </div>
              <span className="font-bold text-slate-900">{agencyCars.filter(c => c.status === 'available').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-slate-600 font-medium">En Location</span>
              </div>
              <span className="font-bold text-slate-900">{agencyCars.filter(c => c.status === 'rented').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-slate-600 font-medium">En Maintenance</span>
              </div>
              <span className="font-bold text-slate-900">{agencyCars.filter(c => c.status === 'maintenance').length}</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Réservations Récentes</h3>
            <div className="space-y-4">
              {agencyReservations.slice(0,3).map(res => (
                <div key={res.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Réservation #{res.id}</p>
                    <p className="text-xs text-slate-500">{new Date(res.startDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
