export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface ClothingItem {
  id: string;
  userId: string;
  name: string;
  category: "Shirts" | "Pants" | "Shoes" | "Jackets" | "Dresses" | "Accessories";
  imageUrl: string;
  color: string;
  season: "Spring" | "Summer" | "Fall" | "Winter" | "All-Season";
  occasion: "Casual" | "Formal" | "Work" | "Party" | "Sport";
  tags: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface Outfit {
  id: string;
  userId: string;
  title: string;
  occasion: string;
  season: string;
  weather: string;
  score: number;
  explanation: string;
  clothingItemIds: string[]; // parsed array
  isFavorite: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
  createdAt: string;
}

export interface SystemSettings {
  aiProvider: string;
  openaiApiKey?: string | null;
  geminiApiKey?: string | null;
  claudeApiKey?: string | null;
  temperature: number;
  maxTokens: number;
  appName: string;
  appDescription: string;
  maintenanceMode: boolean;
  primaryColor: string;
}
