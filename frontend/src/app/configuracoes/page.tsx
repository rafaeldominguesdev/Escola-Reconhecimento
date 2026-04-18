"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { PageWrapper, AnimatedItem } from "@/components/page-wrapper"

export default function Page() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <PageWrapper>
      <div className="flex min-h-svh flex-col">
        <PageHeader title="Configurações" subtitle="Ajustes do sistema (mock)" />

        <main className="flex-1 space-y-4 p-4">
          <AnimatedItem>
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Escolha entre o tema claro, escuro ou automático do sistema.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-4">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="flex-1 min-w-[120px]"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="mr-2 size-4" />
                  Claro
                </Button>

                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="flex-1 min-w-[120px]"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="mr-2 size-4" />
                  Escuro
                </Button>

                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="flex-1 min-w-[120px]"
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="mr-2 size-4" />
                  Sistema
                </Button>
              </CardContent>
            </Card>
          </AnimatedItem>
        </main>
      </div>
    </PageWrapper>
  )
}