import { useState } from 'react'
import { Search, Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddBook: () => void
  onManageReadingLists: () => void
}

export default function Navbar({ searchQuery, onSearchChange, onAddBook, onManageReadingLists }: NavbarProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const handleToggleMobileSearch = () => {
    setIsMobileSearchOpen(prev => !prev)
  }

  const handleCloseMobileSearch = () => {
    setIsMobileSearchOpen(false)
  }

  const handleMobileSearchChange = (value: string) => {
    onSearchChange(value)
  }

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
            <div className="relative w-48 md:w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="sm:hidden h-10 w-10 rounded-full border-2 bg-white"
              onClick={handleToggleMobileSearch}
              aria-label={isMobileSearchOpen ? 'Close search' : 'Open search'}
            >
              <Search className="h-5 w-5" style={{ color: '#ED500D' }} />
            </Button>

            <Button
              onClick={onManageReadingLists}
              variant="outline"
              size="sm"
              className="border-2 bg-white hover:bg-white"
              style={{ borderColor: 'rgb(237, 80, 13)', color: 'rgb(237, 80, 13)' }}
            >
              My Reading List
            </Button>

            <Button onClick={onAddBook} className="flex items-center space-x-2" size="sm" style={{ backgroundColor: '#ED500D', borderColor: '#ED500D' }}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Book</span>
            </Button>
          </div>
        </div>

        {isMobileSearchOpen && (
          <div className="sm:hidden mt-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleMobileSearchChange(e.target.value)}
                  placeholder="Search by title or author..."
                  className="pl-9 bg-white"
                  autoFocus
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCloseMobileSearch}
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
