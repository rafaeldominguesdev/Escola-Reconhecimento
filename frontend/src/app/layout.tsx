import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

import { ThemeInitializer } from "@/components/theme-initializer"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

import { createClient } from "@/utils/supabase/server"

export const metadata: Metadata = {
  title: "Acessível Hub | Gestão Escolar",
  description: "Painel administrativo minimalista para reconhecimento facial",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html
      lang="pt-BR"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable
      )}
      suppressHydrationWarning
    >
      <head>
        <ThemeInitializer />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            {user ? (
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>{children}</SidebarInset>
              </SidebarProvider>
            ) : (
              <div className="flex-1 flex flex-col">
                {children}
              </div>
            )}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}