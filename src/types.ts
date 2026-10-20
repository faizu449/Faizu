export interface SurpriseSettings {
  title: string;
  subtitle: string;
  recipientName: string;
  cakeHeading: string;
  cakeSubtitle: string;
  questionText: string;
  memoriesIntroHeading: string;
  memoriesIntroText: string;
  finalWishesHeading: string;
  finalWishesMessage: string;
  footerTagline: string;
}

export interface Wish {
  id: string;
  type: 'gift' | 'final';
  title: string;
  message: string;
  sender?: string;
  emoji?: string;
  date?: string;
  accentColor?: string;
  order: number;
  isPublished: boolean;
}

export interface Memory {
  id: string;
  title: string;
  caption: string;
  date?: string;
  category?: string;
  imageUrl: string;
  order: number;
  isPublished: boolean;
}

export interface PublicContentResponse {
  settings: SurpriseSettings;
  giftWishes: Wish[];
  finalWishes: Wish[];
  memories: Memory[];
}

export interface AdminStats {
  totalWishes: number;
  publishedWishes: number;
  totalMemories: number;
  publishedMemories: number;
  totalGiftWishes: number;
  totalFinalWishes: number;
}

export interface AdminDataResponse {
  settings: SurpriseSettings;
  wishes: Wish[];
  memories: Memory[];
  stats: AdminStats;
  adminEmail: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  adminEmail: string | null;
}
