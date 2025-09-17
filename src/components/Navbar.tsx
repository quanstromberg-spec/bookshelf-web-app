import { Search, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddBook: () => void
}

export default function Navbar({ searchQuery, onSearchChange, onAddBook }: NavbarProps) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-4xl font-bold font-sigmar" style={{ letterSpacing: '0.02em', color: '#ED500D' }}>My Bookshelf</h1>
            <p className="text-xs sm:text-sm text-muted-foreground italic hidden sm:block mt-2">
              "A reader lives a thousand lives before he dies." – George R.R. Martin
            </p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            <Button onClick={onAddBook} className="flex items-center space-x-2" size="sm" style={{ backgroundColor: '#ED500D', borderColor: '#ED500D' }}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Book</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}