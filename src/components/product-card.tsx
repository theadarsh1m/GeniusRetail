"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { ShoppingCart, Heart, Eye, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DynamicProductImage } from "./dynamic-product-image";
import { useGroupShopping } from "@/context/group-shopping-provider";
import { addProductToGroupCart } from "@/lib/firebase/group-shopping";
import { mockUser } from "@/lib/mock-data";
import { TrendingScore, calculateTrendingScore } from "./trending-score";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { groupCart } = useGroupShopping();
  const trendingScore = calculateTrendingScore(product);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAddToCart = async () => {
    if (groupCart) {
      try {
        await addProductToGroupCart(groupCart.id, product, mockUser);
        toast({
          title: "🎉 Added to Group Cart!",
          description: `${product.name} is now in your group's cart.`,
        });
      } catch (error) {
        console.error("Error adding to group cart:", error);
        toast({
          variant: "destructive",
          title: "❌ Failed to add to group cart.",
          description: "Please try again.",
        });
      }
    } else {
      toast({
        title: "🛒 Added to Cart!",
        description: `${product.name} is now in your cart.`,
      });
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted
        ? "�� Removed from Wishlist"
        : "❤️ Added to Wishlist!",
      description: `${product.name} ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    });
  };

  const cardVariants = {
    initial: {
      scale: 1,
      rotateY: 0,
      z: 0,
    },
    hover: {
      scale: 1.03,
      rotateY: 5,
      z: 50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const overlayVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="perspective-1000"
    >
      <Card className="relative flex flex-col h-full overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 group">
        {/* Product Image Section */}
        <CardHeader className="p-0 relative">
          <div className="relative overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <DynamicProductImage
                query={product.aiHint}
                fallbackSrc={product.image}
                alt={product.name}
                className="object-cover w-full aspect-square"
              />
            </motion.div>

            {/* Gradient Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              <AnimatePresence>
                {product.deal && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Badge
                      variant="destructive"
                      className="shadow-lg backdrop-blur-sm"
                    >
                      {product.deal}
                    </Badge>
                  </motion.div>
                )}
                {trendingScore > 80 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                  >
                    <Badge
                      variant="secondary"
                      className="animate-pulse shadow-lg backdrop-blur-sm"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Hot Pick
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Top Right Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              <AnimatePresence>
                {product.tags.includes("new") && (
                  <motion.div
                    initial={{ scale: 0, x: 20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Badge className="shadow-lg backdrop-blur-sm">New</Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hover Action Buttons */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center gap-3"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <motion.div variants={buttonVariants}>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-12 w-12 rounded-full shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background/90 border border-border/50"
                      onClick={handleWishlistToggle}
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${isWishlisted ? "text-red-500 fill-red-500" : ""}`}
                      />
                    </Button>
                  </motion.div>

                  <motion.div variants={buttonVariants}>
                    <Button
                      size="icon"
                      className="h-14 w-14 rounded-full shadow-xl"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-6 w-6" />
                    </Button>
                  </motion.div>

                  <motion.div variants={buttonVariants}>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-12 w-12 rounded-full shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background/90 border border-border/50"
                      onClick={() => setShowQuickView(true)}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardHeader>

        {/* Product Info */}
        <CardContent className="p-4 flex-grow relative">
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <CardTitle className="text-lg font-headline mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-3">
              {product.category}
            </CardDescription>

            <div className="flex justify-between items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <p className="font-bold text-xl text-primary">
                  ₹{product.price.toFixed(2)}
                </p>
                {product.deal && (
                  <p className="text-sm text-muted-foreground line-through">
                    ₹{(product.price * 1.3).toFixed(2)}
                  </p>
                )}
              </motion.div>
              <TrendingScore product={product} />
            </div>

            {/* Rating */}
            <motion.div
              className="flex items-center gap-1 mt-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(4.5)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.5)</span>
            </motion.div>
          </motion.div>
        </CardContent>

        {/* Quick Add Button (visible on mobile) */}
        <CardFooter className="p-4 pt-0 md:hidden">
          <Button
            className="w-full group relative overflow-hidden"
            onClick={handleAddToCart}
          >
            <motion.span
              className="relative z-10 flex items-center justify-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </motion.span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </Button>
        </CardFooter>

        {/* Glassmorphism Effect */}
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-white/0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}
