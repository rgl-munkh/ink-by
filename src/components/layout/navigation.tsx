"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

interface NavigationProps {
  items: NavigationItem[]
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function Navigation({ 
  items, 
  className,
  orientation = "horizontal" 
}: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={cn(
      "flex",
      orientation === "horizontal" ? "flex-row gap-6" : "flex-col gap-1",
      className
    )}>
      {items.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md",
              "text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground",
              orientation === "vertical" && "justify-start w-full"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
