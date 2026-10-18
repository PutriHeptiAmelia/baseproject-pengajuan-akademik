import { Head, Link, usePage, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    Download,
    Eye,
    FileCheck,
    FileText,
    GraduationCap,
    Printer,
    Shield,
    ShieldCheck,
    Sparkles,
    User,
    UserCheck,
    X,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import AppLogoIcon from "@/components/app-logo-icon";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { BreadcrumbItem, DokumenPengajuan, PengajuanItem } from "@/types";

interface Props {
    pengajuan: PengajuanItem;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Pengajuan",
        href: "/pengajuan",
    },
    {
        title: "Detail Pengajuan",
        href: "#",
    },
];

export default function Show({ pengajuan }: Props) {
    const { auth } = usePage().props;
    const userRole = (auth as any)?.user?.role ?? "mahasiswa";
    const [selectedDoc, setSelectedDoc] = useState<DokumenPengajuan | null>(
        null,
    );
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [copiedNpm, setCopiedNpm] = useState(false);

    const { post, processing } = useForm();

    // 1. Cek Role
    const isDosenPA = userRole === "dosen_pa";
    const isKaprodi = userRole === "kaprodi";

    // 2. Cek Status
    const statusNungguPA =
        pengajuan.status?.kode === "diajukan" || pengajuan.status?.urutan === 1;
    const statusNungguKaprodi =
        pengajuan.status?.kode === "diverifikasi_pa" ||
        pengajuan.status?.urutan === 3;

    const isAdmin = userRole === "admin";

    // Sesuaikan kode 'disetujui_kaprodi' dengan kode status di DB kamu
    const statusNungguAdmin =
        pengajuan.status?.kode === "disetujui_kaprodi" ||
        pengajuan.status?.urutan === 5;

    // 3. Tombol muncul untuk Dosen PA atau Kaprodi jika statusnya sesuai
    const bisaApprove =
        (isDosenPA && statusNungguPA) ||
        (isKaprodi && statusNungguKaprodi) ||
        (isAdmin && statusNungguAdmin);

    const submitRevisi = () => {
        post(`/pengajuan/${pengajuan.id}/revisi`);
    };

    const submitTolak = () => {
        if (
            confirm(
                "Apakah Anda yakin ingin MENOLAK pengajuan ini? Aksi ini tidak bisa dibatalkan.",
            )
        ) {
            post(`/pengajuan/${pengajuan.id}/tolak`);
        }
    };

    const submitAjukanUlang = () => {
        if (confirm("Ajukan ulang pengajuan ini?")) {
            post(`/pengajuan/${pengajuan.id}/ajukan-ulang`);
        }
    };

    const submitApprove = () => {
        post(`/pengajuan/${pengajuan.id}/approve`);
    };

    // Nilai NPM Mahasiswa dari database atau fallback default
    const studentNpm =
        pengajuan.pemohon?.nomor_induk ??
        pengajuan.pemohon?.nim ??
        "2415061079";

    const handleCopyNpm = () => {
        navigator.clipboard.writeText(studentNpm);
        setCopiedNpm(true);
        setTimeout(() => setCopiedNpm(false), 2000);
    };

    const formattedTanggal = pengajuan.tanggal_pengajuan
        ? new Date(pengajuan.tanggal_pengajuan).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : pengajuan.created_at
          ? new Date(pengajuan.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
          : "-";

    // Urutan status stepper
    const currentOrder = pengajuan.status?.urutan ?? 1;

    const steps = [
        { title: "Diajukan Mahasiswa", order: 1, role: "Mahasiswa" },
        { title: "Verifikasi Dosen PA", order: 3, role: "Dosen PA" },
        { title: "Persetujuan Kaprodi", order: 4, role: "Kaprodi" },
        { title: "Penerbitan Dokumen", order: 6, role: "Staff Akademik" },
    ];

    const handleDownloadSimulated = (doc: DokumenPengajuan) => {
        setIsDownloaded(true);
        const content =
            `============================================================\n` +
            `     UNIVERSITAS LAMPUNG - SISTEM INFORMASI AKADEMIK\n` +
            `         BUKTI LAMPIRAN BERKAS PENGAJUAN RESMI\n` +
            `============================================================\n\n` +
            `Nomor Pengajuan : ${pengajuan.nomor_pengajuan}\n` +
            `Nama Mahasiswa  : ${pengajuan.pemohon?.name ?? "-"}\n` +
            `NPM             : ${studentNpm}\n` +
            `Jenis Layanan   : ${pengajuan.jenis_layanan?.nama ?? "-"}\n` +
            `Status          : ${pengajuan.status?.nama ?? "Draft"}\n` +
            `Tanggal Unggah  : ${formattedTanggal}\n` +
            `Nama Berkas     : ${doc.nama_file}\n` +
            `Ukuran Berkas   : ${(doc.ukuran_file / 1024).toFixed(1)} KB\n` +
            `Tipe Berkas     : ${doc.tipe_file ?? "PDF"}\n\n` +
            `Keterangan:\n${pengajuan.keterangan || "Tidak ada catatan tambahan."}\n\n` +
            `Status Keabsahan: DIVERIFIKASI SECARA ELEKTRONIK\n` +
            `Kode Validasi   : UNILA-SIAKAD-${pengajuan.nomor_pengajuan}-${studentNpm}\n` +
            `Waktu Unduh     : ${new Date().toLocaleString("id-ID")}\n` +
            `============================================================\n`;

        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Lampiran_${pengajuan.nomor_pengajuan}_${doc.nama_file.replace(/[^a-zA-Z0-9_-]/g, "_")}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setTimeout(() => setIsDownloaded(false), 3000);
    };

    return (
        <>
            <Head title={`Detail Pengajuan - ${pengajuan.nomor_pengajuan}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header dengan Quick Back & Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3.5">
                        <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="click-bounce rounded-2xl border-border/80 shadow-2xs hover:bg-primary/5 hover:text-primary transition-all"
                        >
                            <Link href="/pengajuan">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                                    {pengajuan.nomor_pengajuan}
                                </h1>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shadow-2xs">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex size-2 rounded-full bg-amber-500"></span>
                                    </span>
                                    {pengajuan.status?.nama ?? "Draft"}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground sm:text-sm mt-0.5 flex items-center gap-2">
                                <span>
                                    Permohonan Layanan{" "}
                                    {pengajuan.jenis_layanan?.nama ??
                                        "Akademik"}
                                </span>
                                <span>•</span>
                                <span className="font-mono text-primary font-medium">
                                    NPM: {studentNpm}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="click-bounce rounded-xl"
                        >
                            <Link href="/pengajuan">Kembali ke Daftar</Link>
                        </Button>
                        {userRole === "mahasiswa" &&
                            pengajuan.status?.kode !== "revisi" && (
                                <Button
                                    asChild
                                    size="sm"
                                    className="click-bounce rounded-xl shadow-xs shadow-primary/25 bg-primary text-primary-foreground"
                                >
                                    <a href="/pengajuan/create">
                                        + Buat Pengajuan Baru
                                    </a>
                                </Button>
                            )}
                    </div>
                </div>

                {/* Progress Stepper Visual Card dengan Academic Accent */}
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-indigo-600" />

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Sparkles className="size-3.5 text-primary" />
                            Alur Tahapan & Verifikasi Dokumen
                        </h3>
                        <span className="text-xs font-semibold text-primary">
                            Tahap {currentOrder} dari 6
                        </span>
                    </div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-4 left-6 right-6 hidden h-0.5 bg-border sm:block" />

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                            {steps.map((step, idx) => {
                                const isPassed = currentOrder >= step.order;
                                const isCurrent = currentOrder === step.order;

                                return (
                                    <div
                                        key={idx}
                                        className="relative z-10 flex sm:flex-col items-center gap-3 sm:text-center group"
                                    >
                                        <div
                                            className={`flex size-10 shrink-0 items-center justify-center rounded-2xl font-bold text-xs transition-all duration-300 shadow-2xs ${
                                                isPassed
                                                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-primary/30"
                                                    : "bg-muted text-muted-foreground border border-border"
                                            } ${isCurrent ? "animate-pulse scale-105 ring-4 ring-primary/30" : ""}`}
                                        >
                                            {isPassed ? (
                                                <CheckCircle2 className="size-5" />
                                            ) : (
                                                idx + 1
                                            )}
                                        </div>
                                        <div>
                                            <div
                                                className={`text-xs font-bold transition-colors ${
                                                    isPassed
                                                        ? "text-foreground"
                                                        : "text-muted-foreground"
                                                }`}
                                            >
                                                {step.title}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground mt-0.5">
                                                {step.role}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-6 md:col-span-2">
                        {/* Info Card */}
                        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs relative overflow-hidden">
                            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                                <FileText className="size-4 text-primary" />
                                Informasi Pengajuan Layanan
                            </h2>
                            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 transition-all duration-200 hover:bg-muted/40 hover:border-primary/20">
                                    <dt className="text-xs font-semibold text-muted-foreground">
                                        Jenis Layanan Akademik
                                    </dt>
                                    <dd className="mt-1.5 text-sm font-bold text-foreground">
                                        {pengajuan.jenis_layanan?.nama ?? "-"}
                                    </dd>
                                </div>
                                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 transition-all duration-200 hover:bg-muted/40 hover:border-primary/20">
                                    <dt className="text-xs font-semibold text-muted-foreground">
                                        Tanggal Diajukan
                                    </dt>
                                    <dd className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-foreground">
                                        <Calendar className="size-4 text-primary" />
                                        {formattedTanggal}
                                    </dd>
                                </div>
                                <div className="sm:col-span-2 rounded-2xl border border-border/70 bg-muted/20 p-4 transition-all duration-200 hover:bg-muted/40 hover:border-primary/20">
                                    <dt className="text-xs font-semibold text-muted-foreground">
                                        Keterangan / Keperluan
                                    </dt>
                                    <dd className="mt-2 text-sm text-foreground leading-relaxed">
                                        {pengajuan.keterangan || (
                                            <span className="italic text-muted-foreground">
                                                Tidak ada keterangan tambahan
                                                yang dicantumkan.
                                            </span>
                                        )}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Dokumen Lampiran Card dengan Tombol Lihat Interaktif */}
                        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                                        <FileCheck className="size-4 text-primary" />
                                        Dokumen Lampiran Berkas
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Klik pada dokumen atau tombol lihat
                                        untuk membuka pratinjau surat resmi
                                    </p>
                                </div>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-2xs">
                                    {pengajuan.dokumen?.length ?? 0} Berkas
                                    Terlampir
                                </span>
                            </div>

                            {pengajuan.dokumen &&
                            pengajuan.dokumen.length > 0 ? (
                                <ul className="mt-5 space-y-3">
                                    {pengajuan.dokumen.map((doc) => (
                                        <li
                                            key={doc.id}
                                            onClick={() => setSelectedDoc(doc)}
                                            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border/80 bg-card hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:scale-[0.99]"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shadow-2xs">
                                                    <FileText className="size-6" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-foreground block group-hover:text-primary transition-colors">
                                                        {doc.nama_file}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                        <span className="font-mono">
                                                            {(
                                                                doc.ukuran_file /
                                                                1024
                                                            ).toFixed(1)}{" "}
                                                            KB
                                                        </span>
                                                        <span>•</span>
                                                        <span className="uppercase font-semibold px-1.5 py-0.2 rounded bg-muted text-[10px] text-foreground">
                                                            {doc.tipe_file?.replace(
                                                                "application/",
                                                                "",
                                                            ) ?? "PDF"}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                                                            <CheckCircle2 className="size-3" />
                                                            Tervalidasi
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 sm:mt-0 flex items-center gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedDoc(doc);
                                                    }}
                                                    className="click-bounce font-bold text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-xl shadow-2xs transition-all"
                                                >
                                                    <Eye className="mr-1.5 size-4" />
                                                    Lihat Berkas
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownloadSimulated(
                                                            doc,
                                                        );
                                                    }}
                                                    className="click-bounce rounded-xl text-muted-foreground hover:text-foreground"
                                                >
                                                    <Download className="size-4" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                                    <FileText className="mx-auto size-8 text-muted-foreground/60 mb-2" />
                                    Tidak ada dokumen lampiran yang diunggah
                                    pada pengajuan ini.
                                </div>
                            )}
                        </div>

                        {/* Riwayat Persetujuan Card */}
                        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
                            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                                <ShieldCheck className="size-4 text-primary" />
                                Riwayat Persetujuan & Verifikasi
                            </h2>
                            {pengajuan.persetujuan &&
                            pengajuan.persetujuan.length > 0 ? (
                                <ul className="mt-5 space-y-3">
                                    {pengajuan.persetujuan.map((approval) => (
                                        <li
                                            key={approval.id}
                                            className="rounded-2xl border border-border/80 bg-muted/20 p-4 transition-all duration-200 hover:border-primary/30"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-2xs">
                                                        {approval.approver?.name?.charAt(
                                                            0,
                                                        ) ?? "A"}
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-bold text-foreground block">
                                                            {approval.approver
                                                                ?.name ??
                                                                "Approver"}
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground">
                                                            Dosen Pembimbing
                                                            Akademik /
                                                            Verifikator
                                                        </span>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`capitalize rounded-full px-3 py-1 text-xs font-bold shadow-2xs ${
                                                        approval.keputusan ===
                                                        "setuju"
                                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                                                            : approval.keputusan ===
                                                                "tolak"
                                                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25"
                                                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25"
                                                    }`}
                                                >
                                                    {approval.keputusan}
                                                </span>
                                            </div>
                                            {approval.catatan && (
                                                <div className="mt-3 text-xs text-foreground bg-card p-3.5 rounded-xl border border-border/60 shadow-2xs leading-relaxed">
                                                    <strong className="text-primary">
                                                        Catatan Verifikator:
                                                    </strong>{" "}
                                                    {approval.catatan}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="mt-4 rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                                    Belum ada catatan persetujuan untuk
                                    pengajuan ini. Berkas sedang dalam antrean
                                    verifikasi Dosen PA.
                                </div>
                            )}
                        </div>
                        {/* Kotak Aksi Revisi Mahasiswa */}
                        {userRole === "mahasiswa" &&
                            pengajuan.status?.kode === "revisi" && (
                                <div className="mt-6 p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30">
                                    <h3 className="text-sm font-bold text-amber-500 mb-2 flex items-center gap-2">
                                        <Clock className="size-4" />
                                        Berkas Perlu Direvisi
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                                        Dosen PA telah mengembalikan berkas ini
                                        untuk diperbaiki. Silakan periksa
                                        kembali lampiran Anda. Jika sudah yakin,
                                        klik tombol di bawah untuk mengajukan
                                        ulang.
                                    </p>
                                    <Button
                                        onClick={submitAjukanUlang}
                                        disabled={processing}
                                        className="w-full sm:w-auto rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
                                    >
                                        {processing
                                            ? "Memproses..."
                                            : "Ajukan Ulang Pengajuan"}
                                    </Button>
                                </div>
                            )}
                        {/* --- KOTAK AKSI VERIFIKASI --- */}
                        {bisaApprove && (
                            <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                                <h3 className="text-sm font-bold text-primary mb-3">
                                    {isAdmin
                                        ? "Aksi Penerbitan Dokumen"
                                        : `Verifikasi ${isKaprodi ? "Kaprodi" : "Dosen PA"}`}
                                </h3>
                                <p className="text-xs text-muted-foreground mb-4">
                                    {isAdmin
                                        ? "Klik tombol di bawah untuk menyelesaikan pengajuan dan menerbitkan dokumen resmi."
                                        : "Pilih untuk menyetujui atau menolak berkas pengajuan."}
                                </p>
                                <div className="flex items-center justify-end gap-3">
                                    {/* Tombol Tolak (Sembunyi kalau Admin) */}
                                    {!isAdmin && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={submitTolak}
                                            disabled={processing}
                                            className="rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50"
                                        >
                                            Tolak
                                        </Button>
                                    )}

                                    {/* Tombol Revisi (Cuma Dosen PA) */}
                                    {isDosenPA && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={submitRevisi}
                                            disabled={processing}
                                            className="rounded-xl text-amber-600 border-amber-200 hover:bg-amber-50"
                                        >
                                            Revisi
                                        </Button>
                                    )}

                                    {/* Tombol Setujui / Selesaikan */}
                                    <Button
                                        type="button"
                                        onClick={submitApprove}
                                        disabled={processing}
                                        className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        {processing
                                            ? "Memproses..."
                                            : isAdmin
                                              ? "Selesaikan & Terbitkan Dokumen"
                                              : "Setujui"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Sidebar Pemohon Card dengan NPM Menonjol */}
                    <div className="space-y-6">
                        <div className="interactive-card rounded-3xl border border-border bg-card p-6 shadow-xs relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                                <GraduationCap className="size-4 text-primary" />
                                Profil Pemohon
                            </h2>
                            <div className="mt-5 flex items-center gap-3.5 border-b border-border/80 pb-5">
                                <div className="flex size-13 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-700 text-white font-black text-lg shadow-xs">
                                    {pengajuan.pemohon?.name?.charAt(0) ?? "M"}
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground text-sm">
                                        {pengajuan.pemohon?.name ?? "-"}
                                    </h4>
                                    <span className="inline-flex items-center gap-1 mt-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                        Mahasiswa Aktif Terdaftar
                                    </span>
                                </div>
                            </div>
                            <dl className="mt-5 space-y-4">
                                {/* NPM Field yang Jelas dan Menonjol */}
                                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5">
                                    <dt className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                                        <span>NPM (Nomor Pokok Mahasiswa)</span>
                                        <button
                                            type="button"
                                            onClick={handleCopyNpm}
                                            className="click-bounce text-[11px] text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
                                            title="Salin NPM"
                                        >
                                            {copiedNpm ? (
                                                <>
                                                    <Check className="size-3 text-emerald-600" />
                                                    <span className="text-emerald-600">
                                                        Tersalin
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="size-3" />
                                                    <span>Salin</span>
                                                </>
                                            )}
                                        </button>
                                    </dt>
                                    <dd className="mt-1 font-mono text-base font-black tracking-wider text-primary">
                                        {studentNpm}
                                    </dd>
                                </div>

                                <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                                    <dt className="text-xs font-medium text-muted-foreground">
                                        Email Kampus
                                    </dt>
                                    <dd className="mt-0.5 text-xs font-semibold text-foreground truncate">
                                        {pengajuan.pemohon?.email ?? "-"}
                                    </dd>
                                </div>

                                <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                                    <dt className="text-xs font-medium text-muted-foreground">
                                        Program Studi & Fakultas
                                    </dt>
                                    <dd className="mt-0.5 text-xs font-semibold text-foreground">
                                        S1 Teknik Informatika — Fakultas Teknik
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Dialog Pratinjau Dokumen Lampiran Bergaya Surat Resmi */}
            <Dialog
                open={selectedDoc !== null}
                onOpenChange={(open) => !open && setSelectedDoc(null)}
            >
                <DialogContent className="max-w-2xl sm:rounded-3xl p-6 sm:p-8">
                    {selectedDoc && (
                        <>
                            <DialogHeader className="text-left border-b border-border pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-2xs">
                                        <FileCheck className="size-6" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-lg font-black text-foreground">
                                            Pratinjau Dokumen Lampiran Resmi
                                        </DialogTitle>
                                        <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                            {selectedDoc.nama_file} •{" "}
                                            {(
                                                selectedDoc.ukuran_file / 1024
                                            ).toFixed(1)}{" "}
                                            KB
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            {/* Lembar Dokumen Pratinjau Bergaya Resmi Kampus */}
                            <div className="academic-paper mt-3 rounded-2xl border-2 border-slate-300 p-6 sm:p-7 text-slate-800 shadow-md relative">
                                <div className="academic-watermark">
                                    UNILA RESMI
                                </div>

                                {/* KOP Surat Resmi Kampus */}
                                <div className="relative z-10 border-b-2 border-double border-slate-900 pb-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1.5">
                                        <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
                                            <AppLogoIcon className="size-4" />
                                        </div>
                                        <span className="text-[11px] sm:text-xs font-bold tracking-wider text-slate-900 uppercase">
                                            KEMENTERIAN PENDIDIKAN TINGGI,
                                            SAINS, DAN TEKNOLOGI
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                        UNIVERSITAS LAMPUNG — FAKULTAS TEKNIK
                                    </h3>
                                    <p className="text-[11px] text-slate-600 font-medium">
                                        Sistem Informasi Pengajuan &
                                        Administrasi Akademik Terpadu (SIAKAD)
                                    </p>
                                </div>

                                {/* Body Dokumen */}
                                <div className="relative z-10 mt-5 space-y-4 text-xs sm:text-sm">
                                    <div className="text-center font-bold text-slate-900 tracking-wide uppercase border-b border-slate-200 pb-2">
                                        LEMBAR VERIFIKASI KEABSAHAN BERKAS
                                        ELEKTRONIK
                                    </div>

                                    <table className="w-full text-xs">
                                        <tbody>
                                            <tr className="border-b border-slate-100">
                                                <td className="py-2 text-slate-500 font-medium w-40">
                                                    Nomor Pengajuan
                                                </td>
                                                <td className="py-2 font-mono font-bold text-slate-900">
                                                    :{" "}
                                                    {pengajuan.nomor_pengajuan}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <td className="py-2 text-slate-500 font-medium">
                                                    Nama Mahasiswa
                                                </td>
                                                <td className="py-2 font-semibold text-slate-900">
                                                    :{" "}
                                                    {pengajuan.pemohon?.name ??
                                                        "-"}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <td className="py-2 text-slate-500 font-medium">
                                                    NPM (Nomor Induk)
                                                </td>
                                                <td className="py-2 font-mono font-black text-primary text-sm">
                                                    : {studentNpm}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <td className="py-2 text-slate-500 font-medium">
                                                    Program Studi
                                                </td>
                                                <td className="py-2 font-semibold text-slate-900">
                                                    : S1 Teknik Informatika
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <td className="py-2 text-slate-500 font-medium">
                                                    Layanan Diajukan
                                                </td>
                                                <td className="py-2 font-semibold text-slate-900">
                                                    :{" "}
                                                    {pengajuan.jenis_layanan
                                                        ?.nama ?? "-"}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <td className="py-2 text-slate-500 font-medium">
                                                    Nama Dokumen
                                                </td>
                                                <td className="py-2 font-semibold text-primary">
                                                    : {selectedDoc.nama_file}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <td className="py-2 text-slate-500 font-medium">
                                                    Ukuran & Tipe
                                                </td>
                                                <td className="py-2 font-medium text-slate-700">
                                                    :{" "}
                                                    {(
                                                        selectedDoc.ukuran_file /
                                                        1024
                                                    ).toFixed(1)}{" "}
                                                    KB (
                                                    {(
                                                        selectedDoc.tipe_file ??
                                                        "PDF"
                                                    ).toUpperCase()}
                                                    )
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 text-slate-500 font-medium">
                                                    Tanggal Registrasi
                                                </td>
                                                <td className="py-2 font-semibold text-slate-900">
                                                    : {formattedTanggal}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* Cap Stempel Digital Resmi */}
                                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-3.5 shadow-2xs">
                                        <div className="flex items-center gap-3 text-emerald-800">
                                            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-2xs">
                                                <ShieldCheck className="size-5 shrink-0" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-900">
                                                    STATUS: TERVERIFIKASI
                                                    DIGITAL KAMPUS
                                                </div>
                                                <div className="text-[11px] text-slate-600">
                                                    Keaslian dokumen dijamin dan
                                                    tersinkronisasi pada
                                                    database universitas.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                                                DIGITAL-SECURE-UNILA
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="mt-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-border pt-4">
                                <span className="text-xs text-muted-foreground">
                                    {isDownloaded
                                        ? "✓ Berkas berhasil diunduh ke komputer Anda"
                                        : "Format pratinjau dokumen akademik resmi"}
                                </span>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <DialogClose asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="click-bounce rounded-xl"
                                        >
                                            Tutup
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            handleDownloadSimulated(selectedDoc)
                                        }
                                        className="click-bounce rounded-xl shadow-xs shadow-primary/25 bg-primary text-primary-foreground font-semibold"
                                    >
                                        <Download className="mr-1.5 size-4" />
                                        Unduh Berkas
                                    </Button>
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

Show.layout = {
    breadcrumbs,
};
