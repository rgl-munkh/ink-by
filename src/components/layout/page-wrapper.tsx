import { cn } from "@/lib/utils"
import { Container } from "./container"

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  containerSize?: "sm" | "md" | "lg" | "xl" | "full"
  noPadding?: boolean
}

export function PageWrapper({ 
  children, 
  className,
  containerSize = "lg",
  noPadding = false
}: PageWrapperProps) {
  return (
    <main className={cn(
      "flex-1",
      !noPadding && "py-6 md:py-8",
      className
    )}>
      <Container size={containerSize}>
        {children}
      </Container>
    </main>
  )
}
