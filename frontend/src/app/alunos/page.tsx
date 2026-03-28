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

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

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
    const termo = search.trim().toLowerCase()

    if (!termo) return alunos

    return alunos.filter((aluno) => {
      const nome = aluno.nome?.toLowerCase() || ""
      const turma = aluno.turma?.toLowerCase() || ""
      const id = String(aluno.id)

      return (
        nome.includes(termo) ||
        turma.includes(termo) ||
        id.includes(termo)
      )
    })
  }, [alunos, search])

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