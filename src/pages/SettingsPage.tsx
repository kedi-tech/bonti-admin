import { useState } from 'react';
import { Settings, User, Bell, Lock, CreditCard, Shield, Save, Mail, Phone, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({ name: 'Admin Bonti', email: 'admin@bonti.com', phone: '+224620000000' });
  const [notifications, setNotifications] = useState({ emailNewUser: true, emailNewProperty: true, pushTransaction: true });
  const [platformSettings, setPlatformSettings] = useState({ unlockFee: '10000', commissionRate: '5', maintenanceMode: false, autoApprove: false });

  const handleSave = (section: string) => {
    toast({ title: `${section} mis à jour`, description: 'Les paramètres ont été sauvegardés.' });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Paramètres</h1><p className="text-muted-foreground">Gérez vos préférences et les paramètres de la plateforme</p></div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4" /><span className="hidden sm:inline">Profil</span></TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="h-4 w-4" /><span className="hidden sm:inline">Notifications</span></TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center gap-2"><Settings className="h-4 w-4" /><span className="hidden sm:inline">Plateforme</span></TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2"><Shield className="h-4 w-4" /><span className="hidden sm:inline">Sécurité</span></TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
            <CardHeader><CardTitle>Informations personnelles</CardTitle><CardDescription>Mettez à jour vos informations de profil</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6"><Avatar className="h-20 w-20"><AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" /><AvatarFallback className="text-2xl">AB</AvatarFallback></Avatar><Button variant="outline" size="sm">Changer la photo</Button></div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="name">Nom complet</Label><Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="phone">Téléphone</Label><Input id="phone" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} /></div>
              </div>
              <div className="flex justify-end"><Button onClick={() => handleSave('Profil')} className="gradient-primary text-primary-foreground"><Save className="mr-2 h-4 w-4" />Sauvegarder</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
            <CardHeader><CardTitle>Préférences de notification</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div><p className="font-medium">Nouvel utilisateur</p><p className="text-sm text-muted-foreground">Email lors d'une nouvelle inscription</p></div><Switch checked={notifications.emailNewUser} onCheckedChange={(checked) => setNotifications({ ...notifications, emailNewUser: checked })} /></div>
              <Separator />
              <div className="flex items-center justify-between"><div><p className="font-medium">Nouvelle propriété</p><p className="text-sm text-muted-foreground">Email lors d'une nouvelle annonce</p></div><Switch checked={notifications.emailNewProperty} onCheckedChange={(checked) => setNotifications({ ...notifications, emailNewProperty: checked })} /></div>
              <Separator />
              <div className="flex items-center justify-between"><div><p className="font-medium">Transactions</p><p className="text-sm text-muted-foreground">Push pour chaque transaction</p></div><Switch checked={notifications.pushTransaction} onCheckedChange={(checked) => setNotifications({ ...notifications, pushTransaction: checked })} /></div>
              <div className="flex justify-end"><Button onClick={() => handleSave('Notifications')} className="gradient-primary text-primary-foreground"><Save className="mr-2 h-4 w-4" />Sauvegarder</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform">
          <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Paramètres de la plateforme</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Frais de déblocage (GNF)</Label><Input value={platformSettings.unlockFee} onChange={(e) => setPlatformSettings({ ...platformSettings, unlockFee: e.target.value })} /></div>
                <div className="space-y-2"><Label>Taux de commission (%)</Label><Input value={platformSettings.commissionRate} onChange={(e) => setPlatformSettings({ ...platformSettings, commissionRate: e.target.value })} /></div>
              </div>
              <Separator />
              <div className="flex items-center justify-between"><div><p className="font-medium">Mode maintenance</p><p className="text-sm text-muted-foreground">Désactiver temporairement l'accès</p></div><Switch checked={platformSettings.maintenanceMode} onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, maintenanceMode: checked })} /></div>
              <Separator />
              <div className="flex items-center justify-between"><div><p className="font-medium">Approbation automatique</p><p className="text-sm text-muted-foreground">Approuver automatiquement les propriétés</p></div><Switch checked={platformSettings.autoApprove} onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, autoApprove: checked })} /></div>
              <div className="flex justify-end"><Button onClick={() => handleSave('Plateforme')} className="gradient-primary text-primary-foreground"><Save className="mr-2 h-4 w-4" />Sauvegarder</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-card bg-card/80 backdrop-blur border-border/50">
            <CardHeader><CardTitle>Paramètres de sécurité</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Mot de passe actuel</Label><Input type="password" placeholder="••••••••" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Nouveau mot de passe</Label><Input type="password" placeholder="••••••••" /></div>
                <div className="space-y-2"><Label>Confirmer</Label><Input type="password" placeholder="••••••••" /></div>
              </div>
              <div className="flex justify-end"><Button variant="outline">Changer le mot de passe</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
