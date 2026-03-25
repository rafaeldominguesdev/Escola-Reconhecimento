import { PageHeader } from "@/components/admin/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader title="Perfil" subtitle="Dados da sua conta (mock)" />

      <main className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Atualize suas informações</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
            <Avatar className="size-14">
              <AvatarFallback>RA</AvatarFallback>
            </Avatar>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Nome</div>
                <Input defaultValue="Rafael" />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">E-mail</div>
                <Input defaultValue="rafael@escola.com" />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button>Salvar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

