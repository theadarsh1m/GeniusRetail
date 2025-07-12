import { type Product } from "@/lib/types";

export const products: Product[] = [
  { id: "1", name: "Classic Leather Jacket", category: "Apparel", price: 4999, stock: 12, tags: ["men", "outerwear", "leather", "chill"], description: "A timeless leather jacket for a cool, classic look.", aiHint: "leather jacket", image: "", relatedItems: ["2", "5"], views: 850, wishlistCount: 450, timeSpent: 220 },
  { id: "2", name: "Slim Fit Denim Jeans", category: "Apparel", price: 1899, stock: 35, tags: ["men", "pants", "denim", "new", "chill"], description: "Modern slim fit jeans made from high-quality stretch denim.", aiHint: "denim jeans", image: "", relatedItems: ["1", "3"], views: 1200, wishlistCount: 300, timeSpent: 180 },
  { id: "3", name: "Urban Canvas Sneakers", category: "Footwear", price: 2499, stock: 25, tags: ["unisex", "shoes", "casual", "chill"], description: "Comfortable and stylish canvas sneakers for everyday wear.", aiHint: "canvas sneakers", image: "", relatedItems: ["2", "6"], deal: "15% off", views: 2500, wishlistCount: 800, timeSpent: 450 },
  { id: "4", name: "Silk Blend Scarf", category: "Accessories", price: 899, stock: 50, tags: ["women", "accessories", "silk"], description: "A luxurious silk blend scarf with a vibrant pattern.", aiHint: "silk scarf", image: "", views: 400, wishlistCount: 80, timeSpent: 50 },
  { id: "5", name: "Retro Sunglasses", category: "Accessories", price: 1299, stock: 40, tags: ["unisex", "sunglasses", "retro", "chill"], description: "Vintage-inspired sunglasses with full UV protection.", aiHint: "retro sunglasses", image: "", deal: "Buy 1 Get 1", views: 1800, wishlistCount: 650, timeSpent: 300 },
  { id: "6", name: "Cotton Crew-Neck T-Shirt", category: "Apparel", price: 799, stock: 150, tags: ["unisex", "tops", "basics", "chill"], description: "A soft, breathable 100% cotton t-shirt, perfect for layering.", aiHint: "cotton t-shirt", image: "", relatedItems: ["2"], views: 3500, wishlistCount: 150, timeSpent: 80 },
  { id: "7", name: "Leather Crossbody Bag", category: "Bags", price: 3299, stock: 22, tags: ["women", "bags", "leather", "new"], description: "A chic and practical leather crossbody bag for your essentials.", aiHint: "leather bag", image: "", relatedItems: ["4"], views: 600, wishlistCount: 200, timeSpent: 150 },
  { id: "8", name: "Performance Running Shoes", category: "Footwear", price: 5499, stock: 18, tags: ["men", "sports", "running", "shoes", "fitness"], description: "Lightweight running shoes designed for maximum performance.", aiHint: "running shoes", image: "", views: 1100, wishlistCount: 400, timeSpent: 250 },
  { id: "9", name: "Wool Beanie", category: "Accessories", price: 999, stock: 3, tags: ["unisex", "winter", "hats", "gaming"], description: "A warm and cozy wool beanie for chilly days. Low stock!", aiHint: "wool beanie", image: "", views: 950, wishlistCount: 120, timeSpent: 90 },
  { id: "10", name: "Linen Button-Up Shirt", category: "Apparel", price: 2199, stock: 4, tags: ["men", "summer", "shirt"], description: "A breathable linen shirt perfect for warm weather. Low stock!", aiHint: "linen shirt", image: "", views: 300, wishlistCount: 50, timeSpent: 40 },
  { id: "11", name: "Mechanical Gaming Keyboard", category: "Electronics", price: 6999, stock: 15, tags: ["unisex", "gaming", "electronics"], description: "RGB mechanical keyboard with cherry-mx switches.", aiHint: "gaming keyboard", image: "", relatedItems: ["12"], views: 2200, wishlistCount: 900, timeSpent: 600 },
  { id: "12", name: "Ergonomic Gaming Mouse", category: "Electronics", price: 3499, stock: 20, tags: ["unisex", "gaming", "electronics", "new"], description: "High-precision ergonomic gaming mouse.", aiHint: "gaming mouse", image: "", relatedItems: ["11"], views: 1500, wishlistCount: 500, timeSpent: 350 },
  { id: "13", name: "Yoga Mat", category: "Fitness", price: 1599, stock: 30, tags: ["unisex", "fitness", "yoga"], description: "Eco-friendly, non-slip yoga mat.", aiHint: "yoga mat", image: "", relatedItems: ["8"], views: 700, wishlistCount: 250, timeSpent: 120 },
  { id: "14", name: "Smart Fitness Watch", category: "Electronics", price: 8999, stock: 10, tags: ["unisex", "fitness", "electronics", "new"], description: "Track your workouts and health metrics.", aiHint: "fitness watch", image: "", deal: "25% off", relatedItems: ["8", "13"], views: 3000, wishlistCount: 1200, timeSpent: 700 },
];

export const mockCartItems = [
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

export const deals = products.filter(p => p.deal);
export const inspiredByYourVisit = products.slice(4, 8);

export const mockUser = {
  id: 'user_12345',
  name: 'Adarsh',
  interests: ['gaming', 'fitness', 'student'],
};

export const moodSuggestions: Record<string, Product[]> = {
  'Gaming': products.filter(p => p.tags.includes('gaming')),
  'Fitness': products.filter(p => p.tags.includes('fitness')),
  'Chill': products.filter(p => p.tags.includes('chill')),
};
