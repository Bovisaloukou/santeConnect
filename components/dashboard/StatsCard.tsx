import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"
import Link from "next/link"

interface StatsCardProps {
  title: string
  description: string
  value: string | number
  icon: ReactNode
  status?: string
  statusColor?: string
  secondaryValue?: string
  secondaryText?: string
  linkHref?: string
  linkText?: string
}

export function StatsCard({
  title,
  description,
  value,
  icon,
  status,
  statusColor = "bg-emerald-50 text-emerald-600",
  secondaryValue,
  secondaryText,
  linkHref,
  linkText,
}: StatsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2 text-emerald-600">{icon}</span>
            {title}
          </CardTitle>
          {status && <span className={`text-sm px-2 py-1 rounded-full ${statusColor}`}>{status}</span>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-emerald-600">{value}</div>
          {secondaryValue && secondaryText && (
            <div className="text-sm text-gray-500">
              {secondaryText}: {secondaryValue}
            </div>
          )}
          {linkHref && linkText && (
            <Button variant="outline" size="sm" className="w-full mt-2" asChild>
              <Link href={linkHref}>{linkText}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
