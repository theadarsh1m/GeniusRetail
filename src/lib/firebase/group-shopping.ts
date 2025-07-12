

"use server";

import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  writeBatch,
  FieldValue,
  serverTimestamp,
  runTransaction
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type User, type GroupCart, type Product, type GroupCartItem } from "@/lib/types";

// --- CREATE ---

/**
 * Creates a new group shopping cart in Firestore.
 */
export async function createGroupCart(owner: User): Promise<string> {
  if (!owner || !owner.id) {
    throw new Error("A valid owner with an ID is required to create a group cart.");
  }
  
  const groupCartsRef = collection(db, "groupCarts");
  const newGroupCartRef = doc(groupCartsRef);

  // Ensure owner is a plain object for Firestore
  const plainOwner = { id: owner.id, name: owner.name };

  const newGroupCart: Omit<GroupCart, 'createdAt'> & { createdAt: FieldValue } = {
    id: newGroupCartRef.id,
    ownerId: owner.id,
    members: [plainOwner],
    memberIds: [owner.id], // Add owner's ID to the memberIds list
    cartItems: [],
    createdAt: serverTimestamp(),
  };

  await setDoc(newGroupCartRef, newGroupCart);
  console.log(`Group cart created with ID: ${newGroupCartRef.id}`);
  return newGroupCartRef.id;
}

// --- JOIN / LEAVE ---

/**
 * Adds a user to an existing group shopping cart.
 * This function attempts a write directly, as security rules prevent non-members from reading.
 * The `arrayUnion` operation is idempotent and will not add duplicates.
 */
export async function joinGroupCart(cartId: string, user: User): Promise<void> {
  if (!user || !user.id) {
    throw new Error("A valid user with an ID is required to join a group cart.");
  }
  const groupCartRef = doc(db, "groupCarts", cartId);
  const plainUser = { id: user.id, name: user.name };

  try {
    await updateDoc(groupCartRef, {
      members: arrayUnion(plainUser),
      memberIds: arrayUnion(user.id),
    });
    console.log(`User ${user.name} successfully joined or was already in group cart ${cartId}`);
  } catch (error) {
    console.error(`Failed to join group cart ${cartId}:`, error);
    // Rethrow a more user-friendly error
    throw new Error("Failed to join the group. The invite link may be invalid or expired.");
  }
}

/**
 * Removes a user from a group shopping cart.
 */
export async function leaveGroupCart(cartId: string, user: User): Promise<void> {
    const groupCartRef = doc(db, "groupCarts", cartId);
    // Ensure user is a plain object for Firestore
    const plainUser = { id: user.id, name: user.name };
    await updateDoc(groupCartRef, {
      members: arrayRemove(plainUser),
      memberIds: arrayRemove(user.id), // Also remove from the memberIds list
    });
    console.log(`User ${user.name} left group cart ${cartId}`);
}


// --- UPDATE CART ITEMS ---

/**
 * Adds a product to the group cart or increments its quantity using a transaction.
 */
export async function addProductToGroupCart(cartId: string, product: Product, user: User) {
  const groupCartRef = doc(db, "groupCarts", cartId);

  try {
    await runTransaction(db, async (transaction) => {
      const groupCartSnap = await transaction.get(groupCartRef);
      if (!groupCartSnap.exists()) {
        throw new Error("Group cart not found");
      }

      const groupCartData = groupCartSnap.data() as GroupCart;
      const existingItemIndex = groupCartData.cartItems.findIndex(item => item.id === product.id);
      let updatedCartItems = [...groupCartData.cartItems];

      if (existingItemIndex > -1) {
        // Item exists, so we update its quantity.
        const existingItem = updatedCartItems[existingItemIndex];
        updatedCartItems[existingItemIndex] = { ...existingItem, quantity: existingItem.quantity + 1 };
      } else {
        // Item does not exist, add it to the array.
        // Sanitize product data to prevent undefined fields
        const sanitizedProduct: Product = {
          ...product,
          views: product.views ?? 0,
          wishlistCount: product.wishlistCount ?? 0,
          timeSpent: product.timeSpent ?? 0,
          deal: product.deal ?? "",
          relatedItems: product.relatedItems ?? [],
        };

        const newItem: GroupCartItem = {
          ...sanitizedProduct,
          quantity: 1,
          addedBy: user.id,
        };
        updatedCartItems.push(newItem);
      }
      
      transaction.update(groupCartRef, { cartItems: updatedCartItems });
    });
    console.log(`Product ${product.name} added/updated in cart ${cartId}`);
  } catch (error) {
    console.error("Transaction failed: ", error);
    throw new Error("Could not add product to cart. Please try again.");
  }
}
