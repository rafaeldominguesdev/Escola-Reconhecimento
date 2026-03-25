import Link from "next/link"

import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader title="Sair" subtitle="Encerrar sessão (mock)" />

      <main className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Deseja sair?</CardTitle>
            <CardDescription>
              Aqui você pode integrar o fluxo real de logout.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" asChild>
              <Link href="/">Cancelar</Link>
            </Button>
            <Button>Confirmar saída</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

