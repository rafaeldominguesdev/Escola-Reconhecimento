import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const canais = [
  { camera: "Portão principal", status: "Online", fps: 24, ultimaDeteccao: "há 3s" },
  { camera: "Corredor A", status: "Online", fps: 18, ultimaDeteccao: "há 10s" },
  { camera: "Pátio", status: "Instável", fps: 10, ultimaDeteccao: "há 1m" },
  { camera: "Entrada lateral", status: "Offline", fps: 0, ultimaDeteccao: "—" },
]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader
        title="Monitoramento"
        subtitle="Saúde do processamento e status das câmeras"
        right={
          <Button asChild>
            <Link href="/camera-ao-vivo">
              Abrir câmera ao vivo
              <ArrowUpRightIcon className="ml-1.5 size-4" />
            </Link>
          </Button>
        }
      />

      <main className="flex-1 space-y-4 p-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline</CardTitle>
              <CardDescription>Detecção → reconhecimento → registro</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-semibold">OK</div>
              <Badge variant="success">saudável</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fila</CardTitle>
              <CardDescription>Eventos pendentes</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-semibold tabular-nums">7</div>
              <Badge variant="warning">atenção</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Latência</CardTitle>
              <CardDescription>Média (últimos 5 min)</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-semibold tabular-nums">210ms</div>
              <Badge variant="secondary">normal</Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Câmeras</CardTitle>
            <CardDescription>Status por canal</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Câmera</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>FPS</TableHead>
                  <TableHead>Última detecção</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {canais.map((c) => (
                  <TableRow key={c.camera}>
                    <TableCell className="font-medium">{c.camera}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.status === "Online"
                            ? "success"
                            : c.status === "Instável"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">{c.fps}</TableCell>
                    <TableCell>{c.ultimaDeteccao}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/camera-ao-vivo">Ver</Link>
                      </Button>
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

