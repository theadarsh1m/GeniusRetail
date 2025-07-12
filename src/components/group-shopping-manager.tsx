"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGroupShopping } from "@/context/group-shopping-provider";
import { joinGroupCart } from "@/lib/firebase/group-shopping";
import { useToast } from "@/hooks/use-toast";

/**
 * This component handles the logic for joining a group shopping session
 * when a user navigates to a `/join/:cartId` URL.
 */
export function GroupShoppingManager() {
  const pathname = usePathname();
  const router = useRouter();
  const { setGroupCartId, currentUser } = useGroupShopping();
  const { toast } = useToast();

  useEffect(() => {
    const handleJoinGroup = async () => {
      if (pathname.startsWith("/join/")) {
        const cartId = pathname.split("/").pop();
        if (cartId) {
          try {
            // Add the current user to the group in Firestore
            await joinGroupCart(cartId, currentUser);
            
            // Set the active group cart ID in the context/local storage
            setGroupCartId(cartId);

            toast({
              title: "Joined Group!",
              description: "You're now shopping with your friends.",
            });
            
            // Redirect to homepage after successfully joining
            router.replace("/");

          } catch (error) {
            console.error("Failed to join group:", error);
            toast({
              variant: "destructive",
              title: "Failed to Join Group",
              description: "The invite link may be invalid or expired. Please check with the group owner.",
            });
            router.replace("/");
          }
        }
      }
    };

    handleJoinGroup();
  }, [pathname, currentUser, setGroupCartId, router, toast]);

  // This component does not render anything itself
  return null;
}
