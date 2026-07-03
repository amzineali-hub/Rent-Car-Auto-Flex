import { useState } from 'react';
import { useStore } from '../lib/store';
import { Search, Plus, Filter, MoreVertical, Mail, Phone } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ClientsPage() {
  const { clients, currentAgency } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const agencyClients = clients.filter(c => c.agencyId === currentAgency?.id);

  const filteredClients = agencyClients.filter(client => 
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Clients</h1>
          <p className="text-slate-500 mt-1">Gérez votre base de clients.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium">
          <Plus size={18} />
          Nouveau client
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par nom ou CIN..." 
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
                <th className="px-6 py-4 font-medium">Nom complet</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">CIN</th>
                <th className="px-6 py-4 font-medium">Permis de conduire</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold font-serif">
                        {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                      </div>
                      <div className="font-semibold text-slate-900">{client.firstName} {client.lastName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <Phone size={14} className="text-slate-400" />
                        {client.phone}
                      </div>
                      {client.email && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Mail size={14} className="text-slate-400" />
                          {client.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-sm">{client.cin}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-sm">{client.driverLicense}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Aucun client trouvé.
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
