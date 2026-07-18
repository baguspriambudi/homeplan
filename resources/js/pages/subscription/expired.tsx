import { Head, Link, useForm } from '@inertiajs/react';
import { BadgeCheck, CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';

interface Plan {
    id: number;
    name: string;
    duration_days: number;
    price: number;
    description: string | null;
}

interface Props {
    plans: Plan[];
    subscriptionEndsAt: string | null;
    pendingOrderCode: string | null;
}

const idr = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
});

export default function SubscriptionExpired({ plans, subscriptionEndsAt, pendingOrderCode }: Props) {
    const form = useForm({ plan_id: plans[0]?.id ?? 0 });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/subscription/renew');
    }

    return (
        <AuthLayout
            title="Masa Aktif Habis"
            description="Perpanjang langganan Anda untuk kembali menggunakan aplikasi. Data Anda tetap aman dan tidak hilang."
        >
            <Head title="Perpanjang Langganan" />

            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CalendarX className="h-4 w-4" />
                    {subscriptionEndsAt
                        ? `Masa aktif berakhir ${new Date(subscriptionEndsAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
                        : 'Belum ada langganan aktif'}
                </div>

                {pendingOrderCode ? (
                    <div className="flex flex-col items-center gap-2 rounded-lg border border-amber-300 p-4 text-center">
                        <p className="text-sm">
                            Anda masih punya order perpanjangan yang belum selesai.
                        </p>
                        <Button asChild>
                            <Link href={`/pay/${pendingOrderCode}`}>Lanjutkan Pembayaran</Link>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div className="grid gap-2 sm:grid-cols-2">
                            {plans.map((plan) => {
                                const selected = form.data.plan_id === plan.id;
                                return (
                                    <button
                                        key={plan.id}
                                        type="button"
                                        onClick={() => form.setData('plan_id', plan.id)}
                                        className={cn(
                                            'relative rounded-lg border p-3 text-left transition-colors',
                                            selected
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                : 'border-border hover:border-primary/50',
                                        )}
                                    >
                                        {selected && (
                                            <BadgeCheck className="absolute top-2 right-2 h-4 w-4 text-primary" />
                                        )}
                                        <div className="font-medium">{plan.name}</div>
                                        <div className="text-lg font-semibold">{idr.format(plan.price)}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {plan.description ?? `Aktif ${plan.duration_days} hari`}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing && <Spinner />}
                            Perpanjang Sekarang
                        </Button>
                    </form>
                )}

                <div className="text-center text-sm text-muted-foreground">
                    <Link href={logout()} method="post" as="button" className="underline">
                        Logout
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
