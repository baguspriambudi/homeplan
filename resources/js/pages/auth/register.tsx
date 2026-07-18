import { Head, useForm } from '@inertiajs/react';
import { BadgeCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';
import { login } from '@/routes';

interface Plan {
    id: number;
    name: string;
    duration_days: number;
    price: number;
    description: string | null;
}

interface Props {
    plans: Plan[];
}

const idr = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
});

export default function Register({ plans }: Props) {
    const form = useForm({
        name: '',
        household_name: '',
        email: '',
        plan_id: plans[0]?.id ?? 0,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/register');
    }

    return (
        <AuthLayout
            title="Create an account"
            description="Pilih paket, isi data, lalu selesaikan pembayaran QRIS. Password akan dikirim ke email setelah pembayaran dikonfirmasi."
        >
            <Head title="Register" />
            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label>Paket langganan</Label>
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
                                        <div className="text-lg font-semibold">
                                            {idr.format(plan.price)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {plan.description ?? `Aktif ${plan.duration_days} hari`}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <InputError message={form.errors.plan_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            autoComplete="name"
                            placeholder="Full name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="household_name">Household name</Label>
                        <Input
                            id="household_name"
                            type="text"
                            required
                            placeholder="e.g. Rumah Bagus"
                            value={form.data.household_name}
                            onChange={(e) => form.setData('household_name', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Your own household space — you can invite family members later.
                        </p>
                        <InputError message={form.errors.household_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="email@example.com"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Password akun akan dikirim ke email ini setelah pembayaran dikonfirmasi.
                        </p>
                        <InputError message={form.errors.email} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        disabled={form.processing}
                        data-test="register-user-button"
                    >
                        {form.processing && <Spinner />}
                        Lanjut ke Pembayaran
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={login()}>Log in</TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
