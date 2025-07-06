export type Amulet = {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  videoUrl?: string;
  model_3d_url?: string;
  history: string;
  worshipCount: number;
  material: string;
  dataAiHint?: string;

  // Marketplace fields
  userId: string;
  userName:string;
  auctionType: 'up-bid' | 'down-bid' | 'fixed';
  startPrice?: number;
  fixedPrice?: number;
  currentPrice: number;
  minBidIncrement?: number;
  auctionStartTime?: string; // ISO Date string
  auctionEndTime: string; // ISO Date string
  aiAnalysis?: {
    history: string;
    estimatedPrice: string;
    condition: string;
  };
  timestamp: string; // ISO Date string
};

export type User = {
  uid: string;
  name: string;
  email?: string;
  avatar?: string;
};
