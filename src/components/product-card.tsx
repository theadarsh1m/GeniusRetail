"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/mock-data";
import { products } from "@/lib/mock-data";
import { ShoppingCart, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    // In a real app, you'd dispatch an action to add the item to a global state (e.g., Redux, Zustand)
    // or make an API call.
    
    // Show a confirmation toast
    toast({
      title: "Added to Cart!",
      description: `${product.name} is now in your cart.`,
    });

    // Show smart bundle suggestions
    if (product.relatedItems && product.relatedItems.length > 0) {
      const relatedProduct = products.find(p => p.id === product.relatedItems![0]);
      if (relatedProduct) {
        setTimeout(() => {
          toast({
            title: "Smart Suggestion",
            description: `People who bought ${product.name} also bought ${relatedProduct.name}.`,
            action: <ToastAction altText={`Add ${relatedProduct.name} to cart`}>Add to Cart</ToastAction>,
          });
        }, 1000);
      }
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full aspect-square"
            data-ai-hint={product.aiHint}
          />
          {product.deal && <Badge variant="accent" className="absolute top-2 left-2">{product.deal}</Badge>}
          {product.tags.includes("new") && <Badge className="absolute top-2 right-2">New</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{product.category}</CardDescription>
        <p className="font-semibold text-lg mt-2">₹{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
