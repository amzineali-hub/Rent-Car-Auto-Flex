export default function InvoicesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Factures & Contrats</h1>
          <p className="text-slate-500 mt-1">Gérez vos documents légaux et financiers.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
        <p className="text-slate-500">Le module de facturation et de génération de contrats est disponible dans la version Premium.</p>
      </div>
    </div>
  );
}
