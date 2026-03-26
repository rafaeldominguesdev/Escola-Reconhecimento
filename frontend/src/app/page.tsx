import Link from "next/link"
import { ArrowUpRightIcon, CameraIcon, UsersIcon } from "lucide-react"

import { ActivitiesChart } from "@/components/admin/activities-chart"
import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const recentEvents = [
  { id: "EVT-1042", tipo: "Entrada", aluno: "Ana Souza", hora: "07:12", status: "Reconhecido" },
  { id: "EVT-1041", tipo: "Saída", aluno: "Bruno Lima", hora: "12:03", status: "Reconhecido" },
  { id: "EVT-1039", tipo: "Entrada", aluno: "Carla Nunes", hora: "07:18", status: "Em análise" },
  { id: "EVT-1036", tipo: "Alerta", aluno: "Visitante", hora: "09:44", status: "Atenção" },
]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do sistema e status do monitoramento"
        right={
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="outline" asChild>
              <Link href="/monitoramento">
                Monitoramento
                <ArrowUpRightIcon className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button asChild>
              <Link href="/alunos/novo">
                <UsersIcon className="size-4" />
                Cadastrar aluno
              </Link>
            </Button>
          </div>
        }
      />

      <main className="flex-1 space-y-4 p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Alunos cadastrados</CardTitle>
              <CardDescription>Total ativo no sistema</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-3xl font-semibold tabular-nums">1.248</div>
              <Badge variant="secondary">+12 esta semana</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reconhecimentos hoje</CardTitle>
              <CardDescription>Entradas/saídas identificadas</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-3xl font-semibold tabular-nums">386</div>
              <Badge variant="success">98,2% OK</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Em análise</CardTitle>
              <CardDescription>Eventos aguardando revisão</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-3xl font-semibold tabular-nums">7</div>
              <Badge variant="warning">revisar</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Câmeras</CardTitle>
              <CardDescription>Status do feed ao vivo</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-3xl font-semibold tabular-nums">4/5</div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/camera-ao-vivo">
                  <CameraIcon className="size-4" />
                  Abrir
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-7">
          <Card className="min-w-0 overflow-hidden lg:col-span-4">
            <CardHeader>
              <CardTitle>Atividade (últimos 7 dias)</CardTitle>
              <CardDescription>Reconhecimentos por dia</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ActivitiesChart />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Fila de atenção</CardTitle>
              <CardDescription>Eventos que exigem ação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-xl border bg-card/50 p-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">Carla Nunes</div>
                  <div className="truncate text-xs text-muted-foreground">
                    Entrada 07:18 • Similaridade baixa
                  </div>
                </div>
                <Badge variant="warning">revisar</Badge>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl border bg-card/50 p-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">Visitante</div>
                  <div className="truncate text-xs text-muted-foreground">
                    Corredor • Detecção de face
                  </div>
                </div>
                <Badge variant="destructive">alerta</Badge>
              </div>
              <Separator />
              <Button variant="outline" className="w-full" asChild>
                <Link href="/alertas">Ver todos os alertas</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimos registros</CardTitle>
            <CardDescription>Entradas, saídas e alertas recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvents.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-xs">{e.id}</TableCell>
                    <TableCell>{e.tipo}</TableCell>
                    <TableCell>{e.aluno}</TableCell>
                    <TableCell className="tabular-nums">{e.hora}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          e.status === "Reconhecido"
                            ? "success"
                            : e.status === "Em análise"
                              ? "warning"
                              : e.status === "Atenção"
                                ? "destructive"
                                : "secondary"
                        }
                      >
                        {e.status}
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