import { Users, CreditCard, TrendingUp, TrendingDown, Unlock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { mockDashboardStats, revenueChartData, propertyTypeData, userGrowthData } from '@/data/mockData';

export default function AnalyticsPage() {
  const formatPrice = (value: number) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toString();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight">Analytiques</h1><p className="text-muted-foreground">Vue d'ensemble des performances</p></div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30days"><SelectTrigger className="w-40"><SelectValue placeholder="Période" /></SelectTrigger><SelectContent><SelectItem value="7days">7 derniers jours</SelectItem><SelectItem value="30days">30 derniers jours</SelectItem><SelectItem value="year">Cette année</SelectItem></SelectContent></Select>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exporter</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur border-border/50"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Revenus totaux</p><p className="text-2xl font-bold">{formatPrice(mockDashboardStats.totalRevenue)} GNF</p><div className="flex items-center gap-1 text-success text-sm mt-1"><TrendingUp className="h-3 w-3" /><span>+12.5%</span></div></div><div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center"><CreditCard className="h-6 w-6 text-success" /></div></div></CardContent></Card>
        <Card className="bg-card/80 backdrop-blur border-border/50"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Utilisateurs actifs</p><p className="text-2xl font-bold">{mockDashboardStats.totalUsers}</p><div className="flex items-center gap-1 text-success text-sm mt-1"><TrendingUp className="h-3 w-3" /><span>+8.3%</span></div></div><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="h-6 w-6 text-primary" /></div></div></CardContent></Card>
        <Card className="bg-card/80 backdrop-blur border-border/50"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total déblocages</p><p className="text-2xl font-bold">{mockDashboardStats.totalUnlocks}</p><div className="flex items-center gap-1 text-success text-sm mt-1"><TrendingUp className="h-3 w-3" /><span>+15.2%</span></div></div><div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center"><Unlock className="h-6 w-6 text-warning" /></div></div></CardContent></Card>
        <Card className="bg-card/80 backdrop-blur border-border/50"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Taux de conversion</p><p className="text-2xl font-bold">24.8%</p><div className="flex items-center gap-1 text-destructive text-sm mt-1"><TrendingDown className="h-3 w-3" /><span>-2.1%</span></div></div><div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center"><TrendingUp className="h-6 w-6 text-destructive" /></div></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card bg-card/80 backdrop-blur border-border/50"><CardHeader><CardTitle className="text-lg">Tendance des revenus</CardTitle></CardHeader><CardContent><div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueChartData}><defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={formatPrice} /><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(value: number) => [`${formatPrice(value)} GNF`, 'Revenus']} /><Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></CardContent></Card>
        <Card className="shadow-card bg-card/80 backdrop-blur border-border/50"><CardHeader><CardTitle className="text-lg">Croissance utilisateurs</CardTitle></CardHeader><CardContent><div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={userGrowthData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} /><Legend /><Bar dataKey="renters" name="Locataires" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} /><Bar dataKey="landlords" name="Propriétaires" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
      </div>

      <Card className="shadow-card bg-card/80 backdrop-blur border-border/50"><CardHeader><CardTitle className="text-lg">Types de propriétés</CardTitle></CardHeader><CardContent><div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={propertyTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">{propertyTypeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} /><Legend /></PieChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  );
}
