import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const movimentacoes = [
  { aluno: "Ana Souza", tipo: "Entrada", hora: "07:12", status: "Reconhecido" },
  { aluno: "Carla Nunes", tipo: "Entrada", hora: "07:18", status: "Em análise" },
  { aluno: "Bruno Lima", tipo: "Saída", hora: "12:03", status: "Reconhecido" },
]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader
        title="Entradas e saídas"
        subtitle="Acompanhe movimentações do dia"
      />

      <main className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
            <CardDescription>Contagens do dia (mock)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Entradas</div>
              <div className="text-2xl font-semibold tabular-nums">214</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Saídas</div>
              <div className="text-2xl font-semibold tabular-nums">198</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Pendentes</div>
              <div className="text-2xl font-semibold tabular-nums">7</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimentações recentes</CardTitle>
            <CardDescription>Últimos eventos do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimentacoes.map((m) => (
                  <TableRow key={`${m.aluno}-${m.hora}-${m.tipo}`}>
                    <TableCell className="font-medium">{m.aluno}</TableCell>
                    <TableCell>{m.tipo}</TableCell>
                    <TableCell className="tabular-nums">{m.hora}</TableCell>
                    <TableCell>
                      <Badge variant={m.status === "Reconhecido" ? "success" : "warning"}>
                        {m.status}
                      </Badge>
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

