import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Clock,
    ExternalLink,
    FileCheck,
    FilePlus,
    FileText,
    GraduationCap,
    Info,
    Printer,
    Shield,
    Sparkles,
    UserCheck,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem, PengajuanItem } from '@/types';

interface ExtraData {
    dosenPa?: {
        name: string;
        nip?: string | null;
        email?: string;
    } | null;
    mahasiswaBimbingan?: Array<{
        id: number;
        name: string;
        nomor_induk?: string | null;
        email: string;
    }>;
    antreanCount?: number;
}

interface Props {
    role: 'mahasiswa' | 'dosen_pa' | 'kaprodi' | 'admin' | string;
    stats?: Record<string, number>;
    recentPengajuans?: PengajuanItem[];
    extra?: ExtraData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    role,
    stats = {},
    recentPengajuans = [],
    extra = {},
}: Props) {
    const { auth } = usePage().props;

    const renderRoleSpecificContent = () => {
        // ==========================================
        // 1. DASHBOARD DOSEN PEMBIMBING AKADEMIK (PA)
        // ==========================================
        if (role === 'dosen_pa') {
            const antrean = stats.antrean ?? 0;
            const totalMahasiswa = stats.totalMahasiswa ?? 0;
            const diverifikasi = stats.diverifikasi ?? 0;
            const totalPengajuan = stats.totalPengajuan ?? 0;

            return (
                <div className="space-y-6">
                    {/* Welcome Banner Dosen PA */}
                    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent p-6 shadow-xs sm:p-8">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl animate-pulse-glow" />
                        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs">
                                        <UserCheck className="size-3.5" />
                                        Dosen Pembimbing Akademik (PA)
                                    </span>
                                    {antrean > 0 ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/25">
                                            <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />
                                            {antrean} Berkas Butuh Verifikasi Anda
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="size-3.5" />
                                            Semua Berkas Sudah Diverifikasi
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                                    Selamat Datang, {auth.user?.name}!
                                </h1>
                                <p className="text-sm text-muted-foreground max-w-xl">
                                    Panel peninjauan dan verifikasi kelayakan permohonan surat akademik mahasiswa bimbingan Anda.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Button asChild size="lg" className="click-bounce rounded-2xl shadow-xs shadow-primary/25 bg-primary text-primary-foreground font-bold">
                                    <Link href="/pengajuan">
                                        <FileCheck className="mr-2 size-4" />
                                        Tinjau Antrean Bimbingan ({antrean})
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stat Cards Khusus Dosen PA */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        {/* Antrean Berkas Perlu Aksi */}
                        <Link
                            href="/pengajuan"
                            className={`interactive-card group relative block overflow-hidden rounded-3xl border p-6 shadow-xs ${
                                antrean > 0
                                    ? 'border-amber-500/40 bg-amber-500/5'
                                    : 'border-border bg-card'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Antrean Perlu Verifikasi
                                </span>
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-2xs">
                                    <Clock className="size-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <span className="text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400 sm:text-4xl">
                                    {antrean}
                                </span>
                                <span className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Periksa berkas &rarr;
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Berkas mahasiswa bimbingan yang menunggu validasi Anda
                            </p>
                        </Link>

                        {/* Mahasiswa Bimbingan */}
                        <Link
                            href="/pengajuan"
                            className="interactive-card click-bounce group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Mahasiswa Bimbingan
                                </span>
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-2xs transition-transform duration-200 group-hover:scale-110">
                                    <Users className="size-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <span className="text-3xl font-black tracking-tight text-blue-600 dark:text-blue-400 sm:text-4xl">
                                    {totalMahasiswa}
                                </span>
                                <span className="text-xs font-medium text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Lihat daftar &rarr;
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Mahasiswa aktif yang dibimbing secara akademik
                            </p>
                        </Link>

                        {/* Total Diverifikasi */}
                        <Link
                            href="/pengajuan"
                            className="interactive-card group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Telah Diverifikasi
                                </span>
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-2xs">
                                    <CheckCircle2 className="size-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <span className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-4xl">
                                    {diverifikasi}
                                </span>
                                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Lihat riwayat &rarr;
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Permohonan yang telah disetujui & diteruskan ke Kaprodi
                            </p>
                        </Link>
                    </div>

                    {/* Tabel Antrean Verifikasi Mahasiswa Bimbingan */}
                    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
                        <div className="flex items-center justify-between border-b border-border/80 p-5 sm:px-6">
                            <div>
                                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                                    <Clock className="size-4 text-amber-500" />
                                    Antrean Verifikasi Mahasiswa Bimbingan
                                </h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Daftar permohonan yang menunggu persetujuan dan verifikasi Dosen PA
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="click-bounce rounded-xl">
                                <Link href="/pengajuan">
                                    Buka Semua ({totalPengajuan})
                                    <ArrowRight className="ml-1.5 size-4" />
                                </Link>
                            </Button>
                        </div>

                        {recentPengajuans.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-14 text-center">
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-2xs">
                                    <CheckCircle2 className="size-7" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-foreground">
                                    Tidak ada antrean yang tertunda
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                                    Semua pengajuan dari mahasiswa bimbingan Anda telah selesai diverifikasi.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border text-sm">
                                    <thead className="bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            <th className="px-6 py-4 text-left">No. Pengajuan</th>
                                            <th className="px-6 py-4 text-left">Mahasiswa Pemohon</th>
                                            <th className="px-6 py-4 text-left">Layanan Akademik</th>
                                            <th className="px-6 py-4 text-left">Status</th>
                                            <th className="px-6 py-4 text-right">Aksi Verifikasi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/80">
                                        {recentPengajuans.map((item) => {
                                            const npm = item.pemohon?.nomor_induk ?? item.pemohon?.nim ?? '2415061079';
                                            const isPending = item.status_pengajuan_id === 1;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    onClick={() => router.visit(`/pengajuan/${item.id}`)}
                                                    className="group hover:bg-primary/5 transition-all duration-150 cursor-pointer"
                                                >
                                                    <td className="px-6 py-4 font-mono font-bold whitespace-nowrap text-primary group-hover:underline">
                                                        {item.nomor_pengajuan}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-foreground">
                                                        <div className="font-bold">{item.pemohon?.name ?? '-'}</div>
                                                        <span className="font-mono text-xs text-primary font-bold">
                                                            NPM: {npm}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-foreground font-medium">
                                                        {item.jenis_layanan?.nama ?? '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-2xs ${
                                                                isPending
                                                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25'
                                                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                                                            }`}
                                                        >
                                                            {isPending && (
                                                                <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />
                                                            )}
                                                            {item.status?.nama ?? 'Draft'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <Button
                                                            size="sm"
                                                            className="click-bounce rounded-xl bg-primary text-primary-foreground font-bold shadow-2xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.visit(`/pengajuan/${item.id}`);
                                                            }}
                                                        >
                                                            {isPending ? 'Verifikasi Sekarang' : 'Tinjau'}
                                                            <ArrowRight className="ml-1 size-3.5" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // ==========================================
        // 2. DASHBOARD KETUA PROGRAM STUDI (KAPRODI)
        // ==========================================
        if (role === 'kaprodi') {
            const antrean = stats.antrean ?? 0;
            const totalProdi = stats.totalProdi ?? 0;
            const disetujui = stats.disetujui ?? 0;
            const ditolak = stats.ditolak ?? 0;

            return (
                <div className="space-y-6">
                    {/* Welcome Banner Kaprodi */}
                    <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-transparent p-6 shadow-xs sm:p-8">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-purple-500/10 blur-3xl animate-pulse-glow" />
                        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/15 px-3 py-1 text-xs font-bold text-purple-700 dark:text-purple-300 shadow-2xs">
                                        <Shield className="size-3.5" />
                                        Ketua Program Studi
                                    </span>
                                    {antrean > 0 ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400 border border-purple-500/25">
                                            <span className="size-1.5 rounded-full bg-purple-500 animate-ping" />
                                            {antrean} Berkas Menunggu Pengesahan Kaprodi
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="size-3.5" />
                                            Seluruh Usulan Prodi Telah Divalidasi
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                                    Selamat Datang, {auth.user?.name}!
                                </h1>
                                <p className="text-sm text-muted-foreground max-w-xl">
                                    Panel otorisasi dan pengesahan resmi permohonan layanan akademik tingkat Program Studi.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Button asChild size="lg" className="click-bounce rounded-2xl shadow-xs shadow-purple-600/25 bg-purple-600 hover:bg-purple-700 text-white font-bold">
                                    <Link href="/pengajuan">
                                        <Shield className="mr-2 size-4" />
                                        Antrean Persetujuan Prodi ({antrean})
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stat Cards Khusus Kaprodi */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        {/* Menunggu Persetujuan Kaprodi */}
                        <Link
                            href="/pengajuan"
                            className={`interactive-card group relative block overflow-hidden rounded-3xl border p-6 shadow-xs ${
                                antrean > 0
                                    ? 'border-purple-500/40 bg-purple-500/5'
                                    : 'border-border bg-card'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Menunggu Pengesahan Kaprodi
                                </span>
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 shadow-2xs">
                                    <Clock className="size-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <span className="text-3xl font-black tracking-tight text-purple-600 dark:text-purple-400 sm:text-4xl">
                                    {antrean}
                                </span>
                                <span className="text-xs font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Sahkan usulan &rarr;
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Berkas telah diverifikasi Dosen PA & menunggu tanda tangan Kaprodi
                            </p>
                        </Link>

                        {/* Total Pengajuan Prodi */}
                        <Link
                            href="/pengajuan"
                            className="interactive-card group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Total Usulan Program Studi
                                </span>
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-2xs">
                                    <FileText className="size-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <span className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                                    {totalProdi}
                                </span>
                                <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Lihat arsip prodi &rarr;
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Seluruh rekapan permohonan layanan akademik prodi
                            </p>
                        </Link>

                        {/* Telah Disahkan */}
                        <div className="group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Telah Disahkan
                                </span>
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-2xs">
                                    <CheckCircle2 className="size-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <span className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-4xl">
                                    {disetujui}
                                </span>
                                <span className="text-xs font-medium text-emerald-600">
                                    Diteruskan ke Staff
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Berkas sah yang telah diteruskan untuk cetak/terbit
                            </p>
                        </div>
                    </div>

                    {/* Tabel Antrean Pengesahan Kaprodi */}
                    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
                        <div className="flex items-center justify-between border-b border-border/80 p-5 sm:px-6">
                            <div>
                                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                                    <Shield className="size-4 text-purple-600" />
                                    Antrean Pengesahan & Validasi Kaprodi
                                </h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Daftar permohonan yang telah lolos verifikasi Dosen PA dan menunggu persetujuan resmi Kaprodi
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="click-bounce rounded-xl">
                                <Link href="/pengajuan">
                                    Lihat Seluruhnya ({totalProdi})
                                    <ArrowRight className="ml-1.5 size-4" />
                                </Link>
                            </Button>
                        </div>

                        {recentPengajuans.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-14 text-center">
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 shadow-2xs">
                                    <CheckCircle2 className="size-7" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-foreground">
                                    Tidak ada berkas yang menunggu pengesahan
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                                    Seluruh permohonan yang masuk telah ditinjau dan divalidasi dengan baik.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border text-sm">
                                    <thead className="bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            <th className="px-6 py-4 text-left">No. Pengajuan</th>
                                            <th className="px-6 py-4 text-left">Mahasiswa & NPM</th>
                                            <th className="px-6 py-4 text-left">Layanan</th>
                                            <th className="px-6 py-4 text-left">Tahapan</th>
                                            <th className="px-6 py-4 text-right">Aksi Kaprodi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/80">
                                        {recentPengajuans.map((item) => {
                                            const npm = item.pemohon?.nomor_induk ?? item.pemohon?.nim ?? '2415061079';
                                            const isKaprodiQueue = item.status_pengajuan_id === 3;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    onClick={() => router.visit(`/pengajuan/${item.id}`)}
                                                    className="group hover:bg-purple-500/5 transition-all duration-150 cursor-pointer"
                                                >
                                                    <td className="px-6 py-4 font-mono font-bold whitespace-nowrap text-purple-700 dark:text-purple-400 group-hover:underline">
                                                        {item.nomor_pengajuan}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-foreground">
                                                        <div className="font-bold">{item.pemohon?.name ?? '-'}</div>
                                                        <span className="font-mono text-xs text-purple-600 font-bold">
                                                            NPM: {npm}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-foreground font-medium">
                                                        {item.jenis_layanan?.nama ?? '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-2xs ${
                                                                isKaprodiQueue
                                                                    ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25'
                                                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                                                            }`}
                                                        >
                                                            {isKaprodiQueue && (
                                                                <span className="size-1.5 rounded-full bg-purple-500 animate-ping" />
                                                            )}
                                                            {item.status?.nama ?? 'Draft'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <Button
                                                            size="sm"
                                                            className="click-bounce rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-2xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.visit(`/pengajuan/${item.id}`);
                                                            }}
                                                        >
                                                            {isKaprodiQueue ? 'Tinjau & Sahkan' : 'Detail'}
                                                            <ArrowRight className="ml-1 size-3.5" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // ==========================================
        // 3. DASHBOARD STAFF ADMINISTRASI AKADEMIK
        // ==========================================
        if (role === 'admin') {
            const antrean = stats.antrean ?? 0;
            const sedangProses = stats.sedangProses ?? 0;
            const selesai = stats.selesai ?? 0;
            const total = stats.total ?? 0;

            return (
                <div className="space-y-6">
                    {/* Welcome Banner Staff Akademik */}
                    <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-transparent p-6 shadow-xs sm:p-8">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl animate-pulse-glow" />
                        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-2xs">
                                        <Printer className="size-3.5" />
                                        Staff Administrasi Akademik
                                    </span>
                                    {antrean > 0 ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 border border-blue-500/25">
                                            <span className="size-1.5 rounded-full bg-blue-500 animate-ping" />
                                            {antrean} Berkas Siap Dicetak & Diterbitkan
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="size-3.5" />
                                            Antrean Dokumen Terbit Beres
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                                    Selamat Datang, {auth.user?.name}!
                                </h1>
                                <p className="text-sm text-muted-foreground max-w-xl">
                                    Pusat pelayanan tata usaha akademik, registrasi nomor surat, pencetakan dokumen resmi, dan pengarsipan kampus.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Button asChild size="lg" className="click-bounce rounded-2xl shadow-xs shadow-blue-600/25 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                                    <Link href="/pengajuan">
                                        <Printer className="mr-2 size-4" />
                                        Antrean Penerbitan Dokumen ({antrean})
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stat Cards Khusus Staff Akademik */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        {/* Siap Dicetak / Terbitkan */}
                        <Link
                            href="/pengajuan"
                            className={`interactive-card group relative block overflow-hidden rounded-3xl border p-6 shadow-xs ${
                                antrean > 0
                                    ? 'border-blue-500/40 bg-blue-500/5'
                                    : 'border-border bg-card'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Siap Cetak & Diterbitkan
                                </span>
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 shadow-2xs">
                                    <Printer className="size-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <span className="text-3xl font-black tracking-tight text-blue-600 dark:text-blue-400 sm:text-4xl">
                                    {antrean}
                                </span>
                                <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Proses dokumen &rarr;
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Telah disahkan Kaprodi & siap diterbitkan nomor suratnya
                            </p>
                        </Link>

                        {/* Sedang Diproses */}
                        <Link
                            href="/pengajuan"
                            className="interactive-card group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Sedang Diproses
                                </span>
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-2xs">
                                    <Clock className="size-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <span className="text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400 sm:text-4xl">
                                    {sedangProses}
                                </span>
                                <span className="text-xs font-medium text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Tinjau berkas &rarr;
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Berkas sedang dalam tahap paraf / penandatanganan fisik
                            </p>
                        </Link>

                        {/* Selesai Diterbitkan */}
                        <div className="group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Total Selesai Diterbitkan
                                </span>
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-2xs">
                                    <CheckCircle2 className="size-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <span className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-4xl">
                                    {selesai}
                                </span>
                                <span className="text-xs font-medium text-emerald-600">
                                    Arsip Resmi
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Surat yang telah diserahkan atau siap diambil mahasiswa
                            </p>
                        </div>
                    </div>

                    {/* Tabel Antrean Penerbitan & Cetak Dokumen */}
                    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
                        <div className="flex items-center justify-between border-b border-border/80 p-5 sm:px-6">
                            <div>
                                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                                    <Printer className="size-4 text-blue-600" />
                                    Antrean Dokumen Siap Cetak & Diterbitkan
                                </h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Permohonan yang telah disahkan Kaprodi dan siap diberikan nomor surat serta dicetak
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="click-bounce rounded-xl">
                                <Link href="/pengajuan">
                                    Buka Semua ({total})
                                    <ArrowRight className="ml-1.5 size-4" />
                                </Link>
                            </Button>
                        </div>

                        {recentPengajuans.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-14 text-center">
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 shadow-2xs">
                                    <CheckCircle2 className="size-7" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-foreground">
                                    Tidak ada dokumen yang menunggu penerbitan
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                                    Semua berkas yang disetujui telah selesai diproses oleh Staff Akademik.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border text-sm">
                                    <thead className="bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            <th className="px-6 py-4 text-left">No. Pengajuan</th>
                                            <th className="px-6 py-4 text-left">Mahasiswa Pemohon</th>
                                            <th className="px-6 py-4 text-left">Layanan Surat</th>
                                            <th className="px-6 py-4 text-left">Status</th>
                                            <th className="px-6 py-4 text-right">Aksi Staff</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/80">
                                        {recentPengajuans.map((item) => {
                                            const npm = item.pemohon?.nomor_induk ?? item.pemohon?.nim ?? '2415061079';
                                            const isReadyToPrint = item.status_pengajuan_id === 4;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    onClick={() => router.visit(`/pengajuan/${item.id}`)}
                                                    className="group hover:bg-blue-500/5 transition-all duration-150 cursor-pointer"
                                                >
                                                    <td className="px-6 py-4 font-mono font-bold whitespace-nowrap text-blue-700 dark:text-blue-400 group-hover:underline">
                                                        {item.nomor_pengajuan}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-foreground">
                                                        <div className="font-bold">{item.pemohon?.name ?? '-'}</div>
                                                        <span className="font-mono text-xs text-blue-600 font-bold">
                                                            NPM: {npm}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-foreground font-medium">
                                                        {item.jenis_layanan?.nama ?? '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-2xs ${
                                                                isReadyToPrint
                                                                    ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25'
                                                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                                                            }`}
                                                        >
                                                            {isReadyToPrint && (
                                                                <span className="size-1.5 rounded-full bg-blue-500 animate-ping" />
                                                            )}
                                                            {item.status?.nama ?? 'Draft'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <Button
                                                            size="sm"
                                                            className="click-bounce rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-2xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.visit(`/pengajuan/${item.id}`);
                                                            }}
                                                        >
                                                            {isReadyToPrint ? 'Proses & Terbitkan' : 'Detail'}
                                                            <ArrowRight className="ml-1 size-3.5" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // ==========================================
        // 4. DEFAULT: DASHBOARD MAHASISWA
        // ==========================================
        const total = stats.total ?? 0;
        const menunggu = stats.menunggu ?? 0;
        const selesai = stats.selesai ?? 0;
        const revisi = stats.revisi ?? 0;
        const dosenPa = extra.dosenPa;

        return (
            <div className="space-y-6">
                {/* Welcome Banner Mahasiswa */}
                <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-6 shadow-xs sm:p-8">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />

                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 shadow-2xs">
                                    <GraduationCap className="size-3.5" />
                                    Mahasiswa Aktif
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Portal Layanan Aktif
                                </span>
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                                Selamat Datang, {auth.user?.name}!
                            </h1>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Ajukan permohonan surat izin, surat keterangan aktif, surat kelulusan, dan pantau proses verifikasi secara digital.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button asChild size="lg" className="click-bounce rounded-2xl shadow-xs shadow-primary/25 bg-primary text-primary-foreground font-bold">
                                <a href="/pengajuan/create">
                                    <FilePlus className="mr-2 size-4" />
                                    + Buat Pengajuan Baru
                                </a>
                            </Button>
                            <Button variant="outline" size="lg" asChild className="click-bounce rounded-2xl">
                                <Link href="/pengajuan">
                                    <FileText className="mr-2 size-4" />
                                    Riwayat Pengajuan
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Info Box Dosen Pembimbing Akademik Saya */}
                {dosenPa && (
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold shadow-2xs">
                                <UserCheck className="size-6" />
                            </div>
                            <div>
                                <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
                                    Dosen Pembimbing Akademik (PA) Anda
                                </div>
                                <div className="text-sm font-bold text-foreground mt-0.5">
                                    {dosenPa.name}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                    NIP: {dosenPa.nip ?? '-'} • {dosenPa.email}
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-muted-foreground bg-card px-3 py-1.5 rounded-xl border border-border shadow-2xs self-start sm:self-center">
                            Verifikator Tahap Pertama Berkas Anda
                        </span>
                    </div>
                )}

                {/* 3 Interactive Stat Cards Mahasiswa */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <Link
                        href="/pengajuan"
                        className="interactive-card group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Total Pengajuan Saya
                            </span>
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-2xs">
                                <FileText className="size-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                                {total}
                            </span>
                            <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Buka arsip &rarr;
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Seluruh riwayat permohonan yang pernah Anda buat
                        </p>
                    </Link>

                    <Link
                        href="/pengajuan"
                        className="interactive-card group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Sedang Dalam Proses
                            </span>
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-2xs">
                                <Clock className="size-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400 sm:text-4xl">
                                {menunggu}
                            </span>
                            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Pantau proses &rarr;
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Berkas dalam tahap verifikasi Dosen PA / Kaprodi / Staff
                        </p>
                    </Link>

                    <Link
                        href="/pengajuan"
                        className="interactive-card group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Pengajuan Selesai
                            </span>
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-2xs">
                                <CheckCircle2 className="size-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-4xl">
                                {selesai}
                            </span>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Ambil surat &rarr;
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Surat resmi siap diunduh atau diambil fisiknya
                        </p>
                    </Link>
                </div>

                {/* Tabel Pengajuan Saya Terkini */}
                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
                    <div className="flex items-center justify-between border-b border-border/80 p-5 sm:px-6">
                        <div>
                            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                                <Sparkles className="size-4 text-primary" />
                                Riwayat Pengajuan Saya Terkini
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Progres verifikasi permohonan surat yang sedang berjalan
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="click-bounce rounded-xl">
                            <Link href="/pengajuan">
                                Lihat Semua
                                <ArrowRight className="ml-1.5 size-4" />
                            </Link>
                        </Button>
                    </div>

                    {recentPengajuans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-14 text-center">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-2xs">
                                <Info className="size-7" />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-foreground">
                                Belum ada pengajuan aktif
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                                Anda belum memiliki permohonan yang diajukan. Mulai buat permohonan layanan akademik pertama Anda!
                            </p>
                            <div className="mt-6">
                                <Button asChild size="sm" className="click-bounce rounded-xl bg-primary text-primary-foreground">
                                    <a href="/pengajuan/create">
                                        <FilePlus className="mr-2 size-4" />
                                        Mulai Pengajuan
                                    </a>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border text-sm">
                                <thead className="bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 text-left">No. Pengajuan</th>
                                        <th className="px-6 py-4 text-left">Layanan Diminta</th>
                                        <th className="px-6 py-4 text-left">Tanggal Diajukan</th>
                                        <th className="px-6 py-4 text-left">Status Terkini</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/80">
                                    {recentPengajuans.map((item) => (
                                        <tr
                                            key={item.id}
                                            onClick={() => router.visit(`/pengajuan/${item.id}`)}
                                            className="group hover:bg-primary/5 transition-all duration-150 cursor-pointer"
                                        >
                                            <td className="px-6 py-4 font-mono font-bold whitespace-nowrap text-primary group-hover:underline">
                                                {item.nomor_pengajuan}
                                            </td>
                                            <td className="px-6 py-4 font-medium whitespace-nowrap text-foreground">
                                                {item.jenis_layanan?.nama ?? '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-xs">
                                                {item.tanggal_pengajuan
                                                    ? new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', {
                                                          day: 'numeric',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      })
                                                    : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 shadow-2xs">
                                                    <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />
                                                    {item.status?.nama ?? 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="click-bounce font-bold text-primary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.visit(`/pengajuan/${item.id}`);
                                                    }}
                                                >
                                                    Detail
                                                    <ArrowRight className="ml-1 size-3.5 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title={`Dashboard - ${role.replace('_', ' ').toUpperCase()}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {renderRoleSpecificContent()}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs,
};
