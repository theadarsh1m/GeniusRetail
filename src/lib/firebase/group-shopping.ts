
"use server";

import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type User, type GroupCart, type Product, type GroupCartItem } from "@/lib/types";
import { mockUser } from "../mock-data";

// --- CREATE ---

/**
 * Creates a new group shopping cart in Firestore.
 */
export async function createGroupCart(owner: User): Promise<string> {
  const groupCartsRef = collection(db, "groupCarts");
  const newGroupCartRef = doc(groupCartsRef);
  const newGroupCart: GroupCart = {
    id: newGroupCartRef.id,
    ownerId: owner.id,
    members: [owner],
    cartItems: [],
    createdAt: new Date(),
  };

  await setDoc(newGroupCartRef, newGroupCart);
  console.log(`Group cart created with ID: ${newGroupCartRef.id}`);
  return newGroupCartRef.id;
}

// --- JOIN / LEAVE ---

/**
 * Adds a user to an existing group shopping cart.
 */
export async function joinGroupCart(cartId: string, user: User): Promise<void> {
  const groupCartRef = doc(db, "groupCarts", cartId);
  const groupCartSnap = await getDoc(groupCartRef);

  if (!groupCartSnap.exists()) {
    throw new Error("Group cart not found");
  }

  const groupCartData = groupCartSnap.data() as GroupCart;
  const isMember = groupCartData.members.some(m => m.id === user.id);

  if (!isMember) {
    await updateDoc(groupCartRef, {
      members: arrayUnion(user),
    });
    console.log(`User ${user.name} joined group cart ${cartId}`);
  }
}

/**
 * Removes a user from a group shopping cart.
 */
export async function leaveGroupCart(cartId: string, user: User): Promise<void> {
    const groupCartRef = doc(db, "groupCarts", cartId);
    await updateDoc(groupCartRef, {
      members: arrayRemove(user),
    });
    console.log(`User ${user.name} left group cart ${cartId}`);
}


// --- UPDATE CART ITEMS ---

/**
 * Adds a product to the group cart or increments its quantity.
 */
export async function addProductToGroupCart(cartId: string, product: Product, user: User) {
  const groupCartRef = doc(db, "groupCarts", cartId);
  const batch = writeBatch(db);

  const groupCartSnap = await getDoc(groupCartRef);
  if (!groupCartSnap.exists()) {
    throw new Error("Group cart not found");
  }

  const groupCartData = groupCartSnap.data() as GroupCart;
  const existingItemIndex = groupCartData.cartItems.findIndex(item => item.id === product.id);

  if (existingItemIndex > -1) {
    // Item exists, so we need to update its quantity.
    // Firestore array updates are tricky. We replace the whole array.
    const updatedCartItems = [...groupCartData.cartItems];
    const existingItem = updatedCartItems[existingItemIndex];
    updatedCartItems[existingItemIndex] = { ...existingItem, quantity: existingItem.quantity + 1 };
    
    batch.update(groupCartRef, { cartItems: updatedCartItems });

  } else {
    // Item does not exist, add it to the array.
    const newItem: GroupCartItem = {
      ...product,
      quantity: 1,
      addedBy: user.id,
    };
    batch.update(groupCartRef, {
      cartItems: arrayUnion(newItem),
    });
  }

  await batch.commit();
}
