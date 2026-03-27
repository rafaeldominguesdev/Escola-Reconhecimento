import Link from "next/link"
import {
  CameraIcon,
  ClipboardListIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

import { ActivitiesChart } from "@/components/admin/activities-chart"
import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getDashboardData } from "@/lib/dashboard"

export default async function Page() {
  const data = await getDashboardData()

  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do sistema"
        right={
          <div className="hidden items-center gap-2 sm:flex">
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  Alunos cadastrados
                </CardTitle>
                <CardDescription>Total ativo no sistema</CardDescription>
              </div>
              <UsersIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-3xl font-semibold tabular-nums">
                {data.totalAlunos}
              </div>
              <Badge variant="secondary">ativos</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  Responsáveis
                </CardTitle>
                <CardDescription>Total cadastrado no sistema</CardDescription>
              </div>
              <UserIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-3xl font-semibold tabular-nums">
                {data.totalResponsaveis}
              </div>
              <Badge variant="secondary">ativos</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  Registros hoje
                </CardTitle>
                <CardDescription>Entradas e saídas registradas</CardDescription>
              </div>
              <ClipboardListIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-3xl font-semibold tabular-nums">
                {data.registrosHoje}
              </div>
              <Badge variant="secondary">hoje</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">Câmeras</CardTitle>
                <CardDescription>Status do feed ao vivo</CardDescription>
              </div>
              <CameraIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-3xl font-semibold tabular-nums">--</div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/camera-ao-vivo">Abrir</Link>
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
              <ActivitiesChart data={data.atividades7Dias} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Resumo rápido</CardTitle>
              <CardDescription>Indicadores principais do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-xl border bg-card/50 p-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">Alunos</div>
                  <div className="truncate text-xs text-muted-foreground">
                    Total de alunos cadastrados
                  </div>
                </div>
                <Badge variant="secondary">{data.totalAlunos}</Badge>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border bg-card/50 p-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">Responsáveis</div>
                  <div className="truncate text-xs text-muted-foreground">
                    Total de responsáveis cadastrados
                  </div>
                </div>
                <Badge variant="secondary">{data.totalResponsaveis}</Badge>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border bg-card/50 p-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">Registros hoje</div>
                  <div className="truncate text-xs text-muted-foreground">
                    Entradas e saídas registradas
                  </div>
                </div>
                <Badge variant="secondary">{data.registrosHoje}</Badge>
              </div>

              <Separator />

              <Button variant="outline" className="w-full" asChild>
                <Link href="/registros">Ver registros</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimos registros</CardTitle>
            <CardDescription>Entradas e saídas recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {data.ultimosRegistros.length === 0 ? (
              <div className="py-6 text-sm text-muted-foreground">
                Nenhum registro encontrado.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.ultimosRegistros.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell className="font-mono text-xs">
                        {registro.id}
                      </TableCell>
                      <TableCell>{registro.tipo}</TableCell>
                      <TableCell>{registro.aluno}</TableCell>
                      <TableCell className="tabular-nums">
                        {registro.hora}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{registro.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}