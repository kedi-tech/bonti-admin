import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Home, UserPlus, CreditCard, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const activities = [
  {
    id: 1,
    type: 'user',
    title: 'Nouvel utilisateur inscrit',
    description: 'Kadiatou Sylla a créé un compte',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kadiatou',
    time: 'Il y a 5 min',
    icon: UserPlus,
    iconColor: 'text-success',
  },
  {
    id: 2,
    type: 'property',
    title: 'Nouvelle propriété listée',
    description: 'Studio Meublé Dixinn en attente d\'approbation',
    avatar: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100',
    time: 'Il y a 15 min',
    icon: Home,
    iconColor: 'text-primary',
  },
  {
    id: 3,
    type: 'transaction',
    title: 'Transaction réussie',
    description: 'Fatou Barry a rechargé 50,000 GNF',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatou',
    time: 'Il y a 30 min',
    icon: CreditCard,
    iconColor: 'text-success',
  },
  {
    id: 4,
    type: 'property',
    title: 'Propriété approuvée',
    description: 'Villa Moderne à Kipé est maintenant active',
    avatar: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100',
    time: 'Il y a 1h',
    icon: Home,
    iconColor: 'text-primary',
  },
  {
    id: 5,
    type: 'user',
    title: 'Profil mis à jour',
    description: 'Mamadou Diallo a modifié son profil',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mamadou',
    time: 'Il y a 2h',
    icon: UserPlus,
    iconColor: 'text-muted-foreground',
  },
];

export function RecentActivity() {
  return (
    <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Activité récente</CardTitle>
        <Badge variant="secondary" className="font-normal">
          <Clock className="mr-1 h-3 w-3" />
          Temps réel
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback>
                    {activity.title.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background flex items-center justify-center border border-border'
                  )}
                >
                  <Icon className={cn('h-3 w-3', activity.iconColor)} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
