export type UserRole = 'mahasiswa' | 'dosen_pa' | 'kaprodi' | 'admin';

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    nomor_induk: string | null;
    role: UserRole;
    phone: string | null;
    dosen_pa_id: number | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};
