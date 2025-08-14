import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface HeaderProps {
  children?: React.ReactNode
  className?: string
  showSeparator?: boolean
}

export function Header({ children, className, showSeparator = true }: HeaderProps) {
  return (
    <>
      <header className={cn(
        "bg-card border-b border-border",
        "px-4 py-3 md:px-6 md:py-4",
        "flex items-center justify-between",
        className
      )}>
        {children}
      </header>
      {showSeparator && <Separator />}
    </>
  )
}

interface HeaderTitleProps {
  children: React.ReactNode
  className?: string
}

export function HeaderTitle({ children, className }: HeaderTitleProps) {
  return (
    <h1 className={cn(
      "text-xl font-semibold text-foreground",
      "tracking-tight",
      className
    )}>
      {children}
    </h1>
  )
}

interface HeaderActionsProps {
  children: React.ReactNode
  className?: string
}

export function HeaderActions({ children, className }: HeaderActionsProps) {
  return (
    <div className={cn(
      "flex items-center gap-2",
      className
    )}>
      {children}
    </div>
  )
}
