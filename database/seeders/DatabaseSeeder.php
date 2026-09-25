<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\JenisLayanan;
use App\Models\StatusPengajuan;
use App\Models\Pengajuan;
use App\Models\DokumenPengajuan;
use App\Models\Persetujuan;
use App\Models\RiwayatStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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
            StatusPengajuan::create($st);
        }

        // 2. Seed Jenis Layanan
        $layananSkl = JenisLayanan::create([
            'kode' => 'SKAK',
            'nama' => 'Surat Keterangan Aktif Kuliah',
            'deskripsi' => 'Surat keterangan bahwa mahasiswa masih aktif berkuliah pada semester berjalan.',
            'is_active' => true,
        ]);

        JenisLayanan::create([
            'kode' => 'SKL',
            'nama' => 'Surat Keterangan Lulus',
            'deskripsi' => 'Surat keterangan kelulusan sementara sebelum ijazah resmi diterbitkan.',
            'is_active' => true,
        ]);

        JenisLayanan::create([
            'kode' => 'CUTI',
            'nama' => 'Pengajuan Cuti Akademik',
            'deskripsi' => 'Permohonan izin berhenti studi sementara pada semester berjalan.',
            'is_active' => true,
        ]);

        // 3. Seed Users per Peran
        $dosenPa = User::create([
            'name' => 'Ir. Gigih Forda Nama, S.T., M.T.I., IPM',
            'email' => 'gigih.forda@eng.unila.ac.id',
            'password' => Hash::make('password123'),
            'nomor_induk' => '198307122008121003',
            'role' => 'dosen_pa',
            'phone' => '081234567801',
        ]);

        $kaprodi = User::create([
            'name' => 'Yessi Mulyani, S.T., M.T.',
            'email' => 'yessi.mulyani@eng.unila.ac.id',
            'password' => Hash::make('password123'),
            'nomor_induk' => '197312262000122001',
            'role' => 'kaprodi',
            'phone' => '081234567802',
        ]);

        $staff = User::create([
            'name' => 'Indrawati',
            'email' => 'indrawati.staff@eng.unila.ac.id',
            'password' => Hash::make('password123'),
            'nomor_induk' => '198501012010012001',
            'role' => 'staff_akademik',
            'phone' => '081234567803',
        ]);

        $mahasiswa = User::create([
            'name' => 'Kholifah Wulandari',
            'email' => 'kholifah.wulandari@students.unila.ac.id',
            'password' => Hash::make('password123'),
            'nomor_induk' => '2415061099',
            'role' => 'mahasiswa',
            'phone' => '081234567804',
            'dosen_pa_id' => $dosenPa->id,
        ]);

        // 4. Seed 1 Contoh Pengajuan + Dokumen + Riwayat Awal
        $statusDiajukan = StatusPengajuan::where('kode', 'diajukan')->first();

        $pengajuanContoh = Pengajuan::create([
            'nomor_pengajuan' => 'PJN-2026-000001',
            'user_id' => $mahasiswa->id,
            'jenis_layanan_id' => $layananSkl->id,
            'status_pengajuan_id' => $statusDiajukan->id,
            'keterangan' => 'Pengajuan surat aktif kuliah untuk keperluan tunjangan orang tua.',
        ]);

        DokumenPengajuan::create([
            'pengajuan_id' => $pengajuanContoh->id,
            'nama_file' => 'KTM_dan_KRS_Semester_Genap.pdf',
            'path_file' => 'dokumen/PJN-2026-000001/ktm_krs.pdf',
            'tipe_file' => 'application/pdf',
            'ukuran_file' => 254800,
        ]);

        RiwayatStatus::create([
            'pengajuan_id' => $pengajuanContoh->id,
            'status_lama_id' => null,
            'status_baru_id' => $statusDiajukan->id,
            'diubah_oleh' => $mahasiswa->id,
            'catatan' => 'Pengajuan pertama kali dibuat oleh mahasiswa.',
        ]);
    }
}