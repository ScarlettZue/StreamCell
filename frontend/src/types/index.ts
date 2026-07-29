export type Role = 'ADMIN';

export type ProductType = 'MULTI_PROFILE' | 'FULL_ACCOUNT' | 'PERSONAL_INVITATION';

export type AccountStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';

export type ProfileStatus = 'AVAILABLE' | 'SOLD' | 'DISABLED';

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED_NO_DEBT' | 'CANCELLED_WITH_DEBT';

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  _count?: {
    products: number;
  };
}

export interface IProduct {
  id: string;
  name: string;
  categoryId: string;
  type: ProductType;
  defaultCost: number;
  defaultPrice: number;
  profilesCount: number;
  isActive: boolean;
  category?: ICategory;
}

export interface IAccountProfile {
  id: string;
  accountId: string;
  profileName: string;
  hasPin: boolean;
  pin?: string | null;
  userEmail?: string | null;
  spotifyUsername?: string | null;
  familyAddress?: string | null;
  status: ProfileStatus;
  account?: IAccount;
  subscriptions?: IProfileSubscription[];
}

export interface IAccount {
  id: string;
  productId: string;
  email: string;
  password?: string | null;
  startDate: string;
  dueDate: string;
  status: AccountStatus;
  notes?: string | null;
  product?: IProduct;
  profiles: IAccountProfile[];
}

export interface IDebtRecord {
  id: string;
  clientId: string;
  amount: number;
  reason: string;
  isPaid: boolean;
  createdAt: string;
}

export interface IProfileSubscription {
  id: string;
  accountProfileId: string;
  clientId: string;
  serviceStartDate: string;
  serviceEndDate: string;
  status: SubscriptionStatus;
  debtAmount: number;
  profile?: IAccountProfile;
  client?: IClient;
}

export interface IClient {
  id: string;
  clientKey: string;
  name: string;
  phone: string;
  totalDebt: number;
  createdAt: string;
  subscriptions?: IProfileSubscription[];
  debts?: IDebtRecord[];
  _count?: {
    subscriptions: number;
    sales: number;
  };
}

export interface ISaleDetail {
  id: string;
  saleId: string;
  accountProfileId: string;
  unitCost: number;
  unitPrice: number;
  subtotalProfit: number;
  profile?: IAccountProfile;
}

export interface ISale {
  id: string;
  code: string;
  clientId: string;
  userId: string;
  totalAmount: number;
  totalCost: number;
  netProfit: number;
  createdAt: string;
  client?: IClient;
  details?: ISaleDetail[];
}

export interface IWhatsAppReminder {
  greeting: string;
  clientName: string;
  phone: string;
  productName: string;
  dueDateFormatted: string;
  generatedMessage: string;
  whatsappUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  metrics?: {
    totalSalesCount: number;
    totalRevenue: number;
    totalProfit: number;
  };
}
