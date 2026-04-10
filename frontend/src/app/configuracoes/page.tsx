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
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"

export default function Page() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader title="Configurações" subtitle="Ajustes do sistema (mock)" />

      <main className="flex-1 space-y-4 p-4">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>
              Escolha entre o tema claro, escuro ou automático do sistema.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-4">
            {!mounted ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1 min-w-[120px]"
                  disabled
                >
                  <Sun className="mr-2 size-4" />
                  Claro
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 min-w-[120px]"
                  disabled
                >
                  <Moon className="mr-2 size-4" />
                  Escuro
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 min-w-[120px]"
                  disabled
                >
                  <Monitor className="mr-2 size-4" />
                  Sistema
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </CardContent>
        </Card>
          
      </main>
    </div>
  )
}