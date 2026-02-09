import React, { useEffect, useState } from "react";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShoppingBag,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  Users,
  Briefcase,
  CalendarDays
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { useYear } from "@/context/YearContext";
import { fetcher } from "@/api/config";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrencyDT, formatDateFR } from "@/utils/formatters";
import { cn } from "@/lib/utils";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
  const { selectedYear } = useYear();
  const [summary, setSummary] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [s, m, c] = await Promise.all([
          fetcher(`/dashboard/summary?year=${selectedYear}`),
          fetcher(`/dashboard/monthly?year=${selectedYear}`),
          fetcher(`/dashboard/purchases-by-category?year=${selectedYear}`)
        ]);
        setSummary(s);
        setMonthlyData(m.map((d: any) => ({
          ...d,
          name: new Date(2000, d.month - 1).toLocaleString('fr-FR', { month: 'short' })
        })));
        setCategoryData(c);
      } catch (err) {
        // Fallback mock data
        setSummary({
          totalContractsHT: 125000,
          totalInvoicedHT: 78000,
          totalRemainingHT: 47000,
          totalPurchasesHT: 22000
        });
        setMonthlyData([
          { name: 'Jan', invoicedHT: 4000, purchasesHT: 1200 },
          { name: 'Fév', invoicedHT: 5500, purchasesHT: 1800 },
          { name: 'Mar', invoicedHT: 8000, purchasesHT: 2100 },
          { name: 'Avr', invoicedHT: 6000, purchasesHT: 1500 },
          { name: 'Mai', invoicedHT: 9500, purchasesHT: 3000 },
          { name: 'Juin', invoicedHT: 12000, purchasesHT: 4500 },
        ]);
        setCategoryData([
          { category: 'Matériel', amountHT: 12000 },
          { category: 'Déplacement', amountHT: 4500 },
          { category: 'Logiciels', amountHT: 3500 },
          { category: 'Divers', amountHT: 2000 },
        ]);
        setStatusData([
          { name: 'En cours', value: 12 },
          { name: 'Terminé', value: 8 },
          { name: 'En attente', value: 5 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500">Aperçu de la performance pour l'exercice {selectedYear}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Contrats (HT)" value={summary?.totalContractsHT || 0} icon={FileText} color="bg-indigo-500" description="Signés" />
        <KPICard title="Total Facturé (HT)" value={summary?.totalInvoicedHT || 0} icon={CheckCircle2} color="bg-emerald-500" description="Ventes" />
        <KPICard title="Reste à Facturer (HT)" value={summary?.totalRemainingHT || 0} icon={Clock} color="bg-amber-500" description="En attente" />
        <KPICard title="Total Achats (HT)" value={summary?.totalPurchasesHT || 0} icon={ShoppingBag} color="bg-rose-500" description="Dépenses" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              <CardTitle className="text-lg font-bold">Flux Mensuel (HT)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="invoicedHT" name="Facturé HT" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="purchasesHT" name="Achats HT" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <PieChartIcon size={18} className="text-primary" />
              <CardTitle className="text-lg font-bold">Statut des Projets</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              <CardTitle className="text-lg font-bold">Activité Récente</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {[
                { type: 'invoice', title: 'Facture FV-2026-012', project: 'Eclairage Avenue', amount: 4500, date_emission: '2026-03-15', date_payement: '2026-03-20' },
                { type: 'purchase', title: 'Nouvel achat : Bureau Vallée', project: 'Frais Généraux', amount: 120, date_emission: '2026-03-14' },
                { type: 'project', title: 'Nouveau projet signé : Audit STEG', project: 'Audit STEG', amount: 15000, date_emission: '2026-03-12' },
                { type: 'invoice', title: 'Facture FV-2026-011', project: 'Rénovation Pont', amount: 12000, date_emission: '2026-03-10', date_payement: null },
              ].map((item, i) => (
                <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    item.type === 'invoice' ? "bg-emerald-100 text-emerald-600" :
                    item.type === 'purchase' ? "bg-rose-100 text-rose-600" :
                    item.type === 'project' ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600"
                  )}>
                    {item.type === 'invoice' ? <FileText size={18} /> :
                     item.type === 'purchase' ? <ShoppingBag size={18} /> :
                     item.type === 'project' ? <Briefcase size={18} /> : <CheckCircle2 size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.project}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-sm font-bold text-slate-700">{formatCurrencyDT(item.amount)}</p>
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <CalendarDays size={10} /> Émise : {formatDateFR(item.date_emission)}
                      </p>
                      {item.type === 'invoice' && item.date_payement && (
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 size={10} /> Payée : {formatDateFR(item.date_payement)}
                        </p>
                      )}
                      {item.type === 'invoice' && !item.date_payement && (
                        <p className="text-[10px] text-amber-500 font-bold">En attente</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <CardTitle className="text-lg font-bold">Top Clients</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                { name: "Commune de Tunis", total: 85000, count: 4 },
                { name: "Ministère de l'Équipement", total: 62000, count: 2 },
                { name: "Société STEG", total: 45000, count: 3 },
              ].map((client, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                    {client.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-slate-800">{client.name}</span>
                      <span className="text-sm font-bold text-primary">{formatCurrencyDT(client.total)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">{client.count} projets</span>
                      <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(client.total / 100000) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;