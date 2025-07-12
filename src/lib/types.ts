
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  tags: string[];
  description: string;
  aiHint: string;
  relatedItems?: string[];
  deal?: string;
  image: string; // From original API
  views?: number;
  wishlistCount?: number;
  timeSpent?: number; // in minutes
};

export type CartItem = {
  product: Product;
  quantity: number;
};

// For mockUser, can be replaced by actual Firebase Auth user
export type User = {
    id: string;
    name: string;
    avatarUrl?: string;
}

export type GroupCartItem = Product & {
  quantity: number;
  addedBy: string; // User ID
};

export type GroupCart = {
  id:string;
  ownerId: string;
  members: User[];
  memberIds: string[]; // For security rules
  cartItems: GroupCartItem[];
  createdAt: any; // Firestore timestamp
};
