import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const registros = [
  { id: "RG-2103", aluno: "Ana Souza", tipo: "Entrada", data: "25/03/2026", hora: "07:12", camera: "Portão principal", status: "Reconhecido" },
  { id: "RG-2102", aluno: "Bruno Lima", tipo: "Saída", data: "25/03/2026", hora: "12:03", camera: "Portão principal", status: "Reconhecido" },
  { id: "RG-2098", aluno: "Carla Nunes", tipo: "Entrada", data: "25/03/2026", hora: "07:18", camera: "Corredor A", status: "Em análise" },
]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader title="Registros" subtitle="Histórico consolidado de eventos" />

      <main className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader className="gap-3">
            <CardTitle>Filtrar</CardTitle>
            <div className="grid gap-2 md:grid-cols-3">
              <Input placeholder="Buscar por aluno/ID…" />
              <Input placeholder="Data (ex.: 25/03/2026)" />
              <Button variant="outline">Aplicar</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Câmera</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.aluno}</TableCell>
                    <TableCell>{r.tipo}</TableCell>
                    <TableCell className="tabular-nums">{r.data}</TableCell>
                    <TableCell className="tabular-nums">{r.hora}</TableCell>
                    <TableCell>{r.camera}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "Reconhecido" ? "success" : "warning"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Detalhes
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

