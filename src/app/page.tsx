"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ProductCard } from "@/components/product-card";
import {
  deals,
  topCategories,
  inspiredByYourVisit,
  type Product,
  mockUser,
  moodSuggestions,
  products,
} from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, Sparkles, TrendingUp, Heart, Star } from "lucide-react";

type Mood = "Chill" | "Gaming" | "Fitness";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function Home() {
  const [mood, setMood] = useState<Mood>("Chill");
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const personalPicks = products.filter((p) =>
    p.tags.includes(mockUser.interests[0]),
  );

  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [moodRef, moodInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [categoriesRef, categoriesInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div className="relative">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{ y, opacity }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 80, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={heroInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              type: "spring",
              stiffness: 100,
              delay: 0.2,
            }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Shopping Experience
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold font-headline mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent"
            initial={{ y: 50, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Welcome to
            <br />
            <motion.span
              className="inline-block"
              animate={{
                textShadow: [
                  "0 0 0px rgba(0,0,0,0)",
                  "0 0 20px rgba(120,119,198,0.5)",
                  "0 0 0px rgba(0,0,0,0)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              RetailGeniusAI
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Your personal AI shopping assistant that understands your style,
            mood, and preferences.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ y: 30, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button size="lg" className="group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Start Shopping
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-accent"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              />
            </Button>
            <Button variant="outline" size="lg" className="backdrop-blur-sm">
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto"
            initial={{ y: 40, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.9</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                Rating
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto space-y-16 pb-16">
        {/* Mood Selection */}
        <motion.section
          ref={moodRef}
          variants={containerVariants}
          initial="hidden"
          animate={moodInView ? "visible" : "hidden"}
          className="relative"
        >
          <Card className="backdrop-blur-sm bg-card/50 border border-border/50 shadow-xl">
            <CardHeader className="text-center">
              <motion.div variants={itemVariants}>
                <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  What's your mood today, {mockUser.name}?
                </CardTitle>
                <CardDescription className="text-lg">
                  Select a mood to get personalized AI-powered suggestions.
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={itemVariants}
                className="flex justify-center"
              >
                <Select
                  onValueChange={(value: Mood) => setMood(value)}
                  defaultValue={mood}
                >
                  <SelectTrigger className="w-[200px] h-12 text-lg bg-background/50 backdrop-blur-sm">
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chill" className="text-lg">
                      😎 Chill Vibes
                    </SelectItem>
                    <SelectItem value="Gaming" className="text-lg">
                      🎮 Gaming Mode
                    </SelectItem>
                    <SelectItem value="Fitness" className="text-lg">
                      🏋️ Fitness Focus
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Mood-based Products */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={moodInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              For Your {mood} Mood
            </h2>
            <Button variant="ghost" className="group">
              View All
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {(moodSuggestions[mood] || []).map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ProductCard product={product as Product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Personal Picks */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={moodInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              Curated for your love of{" "}
              <span className="capitalize text-primary">
                {mockUser.interests[0]}
              </span>
            </h2>
            <Button variant="ghost" className="group">
              View All
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {personalPicks.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ProductCard product={product as Product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Top Categories */}
        <motion.section
          ref={categoriesRef}
          variants={containerVariants}
          initial="hidden"
          animate={categoriesInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing products across our carefully curated categories
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
            variants={containerVariants}
          >
            {topCategories.map((category, index) => (
              <motion.div
                key={category.name}
                variants={itemVariants}
                custom={index}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="overflow-hidden group cursor-pointer text-center bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-0 relative">
                    <div className="overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={300}
                        height={300}
                        className="w-full h-auto object-cover aspect-square transition-transform duration-700 group-hover:scale-110"
                        data-ai-hint={category.aiHint}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.h3
                      className="text-lg font-semibold p-4 group-hover:text-primary transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      {category.name}
                    </motion.h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Deals Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={categoriesInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-3">
              🔥 Hot Deals for You
            </h2>
            <Button variant="ghost" className="group">
              View All Deals
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {deals.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ProductCard product={product as Product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Inspired by Last Visit */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={categoriesInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              ✨ Inspired By Your Last Visit
            </h2>
            <Button variant="ghost" className="group">
              View History
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {inspiredByYourVisit.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ProductCard product={product as Product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
