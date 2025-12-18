import { Users, Home, CreditCard, Unlock, MessageSquare, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { PropertyTypeChart } from '@/components/dashboard/PropertyTypeChart';
import { UserGrowthChart } from '@/components/dashboard/UserGrowthChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { PendingApprovals } from '@/components/dashboard/PendingApprovals';
import { mockDashboardStats } from '@/data/mockData';

export default function Dashboard() {
  const stats = mockDashboardStats;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-GN').format(num);
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    return formatNumber(num);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur le panneau d'administration Bonti
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Utilisateurs"
          value={formatNumber(stats.totalUsers)}
          change={12.5}
          changeLabel="vs mois dernier"
          icon={Users}
          delay={0}
        />
        <StatsCard
          title="Propriétés"
          value={formatNumber(stats.totalProperties)}
          change={8.2}
          changeLabel="vs mois dernier"
          icon={Home}
          delay={50}
        />
        <StatsCard
          title="En attente"
          value={stats.pendingApproval}
          icon={Home}
          iconColor="text-warning"
          delay={100}
        />
        <StatsCard
          title="Revenus"
          value={`${formatCurrency(stats.totalRevenue)} GNF`}
          change={18.7}
          changeLabel="vs mois dernier"
          icon={TrendingUp}
          delay={150}
        />
        <StatsCard
          title="Déblocages"
          value={formatNumber(stats.totalUnlocks)}
          change={15.3}
          changeLabel="vs mois dernier"
          icon={Unlock}
          delay={200}
        />
        <StatsCard
          title="Chats Actifs"
          value={stats.activeChats}
          icon={MessageSquare}
          delay={250}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <UserGrowthChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PropertyTypeChart />
        <RecentActivity />
        <PendingApprovals />
      </div>
    </div>
  );
}
