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

type Responsavel = {
  id: number
  nome: string
  telefone: string | null
  email: string | null
  created_at: string | null
}

export default function ResponsaveisPage() {
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function carregarResponsaveis() {
      setLoading(true)
      setError("")

      const { data, error } = await supabase
        .from("responsaveis")
        .select("id, nome, telefone, email, created_at")
        .order("created_at", { ascending: false })

      if (error) {
        console.error(error)
        setError("Erro ao carregar responsáveis.")
        setResponsaveis([])
        setLoading(false)
        return
      }

      setResponsaveis(data || [])
      setLoading(false)
    }

    carregarResponsaveis()
  }, [])

  const responsaveisFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase()

    if (!termo) return responsaveis

    return responsaveis.filter((responsavel) => {
      const nome = responsavel.nome?.toLowerCase() || ""
      const telefone = responsavel.telefone?.toLowerCase() || ""
      const email = responsavel.email?.toLowerCase() || ""
      const id = String(responsavel.id)

      return (
        nome.includes(termo) ||
        telefone.includes(termo) ||
        email.includes(termo) ||
        id.includes(termo)
      )
    })
  }, [responsaveis, search])

  function formatarData(data: string | null) {
    if (!data) return "-"
    return new Date(data).toLocaleString("pt-BR")
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Responsáveis</h1>
        <p className="text-sm text-muted-foreground">
          Lista de responsáveis cadastrados no sistema.
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>Gerenciamento de responsáveis</CardTitle>
            <CardDescription>
              Busque por nome, telefone, email ou ID.
            </CardDescription>
          </div>

          <div className="relative max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar responsável..."
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-sm text-muted-foreground">
              Carregando responsáveis...
            </div>
          ) : error ? (
            <div className="py-10 text-sm text-red-500">{error}</div>
          ) : responsaveis.length === 0 ? (
            <div className="py-10 text-sm text-muted-foreground">
              Nenhum responsável cadastrado.
            </div>
          ) : responsaveisFiltrados.length === 0 ? (
            <div className="py-10 text-sm text-muted-foreground">
              Nenhum responsável encontrado para a busca.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {responsaveisFiltrados.map((responsavel) => (
                    <TableRow key={responsavel.id}>
                      <TableCell>{responsavel.id}</TableCell>
                      <TableCell className="font-medium">{responsavel.nome}</TableCell>
                      <TableCell>{responsavel.telefone || "-"}</TableCell>
                      <TableCell>{responsavel.email || "-"}</TableCell>
                      <TableCell>{formatarData(responsavel.created_at)}</TableCell>
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