export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  tags: string[];
  description: string;
  aiHint: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export const products: Product[] = [
  { id: "1", name: "Classic Leather Jacket", category: "Apparel", price: 4999, stock: 12, image: "https://placehold.co/400x400", tags: ["men", "outerwear", "leather"], description: "A timeless leather jacket for a cool, classic look.", aiHint: "leather jacket" },
  { id: "2", name: "Slim Fit Denim Jeans", category: "Apparel", price: 1899, stock: 35, image: "https://placehold.co/400x400", tags: ["men", "pants", "denim", "new"], description: "Modern slim fit jeans made from high-quality stretch denim.", aiHint: "denim jeans" },
  { id: "3", name: "Urban Canvas Sneakers", category: "Footwear", price: 2499, stock: 25, image: "https://placehold.co/400x400", tags: ["unisex", "shoes", "casual"], description: "Comfortable and stylish canvas sneakers for everyday wear.", aiHint: "canvas sneakers" },
  { id: "4", name: "Silk Blend Scarf", category: "Accessories", price: 899, stock: 50, image: "https://placehold.co/400x400", tags: ["women", "accessories", "silk"], description: "A luxurious silk blend scarf with a vibrant pattern.", aiHint: "silk scarf" },
  { id: "5", name: "Retro Sunglasses", category: "Accessories", price: 1299, stock: 40, image: "https://placehold.co/400x400", tags: ["unisex", "sunglasses", "retro"], description: "Vintage-inspired sunglasses with full UV protection.", aiHint: "retro sunglasses" },
  { id: "6", name: "Cotton Crew-Neck T-Shirt", category: "Apparel", price: 799, stock: 150, image: "https://placehold.co/400x400", tags: ["unisex", "tops", "basics"], description: "A soft, breathable 100% cotton t-shirt, perfect for layering.", aiHint: "cotton t-shirt" },
  { id: "7", name: "Leather Crossbody Bag", category: "Bags", price: 3299, stock: 22, image: "https://placehold.co/400x400", tags: ["women", "bags", "leather", "new"], description: "A chic and practical leather crossbody bag for your essentials.", aiHint: "leather bag" },
  { id: "8", name: "Performance Running Shoes", category: "Footwear", price: 5499, stock: 18, image: "https://placehold.co/400x400", tags: ["men", "sports", "running", "shoes"], description: "Lightweight running shoes designed for maximum performance.", aiHint: "running shoes" },
  { id: "9", name: "Wool Beanie", category: "Accessories", price: 999, stock: 3, image: "https://placehold.co/400x400", tags: ["unisex", "winter", "hats"], description: "A warm and cozy wool beanie for chilly days. Low stock!", aiHint: "wool beanie" },
  { id: "10", name: "Linen Button-Up Shirt", category: "Apparel", price: 2199, stock: 4, image: "https://placehold.co/400x400", tags: ["men", "summer", "shirt"], description: "A breathable linen shirt perfect for warm weather. Low stock!", aiHint: "linen shirt" },
];

export const mockCartItems: CartItem[] = [
  { product: products[0], quantity: 1 },
  { product: products[2], quantity: 2 },
];

export const topCategories = [
    { name: "Apparel", image: "https://placehold.co/300x300", aiHint: "stylish clothing" },
    { name: "Footwear", image: "https://placehold.co/300x300", aiHint: "modern shoes" },
    { name: "Accessories", image: "https://placehold.co/300x300", aiHint: "fashion accessories" },
    { name: "Bags", image: "https://placehold.co/300x300", aiHint: "leather bags" },
    { name: "New Arrivals", image: "https://placehold.co/300x300", aiHint: "new products" },
];

export const deals = products.slice(0, 4);
export const inspiredByYourVisit = products.slice(4, 8);
