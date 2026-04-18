import Link from "next/link"
import {
  ClipboardListIcon,
  GraduationCapIcon,
  UserRoundPlusIcon,
  Users2Icon,
} from "lucide-react"

import { ActivitiesChart } from "@/components/admin/activities-chart"
import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageWrapper, AnimatedItem } from "@/components/page-wrapper"
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
    <PageWrapper>
      <div className="flex min-h-svh flex-col">
        <PageHeader
          title="Dashboard"
          subtitle="Visão geral do sistema"
        />

        <main className="flex-1 space-y-4 p-4">
          <AnimatedItem className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  Alunos cadastrados
                </CardTitle>
                <CardDescription>Total ativo no sistema</CardDescription>
              </div>
              <GraduationCapIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-3xl font-semibold">
                {data.totalAlunos}
              </div>
              <Badge variant="secondary">ativos</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  Responsáveis
                </CardTitle>
                <CardDescription>Total cadastrado</CardDescription>
              </div>
              <Users2Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-3xl font-semibold">
                {data.totalResponsaveis}
              </div>
              <Badge variant="secondary">ativos</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  Registros hoje
                </CardTitle>
                <CardDescription>Entradas e saídas</CardDescription>
              </div>
              <ClipboardListIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-3xl font-semibold">
                {data.registrosHoje}
              </div>
              <Badge variant="secondary">hoje</Badge>
            </CardContent>
          </Card>
          </AnimatedItem>

          <AnimatedItem className="grid gap-4 lg:grid-cols-7">
            <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Atividade (últimos 7 dias)</CardTitle>
              <CardDescription>Reconhecimentos por dia</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivitiesChart data={data.atividades7Dias} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Resumo rápido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between rounded-md border p-3">
                <span>Alunos</span>
                <Badge>{data.totalAlunos}</Badge>
              </div>

              <div className="flex justify-between rounded-md border p-3">
                <span>Responsáveis</span>
                <Badge>{data.totalResponsaveis}</Badge>
              </div>

              <div className="flex justify-between rounded-md border p-3">
                <span>Registros hoje</span>
                <Badge>{data.registrosHoje}</Badge>
              </div>

              <Separator />

              <Button variant="outline" className="w-full" asChild>
                <Link href="/registros">Ver registros</Link>
              </Button>
            </CardContent>
            </Card>
          </AnimatedItem>

          <AnimatedItem className="grid gap-4 lg:grid-cols-2">
            <Card>
            <CardHeader>
              <CardTitle>Últimos responsáveis cadastrados</CardTitle>
              <CardDescription>Dados vindos da tabela responsaveis</CardDescription>
            </CardHeader>
            <CardContent>
              {data.ultimosResponsaveis.length === 0 ? (
                <div className="py-6 text-sm text-muted-foreground">
                  Nenhum responsável encontrado.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.ultimosResponsaveis.map((responsavel) => (
                      <TableRow key={responsavel.id}>
                        <TableCell>{responsavel.nome}</TableCell>
                        <TableCell>{responsavel.telefone || "-"}</TableCell>
                        <TableCell>{responsavel.email || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimos registros</CardTitle>
              <CardDescription>Entradas e saídas recentes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Hora</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.ultimosRegistros.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.aluno}</TableCell>
                      <TableCell>{r.tipo}</TableCell>
                      <TableCell>{r.hora}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </AnimatedItem>
        </main>
      </div>
    </PageWrapper>
  )
}