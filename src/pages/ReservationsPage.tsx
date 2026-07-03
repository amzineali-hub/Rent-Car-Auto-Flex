import { useState } from 'react';
import { useStore } from '../lib/store';
import { Search, Plus, Filter, MoreVertical, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ReservationsPage() {
  const { reservations, cars, clients, currentAgency } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-slate-100 text-slate-700';
      case 'cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'En cours';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const agencyReservations = reservations.filter(r => r.agencyId === currentAgency?.id);

  // Enhance reservations with car and client details for the view
  const detailedReservations = agencyReservations.map(res => {
    const car = cars.find(c => c.id === res.carId);
    const client = clients.find(c => c.id === res.clientId);
    return { ...res, car, client };
  });

  const filteredReservations = detailedReservations.filter(res => 
    res.car?.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
    res.client?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.client?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Réservations</h1>
          <p className="text-slate-500 mt-1">Suivez les locations de votre agence.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium">
          <Plus size={18} />
          Nouvelle réservation
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher une réservation..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">
            <Filter size={18} />
            Filtrer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Véhicule</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Période</th>
                <th className="px-6 py-4 font-medium">Montant</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReservations.map((res) => {
                const days = differenceInDays(new Date(res.endDate), new Date(res.startDate));
                return (
                  <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">#{res.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{res.car?.make} {res.car?.model}</div>
                      <div className="text-xs text-slate-500 font-mono">{res.car?.registrationPlate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{res.client?.firstName} {res.client?.lastName}</div>
                      <div className="text-xs text-slate-500">{res.client?.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-700 text-sm">
                          <CalendarIcon size={14} className="text-slate-400" />
                          {format(new Date(res.startDate), 'dd MMM yyyy', { locale: fr })}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Clock size={14} className="text-slate-400" />
                          {days} jours
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">{res.totalPrice} MAD</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full", getStatusColor(res.status))}>
                        {getStatusLabel(res.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredReservations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Aucune réservation trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
