import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/mock-data";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
          {product.tags.includes("new") && <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">New</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{product.category}</CardDescription>
        <p className="font-semibold text-lg mt-2">₹{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
