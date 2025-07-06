"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { mockCartItems, type Product } from "@/lib/mock-data"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export function CartSheet() {
  const [items, setItems] = useState(mockCartItems)

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        {items.length > 0 ? (
          <div className="flex h-full flex-col justify-between">
            <div className="flex-1 overflow-y-auto pr-4">
              {items.map(item => (
                <div key={item.product.id} className="mt-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                      data-ai-hint={item.product.aiHint}
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
            <SheetFooter className="mt-4">
              <div className="w-full">
                <div className="flex justify-between items-center font-bold text-lg mb-4">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90" size="lg">Checkout</Button>
              </div>
            </SheetFooter>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="text-muted-foreground">Add some products to get started.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
