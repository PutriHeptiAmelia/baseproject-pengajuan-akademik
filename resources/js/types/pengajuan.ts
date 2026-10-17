export interface Pemohon {
    id: number;
    name: string;
    email: string;
    nomor_induk?: string | null;
    nim?: string | null;
    role?: string;
}

export interface JenisLayanan {
    id: number;
    nama: string;
    deskripsi?: string | null;
    is_active?: boolean;
}

export interface StatusPengajuan {
    id: number;
    nama: string;
    deskripsi?: string | null;
    urutan?: number;
}

export interface DokumenPengajuan {
    id: number;
    pengajuan_id: number;
    nama_file: string;
    path_file: string;
    tipe_file?: string | null;
    ukuran_file: number;
    created_at?: string;
}

export interface Persetujuan {
    id: number;
    pengajuan_id: number;
    approver_id: number;
    status_pengajuan_id: number;
    keputusan: 'setuju' | 'tolak' | 'revisi';
    catatan?: string | null;
    tanggal_keputusan: string;
    approver?: Pemohon;
    status_pengajuan?: StatusPengajuan;
}

export interface PengajuanItem {
    id: number;
    nomor_pengajuan: string;
    user_id: number;
    jenis_layanan_id: number;
    status_pengajuan_id: number;
    keterangan?: string | null;
    tanggal_pengajuan?: string | null;
    tanggal_selesai?: string | null;
    created_at?: string;
    updated_at?: string;
    pemohon?: Pemohon;
    jenis_layanan?: JenisLayanan;
    status?: StatusPengajuan;
    dokumen?: DokumenPengajuan[];
    persetujuan?: Persetujuan[];
}
