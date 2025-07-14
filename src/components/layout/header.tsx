"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Search, User, Mic, X, Users, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartSheet } from "../cart-sheet";
import { SidebarTrigger } from "../ui/sidebar";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";
import { CreateGroupSheet } from "@/components/create-group-sheet";
import { useGroupShopping } from "@/context/group-shopping-provider";
import { GroupCartSheet } from "@/components/group-cart-sheet";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { groupCart } = useGroupShopping();
  const { scrollY } = useScroll();

  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 20]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);

  const {
    text,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (text) {
      setSearchQuery(text);
    }
  }, [text]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 flex h-16 items-center gap-4 border-b px-4 md:px-6 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-lg"
          : "bg-background/95 backdrop-blur-sm border-border shadow-sm",
      )}
      style={{
        backdropFilter: useTransform(headerBlur, (value) => `blur(${value}px)`),
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Mobile Menu Trigger */}
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      {/* Logo */}
      <motion.div
        className="hidden md:block font-bold text-xl font-headline flex items-center gap-2"
        style={{ scale: logoScale }}
      >
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Sparkles className="h-6 w-6 text-primary" />
        </motion.div>
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          RetailGeniusAI
        </span>
      </motion.div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {/* Search Bar */}
        <motion.form
          className="ml-auto flex-1 sm:flex-initial"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative group">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            <Input
              type="search"
              placeholder="Search products..."
              className={cn(
                "pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] transition-all duration-300",
                "bg-background/50 backdrop-blur-sm border-border/50",
                "focus:bg-background/80 focus:border-primary/50 focus:shadow-lg",
                isScrolled && "bg-background/30",
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Voice Search Button */}
            {isClient && hasRecognitionSupport && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 transition-all duration-300",
                    isListening
                      ? "text-red-500 hover:text-red-600 animate-pulse"
                      : "text-muted-foreground hover:text-primary",
                  )}
                  onClick={handleMicClick}
                >
                  <motion.div
                    animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {isListening ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </motion.div>
                  <span className="sr-only">
                    {isListening ? "Stop listening" : "Voice search"}
                  </span>
                </Button>
              </motion.div>
            )}

            {/* Search Suggestions (when typing) */}
            {searchQuery && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-xl p-2 z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="text-sm text-muted-foreground p-2">
                  Searching for "{searchQuery}"...
                </div>
              </motion.div>
            )}
          </div>
        </motion.form>

        {/* Cart */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {groupCart ? <GroupCartSheet /> : <CartSheet />}
        </motion.div>

        {/* Group Shopping Button */}
        <CreateGroupSheet>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80 hover:border-primary/50 transition-all duration-300"
            >
              <Users className="h-5 w-5" />
              <span className="sr-only">Start Group Shopping</span>
            </Button>
          </motion.div>
        </CreateGroupSheet>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80 transition-all duration-300"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://placehold.co/40x40"
                    alt="User"
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    U
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-background/95 backdrop-blur-xl border-border/50"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-accent/50">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-accent/50">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-destructive/50 text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent origin-left"
        style={{
          scaleX: useTransform(scrollY, [0, 1000], [0, 1]),
        }}
      />
    </motion.header>
  );
}
