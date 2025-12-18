export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  roles: ('renter' | 'landlord')[];
  avatar?: string;
  profilePicture?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  status?: 'active' | 'suspended' | 'banned';
}

export interface House {
  id: string;
  landlordId: string;
  landlord?: User;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: 'house' | 'office' | 'apartment' | 'commercial';
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  images: string[];
  status: 'available' | 'rented' | 'paused' | 'high_demand' | 'taken' | 'expired' | 'booked' | 'occupied' | 'cancelled';
  isAccept: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  popularity: {
    views: number;
    unlocks: number;
    watchlists: number;
  };
  demandTracking: {
    unlocksInLast7Days: number;
    unlocksInLast30Days: number;
    lastUnlockDate?: string;
  };
  rentalConfirmation?: {
    confirmedAt: string;
    confirmedBy: string;
    smsVerified: boolean;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  user?: User;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed' | 'success';
  reference?: string;
  paymentMethod: 'OM' | 'DJOMY';
  orderId: string;
  payToken?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  houseId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image';
  sender?: User;
  receiver?: User;
}

export interface Chat {
  id: string;
  renterId: string;
  landlordId: string;
  houseId: string;
  house?: House;
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  createdAt: string;
  unreadCount?: number;
  lastReadTimestamp?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalRenters: number;
  totalLandlords: number;
  newUsersLast7Days: number;
  newUsersLast30Days: number;
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  pendingApproval: number;
  totalTransactions: number;
  totalRevenue: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalUnlocks: number;
  activeChats: number;
}
