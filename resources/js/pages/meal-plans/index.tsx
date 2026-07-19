import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, CookingPot, Sun, Sunrise, Sunset, Trash2, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/use-permission';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { formatDate, formatQty, ingredientColor, PageHeader, toLocalIso } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Meal Planning', href: '#' },
    { title: 'Meal Plans', href: '/meal-plans' },
];

interface Ingredient {
    id: number;
    name: string;
    qty: string;
    uom?: { id: number; name: string };
}

interface Menu {
    id: number;
    name: string;
    description: string | null;
    ingredients: Ingredient[];
}

interface PlanItem {
    id: number;
    date: string;
    meal_time: string;
    notes: string | null;
    menu: Menu;
    creator?: { id: number; name: string };
}

interface Props {
    month: string; // "YYYY-MM"
    items: PlanItem[];
    menus: Menu[];
    mealTimes: string[]; // ['pagi', 'siang', 'sore']
}

/** Ikon + warna chip per waktu makan (konstanta backend MealPlanItem::MEAL_TIMES) */
const MEAL_TIME_META: Record<string, { label: string; icon: typeof Sun; chip: string }> = {
    pagi: { label: 'Pagi', icon: Sunrise, chip: 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:text-amber-400' },
    siang: { label: 'Siang', icon: Sun, chip: 'bg-sky-500/15 text-sky-700 hover:bg-sky-500/25 dark:text-sky-400' },
    sore: { label: 'Sore', icon: Sunset, chip: 'bg-indigo-500/15 text-indigo-700 hover:bg-indigo-500/25 dark:text-indigo-400' },
};

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function shiftMonth(month: string, delta: number): string {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(month: string): string {
    const [y, m] = month.split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

/** Grid kalender Senin-pertama: null = sel kosong di luar bulan */
function buildCalendarCells(month: string): (string | null)[] {
    const [y, m] = month.split('-').map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    const mondayOffset = (new Date(y, m - 1, 1).getDay() + 6) % 7;

    const cells: (string | null)[] = Array(mondayOffset).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push(`${month}-${String(day).padStart(2, '0')}`);
    }
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
}

export default function MealPlansIndex({ month, items, menus, mealTimes }: Props) {
    const { can } = usePermission();
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [detailItem, setDetailItem] = useState<PlanItem | null>(null);

    const todayIso = toLocalIso(new Date());
    const cells = useMemo(() => buildCalendarCells(month), [month]);

    // items per tanggal per waktu makan, urut pagi → siang → sore saat render
    const itemsByDate = useMemo(() => {
        const map: Record<string, Record<string, PlanItem[]>> = {};
        for (const item of items) {
            const date = item.date.slice(0, 10);
            (map[date] ??= {})[item.meal_time] ??= [];
            map[date][item.meal_time].push(item);
        }
        return map;
    }, [items]);

    const form = useForm({
        dates: [] as string[],
        meal_time: 'pagi',
        menu_id: '',
        notes: '',
    });

    const errors = form.errors as Record<string, string>;
    const selectedMenu = menus.find((m) => String(m.id) === form.data.menu_id);

    function goToMonth(target: string) {
        setSelectedDates([]);
        router.get('/meal-plans', { month: target }, { preserveState: false });
    }

    function toggleDate(date: string) {
        if (!can('create meal-plans')) return;
        setSelectedDates((prev) =>
            prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date].sort(),
        );
    }

    function openSchedule() {
        form.setData({ dates: selectedDates, meal_time: 'pagi', menu_id: '', notes: '' });
        form.clearErrors();
        setScheduleOpen(true);
    }

    function submitSchedule(e: React.FormEvent) {
        e.preventDefault();
        form.post('/meal-plans', {
            onSuccess: () => {
                setScheduleOpen(false);
                setSelectedDates([]);
            },
        });
    }

    function deleteItem(item: PlanItem) {
        router.delete(`/meal-plans/${item.id}`, {
            onSuccess: () => setDetailItem(null),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meal Plans" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                <PageHeader
                    subtitle="Klik satu atau beberapa tanggal, lalu jadwalkan menu untuk waktu Pagi, Siang, atau Sore."
                    action={
                        can('create meal-plans') && selectedDates.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setSelectedDates([])}>
                                    <X className="mr-1 h-4 w-4" /> Batal
                                </Button>
                                <Button onClick={openSchedule}>
                                    <CalendarDays className="mr-1 h-4 w-4" /> Jadwalkan ({selectedDates.length})
                                </Button>
                            </div>
                        )
                    }
                />

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToMonth(shiftMonth(month, -1))} aria-label="Bulan sebelumnya">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold capitalize">{monthLabel(month)}</span>
                                {month !== todayIso.slice(0, 7) && (
                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => goToMonth(todayIso.slice(0, 7))}>
                                        Hari ini
                                    </Button>
                                )}
                            </div>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToMonth(shiftMonth(month, 1))} aria-label="Bulan berikutnya">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="min-w-[700px]">
                                <div className="grid grid-cols-7 border-b bg-muted/40">
                                    {WEEKDAYS.map((day) => (
                                        <div key={day} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7">
                                    {cells.map((date, i) => {
                                        if (!date) {
                                            return <div key={`empty-${i}`} className="min-h-28 border-b border-r bg-muted/20 [&:nth-child(7n)]:border-r-0" />;
                                        }

                                        const isToday = date === todayIso;
                                        const isSelected = selectedDates.includes(date);
                                        const dayItems = itemsByDate[date];

                                        return (
                                            <div
                                                key={date}
                                                role={can('create meal-plans') ? 'button' : undefined}
                                                tabIndex={can('create meal-plans') ? 0 : undefined}
                                                onClick={() => toggleDate(date)}
                                                onKeyDown={(e) => e.key === 'Enter' && toggleDate(date)}
                                                className={`min-h-28 border-b border-r p-1.5 transition-colors [&:nth-child(7n)]:border-r-0 ${
                                                    isSelected ? 'bg-primary/10' : 'hover:bg-muted/40'
                                                } ${can('create meal-plans') ? 'cursor-pointer' : ''}`}
                                            >
                                                <div className="mb-1 flex items-center justify-between">
                                                    <span
                                                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                                                            isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {Number(date.slice(8, 10))}
                                                    </span>
                                                    {isSelected && (
                                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                            <Check className="h-3 w-3" />
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    {mealTimes.map((time) =>
                                                        (dayItems?.[time] ?? []).map((item) => {
                                                            const meta = MEAL_TIME_META[time];
                                                            const Icon = meta?.icon ?? Sun;
                                                            return (
                                                                <button
                                                                    key={item.id}
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setDetailItem(item);
                                                                    }}
                                                                    className={`w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium transition-colors ${meta?.chip ?? 'bg-muted'}`}
                                                                    title={`${meta?.label ?? time}: ${item.menu.name}`}
                                                                >
                                                                    <Icon className="mr-1 inline h-3 w-3 shrink-0" />
                                                                    {item.menu.name}
                                                                </button>
                                                            );
                                                        }),
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 border-t px-4 py-2.5 text-xs text-muted-foreground">
                            {mealTimes.map((time) => {
                                const meta = MEAL_TIME_META[time];
                                const Icon = meta?.icon ?? Sun;
                                return (
                                    <span key={time} className="inline-flex items-center gap-1.5">
                                        <span className={`flex h-5 w-5 items-center justify-center rounded ${meta?.chip ?? 'bg-muted'}`}>
                                            <Icon className="h-3 w-3" />
                                        </span>
                                        {meta?.label ?? time}
                                    </span>
                                );
                            })}
                            <span className="ml-auto">Klik menu di kalender untuk lihat detail bahannya.</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dialog Jadwalkan */}
            <Dialog open={scheduleOpen} onOpenChange={(open) => !open && setScheduleOpen(false)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Jadwalkan Menu</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitSchedule} className="flex flex-col gap-4">
                        <div>
                            <Label>Tanggal terpilih</Label>
                            <div className="mt-1 flex flex-wrap gap-1">
                                {form.data.dates.map((date) => (
                                    <Badge key={date} variant="secondary" className="font-normal">
                                        {formatDate(date)}
                                    </Badge>
                                ))}
                            </div>
                            <InputError message={errors.dates} />
                        </div>

                        <div>
                            <Label>Waktu makan</Label>
                            <div className="mt-1 grid grid-cols-3 gap-2">
                                {mealTimes.map((time) => {
                                    const meta = MEAL_TIME_META[time];
                                    const Icon = meta?.icon ?? Sun;
                                    const active = form.data.meal_time === time;
                                    return (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => form.setData('meal_time', time)}
                                            className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                                                active ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'
                                            }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {meta?.label ?? time}
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.meal_time} />
                        </div>

                        <div>
                            <Label>Menu</Label>
                            <Select value={form.data.menu_id} onValueChange={(v) => form.setData('menu_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={menus.length === 0 ? 'Belum ada menu — buat dulu di halaman Menus' : 'Pilih menu masakan'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {menus.map((menu) => (
                                        <SelectItem key={menu.id} value={String(menu.id)}>
                                            {menu.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.menu_id} />
                            {selectedMenu && selectedMenu.ingredients.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {selectedMenu.ingredients.map((ing) => (
                                        <Badge key={ing.id} variant="secondary" className={`font-normal ${ingredientColor(ing.name)}`}>
                                            {ing.name} {formatQty(ing.qty)} {ing.uom?.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <Label>
                                Catatan <span className="text-xs text-muted-foreground">(opsional)</span>
                            </Label>
                            <Textarea
                                value={form.data.notes}
                                onChange={(e) => form.setData('notes', e.target.value)}
                                placeholder="Misal: porsi double, untuk bekal"
                                rows={2}
                            />
                            <InputError message={errors.notes} />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setScheduleOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={form.processing || !form.data.menu_id}>
                                Jadwalkan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Detail Menu Terjadwal */}
            <Dialog open={!!detailItem} onOpenChange={(open) => !open && setDetailItem(null)}>
                <DialogContent>
                    {detailItem && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                        <CookingPot className="h-4 w-4 text-muted-foreground" />
                                    </span>
                                    {detailItem.menu.name}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <Badge variant="secondary">{formatDate(detailItem.date)}</Badge>
                                <Badge className={MEAL_TIME_META[detailItem.meal_time]?.chip ?? 'bg-muted'}>
                                    {MEAL_TIME_META[detailItem.meal_time]?.label ?? detailItem.meal_time}
                                </Badge>
                            </div>

                            {detailItem.menu.description && (
                                <p className="text-sm text-muted-foreground">{detailItem.menu.description}</p>
                            )}

                            <div>
                                <p className="mb-1.5 text-sm font-medium">Bahan-bahan</p>
                                <div className="flex flex-wrap gap-1">
                                    {detailItem.menu.ingredients.map((ing) => (
                                        <Badge key={ing.id} variant="secondary" className={`font-normal ${ingredientColor(ing.name)}`}>
                                            {ing.name} {formatQty(ing.qty)} {ing.uom?.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {detailItem.notes && (
                                <p className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                                    {detailItem.notes}
                                </p>
                            )}

                            <DialogFooter>
                                {can('delete meal-plans') && (
                                    <Button variant="destructive" onClick={() => deleteItem(detailItem)}>
                                        <Trash2 className="mr-1 h-4 w-4" /> Hapus dari kalender
                                    </Button>
                                )}
                                <Button variant="ghost" onClick={() => setDetailItem(null)}>
                                    Tutup
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
