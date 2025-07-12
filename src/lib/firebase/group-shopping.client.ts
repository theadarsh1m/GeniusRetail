
"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type GroupCart } from "@/lib/types";

/**
 * Sets up a real-time listener for a group shopping cart.
 * This function is intended to be used on the client side.
 */
export function listenToGroupCart(cartId: string, callback: (cart: GroupCart | null) => void) {
  const groupCartRef = doc(db, "groupCarts", cartId);
  const unsubscribe = onSnapshot(groupCartRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as GroupCart);
    } else {
      console.warn(`Group cart with ID ${cartId} does not exist.`);
      callback(null);
    }
  }, (error) => {
      console.error("Error listening to group cart:", error);
      callback(null);
  });
  return unsubscribe; // Return the function to stop listening
}
