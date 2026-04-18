"use client"

import { useEffect, useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
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

import { PageWrapper, AnimatedItem } from "@/components/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

type EntradaSaida = {
  id: number
  tipo: string
  data_hora: string
  mensagem_enviada: boolean | null
  observacao: string | null
  aluno: string
}

interface RegistroDB {
  id: number
  tipo: string
  data_hora: string
  mensagem_enviada: boolean | null
  observacao: string | null
  alunos: {
    nome: string
  } | null
}

export default function EntradasSaidasPage() {
  const [dados, setDados] = useState<EntradaSaida[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | "entrada" | "saida">("todos")

  useEffect(() => {
    async function carregarDados() {
      setLoading(true)
      setError("")

      const { data, error } = await supabase
        .from("registros")
        .select(`
          id,
          tipo,
          data_hora,
          mensagem_enviada,
          observacao,
          alunos (
            nome
          )
        `)
        .order("data_hora", { ascending: false })

      if (error) {
        console.error(error)
        setError("Erro ao carregar entradas e saídas.")
        setDados([])
        setLoading(false)
        return
      }

      const dadosFormatados: EntradaSaida[] = (data as unknown as RegistroDB[] || []).map((item) => ({
        id: item.id,
        tipo: item.tipo,
        data_hora: item.data_hora,
        mensagem_enviada: item.mensagem_enviada,
        observacao: item.observacao,
        aluno: item.alunos?.nome || "Aluno não encontrado",
      }))

      setDados(dadosFormatados)
      setLoading(false)
    }

    carregarDados()
  }, [])

  const dadosFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase()

    return dados.filter((item) => {
      const matchBusca =
        !termo ||
        item.aluno.toLowerCase().includes(termo) ||
        item.tipo.toLowerCase().includes(termo) ||
        String(item.id).includes(termo) ||
        (item.observacao || "").toLowerCase().includes(termo)

      const matchTipo =
        tipoFiltro === "todos" || item.tipo.toLowerCase() === tipoFiltro

      return matchBusca && matchTipo
    })
  }, [dados, search, tipoFiltro])

  const totalEntradas = dados.filter((item) => item.tipo.toLowerCase() === "entrada").length
  const totalSaidas = dados.filter((item) => item.tipo.toLowerCase() === "saida").length
  const totalGeral = dados.length

  function formatarDataHora(dataHora: string) {
    return new Date(dataHora).toLocaleString("pt-BR")
  }

  return (
    <PageWrapper>
      <div className="space-y-6 p-6">
        <AnimatedItem>
          <h1 className="text-2xl font-semibold tracking-tight">Entradas e saídas</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe o fluxo de entrada e saída dos alunos.
          </p>
        </AnimatedItem>

        <AnimatedItem className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/40 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold uppercase tracking-wider text-muted-foreground">Total de entradas</CardTitle>
              <CardDescription className="text-sm">Registros de entrada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight">{totalEntradas}</div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold uppercase tracking-wider text-muted-foreground">Total de saídas</CardTitle>
              <CardDescription className="text-sm">Registros de saída</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight">{totalSaidas}</div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm bg-accent/20 transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold uppercase tracking-wider text-muted-foreground">Total geral</CardTitle>
              <CardDescription className="text-sm">Entradas e saídas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight">{totalGeral}</div>
            </CardContent>
          </Card>
        </AnimatedItem>

        <AnimatedItem>
          <Card>
            <CardHeader className="space-y-4">
              <div>
                <CardTitle>Histórico de entradas e saídas</CardTitle>
                <CardDescription>
                  Busque por aluno, ID, observação e filtre por tipo.
                </CardDescription>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative w-full md:max-w-sm">
                  <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar entrada ou saída..."
                    className="pl-9"
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/40 shadow-inner">
                  <Button
                    variant={tipoFiltro === "todos" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setTipoFiltro("todos")}
                    className={cn(
                      "h-9 px-5 text-sm font-heading font-medium transition-all duration-200 rounded-lg",
                      tipoFiltro === "todos" ? "bg-accent/80 text-accent-foreground shadow-md shadow-white/10 ring-1 ring-border/50 hover:bg-accent" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={tipoFiltro === "entrada" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setTipoFiltro("entrada")}
                    className={cn(
                      "h-9 px-5 text-sm font-heading font-medium transition-all duration-200 rounded-lg",
                      tipoFiltro === "entrada" ? "bg-accent/80 text-accent-foreground shadow-md shadow-white/10 ring-1 ring-border/50 hover:bg-accent" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Entrada
                  </Button>
                  <Button
                    variant={tipoFiltro === "saida" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setTipoFiltro("saida")}
                    className={cn(
                      "h-9 px-5 text-sm font-heading font-medium transition-all duration-200 rounded-lg",
                      tipoFiltro === "saida" ? "bg-accent/80 text-accent-foreground shadow-md shadow-white/10 ring-1 ring-border/50 hover:bg-accent" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Saída
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="space-y-3 py-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : error ? (
                <div className="py-10 text-sm text-red-500">{error}</div>
              ) : dados.length === 0 ? (
                <div className="py-10 text-sm text-muted-foreground">
                  Nenhum registro encontrado.
                </div>
              ) : dadosFiltrados.length === 0 ? (
                <div className="py-10 text-sm text-muted-foreground">
                  Nenhum resultado para os filtros aplicados.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Alunos</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Mensagem</TableHead>
                        <TableHead>Observação</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {dadosFiltrados.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell className="font-medium">{item.aluno}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{item.tipo}</Badge>
                          </TableCell>
                          <TableCell>{formatarDataHora(item.data_hora)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {item.mensagem_enviada ? "Enviada" : "Pendente"}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.observacao || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedItem>
      </div>
    </PageWrapper>
  )
}