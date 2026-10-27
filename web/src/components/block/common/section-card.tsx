import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title: string
  description?: string
  toolbar?: React.ReactNode
  children: React.ReactNode
}

export default function SectionCard({ title, description, toolbar, children }: SectionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader
        className={cn(
          'flex flex-col items-stretch gap-3 lg:flex-row lg:items-center',
          description ? 'min-h-22' : 'min-h-15',
        )}
      >
        <CardHeading className="min-w-0 flex-1">
          <CardTitle className="text-xl leading-relaxed tracking-normal">{title}</CardTitle>
          <CardDescription
            className={cn('text-sm text-muted-foreground', !description && 'sr-only')}
          >
            {description}
          </CardDescription>
        </CardHeading>

        {toolbar && <CardToolbar className="w-full shrink-0 lg:w-auto">{toolbar}</CardToolbar>}
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}
