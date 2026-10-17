import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2.5 transition hover:opacity-90"
                        >
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                                <AppLogoIcon className="size-7" />
                            </div>
                            <span className="text-base font-bold tracking-tight text-foreground">
                                Portal Layanan Akademik
                            </span>
                        </Link>

                        <div className="mt-2 space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                {title}
                            </h1>
                            <p className="text-xs text-muted-foreground sm:text-sm">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
                        {children}
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Sistem Pengajuan Layanan Akademik Terpadu
                    </p>
                </div>
            </div>
        </div>
    );
}
