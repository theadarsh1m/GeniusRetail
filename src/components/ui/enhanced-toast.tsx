"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive" | "warning" | "info";
  duration?: number;
  onClose: (id: string) => void;
}

const toastVariants = {
  initial: {
    opacity: 0,
    x: 300,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    x: 300,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
      delay: 0.1,
    },
  },
};

export function EnhancedToast({
  id,
  title,
  description,
  variant = "default",
  duration = 5000,
  onClose,
}: EnhancedToastProps) {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "destructive":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getStyles = () => {
    switch (variant) {
      case "success":
        return "border-green-200 bg-green-50/90 text-green-900";
      case "destructive":
        return "border-red-200 bg-red-50/90 text-red-900";
      case "warning":
        return "border-yellow-200 bg-yellow-50/90 text-yellow-900";
      case "info":
        return "border-blue-200 bg-blue-50/90 text-blue-900";
      default:
        return "border-border bg-background/90 text-foreground";
    }
  };

  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm",
        "max-w-sm w-full group",
        getStyles(),
      )}
      whileHover={{ scale: 1.02 }}
    >
      {/* Icon */}
      <motion.div variants={iconVariants}>{getIcon()}</motion.div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <motion.h4
          className="font-semibold text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {title}
        </motion.h4>
        {description && (
          <motion.p
            className="text-sm opacity-80"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Close Button */}
      <motion.button
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100"
        onClick={() => onClose(id)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <X className="h-4 w-4" />
      </motion.button>

      {/* Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-lg"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        onAnimationComplete={() => onClose(id)}
      />
    </motion.div>
  );
}
