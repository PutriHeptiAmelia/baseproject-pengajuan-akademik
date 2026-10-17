<?php

namespace Database\Seeders;

use App\Models\DokumenPengajuan;
use App\Models\JenisLayanan;
use App\Models\Pengajuan;
use App\Models\Persetujuan;
use App\Models\StatusPengajuan;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Status Pengajuan
        $statusList = [
            ['kode' => 'diajukan', 'nama' => 'Menunggu Verifikasi Dosen PA', 'urutan' => 1],
            ['kode' => 'revisi', 'nama' => 'Perlu Revisi Mahasiswa', 'urutan' => 2],
            ['kode' => 'diverifikasi_pa', 'nama' => 'Menunggu Persetujuan Kaprodi', 'urutan' => 3],
            ['kode' => 'disetujui_kaprodi', 'nama' => 'Menunggu Pemrosesan Staff Akademik', 'urutan' => 4],
            ['kode' => 'diproses_staff', 'nama' => 'Sedang Diproses Staff Akademik', 'urutan' => 5],
            ['kode' => 'selesai', 'nama' => 'Selesai', 'urutan' => 6],
            ['kode' => 'ditolak', 'nama' => 'Ditolak', 'urutan' => 7],
        ];

        foreach ($statusList as $st) {
            StatusPengajuan::updateOrCreate(['kode' => $st['kode']], $st);
        }

        // 2. Seed Jenis Layanan
        $layananSkl = JenisLayanan::updateOrCreate(
            ['kode' => 'SKAK'],
            [
                'nama' => 'Surat Keterangan Aktif Kuliah',
                'deskripsi' => 'Surat keterangan bahwa mahasiswa masih aktif berkuliah pada semester berjalan.',
                'is_active' => true,
            ]
        );

        JenisLayanan::updateOrCreate(
            ['kode' => 'SKL'],
            [
                'nama' => 'Surat Keterangan Lulus',
                'deskripsi' => 'Surat keterangan kelulusan sementara sebelum ijazah resmi diterbitkan.',
                'is_active' => true,
            ]
        );

        JenisLayanan::updateOrCreate(
            ['kode' => 'CUTI'],
            [
                'nama' => 'Pengajuan Cuti Akademik',
                'deskripsi' => 'Permohonan izin berhenti studi sementara pada semester berjalan.',
                'is_active' => true,
            ]
        );

        // 3. Seed Users
        $this->call([
            UserSeeder::class,
        ]);

        // 4. Seed Contoh Pengajuan Multi-Role & Multi-Status
        $mahasiswa = User::where('role', 'mahasiswa')->first();
        $dosenPa = User::where('role', 'dosen_pa')->first();
        $kaprodi = User::where('role', 'kaprodi')->first();
        $staff = User::where('role', 'admin')->first();

        $statusDiajukan = StatusPengajuan::where('kode', 'diajukan')->first();
        $statusKaprodi = StatusPengajuan::where('kode', 'diverifikasi_pa')->first();
        $statusStaff = StatusPengajuan::where('kode', 'disetujui_kaprodi')->first();
        $statusSelesai = StatusPengajuan::where('kode', 'selesai')->first();

        $layananSkl = JenisLayanan::where('kode', 'SKL')->first();
        $layananSkak = JenisLayanan::where('kode', 'SKAK')->first();
        $layananCuti = JenisLayanan::where('kode', 'CUTI')->first();

        if ($mahasiswa && $statusDiajukan) {
            // 1. Antrean Verifikasi Dosen PA
            $p1 = Pengajuan::updateOrCreate(
                ['nomor_pengajuan' => 'PJN-2026-000001'],
                [
                    'user_id' => $mahasiswa->id,
                    'jenis_layanan_id' => $layananSkak->id,
                    'status_pengajuan_id' => $statusDiajukan->id,
                    'keterangan' => 'Pengajuan surat aktif kuliah untuk keperluan perpanjangan tunjangan dinas orang tua.',
                    'tanggal_pengajuan' => now()->subDay(),
                ]
            );

            DokumenPengajuan::updateOrCreate(
                ['pengajuan_id' => $p1->id],
                [
                    'nama_file' => 'KTM_dan_KRS_Semester_Berjalan.pdf',
                    'path_file' => 'dokumen/PJN-2026-000001/ktm_krs.pdf',
                    'tipe_file' => 'application/pdf',
                    'ukuran_file' => 254800,
                ]
            );

            // 2. Antrean Persetujuan Kaprodi
            if ($statusKaprodi && $layananSkl) {
                $p2 = Pengajuan::updateOrCreate(
                    ['nomor_pengajuan' => 'PJN-2026-000002'],
                    [
                        'user_id' => $mahasiswa->id,
                        'jenis_layanan_id' => $layananSkl->id,
                        'status_pengajuan_id' => $statusKaprodi->id,
                        'keterangan' => 'Permohonan penerbitan Surat Keterangan Lulus (SKL) untuk kelengkapan administrasi beasiswa pascasarjana.',
                        'tanggal_pengajuan' => now()->subDays(2),
                    ]
                );

                DokumenPengajuan::updateOrCreate(
                    ['pengajuan_id' => $p2->id],
                    [
                        'nama_file' => 'Berita_Acara_Ujian_Skripsi_Telah_Disahkan.pdf',
                        'path_file' => 'dokumen/PJN-2026-000002/berita_acara.pdf',
                        'tipe_file' => 'application/pdf',
                        'ukuran_file' => 312000,
                    ]
                );

                if ($dosenPa) {
                    Persetujuan::updateOrCreate(
                        ['pengajuan_id' => $p2->id, 'approver_id' => $dosenPa->id],
                        [
                            'status_pengajuan_id' => $statusKaprodi->id,
                            'keputusan' => 'setuju',
                            'catatan' => 'Berkas kelulusan dan nilai naskah skripsi mahasiswa telah diverifikasi sah.',
                            'tanggal_keputusan' => now()->subDay(),
                        ]
                    );
                }
            }

            // 3. Antrean Pemrosesan Staff Akademik
            if ($statusStaff && $layananCuti) {
                $p3 = Pengajuan::updateOrCreate(
                    ['nomor_pengajuan' => 'PJN-2026-000003'],
                    [
                        'user_id' => $mahasiswa->id,
                        'jenis_layanan_id' => $layananCuti->id,
                        'status_pengajuan_id' => $statusStaff->id,
                        'keterangan' => 'Permohonan cuti akademik semester genap tahun akademik 2026/2027 karena urusan kedinasan/kesehatan.',
                        'tanggal_pengajuan' => now()->subDays(4),
                    ]
                );

                DokumenPengajuan::updateOrCreate(
                    ['pengajuan_id' => $p3->id],
                    [
                        'nama_file' => 'Surat_Keterangan_Dokter_dan_Persetujuan_Orang_Tua.pdf',
                        'path_file' => 'dokumen/PJN-2026-000003/surat_cuti.pdf',
                        'tipe_file' => 'application/pdf',
                        'ukuran_file' => 198400,
                    ]
                );

                if ($dosenPa) {
                    Persetujuan::updateOrCreate(
                        ['pengajuan_id' => $p3->id, 'approver_id' => $dosenPa->id],
                        [
                            'status_pengajuan_id' => $statusKaprodi->id,
                            'keputusan' => 'setuju',
                            'catatan' => 'Dosen PA menyetujui permohonan cuti sementara mahasiswa.',
                            'tanggal_keputusan' => now()->subDays(3),
                        ]
                    );
                }

                if ($kaprodi) {
                    Persetujuan::updateOrCreate(
                        ['pengajuan_id' => $p3->id, 'approver_id' => $kaprodi->id],
                        [
                            'status_pengajuan_id' => $statusStaff->id,
                            'keputusan' => 'setuju',
                            'catatan' => 'Ketua Program Studi mengesahkan usulan cuti mahasiswa. Lanjutkan penerbitan SK Cuti ke bagian Tata Usaha Akademik.',
                            'tanggal_keputusan' => now()->subDays(2),
                        ]
                    );
                }
            }

            // 4. Pengajuan Selesai
            if ($statusSelesai && $layananSkak) {
                $p4 = Pengajuan::updateOrCreate(
                    ['nomor_pengajuan' => 'PJN-2026-000004'],
                    [
                        'user_id' => $mahasiswa->id,
                        'jenis_layanan_id' => $layananSkak->id,
                        'status_pengajuan_id' => $statusSelesai->id,
                        'keterangan' => 'Permohonan surat aktif kuliah untuk kelengkapan berkas BPJS Kesehatan keluarga.',
                        'tanggal_pengajuan' => now()->subDays(7),
                        'tanggal_selesai' => now()->subDays(5),
                    ]
                );

                DokumenPengajuan::updateOrCreate(
                    ['pengajuan_id' => $p4->id],
                    [
                        'nama_file' => 'Bukti_Pembayaran_UKT_Terbaru.pdf',
                        'path_file' => 'dokumen/PJN-2026-000004/bukti_ukt.pdf',
                        'tipe_file' => 'application/pdf',
                        'ukuran_file' => 142000,
                    ]
                );

                if ($staff) {
                    Persetujuan::updateOrCreate(
                        ['pengajuan_id' => $p4->id, 'approver_id' => $staff->id],
                        [
                            'status_pengajuan_id' => $statusSelesai->id,
                            'keputusan' => 'setuju',
                            'catatan' => 'Dokumen fisik bertanda tangan basah dan salinan digital ber-QR Code telah diterbitkan resmi.',
                            'tanggal_keputusan' => now()->subDays(5),
                        ]
                    );
                }
            }
        }
    }
}
