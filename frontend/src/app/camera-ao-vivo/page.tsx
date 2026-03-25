import { CameraIcon, RefreshCcwIcon } from "lucide-react"

import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader
        title="Câmera ao vivo"
        subtitle="Prévia do feed e indicadores (mock)"
        right={
          <Button variant="outline">
            <RefreshCcwIcon className="size-4" />
            Atualizar
          </Button>
        }
      />

      <main className="flex-1 space-y-4 p-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Feed</CardTitle>
              <CardDescription>Integre aqui o stream real (WebRTC/RTSP)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid aspect-video w-full place-items-center rounded-2xl border bg-muted/40">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CameraIcon className="size-4" />
                  Prévia do vídeo (placeholder)
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indicadores</CardTitle>
              <CardDescription>Status do canal selecionado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div className="text-sm">Status</div>
                <Badge variant="success">Online</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div className="text-sm">FPS</div>
                <div className="font-medium tabular-nums">24</div>
              </div>
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div className="text-sm">Detecções/min</div>
                <div className="font-medium tabular-nums">32</div>
              </div>
              <Button className="w-full">Marcar evento</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

