import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { CheckCircle2, ExternalLink, ReceiptText, XCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/components/input-error';
import { EmptyRow, PageHeader, SearchInput, TablePagination, usePagination } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Payments', href: '/payment-orders' }];

interface PaymentOrder {
    id: number;
    code: string;
    type: 'registration' | 'renewal';
    name: string | null;
    email: string | null;
    household_name: string | null;
    amount: number;
    unique_code: number;
    total_amount: number;
    status: 'pending' | 'waiting_confirmation' | 'approved' | 'rejected';
    proof_path: string | null;
    reject_reason: string | null;
    approved_at: string | null;
    expires_at: string | null;
    created_at: string;
    plan: { id: number; name: string; duration_days: number } | null;
    user: { id: number; name: string; email: string } | null;
    approver: { id: number; name: string } | null;
}

interface Props {
    orders: PaymentOrder[];
}

const idr = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
});

const STATUS_BADGE: Record<PaymentOrder['status'], { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    waiting_confirmation: { label: 'Waiting', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    approved: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    rejected: { label: 'Rejected', className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
};

export default function PaymentOrdersIndex({ orders }: Props) {
    const [search, setSearch] = useState('');
    const [approveTarget, setApproveTarget] = useState<PaymentOrder | null>(null);
    const [rejectTarget, setRejectTarget] = useState<PaymentOrder | null>(null);
    const [processing, setProcessing] = useState(false);

    const rejectForm = useForm({ reason: '' });

    const visibleOrders = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return orders;
        return orders.filter((o) =>
            [o.code, o.name, o.email, o.user?.name, o.user?.email, o.plan?.name, o.status]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q)),
        );
    }, [orders, search]);

    const pagination = usePagination(visibleOrders);

    function applicant(order: PaymentOrder) {
        if (order.type === 'registration') {
            return { name: order.name, email: order.email };
        }
        return { name: order.user?.name, email: order.user?.email };
    }

    function confirmApprove() {
        if (!approveTarget) return;
        setProcessing(true);
        router.post(`/payment-orders/${approveTarget.id}/approve`, {}, {
            onFinish: () => {
                setProcessing(false);
                setApproveTarget(null);
            },
        });
    }

    function submitReject(e: React.FormEvent) {
        e.preventDefault();
        if (!rejectTarget) return;
        rejectForm.post(`/payment-orders/${rejectTarget.id}/reject`, {
            onSuccess: () => {
                setRejectTarget(null);
                rejectForm.reset();
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                <PageHeader subtitle="Konfirmasi pembayaran registrasi dan perpanjangan langganan." />

                <SearchInput value={search} onChange={setSearch} placeholder="Search code, name, email, or status..." />

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Proof</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleOrders.length === 0 && (
                                    <EmptyRow
                                        colSpan={8}
                                        icon={<ReceiptText />}
                                        message={search ? `No orders match "${search}".` : 'No payment orders yet.'}
                                    />
                                )}
                                {pagination.paged.map((order) => {
                                    const who = applicant(order);
                                    const badge = STATUS_BADGE[order.status];
                                    return (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <div className="font-medium">{who.name ?? '—'}</div>
                                                <div className="text-xs text-muted-foreground">{who.email}</div>
                                                {order.household_name && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Household: {order.household_name}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {order.type === 'registration' ? 'Registrasi' : 'Perpanjangan'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {order.plan?.name}
                                                <div className="text-xs text-muted-foreground">
                                                    {order.plan?.duration_days} hari
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{idr.format(order.total_amount)}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    kode unik +{order.unique_code}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={badge.className} variant="secondary">
                                                    {badge.label}
                                                </Badge>
                                                {order.status === 'rejected' && order.reject_reason && (
                                                    <div className="mt-1 max-w-[160px] text-xs text-muted-foreground">
                                                        {order.reject_reason}
                                                    </div>
                                                )}
                                                {order.approver && (
                                                    <div className="text-xs text-muted-foreground">
                                                        by {order.approver.name}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {order.proof_path ? (
                                                    <Button asChild size="sm" variant="outline">
                                                        <a
                                                            href={`/payment-orders/${order.id}/proof`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <ExternalLink className="mr-1 h-3 w-3" /> View
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {order.status === 'waiting_confirmation' && (
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            size="sm"
                                                            className="bg-emerald-600 hover:bg-emerald-700"
                                                            onClick={() => setApproveTarget(order)}
                                                        >
                                                            <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-rose-500 hover:text-rose-600"
                                                            onClick={() => {
                                                                rejectForm.reset();
                                                                setRejectTarget(order);
                                                            }}
                                                        >
                                                            <XCircle className="mr-1 h-4 w-4" /> Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <TablePagination {...pagination} />
                    </CardContent>
                </Card>
            </div>

            {/* Approve Confirm */}
            <Dialog open={!!approveTarget} onOpenChange={(open) => !open && setApproveTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                            Pastikan dana sebesar{' '}
                            <strong className="text-foreground">
                                {approveTarget && idr.format(approveTarget.total_amount)}
                            </strong>{' '}
                            benar-benar sudah masuk ke rekening (cocokkan kode uniknya).
                        </p>
                        {approveTarget?.type === 'registration' ? (
                            <p className="text-muted-foreground">
                                Setelah approve: akun untuk <strong className="text-foreground">{approveTarget?.email}</strong>{' '}
                                dibuat dan password dikirim via email.
                            </p>
                        ) : (
                            <p className="text-muted-foreground">
                                Setelah approve: masa aktif <strong className="text-foreground">{approveTarget?.user?.email}</strong>{' '}
                                diperpanjang {approveTarget?.plan?.duration_days} hari.
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setApproveTarget(null)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={processing}
                            onClick={confirmApprove}
                        >
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Payment</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitReject} className="flex flex-col gap-4">
                        <div>
                            <Label>Reason</Label>
                            <Input
                                value={rejectForm.data.reason}
                                onChange={(e) => rejectForm.setData('reason', e.target.value)}
                                placeholder="e.g. Dana tidak ditemukan di mutasi rekening"
                            />
                            <InputError message={rejectForm.errors.reason} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setRejectTarget(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="destructive" disabled={rejectForm.processing}>
                                Reject
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
