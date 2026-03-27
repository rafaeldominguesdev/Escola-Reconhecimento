import { ShieldAlertIcon } from "lucide-react"

import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const alertas = [
  { id: "ALR-88", titulo: "Visitante detectado", local: "Corredor", quando: "há 2h", severidade: "Alta" },
  { id: "ALR-87", titulo: "Baixa similaridade", local: "Portão", quando: "há 3h", severidade: "Média" },
  { id: "ALR-82", titulo: "Câmera offline", local: "Entrada lateral", quando: "ontem", severidade: "Alta" },
]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader title="Alertas" subtitle="Ocorrências que exigem ação" />

      <main className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Fila de alertas</CardTitle>
            <CardDescription>Revise e marque como resolvido</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Alerta</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Quando</TableHead>
                  <TableHead>Severidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertas.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.id}</TableCell>
                    <TableCell className="font-medium">{a.titulo}</TableCell>
                    <TableCell>{a.local}</TableCell>
                    <TableCell>{a.quando}</TableCell>
                    <TableCell>
                      <Badge variant={a.severidade === "Alta" ? "destructive" : "warning"}>
                        {a.severidade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <ShieldAlertIcon className="size-4" />
                            Revisar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Revisar alerta {a.id}</DialogTitle>
                            <DialogDescription>
                              {a.titulo} • {a.local} • {a.quando}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="rounded-xl border bg-muted/30 p-3 text-sm text-muted-foreground">
                            Aqui você pode plugar a evidência (frame, score de
                            similaridade, logs do modelo etc.).
                          </div>
                          <DialogFooter>
                             <Button>Marcar como resolvido</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

