"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";
import { useGroupShopping } from "@/context/group-shopping-provider";
import { CartSheet } from "./cart-sheet";
import { GroupCartSheet } from "./group-cart-sheet";

export function FloatingCartButton() {
  const { groupCart } = useGroupShopping();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Simulate cart item count (replace with actual cart logic)
    setCartItemCount(3);
  }, []);

  const buttonVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      rotate: 180,
      transition: {
        duration: 0.2,
      },
    },
  };

  const countVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
      },
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="lg"
                className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 relative group overflow-hidden"
                onClick={() => setIsOpen(true)}
              >
                {/* Ripple Effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{
                    scale: 1.5,
                    opacity: [0, 0.5, 0],
                    transition: { duration: 0.6, repeat: Infinity },
                  }}
                />

                <ShoppingCart className="h-6 w-6 relative z-10" />

                {/* Item Count Badge */}
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.div
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg"
                      variants={countVariants}
                      initial="initial"
                      animate="animate"
                      exit="initial"
                      whileHover="pulse"
                    >
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/50 blur-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.7 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>

            {/* Quick Add Button */}
            <motion.div
              className="absolute -top-16 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background/90 border border-border/50"
                onClick={() => {
                  // Quick add functionality
                  setCartItemCount((prev) => prev + 1);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sheet */}
      {groupCart ? (
        <GroupCartSheet open={isOpen} onOpenChange={setIsOpen} />
      ) : (
        <CartSheet open={isOpen} onOpenChange={setIsOpen} />
      )}
    </>
  );
}
