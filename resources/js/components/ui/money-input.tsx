import * as React from 'react';

import { cn } from '@/lib/utils';

interface MoneyInputProps extends Omit<React.ComponentProps<'input'>, 'type' | 'value' | 'onChange'> {
    /** Raw numeric string, e.g. "150000" */
    value: string;
    /** Called with the raw numeric string (digits only) */
    onValueChange: (raw: string) => void;
}

function formatDisplay(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    return Number(digits).toLocaleString('id-ID');
}

function MoneyInput({ className, value, onValueChange, placeholder = '0', ...props }: MoneyInputProps) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onValueChange(e.target.value.replace(/\D/g, ''));
    }

    return (
        <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                Rp
            </span>
            <input
                type="text"
                inputMode="numeric"
                data-slot="input"
                value={formatDisplay(value)}
                onChange={handleChange}
                placeholder={placeholder}
                className={cn(
                    'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent py-1 pl-10 pr-3 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    className,
                )}
                {...props}
            />
        </div>
    );
}

export { MoneyInput };
