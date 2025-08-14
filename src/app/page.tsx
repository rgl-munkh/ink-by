import { MainLayout, Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  return (
    <MainLayout>
      <Container className="py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Ink By</h1>
            <p className="text-muted-foreground">
              UI Component Library Setup Complete
            </p>
          </div>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Example Components</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" />
              </div>
              <div className="flex gap-2">
                <Button>Primary Button</Button>
                <Button variant="outline">Secondary Button</Button>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </MainLayout>
  )
}
