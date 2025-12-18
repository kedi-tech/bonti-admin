import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Eye,
  Unlock,
  Heart,
  Calendar,
  User,
  Phone,
  Mail,
  Check,
  X,
  Edit,
  Trash2,
  Building,
  Home as HomeIcon,
  Briefcase,
  Store,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
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

const statusLabels: Record<string, string> = {
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

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const property = mockHouses.find((h) => h.id === id);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Propriété non trouvée</h2>
        <Button onClick={() => navigate('/properties')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux propriétés
        </Button>
      </div>
    );
  }

  const TypeIcon = propertyTypeIcons[property.propertyType];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-GN').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    };
    return <Badge className={styles[status] || 'bg-muted'}>{statusLabels[status] || status}</Badge>;
  };

  const handleApprove = () => {
    toast({
      title: 'Propriété approuvée',
      description: `"${property.title}" a été approuvée avec succès.`,
    });
    setShowApproveDialog(false);
  };

  const handleReject = () => {
    toast({
      title: 'Propriété rejetée',
      description: `"${property.title}" a été rejetée.`,
      variant: 'destructive',
    });
    setShowRejectDialog(false);
    setRejectReason('');
  };

  const handleDelete = () => {
    toast({
      title: 'Propriété supprimée',
      description: `"${property.title}" a été supprimée définitivement.`,
      variant: 'destructive',
    });
    setShowDeleteDialog(false);
    navigate('/properties');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  // Generate map URL for the location
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${property.location.longitude - 0.01},${property.location.latitude - 0.01},${property.location.longitude + 0.01},${property.location.latitude + 0.01}&layer=mapnik&marker=${property.location.latitude},${property.location.longitude}`;
  const mapLinkUrl = `https://www.openstreetmap.org/?mlat=${property.location.latitude}&mlon=${property.location.longitude}#map=15/${property.location.latitude}/${property.location.longitude}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/properties')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{property.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{property.location.address}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!property.isAccept && (
            <>
              <Button
                onClick={() => setShowApproveDialog(true)}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <Check className="mr-2 h-4 w-4" />
                Approuver
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(true)}
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                <X className="mr-2 h-4 w-4" />
                Rejeter
              </Button>
            </>
          )}
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="shadow-card bg-card/80 backdrop-blur border-border/50 overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={property.images[currentImageIndex]}
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {property.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all',
                          index === currentImageIndex
                            ? 'bg-primary w-4'
                            : 'bg-foreground/50 hover:bg-foreground/70'
                        )}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                {getStatusBadge(property.status)}
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
              </div>
            </div>
            {property.images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    className={cn(
                      'flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all',
                      index === currentImageIndex
                        ? 'border-primary'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Description */}
          <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </CardContent>
          </Card>

          {/* Location Map */}
          <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Localisation</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a href={mapLinkUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ouvrir la carte
                </a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden border border-border">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location Map"
                />
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.location.address}</span>
                <span className="text-xs">
                  ({property.location.latitude.toFixed(4)}, {property.location.longitude.toFixed(4)})
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Price & Type */}
          <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {formatPrice(property.price)} {property.currency}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TypeIcon className="h-5 w-5" />
                <span>{propertyTypeLabels[property.propertyType]}</span>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>Vues</span>
                </div>
                <span className="font-semibold">{property.popularity.views}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Unlock className="h-4 w-4" />
                  <span>Déblocages</span>
                </div>
                <span className="font-semibold">{property.popularity.unlocks}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>Favoris</span>
                </div>
                <span className="font-semibold">{property.popularity.watchlists}</span>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between mb-1">
                  <span>7 derniers jours:</span>
                  <span className="font-medium text-foreground">
                    {property.demandTracking.unlocksInLast7Days} déblocages
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>30 derniers jours:</span>
                  <span className="font-medium text-foreground">
                    {property.demandTracking.unlocksInLast30Days} déblocages
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Landlord Info */}
          {property.landlord && (
            <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Propriétaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={property.landlord.avatar} />
                    <AvatarFallback>
                      {property.landlord.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{property.landlord.name}</p>
                    <Badge variant="outline" className="text-xs">
                      Propriétaire
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {property.landlord.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{property.landlord.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{property.landlord.phone}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate(`/users/${property.landlord?.id}`)}>
                  <User className="mr-2 h-4 w-4" />
                  Voir le profil
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Dates */}
          <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Créé le:</span>
                <span className="ml-auto">{formatDate(property.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Mis à jour:</span>
                <span className="ml-auto">{formatDate(property.updatedAt)}</span>
              </div>
              {property.expiresAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Expire le:</span>
                  <span className="ml-auto">{formatDate(property.expiresAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rental Confirmation */}
          {property.rentalConfirmation && (
            <Card className="shadow-card bg-card/80 backdrop-blur border-border/50 border-primary/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-success" />
                  Location confirmée
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confirmé le:</span>
                  <span>{formatDate(property.rentalConfirmation.confirmedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SMS vérifié:</span>
                  <span>
                    {property.rentalConfirmation.smsVerified ? (
                      <Badge className="bg-success/20 text-success">Oui</Badge>
                    ) : (
                      <Badge variant="secondary">Non</Badge>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Approuver cette propriété ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point d'approuver "{property.title}". Cette propriété sera visible par tous les utilisateurs de la plateforme.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              <Check className="mr-2 h-4 w-4" />
              Approuver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeter cette propriété ?</AlertDialogTitle>
            <AlertDialogDescription>
              Veuillez fournir une raison pour le rejet de "{property.title}". Cette raison sera communiquée au propriétaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Raison du rejet (ex: photos de mauvaise qualité, informations incomplètes...)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-destructive hover:bg-destructive/90"
              disabled={!rejectReason.trim()}
            >
              <X className="mr-2 h-4 w-4" />
              Rejeter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette propriété ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La propriété "{property.title}" sera définitivement supprimée de la plateforme.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
