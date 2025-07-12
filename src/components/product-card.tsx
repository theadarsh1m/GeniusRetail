
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DynamicProductImage } from "./dynamic-product-image";
import { useGroupShopping } from "@/context/group-shopping-provider";
import { addProductToGroupCart } from "@/lib/firebase/group-shopping";
import { mockUser } from "@/lib/mock-data";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { groupCart } = useGroupShopping();

  const handleAddToCart = async () => {
    if (groupCart) {
      try {
        await addProductToGroupCart(groupCart.id, product, mockUser);
        toast({
          title: "Added to Group Cart!",
          description: `${product.name} is now in your group's cart.`,
        });
      } catch (error) {
        console.error("Error adding to group cart:", error);
        toast({
          variant: "destructive",
          title: "Failed to add to group cart.",
          description: "Please try again.",
        });
      }
    } else {
      // Logic for adding to a personal cart
      toast({
        title: "Added to Cart!",
        description: `${product.name} is now in your cart.`,
      });
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 group">
      <CardHeader className="p-0">
        <div className="relative">
          <DynamicProductImage
            query={product.aiHint}
            fallbackSrc={product.image}
            alt={product.name}
            className="object-cover w-full aspect-square"
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
