import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const alunos = [
  { id: "AL-0001", nome: "Ana Souza", turma: "8º A", status: "Ativo" },
  { id: "AL-0002", nome: "Bruno Lima", turma: "9º B", status: "Ativo" },
  { id: "AL-0003", nome: "Carla Nunes", turma: "7º C", status: "Pendente" },
  { id: "AL-0004", nome: "Diego Rocha", turma: "6º A", status: "Inativo" },
]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader
        title="Alunos"
        subtitle="Gerencie cadastros e status dos alunos"
        right={
          <Button asChild>
            <Link href="/alunos/novo">
              <PlusIcon className="size-4" />
              Novo aluno
            </Link>
          </Button>
        }
      />

      <main className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader className="gap-3">
            <CardTitle>Lista de alunos</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input placeholder="Buscar por nome, ID ou turma…" />
              <Button variant="outline">Filtrar</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunos.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.id}</TableCell>
                    <TableCell className="font-medium">{a.nome}</TableCell>
                    <TableCell>{a.turma}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          a.status === "Ativo"
                            ? "success"
                            : a.status === "Pendente"
                              ? "warning"
                              : "secondary"
                        }
                      >
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                      <Button variant="ghost" size="sm">
                        Editar
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

