import { Transition } from '@headlessui/react';
import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import { Send } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

interface TelegramProps {
    linked: boolean;
    link_code: string | null;
    bot_configured: boolean;
    bot_username: string | null;
}

export default function Profile({
    mustVerifyEmail,
    status,
    telegram,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    telegram: TelegramProps;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile Settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <div className="space-y-4">
                    <Heading
                        variant="small"
                        title="Telegram"
                        description="Catat expense & income langsung dari chat bot Telegram"
                    />

                    {!telegram.bot_configured && !telegram.linked ? (
                        <div className="rounded-lg border border-dashed p-4">
                            <p className="text-sm text-muted-foreground">
                                Household kamu belum menyambungkan bot Telegram. Minta admin household mengaturnya lewat
                                menu <span className="font-medium text-foreground">Telegram Bot</span>.
                            </p>
                        </div>
                    ) : telegram.linked ? (
                        <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="flex items-center gap-2 text-sm">
                                <Send className="h-4 w-4 text-sky-500" />
                                Akun Telegram <span className="font-medium text-emerald-600 dark:text-emerald-400">terhubung</span>
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.delete('/settings/telegram', { preserveScroll: true })}
                            >
                                Putuskan tautan
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 rounded-lg border p-4">
                            {telegram.link_code ? (
                                <div className="text-sm">
                                    <p className="text-muted-foreground">
                                        Kirim pesan ini ke bot
                                        {telegram.bot_username && (
                                            <>
                                                {' '}
                                                <a
                                                    href={`https://t.me/${telegram.bot_username}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-medium text-foreground underline underline-offset-4"
                                                >
                                                    @{telegram.bot_username}
                                                </a>
                                            </>
                                        )}
                                        :
                                    </p>
                                    <code className="mt-2 inline-block rounded-md bg-muted px-3 py-1.5 font-mono text-sm font-semibold">
                                        /link {telegram.link_code}
                                    </code>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Buat kode tautan, lalu kirimkan ke bot Telegram dengan perintah{' '}
                                    <code className="rounded bg-muted px-1">/link KODE</code>.
                                </p>
                            )}
                            <div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.post('/settings/telegram/link-code', {}, { preserveScroll: true })}
                                >
                                    <Send className="mr-1 h-4 w-4" />
                                    {telegram.link_code ? 'Buat kode baru' : 'Buat kode tautan'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
