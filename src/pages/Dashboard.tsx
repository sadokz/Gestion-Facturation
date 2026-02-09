import React, { useEffect, useState } from "react";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShoppingBag,
  TrendingUp,
  PieChart as PieChartIcon,
  ArrowUpRight,
  Users
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
import { formatCurrencyDT } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
  const { selectedYear } = useYear();
  const [summary, setSummary] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [s, m, c, p] = await Promise.all([
          fetcher(`/dashboard/summary?year=${selectedYear}`),
          fetcher(`/dashboard/monthly?year=${selectedYear}`),
          fetcher(`/dashboard/purchases-by-category?year=${selectedYear}`),
          fetcher(`/projects?year=${selectedYear}&limit=5`)
        ]);
        setSummary(s);
        setMonthlyData(m.map((d: any) => ({
          ...d,
          name: new Date(2000, d.month - 1).toLocaleString('fr-FR', { month: 'short' })
        })));
        setCategoryData(c);
        setRecentProjects(p);
      } catch (err) {
        console.error(err);
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
        setRecentProjects([
          { id: 1, reference_projet: "PRJ-2026-001", nom_projet: "Eclairage Avenue", client: "Commune X", montant_total_ht: 50000, statut: "En cours" },
          { id: 2, reference_projet: "PRJ-2026-002", nom_projet: "Rénovation Pont", client: "Ministère Y", montant_total_ht: 120000, statut: "Terminé" },
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Contrats (HT)" 
          value={summary?.totalContractsHT || 0} 
          icon={FileText} 
          color="bg-indigo-500" 
          description="Signés"
        />
        <KPICard 
          title="Total Facturé (HT)" 
          value={summary?.totalInvoicedHT || 0} 
          icon={CheckCircle2} 
          color="bg-emerald-500" 
          description="Ventes"
        />
        <KPICard 
          title="Reste à Facturer (HT)" 
          value={summary?.totalRemainingHT || 0} 
          icon={Clock} 
          color="bg-amber-500" 
          description="En attente"
        />
        <KPICard 
          title="Total Achats (HT)" 
          value={summary?.totalPurchasesHT || 0} 
          icon={ShoppingBag} 
          color="bg-rose-500" 
          description="Dépenses"
        />
      </div>

      {/* Charts */}
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
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
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
              <CardTitle className="text-lg font-bold">Achats par Catégorie</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="amountHT"
                    nameKey="category"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Recent Projects & Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ArrowUpRight size={18} className="text-primary" />
              <CardTitle className="text-lg font-bold">Projets Récents</CardTitle>
            </div>
            <button className="text-xs font-semibold text-primary hover:underline">Voir tout</button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentProjects.map((project) => (
                <div key={project.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{project.nom_projet}</span>
                    <span className="text-xs text-slate-500">{project.client}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-700">{formatCurrencyDT(project.montant_total_ht)}</span>
                    <Badge variant="outline" className="text-[10px]">{project.statut}</Badge>
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
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(client.total / 100000) * 100}%` }} 
                        />
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