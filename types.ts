export enum ViewState {
  HOME = 'HOME',
  CHAT = 'CHAT',
  GENERATOR = 'GENERATOR',
  TRENDS = 'TRENDS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface OutfitParams {
  occasion: string;
  style: string;
  weather: string;
  colorPalette: string;
}

export interface TrendItem {
  name: string;
  score: number;
  description: string;
  category: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}