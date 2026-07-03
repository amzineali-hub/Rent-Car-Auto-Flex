import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Car, Users, Calendar, FileText, Home, LogOut, Menu, X, Settings, ShieldAlert } from 'lucide-react';
import { cn } from './lib/utils';
import DashboardPage from './pages/DashboardPage';
import CarsPage from './pages/CarsPage';
import ClientsPage from './pages/ClientsPage';
import ReservationsPage from './pages/ReservationsPage';
import SettingsPage from './pages/SettingsPage';
import InvoicesPage from './pages/InvoicesPage';

import { StoreProvider, useStore } from './lib/store';

function AgencySelector() {
  const { agencies, currentAgency, setCurrentAgency } = useStore();
  
  if (agencies.length === 0) return null;
  
  return (
    <div className="px-4 py-3 border-b border-slate-200">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Agence active</label>
      <select 
        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block p-2"
        value={currentAgency?.id || ''}
        onChange={(e) => {
          const found = agencies.find(a => a.id === e.target.value);
          if (found) setCurrentAgency(found);
        }}
      >
        {agencies.map(agency => (
          <option key={agency.id} value={agency.id}>{agency.name}</option>
        ))}
      </select>
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { name: 'Tableau de bord', path: '/', icon: Home },
    { name: 'Véhicules', path: '/cars', icon: Car },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Réservations', path: '/reservations', icon: Calendar },
    { name: 'Factures & Contrats', path: '/invoices', icon: FileText },
    { name: 'Paramètres', path: '/settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "bg-white border-r border-slate-200 h-screen transition-all duration-300 flex flex-col",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
        {!collapsed && <span className="font-serif font-bold text-xl text-slate-800 tracking-tight truncate">Auto Flex</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-md">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      
      {!collapsed && <AgencySelector />}

      
      <div className="flex-1 py-6 overflow-y-auto space-y-1 px-3">
        {links.map((link) => {
          const active = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
                active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <link.icon size={20} className={cn("shrink-0", active ? "text-white" : "text-slate-400")} />
              {!collapsed && <span className="font-medium text-sm">{link.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200">
        <button className={cn(
          "flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors",
          collapsed && "justify-center px-0"
        )}>
          <LogOut size={20} />
          {!collapsed && <span className="font-medium text-sm">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/cars" element={<CarsPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </StoreProvider>
  );
}
