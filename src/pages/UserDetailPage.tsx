import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Edit,
  Ban,
  Trash2,
  CheckCircle,
  Home,
  CreditCard,
  MessageSquare,
  Clock,
  Unlock,
  Eye,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { mockUsers, mockHouses, mockTransactions } from '@/data/mockData';

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const user = mockUsers.find((u) => u.id === id);
  
  // Get user's properties (if landlord)
  const userProperties = mockHouses.filter((h) => h.landlordId === id);
  
  // Get user's transactions
  const userTransactions = mockTransactions.filter((t) => t.userId === id);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Utilisateur non trouvé</h2>
        <Button onClick={() => navigate('/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux utilisateurs
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-GN').format(price);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/20 text-success border-success/30">Actif</Badge>;
      case 'suspended':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Suspendu</Badge>;
      case 'banned':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Banni</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getTransactionStatusBadge = (status: string) => {
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
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const handleSuspend = () => {
    toast({
      title: 'Utilisateur suspendu',
      description: `${user.name} a été suspendu avec succès.`,
      variant: 'destructive',
    });
    setShowSuspendDialog(false);
  };

  const handleActivate = () => {
    toast({
      title: 'Utilisateur activé',
      description: `${user.name} a été réactivé avec succès.`,
    });
    setShowActivateDialog(false);
  };

  const handleDelete = () => {
    toast({
      title: 'Utilisateur supprimé',
      description: `${user.name} a été supprimé définitivement.`,
      variant: 'destructive',
    });
    setShowDeleteDialog(false);
    navigate('/users');
  };

  // Mock activity timeline
  const activityTimeline = [
    { type: 'login', description: 'Connexion depuis mobile', date: '2024-12-14T10:30:00Z' },
    { type: 'transaction', description: 'Recharge portefeuille - 50,000 GNF', date: '2024-12-14T09:15:00Z' },
    { type: 'unlock', description: 'Déblocage - Villa Moderne à Kipé', date: '2024-12-13T16:45:00Z' },
    { type: 'message', description: 'Message envoyé à Mamadou Diallo', date: '2024-12-13T14:20:00Z' },
    { type: 'login', description: 'Connexion depuis web', date: '2024-12-12T11:00:00Z' },
    { type: 'profile', description: 'Mise à jour du profil', date: '2024-12-10T08:30:00Z' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <User className="h-4 w-4" />;
      case 'transaction':
        return <CreditCard className="h-4 w-4" />;
      case 'unlock':
        return <Unlock className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'profile':
        return <Edit className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Calculate stats
  const totalSpent = userTransactions
    .filter((t) => t.type === 'debit' && (t.status === 'completed' || t.status === 'success'))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDeposited = userTransactions
    .filter((t) => t.type === 'credit' && (t.status === 'completed' || t.status === 'success'))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-lg">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge(user.status)}
                {user.roles.includes('landlord') && (
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    Propriétaire
                  </Badge>
                )}
                {user.roles.includes('renter') && (
                  <Badge variant="outline" className="border-muted-foreground/50">
                    Locataire
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          {user.status === 'suspended' ? (
            <Button
              size="sm"
              onClick={() => setShowActivateDialog(true)}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Réactiver
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSuspendDialog(true)}
              className="border-warning text-warning hover:bg-warning/10"
            >
              <Ban className="mr-2 h-4 w-4" />
              Suspendre
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Inscrit le</p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                  <p className="font-medium">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.roles.includes('landlord') && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Home className="h-4 w-4" />
                      <span>Propriétés</span>
                    </div>
                    <span className="font-semibold">{userProperties.length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>Vues totales</span>
                    </div>
                    <span className="font-semibold">
                      {userProperties.reduce((sum, p) => sum + p.popularity.views, 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Unlock className="h-4 w-4" />
                      <span>Déblocages</span>
                    </div>
                    <span className="font-semibold">
                      {userProperties.reduce((sum, p) => sum + p.popularity.unlocks, 0)}
                    </span>
                  </div>
                  {user.roles.includes('renter') && <Separator />}
                </>
              )}
              {user.roles.includes('renter') && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Unlock className="h-4 w-4" />
                      <span>Propriétés débloquées</span>
                    </div>
                    <span className="font-semibold">12</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>Total déposé</span>
                    </div>
                    <span className="font-semibold text-success">
                      {formatPrice(totalDeposited)} GNF
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span>Total dépensé</span>
                    </div>
                    <span className="font-semibold">
                      {formatPrice(totalSpent)} GNF
                    </span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>Conversations</span>
                </div>
                <span className="font-semibold">8</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activité</TabsTrigger>
              <TabsTrigger value="properties">
                {user.roles.includes('landlord') ? 'Propriétés' : 'Débloquées'}
              </TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityTimeline.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(activity.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Properties Tab */}
            <TabsContent value="properties">
              <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {user.roles.includes('landlord') ? 'Propriétés listées' : 'Propriétés débloquées'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userProperties.length > 0 ? (
                    <div className="space-y-4">
                      {userProperties.map((property) => (
                        <div
                          key={property.id}
                          className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/properties/${property.id}`)}
                        >
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-16 h-12 rounded-md object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{property.title}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {property.location.address}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              {formatPrice(property.price)} {property.currency}
                            </p>
                            <Badge
                              variant="outline"
                              className={
                                property.status === 'available'
                                  ? 'border-success/50 text-success'
                                  : ''
                              }
                            >
                              {property.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune propriété</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions">
              <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Historique des transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {userTransactions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Type</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userTransactions.map((transaction) => (
                          <TableRow key={transaction.id} className="hover:bg-secondary/30">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {transaction.type === 'credit' ? (
                                  <TrendingUp className="h-4 w-4 text-success" />
                                ) : (
                                  <CreditCard className="h-4 w-4 text-primary" />
                                )}
                                <span className="capitalize">
                                  {transaction.type === 'credit' ? 'Crédit' : 'Débit'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell
                              className={
                                transaction.type === 'credit'
                                  ? 'text-success font-medium'
                                  : 'font-medium'
                              }
                            >
                              {transaction.type === 'credit' ? '+' : '-'}
                              {formatPrice(transaction.amount)} GNF
                            </TableCell>
                            <TableCell>
                              {getTransactionStatusBadge(transaction.status)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatShortDate(transaction.timestamp)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune transaction</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Suspend Dialog */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Suspendre l'utilisateur
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir suspendre <strong>{user.name}</strong> ? 
              L'utilisateur ne pourra plus accéder à son compte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspend}
              className="bg-warning hover:bg-warning/90 text-warning-foreground"
            >
              Suspendre
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Dialog */}
      <AlertDialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Réactiver l'utilisateur
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir réactiver <strong>{user.name}</strong> ? 
              L'utilisateur pourra à nouveau accéder à son compte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActivate}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              Réactiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Supprimer l'utilisateur
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données de <strong>{user.name}</strong> seront 
              définitivement supprimées, y compris ses propriétés, transactions et messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
