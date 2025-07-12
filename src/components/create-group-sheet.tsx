"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Copy, Check, Users } from "lucide-react"
import { useGroupShopping } from "@/context/group-shopping-provider"
import { createGroupCart } from "@/lib/firebase/group-shopping"
import { useToast } from "@/hooks/use-toast"

export function CreateGroupSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [hasCopied, setHasCopied] = useState(false);
  const { currentUser, setGroupCartId } = useGroupShopping();
  const { toast } = useToast();

  const handleCreateGroup = async () => {
    setIsLoading(true);
    try {
      const newCartId = await createGroupCart(currentUser);
      setGroupCartId(newCartId);
      const link = `${window.location.origin}/join/${newCartId}`;
      setInviteLink(link);
      toast({
        title: "Group created!",
        description: "You can now invite others to shop with you.",
      });
    } catch (error) {
      console.error("Error creating group cart:", error);
      toast({
        variant: "destructive",
        title: "Failed to create group",
        description: "There was an issue creating the group cart. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const resetState = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset when sheet closes
      setInviteLink("");
      setIsLoading(false);
      setHasCopied(false);
    }
    setOpen(isOpen);
  }

  return (
    <Sheet open={open} onOpenChange={resetState}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Start a Group Shopping Session</SheetTitle>
          <SheetDescription>
            Create a shared cart and invite your friends to shop together in real-time.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-8">
          {!inviteLink ? (
            <Button onClick={handleCreateGroup} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Group...
                </>
              ) : (
                <>
                 <Users className="mr-2 h-4 w-4"/>
                 Create Group & Get Invite Link
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-center">Your group is ready!</h3>
              <p className="text-sm text-muted-foreground text-center">Share this link with your friends to invite them.</p>
              <div className="space-y-2">
                <Label htmlFor="invite-link">Invite Link</Label>
                <div className="flex gap-2">
                    <Input id="invite-link" value={inviteLink} readOnly />
                    <Button variant="outline" size="icon" onClick={handleCopy}>
                        {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <SheetFooter>
           <p className="text-xs text-muted-foreground">Once your friends join, you'll see them in the group cart.</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
