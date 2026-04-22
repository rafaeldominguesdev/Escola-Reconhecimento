"use client"

import { useEffect, useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageWrapper, AnimatedItem } from "@/components/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Registro = {
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

export default function RegistrosPage() {
  const [registros, setRegistros] = useState<Registro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | "entrada" | "saida">("todos")

  useEffect(() => {
    async function carregarRegistros() {
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
        setError("Erro ao carregar registros.")
        setRegistros([])
        setLoading(false)
        return
      }

      const registrosFormatados: Registro[] = (data as unknown as RegistroDB[] || []).map((item) => ({
        id: item.id,
        tipo: item.tipo,
        data_hora: item.data_hora,
        mensagem_enviada: item.mensagem_enviada,
        observacao: item.observacao,
        aluno: item.alunos?.nome || "Aluno não encontrado",
      }))

      setRegistros(registrosFormatados)
      setLoading(false)
    }

    carregarRegistros()
  }, [])

  const registrosFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase()

    return registros.filter((registro) => {
      const matchBusca =
        !termo ||
        registro.aluno.toLowerCase().includes(termo) ||
        registro.tipo.toLowerCase().includes(termo) ||
        String(registro.id).includes(termo) ||
        (registro.observacao || "").toLowerCase().includes(termo)

      const matchTipo =
        tipoFiltro === "todos" || registro.tipo.toLowerCase() === tipoFiltro

      return matchBusca && matchTipo
    })
  }, [registros, search, tipoFiltro])

  const totalEntradas = useMemo(() => 
    registros.filter((r) => r.tipo.toLowerCase() === "entrada").length,
    [registros]
  )
  const totalSaidas = useMemo(() => 
    registros.filter((r) => r.tipo.toLowerCase() === "saida").length,
    [registros]
  )
  const totalGeral = registros.length

  function formatarDataHora(dataHora: string) {
    const data = new Date(dataHora)
    return data.toLocaleString("pt-BR")
  }

  return (
    <PageWrapper>
      <div className="space-y-6 p-6">
        <AnimatedItem>
          <h1 className="text-2xl font-semibold tracking-tight">Registros</h1>
          <p className="text-sm text-muted-foreground">
            Histórico unificado de entradas e saídas dos alunos.
          </p>
        </AnimatedItem>

        <AnimatedItem className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="label-uppercase">Total de entradas</CardTitle>
              <CardDescription className="text-sm">Registros de entrada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight">{totalEntradas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="label-uppercase">Total de saídas</CardTitle>
              <CardDescription className="text-sm">Registros de saída</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight">{totalSaidas}</div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="label-uppercase">Total geral</CardTitle>
              <CardDescription className="text-sm">Soma de todos os registros</CardDescription>
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
            <CardTitle>Histórico de registros</CardTitle>
            <CardDescription>
              Busque por aluno, tipo, ID ou observação e filtre por entrada ou saída.
            </CardDescription>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative w-full md:max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar registro..."
                className="pl-9"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 p-1 bg-muted/40 rounded-lg border border-border">
              <Button
                variant={tipoFiltro === "todos" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTipoFiltro("todos")}
                className={cn(
                  "h-9 px-5 text-xs font-bold transition-all rounded-lg",
                  tipoFiltro === "todos" ? "bg-muted text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Todos
              </Button>
              <Button
                variant={tipoFiltro === "entrada" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTipoFiltro("entrada")}
                className={cn(
                  "h-9 px-5 text-xs font-bold transition-all rounded-lg",
                  tipoFiltro === "entrada" ? "bg-muted text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Entrada
              </Button>
              <Button
                variant={tipoFiltro === "saida" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTipoFiltro("saida")}
                className={cn(
                  "h-9 px-5 text-xs font-bold transition-all rounded-lg",
                  tipoFiltro === "saida" ? "bg-muted text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
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
          ) : registros.length === 0 ? (
            <div className="py-10 text-sm text-muted-foreground">
              Nenhum registro encontrado.
            </div>
          ) : registrosFiltrados.length === 0 ? (
            <div className="py-10 text-sm text-muted-foreground">
              Nenhum resultado para os filtros aplicados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Observação</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {registrosFiltrados.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell>{registro.id}</TableCell>
                      <TableCell className="font-medium">{registro.aluno}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{registro.tipo}</Badge>
                      </TableCell>
                      <TableCell>{formatarDataHora(registro.data_hora)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {registro.mensagem_enviada ? "Enviada" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell>{registro.observacao || "-"}</TableCell>
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