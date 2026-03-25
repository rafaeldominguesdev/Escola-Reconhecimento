import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader title="Configurações" subtitle="Ajustes do sistema (mock)" />

      <main className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros</CardTitle>
            <CardDescription>
              Pontos para integração de thresholds, webhooks e regras de alerta.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Threshold de similaridade</div>
              <Input placeholder="Ex.: 0.78" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Retenção de registros (dias)</div>
              <Input placeholder="Ex.: 90" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button>Salvar</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

