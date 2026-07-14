import { Moon, Sun } from 'lucide-react';

import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
        >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    );
}
