import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
})

import { createClient } from "@/utils/supabase/server"

export const metadata: Metadata = {
  title: "Acessível Hub | Gestão Escolar",
  description: "Painel administrativo de alta performance para reconhecimento facial",
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
        inter.variable,
        playfair.variable
      )}

      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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