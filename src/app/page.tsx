"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { deals, topCategories, inspiredByYourVisit, type Product, mockUser, moodSuggestions, products } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Mood = "Chill" | "Gaming" | "Fitness";

export default function Home() {
  const [mood, setMood] = useState<Mood>("Chill");

  const personalPicks = products.filter(p => p.tags.includes(mockUser.interests[0]));

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
        <Card>
          <CardHeader>
            <CardTitle>What's your mood today, {mockUser.name}?</CardTitle>
            <CardDescription>Select a mood to get personalized suggestions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value: Mood) => setMood(value)} defaultValue={mood}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Chill">😎 Chill</SelectItem>
                <SelectItem value="Gaming">🎮 Gaming</SelectItem>
                <SelectItem value="Fitness">🏋️ Fitness</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold font-headline mb-6">
          For Your {mood} Mood
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(moodSuggestions[mood] || []).map((product) => (
            <ProductCard key={product.id} product={product as Product} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold font-headline mb-6">
          Based on your interest in <span className="capitalize">{mockUser.interests[0]}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personalPicks.map((product) => (
            <ProductCard key={product.id} product={product as Product} />
          ))}
        </div>
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
