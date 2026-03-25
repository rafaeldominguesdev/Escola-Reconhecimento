import Link from "next/link"
import { SaveIcon } from "lucide-react"

import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader
        title="Cadastrar aluno"
        subtitle="Crie um novo cadastro e vincule dados básicos"
        right={
          <Button variant="outline" asChild>
            <Link href="/alunos">Voltar</Link>
          </Button>
        }
      />

      <main className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Dados do aluno</CardTitle>
            <CardDescription>
              Você pode integrar a captura facial/biometria aqui depois.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Nome completo</div>
              <Input placeholder="Ex.: Ana Souza" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Matrícula</div>
              <Input placeholder="Ex.: 2026-000123" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Turma</div>
              <Input placeholder="Ex.: 8º A" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Responsável</div>
              <Input placeholder="Ex.: Maria Souza" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <div className="text-sm font-medium">Observações</div>
              <Textarea placeholder="Observações internas (opcional)" />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline">Cancelar</Button>
              <Button>
                <SaveIcon className="size-4" />
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

