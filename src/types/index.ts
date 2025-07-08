export interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  category: string;
  imageUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}