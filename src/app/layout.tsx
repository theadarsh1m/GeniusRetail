import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import { FloatingCartButton } from "@/components/floating-cart-button";
import { cn } from "@/lib/utils";
import { GroupShoppingProvider } from "@/context/group-shopping-provider";
import { GroupShoppingManager } from "@/components/group-shopping-manager";

export const metadata: Metadata = {
  title: "RetailGeniusAI - AI-Powered Shopping Experience",
  description:
    "Discover amazing products with AI-powered recommendations and smart shopping features.",
  keywords: ["AI shopping", "ecommerce", "smart recommendations", "retail"],
  authors: [{ name: "RetailGeniusAI Team" }],
  openGraph: {
    title: "RetailGeniusAI - AI-Powered Shopping Experience",
    description:
      "Discover amazing products with AI-powered recommendations and smart shopping features.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={cn(
          "font-body antialiased bg-background text-foreground min-h-screen",
        )}
      >
        <GroupShoppingProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 relative">
                  {children}
                  <FloatingCartButton />
                </main>
              </div>
            </div>
          </SidebarProvider>

          {/* Enhanced Toast System */}
          <Toaster />

          {/* Group Shopping Manager */}
          <GroupShoppingManager />

          {/* Background Effects */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>
        </GroupShoppingProvider>
      </body>
    </html>
  );
}
