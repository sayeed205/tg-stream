import { LaptopMinimal, Moon, Sun } from 'lucide-react'

import { cn } from '~/lib/utils'
import { useTheme } from './theme-provider'

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()

  return (
    // Added bg-background/20 to provide a subtle, theme-aware transparent background.
    // This ensures icons remain visible against varying backdrop images without a solid color block.
    <div className="relative flex h-10 items-center rounded-full bg-background/20 p-1 shadow-md backdrop-blur-md">
      {/* Sliding indicator */}
      <div
        className={cn(
          'absolute left-1 h-8 w-8 rounded-full bg-primary transition-transform duration-200 ease-in-out',
          theme === 'system' && 'translate-x-0',
          theme === 'dark' && 'translate-x-8',
          theme === 'light' && 'translate-x-16'
        )}
      />

      {/* System button */}
      <button
        onClick={() => setTheme('system')}
        className={cn(
          'relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors',
          theme === 'system'
            ? 'text-primary-foreground' // Active state: text color contrasting with primary
            : 'text-muted-foreground hover:text-foreground' // Inactive state: muted text, hovers to foreground
        )}
        aria-label="System theme"
      >
        <LaptopMinimal className="h-4 w-4" />
      </button>

      {/* Dark button */}
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors',
          theme === 'dark'
            ? 'text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="Dark theme"
      >
        <Moon className="h-4 w-4" />
      </button>

      {/* Light button */}
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors',
          theme === 'light'
            ? 'text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="Light theme"
      >
        <Sun className="h-4 w-4" />
      </button>
    </div>
  )
}
