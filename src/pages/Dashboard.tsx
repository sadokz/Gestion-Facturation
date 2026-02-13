import React, { useEffect, useState, useMemo } from "react";
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
  CalendarDays,
  ShieldCheck, 
  Banknote,    
  Wallet,
  GripVertical 
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { useYear } from "@/context/YearContext";
import { useDashboard } from "@/context/DashboardContext"; 
import { usePrivacy } from "@/context/PrivacyContext";
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
import { formatCurrencyDT, formatDateFR, computeTTC } from "@/utils/formatters";
import { cn } from "@/lib/utils";

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy, 
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const STATUS_COLORS = {
  'Payée': '#10b981',
  'En attente': '#a5b4fc',
  'Non facturée': '#94a3b8'
};

interface KpiCardData {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  valueKey: string; 
  preferenceKey: string; 
}

const ALL_KPI_DEFINITIONS: KpiCardData[] = [
  { id: "totalContractsHT", title: "Total Contrats (HT)", icon: FileText, color: "bg-indigo-500", description: "Signés", valueKey: "totalContractsHT", preferenceKey: "totalContractsHT" },
  { id: "totalInvoicedHT", title: "Total Facturé (HT)", icon: CheckCircle2, color: "bg-emerald-500", description: "Ventes", valueKey: "totalInvoicedHT", preferenceKey: "totalInvoicedHT" },
  { id: "totalRemainingHT", title: "Reste à Facturer (HT)", icon: Clock, color: "bg-amber-500", description: "En attente", valueKey: "totalRemainingHT", preferenceKey: "totalRemainingHT" },
  { id: "totalPurchasesHT", title: "Total Achats (HT)", icon: ShoppingBag, color: "bg-rose-500", description: "Dépenses", valueKey: "totalPurchasesHT", preferenceKey: "totalPurchasesHT" },
  { id: "totalCnssPaid", title: "Total Payé CNSS", icon: ShieldCheck, color: "bg-blue-600", description: "Cotisations", valueKey: "totalCnssPaid", preferenceKey: "showTotalCnssPaid" },
  { id: "totalSalaries", title: "Total Salaires", icon: Banknote, color: "bg-purple-600", description: "Charges", valueKey: "totalSalaries", preferenceKey: "showTotalSalaries" },
  { id: "totalRevenue", title: "Chiffre d'affaires", icon: TrendingUp, color: "bg-green-600", description: "Ventes + Autres", valueKey: "totalRevenue", preferenceKey: "showTotalRevenue" },
  { id: "totalProfit", title: "Bénéfice Total", icon: Wallet, color: "bg-teal-600", description: "Estimé", valueKey: "totalProfit", preferenceKey: "showTotalProfit" },
];

const SortableKPICard = ({ kpi, summary }: { kpi: KpiCardData; summary: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: kpi.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div {...attributes} {...listeners} className="absolute top-2 left-2 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors z-20">
        <GripVertical size={18} />
      </div>
      <KPICard title={kpi.title} value={summary?.[kpi.valueKey] || 0} icon={kpi.icon} color={kpi.color} description={kpi.description} />
    </div>
  );
};

const SortableSection = ({ id, width, children }: { id: string, width: string, children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1, opacity: isDragging ? 0.5 : 1 };

  const widthClass = {
    "25": "w-full lg:w-1/4",
    "50": "w-full lg:w-1/2",
    "75": "w-full lg:w-3/4",
    "100": "w-full"
  }[width] || "w-full lg:w-1/2";

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "relative group p-3",
        widthClass
      )}
    >
      <div {...attributes} {...listeners} className="absolute top-6 right-6 cursor-grab active:cursor-grabbing text-slate-300 hover:text-primary transition-colors z-20 opacity-0 group-hover:opacity-100">
        <GripVertical size={20} />
      </div>
      {children}
    </div>
  );
};

const Dashboard = () => {
  const { selectedYear } = useYear();
  const { preferences, kpiOrder, setKpiOrder, mainSectionOrder, setMainSectionOrder, sectionWidths } = useDashboard(); 
  const { isPrivate } = usePrivacy();
  const [summary, setSummary] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [s, m] = await Promise.all([
          fetcher(`/dashboard/summary?year=${selectedYear}`),
          fetcher(`/dashboard/monthly?year=${selectedYear}`)
        ]);
        setSummary(s);
        setMonthlyData(m.map((d: any) => ({
          ...d,
          name: d.month ? new Date(2000, d.month - 1).toLocaleString('fr-FR', { month: 'short' }) : '?',
          invoicedTTC: computeTTC(d.invoicedHT, 19),
          pendingInvoicedTTC: computeTTC(d.pendingInvoicedHT || (d.invoicedHT * 0.3), 19),
          purchasesTTC: computeTTC(d.purchasesHT, 19),
          salaries: d.salaries || (d.purchasesHT * 1.5)
        })));
        setStatusData([{ name: 'Payée', value: 15 }, { name: 'En attente', value: 7 }, { name: 'Non facturée', value: 3 }]);
      } catch (err) {
        setSummary({ totalContractsHT: 125000, totalInvoicedHT: 78000, totalRemainingHT: 47000, totalPurchasesHT: 22000, totalCnssPaid: 15000, totalSalaries: 45000, totalRevenue: 95000, totalProfit: 30000 });
        setMonthlyData([
          { name: 'Jan', invoicedTTC: computeTTC(4000, 19), pendingInvoicedTTC: computeTTC(1200, 19), purchasesTTC: computeTTC(1200, 19), salaries: 3500 },
          { name: 'Fév', invoicedTTC: computeTTC(5500, 19), pendingInvoicedTTC: computeTTC(2000, 19), purchasesTTC: computeTTC(1800, 19), salaries: 3500 },
          { name: 'Mar', invoicedTTC: computeTTC(8000, 19), pendingInvoicedTTC: computeTTC(3500, 19), purchasesTTC: computeTTC(2100, 19), salaries: 3800 },
          { name: 'Avr', invoicedTTC: computeTTC(6000, 19), pendingInvoicedTTC: computeTTC(1500, 19), purchasesTTC: computeTTC(1500, 19), salaries: 3800 },
          { name: 'Mai', invoicedTTC: computeTTC(9500, 19), pendingInvoicedTTC: computeTTC(4000, 19), purchasesTTC: computeTTC(3000, 19), salaries: 4000 },
          { name: 'Juin', invoicedTTC: computeTTC(12000, 19), pendingInvoicedTTC: computeTTC(5000, 19), purchasesTTC: computeTTC(4500, 19), salaries: 4200 },
        ]);
        setStatusData([{ name: 'Payée', value: 15 }, { name: 'En attente', value: 7 }, { name: 'Non facturée', value: 3 }]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedYear]);

  const handleKpiDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = kpiOrder.indexOf(active.id as string);
      const newIndex = kpiOrder.indexOf(over.id as string);
      setKpiOrder(arrayMove(kpiOrder, oldIndex, newIndex));
    }
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = mainSectionOrder.indexOf(active.id as string);
      const newIndex = mainSectionOrder.indexOf(over.id as string);
      setMainSectionOrder(arrayMove(mainSectionOrder, oldIndex, newIndex));
    }
  };

  const visibleKpis = useMemo(() => {
    const filteredKpis = ALL_KPI_DEFINITIONS.filter(kpi => preferences[kpi.preferenceKey as keyof typeof preferences]);
    return kpiOrder.map(id => filteredKpis.find(kpi => kpi.id === id)).filter(Boolean) as KpiCardData[];
  }, [preferences, kpiOrder]); 

  const renderSection = (id: string) => {
    const width = sectionWidths[id] || "50";
    
    switch (id) {
      case "monthlyFlux":
        return preferences.showMonthlyFlux && (
          <SortableSection id="monthlyFlux" key="monthlyFlux" width={width}>
            <Card className="border-none shadow-md overflow-hidden h-full">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary" />
                  <CardTitle className="text-lg font-bold">Flux Mensuel (TTC)</CardTitle>
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
                        formatter={(value: number) => isPrivate ? "*****" : formatCurrencyDT(value)} 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                        cursor={{ fill: '#f8fafc' }} 
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      {preferences.fluxShowInvoiced && <Bar dataKey="invoicedTTC" name="Facturé TTC" stackId="sales" fill={STATUS_COLORS['Payée']} barSize={30} />}
                      {preferences.fluxShowPending && <Bar dataKey="pendingInvoicedTTC" name="En attente TTC" stackId="sales" fill={STATUS_COLORS['En attente']} radius={[4, 4, 0, 0]} barSize={30} />}
                      {preferences.fluxShowPurchases && <Bar dataKey="purchasesTTC" name="Achats TTC" stackId="expenses" fill="#f43f5e" barSize={30} />}
                      {preferences.fluxShowSalaries && <Bar dataKey="salaries" name="Salaires" stackId="expenses" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </SortableSection>
        );
      case "projectStatus":
        return preferences.showProjectStatus && (
          <SortableSection id="projectStatus" key="projectStatus" width={width}>
            <Card className="border-none shadow-md overflow-hidden h-full">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <PieChartIcon size={18} className="text-primary" />
                  <CardTitle className="text-lg font-bold">Statut des Factures</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#cbd5e1'} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => isPrivate ? "*****" : value}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                      />
                      <Legend verticalAlign="bottom" iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </SortableSection>
        );
      case "recentActivity":
        return preferences.showRecentActivity && (
          <SortableSection id="recentActivity" key="recentActivity" width={width}>
            <Card className="border-none shadow-md overflow-hidden h-full">
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
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", item.type === 'invoice' ? "bg-emerald-100 text-emerald-600" : item.type === 'purchase' ? "bg-rose-100 text-rose-600" : item.type === 'project' ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600")}>
                        {item.type === 'invoice' ? <FileText size={18} /> : item.type === 'purchase' ? <ShoppingBag size={18} /> : item.type === 'project' ? <Briefcase size={18} /> : <CheckCircle2 size={18} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.project}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="text-sm font-bold text-slate-700">{isPrivate ? "*****" : formatCurrencyDT(item.amount)}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1"><CalendarDays size={10} /> {formatDateFR(item.date_emission)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </SortableSection>
        );
      case "topClients":
        return preferences.showTopClients && (
          <SortableSection id="topClients" key="topClients" width={width}>
            <Card className="border-none shadow-md overflow-hidden h-full">
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
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">{client.name.charAt(0)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-bold text-slate-800">{client.name}</span>
                          <span className="text-sm font-bold text-primary">{isPrivate ? "*****" : formatCurrencyDT(client.total)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(client.total / 100000) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </SortableSection>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] rounded-2xl" />
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleKpiDragEnd}>
        <SortableContext items={visibleKpis.map(kpi => kpi.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleKpis.map((kpi) => (
              <SortableKPICard key={kpi.id} kpi={kpi} summary={summary} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
        <SortableContext items={mainSectionOrder} strategy={verticalListSortingStrategy}>
          <div className="flex flex-wrap -m-3">
            {mainSectionOrder.map(id => renderSection(id))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Dashboard;