import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const responsaveis = [
  { nome: "Maria Souza", aluno: "Ana Souza", contato: "(11) 99999-0000", status: "Ativo" },
  { nome: "Paulo Lima", aluno: "Bruno Lima", contato: "(11) 98888-0000", status: "Ativo" },
  { nome: "Renata Nunes", aluno: "Carla Nunes", contato: "(11) 97777-0000", status: "Pendente" },
]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader title="Responsáveis" subtitle="Vínculos e contatos principais" />

      <main className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader className="gap-3">
            <CardTitle>Lista</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input placeholder="Buscar por responsável/aluno…" />
              <Button variant="outline">Filtrar</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responsaveis.map((r) => (
                  <TableRow key={`${r.nome}-${r.aluno}`}>
                    <TableCell className="font-medium">{r.nome}</TableCell>
                    <TableCell>{r.aluno}</TableCell>
                    <TableCell className="tabular-nums">{r.contato}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "Ativo" ? "success" : "warning"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Ver
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

