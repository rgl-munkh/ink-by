"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { designTokens } from "@/lib/design-tokens"

export function DesignShowcase() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Design System</h1>
        <p className="text-muted-foreground">
          A minimalist design system with muted colors and clean typography.
        </p>
      </div>

      <Separator />

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Typography</h2>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-semibold">Heading 2</h2>
            <h3 className="text-2xl font-semibold">Heading 3</h3>
            <h4 className="text-xl font-semibold">Heading 4</h4>
            <p className="text-lg">Large text for emphasis</p>
            <p>Regular paragraph text with good readability</p>
            <p className="text-sm text-muted-foreground">Small muted text</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="w-full h-16 bg-background border rounded mb-2"></div>
            <p className="text-sm font-medium">Background</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-16 bg-card border rounded mb-2"></div>
            <p className="text-sm font-medium">Card</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-16 bg-primary rounded mb-2"></div>
            <p className="text-sm font-medium">Primary</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-16 bg-secondary rounded mb-2"></div>
            <p className="text-sm font-medium">Secondary</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-16 bg-muted rounded mb-2"></div>
            <p className="text-sm font-medium">Muted</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-16 bg-accent rounded mb-2"></div>
            <p className="text-sm font-medium">Accent</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-16 bg-destructive rounded mb-2"></div>
            <p className="text-sm font-medium">Destructive</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-16 bg-border border-2 rounded mb-2"></div>
            <p className="text-sm font-medium">Border</p>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Components</h2>
        
        {/* Buttons */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Buttons</h3>
          <div className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Small</Button>
            <Button>Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Badges</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
            <Input placeholder="Default input" />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Disabled" disabled />
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Default Card</h4>
              <p className="text-sm text-muted-foreground">
                A simple card with default styling.
              </p>
            </Card>
            <Card className="p-4 shadow-md">
              <h4 className="font-semibold mb-2">Elevated Card</h4>
              <p className="text-sm text-muted-foreground">
                A card with enhanced shadow for emphasis.
              </p>
            </Card>
            <Card className="p-4 border-2">
              <h4 className="font-semibold mb-2">Outlined Card</h4>
              <p className="text-sm text-muted-foreground">
                A card with stronger border definition.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Spacing */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Spacing Scale</h2>
        <div className="space-y-2">
          {Object.entries(designTokens.spacing).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <div className="w-16 text-sm font-mono">{key}</div>
              <div className="w-16 text-sm text-muted-foreground">{value}</div>
              <div 
                className="bg-primary h-4" 
                style={{ width: value }}
              ></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
