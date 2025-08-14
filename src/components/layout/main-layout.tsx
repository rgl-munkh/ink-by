import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-background text-foreground",
      "flex flex-col",
      className
    )}>
      {children}
    </div>
  )
}
