
export enum AppTab {
  SKETCH = 'sketch',
  TRENDS = 'trends',
  CONSULTANT = 'consultant',
  COLLECTION = 'collection'
}

export interface FashionSketch {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  style: string;
}

export interface TrendResult {
  title: string;
  snippet: string;
  url: string;
}

export interface DesignSpec {
  silhouette: string;
  fabrics: string[];
  colors: string[];
  details: string[];
  inspiration: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  specs?: DesignSpec;
}
