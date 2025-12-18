import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Check,
  X,
  MapPin,
  Building,
  Home as HomeIcon,
  Briefcase,
  Store,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockHouses } from '@/data/mockData';
import { cn } from '@/lib/utils';

const propertyTypeIcons = {
  house: HomeIcon,
  apartment: Building,
  office: Briefcase,
  commercial: Store,
};

const propertyTypeLabels = {
  house: 'Maison',
  apartment: 'Appartement',
  office: 'Bureau',
  commercial: 'Commercial',
};

export default function PropertiesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');

  const filteredProperties = mockHouses.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || property.propertyType === typeFilter;
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesApproval =
      approvalFilter === 'all' ||
      (approvalFilter === 'approved' && property.isAccept) ||
      (approvalFilter === 'pending' && !property.isAccept);

    return matchesSearch && matchesType && matchesStatus && matchesApproval;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-GN').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      available: 'bg-success/20 text-success border-success/30',
      rented: 'bg-primary/20 text-primary border-primary/30',
      paused: 'bg-muted text-muted-foreground border-muted',
      high_demand: 'bg-warning/20 text-warning border-warning/30',
      taken: 'bg-destructive/20 text-destructive border-destructive/30',
      expired: 'bg-muted text-muted-foreground border-muted',
      booked: 'bg-primary/20 text-primary border-primary/30',
      occupied: 'bg-primary/20 text-primary border-primary/30',
      cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
    };

    const labels: Record<string, string> = {
      available: 'Disponible',
      rented: 'Loué',
      paused: 'En pause',
      high_demand: 'Haute demande',
      taken: 'Pris',
      expired: 'Expiré',
      booked: 'Réservé',
      occupied: 'Occupé',
      cancelled: 'Annulé',
    };

    return <Badge className={styles[status] || 'bg-muted'}>{labels[status] || status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Propriétés</h1>
          <p className="text-muted-foreground">
            Gérez les annonces immobilières de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" className="gradient-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{mockHouses.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Disponibles</p>
            <p className="text-2xl font-bold text-success">
              {mockHouses.filter((h) => h.status === 'available').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Loués</p>
            <p className="text-2xl font-bold text-primary">
              {mockHouses.filter((h) => h.status === 'rented').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-2xl font-bold text-warning">
              {mockHouses.filter((h) => !h.isAccept).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Haute demande</p>
            <p className="text-2xl font-bold">
              {mockHouses.filter((h) => h.status === 'high_demand').length}
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
                placeholder="Rechercher par titre ou adresse..."
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
                <SelectItem value="house">Maison</SelectItem>
                <SelectItem value="apartment">Appartement</SelectItem>
                <SelectItem value="office">Bureau</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="rented">Loué</SelectItem>
                <SelectItem value="paused">En pause</SelectItem>
                <SelectItem value="high_demand">Haute demande</SelectItem>
              </SelectContent>
            </Select>
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Approbation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
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
                <TableHead>Propriété</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Approbation</TableHead>
                <TableHead>Vues</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => {
                const TypeIcon = propertyTypeIcons[property.propertyType];
                return (
                  <TableRow key={property.id} className="hover:bg-secondary/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="h-12 w-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium line-clamp-1">{property.title}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {property.location.address}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {property.landlord && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={property.landlord.avatar} />
                            <AvatarFallback>
                              {property.landlord.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{property.landlord.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {propertyTypeLabels[property.propertyType]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-primary">
                        {formatPrice(property.price)} {property.currency}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(property.status)}</TableCell>
                    <TableCell>
                      {property.isAccept ? (
                        <Badge className="bg-success/20 text-success border-success/30">
                          <Check className="mr-1 h-3 w-3" />
                          Approuvé
                        </Badge>
                      ) : (
                        <Badge className="bg-warning/20 text-warning border-warning/30">
                          En attente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{property.popularity.views}</span>
                        <span className="text-muted-foreground"> vues</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/properties/${property.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          {!property.isAccept && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-success">
                                <Check className="mr-2 h-4 w-4" />
                                Approuver
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <X className="mr-2 h-4 w-4" />
                                Rejeter
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
