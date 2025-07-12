
"use client";

import { listenToGroupCart } from "@/lib/firebase/group-shopping.client";
import { type GroupCart, type User } from "@/lib/types";
import { mockUser } from "@/lib/mock-data";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface GroupShoppingContextType {
  groupCartId: string | null;
  setGroupCartId: (id: string | null) => void;
  groupCart: GroupCart | null;
  isLoading: boolean;
  currentUser: User;
}

const GroupShoppingContext = createContext<GroupShoppingContextType | undefined>(undefined);

export function GroupShoppingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [groupCartId, setGroupCartIdState] = useState<string | null>(null);
  const [groupCart, setGroupCart] = useState<GroupCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = mockUser; // Using mock user for now

  useEffect(() => {
    // This effect runs once on mount to get the initial cart ID from localStorage.
    const storedCartId = localStorage.getItem("groupCartId");
    if (storedCartId) {
      setGroupCartIdState(storedCartId);
    } else {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // This effect sets up the Firestore listener whenever the groupCartId changes.
    let unsubscribe: (() => void) | undefined;
    
    if (groupCartId) {
      setIsLoading(true);
      unsubscribe = listenToGroupCart(groupCartId, (cart) => {
        setGroupCart(cart);
        if (cart) {
          // If the current user is not in the member list, leave the group.
          if (!cart.members.some(m => m.id === currentUser.id)) {
            setGroupCartId(null);
          }
        } else {
          // Cart was deleted, so clear local state
          setGroupCartId(null);
        }
        setIsLoading(false);
      });
    } else {
      setGroupCart(null);
      localStorage.removeItem("groupCartId");
      setIsLoading(false);
    }

    // Cleanup listener on component unmount or when cartId changes.
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [groupCartId, currentUser.id]);

  const setGroupCartId = (id: string | null) => {
    if (id) {
      localStorage.setItem("groupCartId", id);
      setGroupCartIdState(id);
    } else {
      localStorage.removeItem("groupCartId");
      setGroupCartIdState(null);
    }
  };

  return (
    <GroupShoppingContext.Provider value={{ groupCartId, setGroupCartId, groupCart, isLoading, currentUser }}>
      {children}
    </GroupShoppingContext.Provider>
  );
}

export function useGroupShopping() {
  const context = useContext(GroupShoppingContext);
  if (context === undefined) {
    throw new Error("useGroupShopping must be used within a GroupShoppingProvider");
  }
  return context;
}
