import { ProductCard } from "@/components/product-card";
import { deals, topCategories, inspiredByYourVisit, type Product } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
          Welcome to RetailGeniusAI
        </h1>
        <p className="text-lg text-muted-foreground">
          Your personal AI shopping assistant.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold font-headline mb-6">Top Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {topCategories.map((category) => (
            <Card key={category.name} className="overflow-hidden group text-center">
              <CardContent className="p-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={category.aiHint}
                />
                <h3 className="text-lg font-semibold p-4">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold font-headline mb-6">Deals for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product as Product} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold font-headline mb-6">
          Inspired By Your Last Visit
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {inspiredByYourVisit.map((product) => (
            <ProductCard key={product.id} product={product as Product} />
          ))}
        </div>
      </section>
    </div>
  );
}
