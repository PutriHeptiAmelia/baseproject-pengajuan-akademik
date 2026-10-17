import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    FilePlus,
    FileText,
    Filter,
    GraduationCap,
    RotateCcw,
    Search,
    Sparkles,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BreadcrumbItem, PengajuanItem } from '@/types';

interface Props {
    pengajuans?: PengajuanItem[];
    role?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan',
        href: '/pengajuan',
    },
];

type FilterStatus = 'all' | 'menunggu' | 'selesai' | 'ditolak';

export default function Index({ pengajuans = [], role = 'mahasiswa' }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

    const filtered = useMemo(() => {
        return pengajuans.filter((item) => {
            const query = searchTerm.toLowerCase();
            const studentNpm = item.pemohon?.nomor_induk ?? item.pemohon?.nim ?? '2415061079';

            const matchesSearch =
                item.nomor_pengajuan?.toLowerCase().includes(query) ||
                item.pemohon?.name?.toLowerCase().includes(query) ||
                studentNpm.toLowerCase().includes(query) ||
                item.jenis_layanan?.nama?.toLowerCase().includes(query) ||
                item.status?.nama?.toLowerCase().includes(query);

            if (!matchesSearch) return false;

            const status = item.status?.nama?.toLowerCase() || '';
            if (activeFilter === 'menunggu') {
                return status.includes('menunggu') || status.includes('proses') || status.includes('diajukan');
            }
            if (activeFilter === 'selesai') {
                return status.includes('selesai') || status.includes('setuju');
            }
            if (activeFilter === 'ditolak') {
                return status.includes('tolak') || status.includes('revisi');
            }
            return true;
        });
    }, [pengajuans, searchTerm, activeFilter]);

    const getStatusBadge = (statusName?: string) => {
        const name = statusName?.toLowerCase() || '';
        if (name.includes('selesai') || name.includes('setuju')) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-2xs">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {statusName ?? 'Selesai'}
                </span>
            );
        }
        if (name.includes('tolak')) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 shadow-2xs">
                    <span className="size-1.5 rounded-full bg-rose-500" />
                    {statusName ?? 'Ditolak'}
                </span>
            );
        }
        if (name.includes('revisi')) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-2xs">
                    <span className="size-1.5 rounded-full bg-blue-500" />
                    {statusName ?? 'Perlu Revisi'}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shadow-2xs">
                <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full bg-amber-500"></span>
                </span>
                {statusName ?? 'Menunggu Verifikasi'}
            </span>
        );
    };

    return (
        <>
            <Head title="Daftar Pengajuan Akademik" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header dengan badge & aksi per-role */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                <Sparkles className="size-3" />
                                {role === 'mahasiswa' ? 'Portal Pelayanan Digital Mahasiswa'
                                    : role === 'dosen_pa' ? 'Panel Verifikasi Dosen PA'
                                    : role === 'kaprodi' ? 'Panel Validasi Kaprodi'
                                    : 'Panel Tata Usaha Akademik'}
                            </span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                            {role === 'mahasiswa' ? 'Daftar Pengajuan Saya'
                                : role === 'dosen_pa' ? 'Pengajuan Bimbingan Mahasiswa'
                                : role === 'kaprodi' ? 'Seluruh Pengajuan Program Studi'
                                : 'Antrean Pengajuan — Staff Akademik'}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {role === 'mahasiswa'
                                ? 'Pantau dan kelola progres verifikasi seluruh permohonan surat akademik Anda.'
                                : role === 'dosen_pa'
                                ? 'Tinjau dan verifikasi berkas permohonan dari mahasiswa bimbingan Anda.'
                                : role === 'kaprodi'
                                ? 'Validasi dan berikan pengesahan resmi atas permohonan layanan akademik prodi.'
                                : 'Proses, cetak, dan terbitkan surat resmi permohonan layanan yang telah disahkan.'}
                        </p>
                    </div>
                    {role === 'mahasiswa' && (
                        <div>
                            <Button asChild size="lg" className="click-bounce rounded-2xl shadow-xs shadow-primary/25 bg-primary text-primary-foreground font-bold">
                                <a href="/pengajuan/create">
                                    <FilePlus className="mr-2 size-4" />
                                    + Buat Pengajuan Baru
                                </a>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Interactive Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-2xs">
                        <button
                            type="button"
                            onClick={() => setActiveFilter('all')}
                            className={`click-bounce rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                                activeFilter === 'all'
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        >
                            Semua ({pengajuans.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveFilter('menunggu')}
                            className={`click-bounce rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                                activeFilter === 'menunggu'
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        >
                            Menunggu Verifikasi
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveFilter('selesai')}
                            className={`click-bounce rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                                activeFilter === 'selesai'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        >
                            Selesai
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveFilter('ditolak')}
                            className={`click-bounce rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                                activeFilter === 'ditolak'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        >
                            Ditolak / Revisi
                        </button>
                    </div>

                    {/* Search Input dengan Clear Button & NPM Searchable */}
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari no. pengajuan, nama, NPM..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-2xl pl-10 pr-9 transition-all focus:ring-4 focus:ring-primary/10 bg-card"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="click-bounce absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Container dengan Desain Modern */}
                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-16 text-center">
                            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-2xs">
                                <FileText className="size-8" />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-foreground">
                                {searchTerm || activeFilter !== 'all'
                                    ? 'Tidak ada pengajuan yang sesuai'
                                    : 'Belum ada data pengajuan'}
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                                {searchTerm || activeFilter !== 'all'
                                    ? 'Coba ganti filter status atau periksa kembali kata kunci pencarian Anda.'
                                    : 'Anda belum memiliki permohonan layanan akademik yang tersimpan dalam sistem.'}
                            </p>
                            <div className="mt-6 flex items-center gap-3">
                                {(searchTerm || activeFilter !== 'all') && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setActiveFilter('all');
                                        }}
                                        className="click-bounce rounded-xl"
                                    >
                                        <RotateCcw className="mr-1.5 size-3.5" />
                                        Reset Filter
                                    </Button>
                                )}
                                <Button asChild size="sm" className="click-bounce rounded-xl bg-primary text-primary-foreground shadow-xs">
                                    <a href="/pengajuan/create">
                                        <FilePlus className="mr-1.5 size-3.5" />
                                        Buat Pengajuan Baru
                                    </a>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border text-sm">
                                <thead className="bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            No. Pengajuan
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Pemohon & NPM
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Jenis Layanan
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Status Terkini
                                        </th>
                                        <th className="px-6 py-4 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/80">
                                    {filtered.map((item) => {
                                        const npm = item.pemohon?.nomor_induk ?? item.pemohon?.nim ?? '2415061079';
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
                                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                                        <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md text-[11px] border border-primary/15">
                                                            NPM: {npm}
                                                        </span>
                                                        {item.pemohon?.email && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="text-muted-foreground truncate max-w-[150px]">{item.pemohon.email}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-foreground">
                                                    <span className="font-medium">{item.jenis_layanan?.nama ?? '-'}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(item.status?.nama)}
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
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs,
};
