
"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Users, UserX } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { DynamicProductImage } from "./dynamic-product-image"
import { useGroupShopping } from "@/context/group-shopping-provider"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { mockUser } from "@/lib/mock-data"
import { leaveGroupCart } from "@/lib/firebase/group-shopping"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function GroupCartSheet() {
  const { groupCart, setGroupCartId } = useGroupShopping()
  const { toast } = useToast()

  if (!groupCart) return null;
  
  const subtotal = groupCart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleLeaveGroup = async () => {
    try {
      await leaveGroupCart(groupCart.id, mockUser);
      setGroupCartId(null);
      toast({
        title: "You have left the group",
        description: "Your cart is now back to your personal cart.",
      });
    } catch (error) {
      console.error("Error leaving group:", error);
      toast({
        variant: "destructive",
        title: "Failed to leave group",
        description: "There was a problem leaving the group. Please try again.",
      });
    }
  };

  const getUserById = (userId: string) => {
    return groupCart.members.find(m => m.id === userId);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Users className="h-5 w-5 text-accent" />
          {groupCart.cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
              {groupCart.cartItems.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Group Shopping Cart</SheetTitle>
          <SheetDescription>This cart is shared with your group. Shop together!</SheetDescription>
        </SheetHeader>
        
        <div className="my-4">
            <h4 className="font-semibold mb-2">Members</h4>
            <div className="flex items-center gap-2">
                {groupCart.members.map(member => (
                    <Avatar key={member.id}>
                        <AvatarImage src={`https://placehold.co/40x40/E89F71/FFFFFF?text=${member.name.charAt(0)}`} alt={member.name} data-ai-hint="user avatar" />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
        </div>

        <Separator />

        {groupCart.cartItems.length > 0 ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 mt-4">
              {groupCart.cartItems.map(item => {
                const addedByUser = getUserById(item.addedBy);
                return (
                  <div key={item.id} className="mb-4">
                    <div className="flex items-start gap-4">
                      <DynamicProductImage
                        query={item.aiHint}
                        fallbackSrc={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="text-xs text-muted-foreground mt-1">Added by: {addedByUser?.name || 'A member'}</p>
                      </div>
                      <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <SheetFooter className="mt-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90" size="lg">Checkout Together</Button>
                
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <UserX className="mr-2 h-4 w-4" />
                      Leave Group
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        If you leave, you'll stop sharing your cart with this group. You can always rejoin later using the invite link.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLeaveGroup}>Leave Group</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </SheetFooter>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center flex-1">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">Your group cart is empty</p>
            <p className="text-muted-foreground">Add some products to get started.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
