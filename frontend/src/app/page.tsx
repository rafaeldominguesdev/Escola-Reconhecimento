import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardTitle } from "@/components/ui/card"

const Home = () => {
    return(
        <Card className="w-[30%] p-4 mx-auto mt-10">
             <CardTitle>Card Title</CardTitle>
            <Input  placeholder="Digite seu email aqui"/>
            <Button className="cursor-pointer">Enviar </Button>
        </Card>
    )
}

export default Home