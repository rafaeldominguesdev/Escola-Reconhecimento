import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  ClipboardListIcon,
  GraduationCapIcon,
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
      <div className="flex min-h-svh flex-col pt-0 transition-colors duration-300">
        <PageHeader
          title="Dashboard"
          subtitle="Visão geral corporativa"
        />

        <main className="flex-1 space-y-5 p-4 lg:p-6 max-w-[1600px] mx-auto w-full">
          <AnimatedItem className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="label-uppercase">
                    Alunos cadastrados
                  </CardTitle>
                </div>
                <div className="p-3 rounded-xl bg-muted border border-border">
                  <GraduationCapIcon className="size-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="flex items-end justify-between pt-1 px-6 pb-6">
                <div className="text-3xl font-bold tracking-tight">
                  {data.totalAlunos}
                </div>
                <Badge variant="secondary">Ativos</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="label-uppercase">
                    Responsáveis
                  </CardTitle>
                </div>
                <div className="p-3 rounded-xl bg-muted border border-border">
                   <Users2Icon className="size-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="flex items-end justify-between pt-1 px-6 pb-6">
                <div className="text-3xl font-bold tracking-tight">
                  {data.totalResponsaveis}
                </div>
                <Badge variant="secondary">Ativos</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="label-uppercase">
                    Registros hoje
                  </CardTitle>
                </div>
                <div className="p-3 rounded-xl bg-muted border border-border">
                  <ClipboardListIcon className="size-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="flex items-end justify-between pt-1 px-6 pb-6">
                <div className="text-3xl font-bold tracking-tight">
                  {data.registrosHoje}
                </div>
                <Badge variant="secondary">Hoje</Badge>
              </CardContent>
            </Card>
          </AnimatedItem>

          <AnimatedItem className="grid gap-8 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader className="border-b border-border/50 pb-4 px-8 pt-8">
                <CardTitle className="label-uppercase">Desempenho Semanal</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <ActivitiesChart data={data.atividades7Dias} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader className="border-b border-border/50 pb-4 px-8 pt-8">
                <CardTitle className="label-uppercase">Resumo Operacional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-8 pt-4">
                <div className="flex justify-between items-center rounded-xl border border-border p-4 bg-muted/30 transition-all">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Total Alunos</span>
                  <span className="font-bold text-xl">{data.totalAlunos}</span>
                </div>

                <div className="flex justify-between items-center rounded-xl border border-border p-4 bg-muted/30 transition-all">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Responsáveis</span>
                  <span className="font-bold text-xl">{data.totalResponsaveis}</span>
                </div>

                <div className="flex justify-between items-center rounded-xl border border-border p-4 bg-muted/30 transition-all">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Atividade Hoje</span>
                  <span className="font-bold text-xl text-foreground">{data.registrosHoje}</span>
                </div>

                <div className="pt-6">
                  <Button className="w-full h-12" asChild>
                    <Link href="/registros">Consultar Base de Dados</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedItem>

          <AnimatedItem className="grid gap-8 lg:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border/50 pb-4 px-8 pt-8">
                <CardTitle className="label-uppercase">Cadastros Recentes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {data.ultimosResponsaveis.length === 0 ? (
                  <div className="py-20 text-center text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">
                    Base de dados vazia
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-border bg-muted/5">
                        <TableHead className="label-uppercase h-10 px-4">Identificação</TableHead>
                        <TableHead className="label-uppercase h-10">Contato</TableHead>
                        <TableHead className="label-uppercase h-10 text-right pr-6">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.ultimosResponsaveis.map((responsavel) => (
                        <TableRow key={responsavel.id} className="group border-b border-border/50">
                          <TableCell className="px-4 py-3">
                            <div className="flex flex-col">
                                <span className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">{responsavel.nome}</span>
                                <span className="text-[9px] text-muted-foreground/50 font-medium uppercase tracking-wider">{responsavel.email || "Sem e-mail"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[11px] font-medium text-muted-foreground/60 py-3">{responsavel.telefone || "-"}</TableCell>
                          <TableCell className="text-right pr-6 py-3">
                             <div className="size-1.5 bg-muted-foreground/40 rounded-full inline-block" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border/50 pb-4 px-8 pt-8">
                <CardTitle className="label-uppercase">Logs de Acesso</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/20">
                      <TableHead className="label-uppercase h-12 px-8 text-center">ID</TableHead>
                      <TableHead className="label-uppercase h-12">Usuário</TableHead>
                      <TableHead className="label-uppercase h-12">Evento</TableHead>
                      <TableHead className="label-uppercase h-12 text-right pr-8">Cronometria</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.ultimosRegistros.map((r) => (
                      <TableRow key={r.id} className="border-b border-border/50 group">
                        <TableCell className="font-bold text-[10px] text-center text-muted-foreground/30 py-4 px-8">{r.id}</TableCell>
                        <TableCell className="text-[14px] font-semibold text-foreground py-4">{r.aluno}</TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                            r.tipo === "EN" 
                              ? "bg-transparent text-foreground border-border" 
                              : "bg-transparent text-muted-foreground border-border"
                          )}>
                            {r.tipo === "EN" ? "Entrada" : "Saída"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-[12px] text-right pr-8 text-muted-foreground/60 py-4">{r.hora}</TableCell>
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