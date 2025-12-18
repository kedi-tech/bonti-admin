import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, User, Home, Eye, Trash2, MoreHorizontal, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { mockUsers, mockHouses } from '@/data/mockData';
import { Chat } from '@/types';

const mockChats: Chat[] = [
  { id: '1', renterId: '2', landlordId: '1', houseId: '1', house: mockHouses[0], messages: [
    { id: 'm1', senderId: '2', receiverId: '1', houseId: '1', content: 'Bonjour, je suis intéressé par votre villa.', timestamp: '2024-12-14T10:00:00Z', type: 'text' },
    { id: 'm2', senderId: '1', receiverId: '2', houseId: '1', content: 'Oui, elle est disponible. Voulez-vous organiser une visite ?', timestamp: '2024-12-14T10:15:00Z', type: 'text' },
  ], createdAt: '2024-12-14T10:00:00Z', unreadCount: 1 },
  { id: '2', renterId: '4', landlordId: '3', houseId: '2', house: mockHouses[1], messages: [
    { id: 'm3', senderId: '4', receiverId: '3', houseId: '2', content: 'L\'appartement est-il meublé ?', timestamp: '2024-12-13T14:00:00Z', type: 'text' },
  ], createdAt: '2024-12-13T14:00:00Z', unreadCount: 0 },
];

export default function MessagesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);

  const getRenter = (renterId: string) => mockUsers.find((u) => u.id === renterId);
  const getLandlord = (landlordId: string) => mockUsers.find((u) => u.id === landlordId);
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Gérez les conversations entre utilisateurs</p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30">{mockChats.reduce((sum, c) => sum + (c.unreadCount || 0), 0)} non lus</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <Card className="shadow-card bg-card/80 backdrop-blur border-border/50 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[480px]">
              {mockChats.map((chat) => {
                const renter = getRenter(chat.renterId);
                const lastMessage = chat.messages[chat.messages.length - 1];
                return (
                  <div key={chat.id} className={`p-4 cursor-pointer border-b border-border/50 hover:bg-secondary/50 ${selectedChat?.id === chat.id ? 'bg-secondary/70' : ''}`} onClick={() => setSelectedChat(chat)}>
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12"><AvatarImage src={renter?.avatar} /><AvatarFallback>{renter?.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between"><p className="font-medium truncate">{renter?.name}</p><span className="text-xs text-muted-foreground">{formatTime(lastMessage.timestamp)}</span></div>
                        <p className="text-sm text-muted-foreground truncate">{chat.house?.title}</p>
                        <p className="text-sm text-muted-foreground truncate mt-1">{lastMessage.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-card bg-card/80 backdrop-blur border-border/50 overflow-hidden flex flex-col">
          {selectedChat ? (
            <>
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10"><AvatarImage src={getRenter(selectedChat.renterId)?.avatar} /><AvatarFallback>{getRenter(selectedChat.renterId)?.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-medium">{getRenter(selectedChat.renterId)?.name} ↔ {getLandlord(selectedChat.landlordId)?.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1"><Home className="h-3 w-3" />{selectedChat.house?.title}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/properties/${selectedChat.houseId}`)}><Eye className="mr-2 h-4 w-4" />Voir propriété</Button>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedChat.messages.map((message) => {
                    const sender = mockUsers.find((u) => u.id === message.senderId);
                    const isRenter = message.senderId === selectedChat.renterId;
                    return (
                      <div key={message.id} className={`flex items-end gap-2 ${isRenter ? '' : 'flex-row-reverse'}`}>
                        <Avatar className="h-8 w-8"><AvatarImage src={sender?.avatar} /><AvatarFallback>{sender?.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isRenter ? 'bg-secondary text-secondary-foreground rounded-bl-none' : 'bg-primary text-primary-foreground rounded-br-none'}`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border/50 bg-secondary/30">
                <p className="text-xs text-muted-foreground text-center">Mode lecture seule pour les administrateurs</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground"><MessageSquare className="h-16 w-16 opacity-50" /></div>
          )}
        </Card>
      </div>
    </div>
  );
}
