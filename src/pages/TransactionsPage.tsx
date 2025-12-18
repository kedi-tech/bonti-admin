import { useState } from 'react';
import {
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockTransactions } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.user?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || tx.paymentMethod === methodFilter;

    return matchesSearch && matchesType && matchesStatus && matchesMethod;
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-GN').format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-success/20 text-success border-success/30',
      success: 'bg-success/20 text-success border-success/30',
      pending: 'bg-warning/20 text-warning border-warning/30',
      failed: 'bg-destructive/20 text-destructive border-destructive/30',
    };

    const labels: Record<string, string> = {
      completed: 'Complété',
      success: 'Succès',
      pending: 'En attente',
      failed: 'Échoué',
    };

    return <Badge className={styles[status] || 'bg-muted'}>{labels[status] || status}</Badge>;
  };

  const totalRevenue = mockTransactions
    .filter((tx) => tx.type === 'credit' && (tx.status === 'completed' || tx.status === 'success'))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalDebits = mockTransactions
    .filter((tx) => tx.type === 'debit' && (tx.status === 'completed' || tx.status === 'success'))
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Historique des paiements et transferts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total transactions</p>
            <p className="text-2xl font-bold">{mockTransactions.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Recharges</p>
            <p className="text-2xl font-bold text-success">
              {formatAmount(totalRevenue)} GNF
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Déblocages</p>
            <p className="text-2xl font-bold text-primary">
              {formatAmount(totalDebits)} GNF
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Échecs</p>
            <p className="text-2xl font-bold text-destructive">
              {mockTransactions.filter((tx) => tx.status === 'failed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ID, référence ou utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="credit">Crédit</SelectItem>
                <SelectItem value="debit">Débit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
                <SelectItem value="success">Succès</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="OM">Orange Money</SelectItem>
                <SelectItem value="DJOMY">Djomy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Transaction</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-10 w-10 rounded-full flex items-center justify-center',
                          tx.type === 'credit'
                            ? 'bg-success/10'
                            : 'bg-primary/10'
                        )}
                      >
                        {tx.type === 'credit' ? (
                          <ArrowDownLeft className="h-5 w-5 text-success" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {tx.type === 'credit' ? 'Recharge' : 'Déblocage'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.orderId}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tx.user && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={tx.user.avatar} />
                          <AvatarFallback>
                            {tx.user.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{tx.user.name}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'font-semibold',
                        tx.type === 'credit' ? 'text-success' : 'text-foreground'
                      )}
                    >
                      {tx.type === 'credit' ? '+' : '-'}
                      {formatAmount(tx.amount)} GNF
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {tx.paymentMethod === 'OM' ? 'Orange Money' : 'Djomy'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(tx.timestamp)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </DropdownMenuItem>
                        {tx.status === 'pending' && (
                          <DropdownMenuItem>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Vérifier statut
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
