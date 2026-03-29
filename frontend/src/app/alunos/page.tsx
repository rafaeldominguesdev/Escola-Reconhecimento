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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Aluno = {
  id: number
  nome: string
  turma: string | null
  foto_path: string | null
  created_at: string | null
}

const TURMAS_CONFIG = [
  {
    id: "ef1",
    label: "Fund. 1",
    anos: ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"],
  },
  {
    id: "ef2",
    label: "Fund. 2",
    anos: ["6º Ano", "7º Ano", "8º Ano", "9º Ano"],
  },
  {
    id: "em",
    label: "E. Médio",
    anos: ["1º Ano", "2º Ano", "3º Ano"],
  },
]

const SALAS = ["A", "B", "C", "D"]

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  
  // Estados para Filtros
  const [nivelAtivo, setNivelAtivo] = useState<string | null>(null)
  const [anoAtivo, setAnoAtivo] = useState<string | null>(null)
  const [salaAtiva, setSalaAtiva] = useState<string | null>(null)

  useEffect(() => {
    async function carregarAlunos() {
      setLoading(true)
      setError("")

      const { data, error } = await supabase
        .from("alunos")
        .select("id, nome, turma, foto_path, created_at")
        .order("created_at", { ascending: false })

      if (error) {
        console.error(error)
        setError("Erro ao carregar alunos.")
        setAlunos([])
        setLoading(false)
        return
      }

      setAlunos(data || [])
      setLoading(false)
    }

    carregarAlunos()
  }, [])

  const alunosFiltrados = useMemo(() => {
    let filtrados = alunos

    // Filtro por Nível/Ano/Sala
    if (nivelAtivo || anoAtivo || salaAtiva) {
      filtrados = filtrados.filter((aluno) => {
        const turma = aluno.turma?.toLowerCase() || ""
        
        let match = true
        
        // Match simples por string
        if (nivelAtivo) {
          const nivelLabel = TURMAS_CONFIG.find(n => n.id === nivelAtivo)?.label.toLowerCase()
          if (nivelLabel && !turma.includes(nivelLabel)) match = false
        }
        
        if (anoAtivo && !turma.includes(anoAtivo.toLowerCase())) match = false
        
        if (salaAtiva && !turma.includes(` ${salaAtiva.toLowerCase()}`) && !turma.endsWith(salaAtiva.toLowerCase())) match = false
        
        return match
      })
    }

    const termo = search.trim().toLowerCase()
    if (!termo) return filtrados

    return filtrados.filter((aluno) => {
      const nome = aluno.nome?.toLowerCase() || ""
      const turma = aluno.turma?.toLowerCase() || ""
      const id = String(aluno.id)

      return (
        nome.includes(termo) ||
        turma.includes(termo) ||
        id.includes(termo)
      )
    })
  }, [alunos, search, nivelAtivo, anoAtivo, salaAtiva])

  function formatarData(data: string | null) {
    if (!data) return "-"
    return new Date(data).toLocaleString("pt-BR")
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Alunos</h1>
        <p className="text-sm text-muted-foreground">
          Lista de alunos cadastrados no sistema.
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>Gerenciamento de alunos</CardTitle>
            <CardDescription>
              Busque por nome, turma ou ID.
            </CardDescription>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase text-muted-foreground mr-2">Filtros:</span>
              <Button
                variant={!nivelAtivo ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setNivelAtivo(null)
                  setAnoAtivo(null)
                  setSalaAtiva(null)
                }}
                className="h-8 rounded-full"
              >
                Todos
              </Button>
              {TURMAS_CONFIG.map((config) => (
                <Button
                  key={config.id}
                  variant={nivelAtivo === config.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setNivelAtivo(config.id)
                    setAnoAtivo(null)
                    setSalaAtiva(null)
                  }}
                  className="h-8 rounded-full"
                >
                  {config.label}
                </Button>
              ))}
            </div>

            {nivelAtivo && (
              <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-xs font-semibold uppercase text-muted-foreground mr-2 ml-4">Ano:</span>
                {TURMAS_CONFIG.find(n => n.id === nivelAtivo)?.anos.map((ano) => (
                  <Button
                    key={ano}
                    variant={anoAtivo === ano ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setAnoAtivo(anoAtivo === ano ? null : ano)
                      setSalaAtiva(null)
                    }}
                    className="h-8 rounded-full"
                  >
                    {ano}
                  </Button>
                ))}
              </div>
            )}

            {anoAtivo && (
              <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-xs font-semibold uppercase text-muted-foreground mr-2 ml-8">Sala:</span>
                {SALAS.map((sala) => (
                  <Button
                    key={sala}
                    variant={salaAtiva === sala ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setSalaAtiva(salaAtiva === sala ? null : sala)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    {sala}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="relative max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar aluno..."
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-sm text-muted-foreground">
              Carregando alunos...
            </div>
          ) : error ? (
            <div className="py-10 text-sm text-red-500">{error}</div>
          ) : alunos.length === 0 ? (
            <div className="py-10 text-sm text-muted-foreground">
              Nenhum aluno cadastrado.
            </div>
          ) : alunosFiltrados.length === 0 ? (
            <div className="py-10 text-sm text-muted-foreground">
              Nenhum aluno encontrado para a busca.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Foto</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {alunosFiltrados.map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell>{aluno.id}</TableCell>
                      <TableCell className="font-medium">{aluno.nome}</TableCell>
                      <TableCell>{aluno.turma || "-"}</TableCell>
                      <TableCell>{aluno.foto_path ? "Sim" : "Não"}</TableCell>
                      <TableCell>{formatarData(aluno.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}