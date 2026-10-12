<?php

namespace App\Policies;

use App\Models\Pengajuan;
use App\Models\User;

class PengajuanPolicy
{
    /**
     * Lihat daftar pengajuan (index)
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            'mahasiswa',
            'dosen_pa',
            'kaprodi',
            'staff_akademik',
        ]);
    }

    /**
     * Lihat detail pengajuan
     */
    public function view(User $user, Pengajuan $pengajuan): bool
    {
        // Mahasiswa: cuma boleh lihat pengajuan miliknya sendiri
        if ($user->role === 'mahasiswa') {
            return $pengajuan->user_id === $user->id;
        }

        // Dosen PA: cuma boleh lihat pengajuan mahasiswa bimbingannya
        if ($user->role === 'dosen_pa') {
            return $pengajuan->pemohon
                && $pengajuan->pemohon->dosen_pa_id === $user->id;
        }

        // Kaprodi & staff akademik: boleh lihat semua
        return in_array($user->role, ['kaprodi', 'staff_akademik']);
    }

    /**
     * Buat pengajuan baru
     */
    public function create(User $user): bool
    {
        return $user->role === 'mahasiswa';
    }

    /**
     * Update pengajuan
     */
    public function update(User $user, Pengajuan $pengajuan): bool
    {
        // Mahasiswa: boleh edit pengajuannya sendiri
        // HANYA kalau masih status awal (belum diproses)
        if ($user->role === 'mahasiswa') {
            return $pengajuan->user_id === $user->id
                && $pengajuan->status_pengajuan_id === 1;
        }

        // Kaprodi: boleh update semua
        return $user->role === 'kaprodi';
    }

    /**
     * Hapus pengajuan
     */
    public function delete(User $user, Pengajuan $pengajuan): bool
    {
        // Cuma kaprodi yang boleh hapus
        return $user->role === 'kaprodi';
    }

    /**
     * Approve / setujui pengajuan (custom method)
     */
    public function approve(User $user, Pengajuan $pengajuan): bool
    {
        // Dosen PA: approve pengajuan mahasiswa bimbingannya
        if ($user->role === 'dosen_pa') {
            return $pengajuan->pemohon
                && $pengajuan->pemohon->dosen_pa_id === $user->id;
        }

        // Kaprodi & staff akademik: boleh approve semua
        return in_array($user->role, ['kaprodi', 'staff_akademik']);
    }

    /**
     * Restore — belum dipakai
     */
    public function restore(User $user, Pengajuan $pengajuan): bool
    {
        return false;
    }

    /**
     * Force delete — belum dipakai
     */
    public function forceDelete(User $user, Pengajuan $pengajuan): bool
    {
        return false;
    }
}
