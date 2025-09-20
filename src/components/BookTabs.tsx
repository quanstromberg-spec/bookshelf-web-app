import { BookFilter } from '@/types/book'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface BookTabsProps {
  activeFilter: BookFilter
  onFilterChange: (filter: BookFilter) => void
  totalCounts: Record<BookFilter, number>
  className?: string
}

export default function BookTabs({ activeFilter, onFilterChange, totalCounts, className }: BookTabsProps) {
  const tabs: { label: BookFilter; count: number }[] = [
    { label: 'All Books', count: totalCounts['All Books'] },
    { label: 'Read', count: totalCounts['Read'] },
    { label: 'Wish List', count: totalCounts['Wish List'] }
  ]

  return (
    <div className={cn('mb-6', className)}>
      <Tabs value={activeFilter} onValueChange={(value) => onFilterChange(value as BookFilter)}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:inline-flex" style={{ backgroundColor: '#FFE8D9' }}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.label}
              value={tab.label}
              className="flex items-center space-x-2"
            >
              <span>{tab.label}</span>
              <span className="bg-muted-foreground/20 text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
