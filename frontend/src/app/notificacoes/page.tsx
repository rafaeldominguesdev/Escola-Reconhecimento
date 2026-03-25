import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const notificacoes = [
  { tipo: "Sistema", mensagem: "Atualização de modelo aplicada com sucesso.", quando: "há 12m", prioridade: "Baixa" },
  { tipo: "Monitoramento", mensagem: "Câmera “Pátio” com instabilidade.", quando: "há 1h", prioridade: "Média" },
  { tipo: "Segurança", mensagem: "Detecção de visitante no corredor.", quando: "há 2h", prioridade: "Alta" },
]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader title="Notificações" subtitle="Mensagens do sistema e monitoramento" />

      <main className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Caixa de entrada</CardTitle>
            <CardDescription>Eventos informativos e operacionais</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Quando</TableHead>
                  <TableHead>Prioridade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notificacoes.map((n) => (
                  <TableRow key={`${n.tipo}-${n.quando}`}>
                    <TableCell className="font-medium">{n.tipo}</TableCell>
                    <TableCell>{n.mensagem}</TableCell>
                    <TableCell>{n.quando}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          n.prioridade === "Alta"
                            ? "destructive"
                            : n.prioridade === "Média"
                              ? "warning"
                              : "secondary"
                        }
                      >
                        {n.prioridade}
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

