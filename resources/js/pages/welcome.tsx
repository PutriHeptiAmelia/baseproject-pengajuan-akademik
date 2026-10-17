import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    FileText,
    GraduationCap,
    Send,
    ShieldCheck,
    Sparkles,
    UserCheck,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;
    const dashboardUrl = dashboard();

    return (
        <>
            <Head title="Portal Layanan Akademik" />

            <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
                {/* Ambient Decorative Glow */}
                <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent blur-3xl" />
                <div className="pointer-events-none absolute top-1/2 -right-40 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />

                {/* Navbar */}
                <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md transition-all">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3.5">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-300 hover:rotate-3 hover:scale-105 active:scale-95">
                                <AppLogoIcon className="size-6" />
                            </div>
                            <div>
                                <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                                    Portal Layanan Akademik
                                </span>
                                <span className="hidden text-xs font-medium text-muted-foreground sm:block">
                                    Sistem Informasi Administrasi Kampus Terpadu
                                </span>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Button asChild className="group">
                                    <Link href={dashboardUrl}>
                                        Buka Dashboard
                                        <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button asChild className="group">
                                    <Link href={login()}>
                                        Masuk ke Portal
                                        <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main>
                    <section className="relative overflow-hidden py-16 sm:py-24 md:py-28">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="mx-auto max-w-3xl text-center">
                                {/* Badge Status */}
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs transition-transform duration-300 hover:scale-105">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                                    </span>
                                    <GraduationCap className="size-4" />
                                    Pelayanan Administrasi Mahasiswa Digital 24/7
                                </div>

                                <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                                    Layanan Akademik{' '}
                                    <span className="relative whitespace-nowrap text-primary">
                                        <span className="relative z-10">Cepat & Transparan</span>
                                        <span className="absolute bottom-2 left-0 -z-0 h-3 w-full bg-primary/15 rounded-md transform -rotate-1"></span>
                                    </span>
                                </h1>

                                <p className="mt-6 text-base text-muted-foreground sm:text-lg sm:leading-relaxed">
                                    Platform resmi pengajuan administrasi akademik mahasiswa. Ajukan surat aktif kuliah, cuti akademik, hingga pengajuan bimbingan dengan verifikasi langsung dari Dosen PA dan persetujuan Kaprodi.
                                </p>

                                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    {auth.user ? (
                                        <Button size="lg" className="group w-full sm:w-auto shadow-md shadow-primary/20" asChild>
                                            <Link href="/pengajuan">
                                                <FileText className="mr-2 size-5" />
                                                Kelola Pengajuan Saya
                                                <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button size="lg" className="group w-full sm:w-auto shadow-md shadow-primary/20" asChild>
                                            <Link href={login()}>
                                                <GraduationCap className="mr-2 size-5 transition-transform duration-300 group-hover:-rotate-12" />
                                                Masuk Sebagai Mahasiswa / Dosen
                                                <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    )}

                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full sm:w-auto hover:bg-muted/80"
                                        asChild
                                    >
                                        <a href="#alur">
                                            Lihat Alur Layanan &rarr;
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Keunggulan Bar dengan Interactive Cards */}
                    <section className="border-y border-border/80 bg-card/60 backdrop-blur-md py-12">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div className="interactive-card group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                            <Clock className="size-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-foreground">
                                                Bebas Antre 24/7
                                            </h3>
                                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                                Pengajuan permohonan dapat diajukan kapan saja dari perangkat Anda tanpa datang ke loket fisik.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="interactive-card group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 dark:text-emerald-400">
                                            <CheckCircle2 className="size-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-foreground">
                                                Pelacakan Real-time
                                            </h3>
                                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                                Pantau setiap tahapan verifikasi, catatan dosen, dan estimasi selesai secara terbuka.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="interactive-card group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 dark:text-indigo-400">
                                            <ShieldCheck className="size-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-foreground">
                                                Otorisasi Sah & Aman
                                            </h3>
                                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                                Tervalidasi bertingkat oleh Dosen Pembimbing Akademik, Kaprodi, dan Staff Resmi.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Alur Pengajuan Section dengan Micro-interaction */}
                    <section id="alur" className="py-20 sm:py-28">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="mx-auto max-w-2xl text-center">
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    Langkah Mudah
                                </span>
                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                    Alur Pengajuan Layanan Akademik
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Prosedur terpadu yang menjamin keabsahan berkas dan kepastian tindak lanjut.
                                </p>
                            </div>

                            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="interactive-card group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs">
                                    <div>
                                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-bold text-sm text-primary-foreground shadow-xs transition-transform duration-300 group-hover:scale-110">
                                            01
                                        </span>
                                        <h3 className="mt-5 text-base font-bold text-foreground">
                                            Pilih Kategori Layanan
                                        </h3>
                                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                            Pilih layanan yang Anda butuhkan (Surat Aktif Kuliah, Surat Keterangan Lulus, atau Cuti Akademik).
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-primary">
                                        <span>Langkah Awal</span>
                                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                    </div>
                                </div>

                                <div className="interactive-card group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs">
                                    <div>
                                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-bold text-sm text-primary-foreground shadow-xs transition-transform duration-300 group-hover:scale-110">
                                            02
                                        </span>
                                        <h3 className="mt-5 text-base font-bold text-foreground">
                                            Verifikasi Dosen PA
                                        </h3>
                                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                            Dosen Pembimbing Akademik mengevaluasi kelayakan akademik dan menyetujui permohonan Anda.
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-primary">
                                        <span>Pemeriksaan PA</span>
                                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                    </div>
                                </div>

                                <div className="interactive-card group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs">
                                    <div>
                                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-bold text-sm text-primary-foreground shadow-xs transition-transform duration-300 group-hover:scale-110">
                                            03
                                        </span>
                                        <h3 className="mt-5 text-base font-bold text-foreground">
                                            Persetujuan Kaprodi
                                        </h3>
                                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                            Ketua Program Studi memvalidasi dan memberikan rekomendasi persetujuan resmi program studi.
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-primary">
                                        <span>Validasi Prodi</span>
                                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                    </div>
                                </div>

                                <div className="interactive-card group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs">
                                    <div>
                                        <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 font-bold text-sm text-white shadow-xs transition-transform duration-300 group-hover:scale-110">
                                            04
                                        </span>
                                        <h3 className="mt-5 text-base font-bold text-foreground">
                                            Penerbitan Dokumen
                                        </h3>
                                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                            Staff Administrasi Akademik menyelesaikan pengajuan dan menerbitkan surat / dokumen resmi.
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        <span>Selesai & Sah</span>
                                        <CheckCircle2 className="size-3.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-border bg-card/80 py-10 text-center text-xs text-muted-foreground">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="flex items-center gap-2">
                                <AppLogoIcon className="size-5 text-primary" />
                                <span className="font-semibold text-foreground">Portal Layanan Akademik</span>
                            </div>
                            <p>© {new Date().getFullYear()} Sistem Informasi Pelayanan Akademik Terpadu. Hak Cipta Terpelihara.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
