import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;
    const dashboardUrl = dashboard();

    return (
        <>
            <Head title="Beranda" />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="mb-6 w-full max-w-[335px] text-sm lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboardUrl}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                            >
                                Log in
                            </Link>
                        )}
                    </nav>
                </header>

                <main className="flex w-full max-w-[335px] flex-col gap-4 rounded-lg bg-white p-8 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:max-w-4xl lg:p-16 dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                    <h1 className="text-xl font-medium lg:text-3xl">
                        Sistem Pengajuan Administrasi Akademik
                    </h1>
                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                        Ajukan layanan akademik secara online, unggah dokumen
                        persyaratan, dan pantau status pengajuan Anda mulai dari
                        verifikasi Dosen PA, persetujuan Kaprodi, hingga
                        diproses Staff Akademik.
                    </p>
                    {!auth.user && (
                        <div>
                            <Link
                                href={login()}
                                className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                            >
                                Masuk untuk mengajukan
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
