import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye, MapPin } from 'lucide-react';
import { mockHouses } from '@/data/mockData';

export function PendingApprovals() {
  const pendingProperties = mockHouses.filter((house) => !house.isAccept);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-GN').format(price);
  };

  return (
    <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">En attente d'approbation</CardTitle>
        <Badge variant="destructive">{pendingProperties.length}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingProperties.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune propriété en attente
          </p>
        ) : (
          pendingProperties.map((property) => (
            <div
              key={property.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50"
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{property.title}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  {property.location.address}
                </div>
                <p className="text-sm font-semibold text-primary mt-1">
                  {formatPrice(property.price)} {property.currency}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
