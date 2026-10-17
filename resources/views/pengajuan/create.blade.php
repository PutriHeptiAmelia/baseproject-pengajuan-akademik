<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulir Pengajuan Layanan Akademik</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                    },
                    colors: {
                        academic: {
                            50: '#f0f5ff',
                            100: '#e0ebff',
                            500: '#2b58bf',
                            600: '#1d429a',
                            700: '#153177',
                            900: '#0e1f4d',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .click-press {
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .click-press:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -5px rgba(29, 66, 154, 0.25);
        }
        .click-press:active {
            transform: translateY(0px) scale(0.97);
        }
        .service-card {
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
        }
        .service-card:hover {
            transform: translateY(-2px);
            border-color: #2b58bf;
        }
        .service-card:active {
            transform: scale(0.98);
        }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-800 antialiased min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
        <!-- Header Navigasi -->
        <div class="mb-6 flex items-center justify-between">
            <a href="{{ route('pengajuan.index') }}" class="inline-flex items-center gap-2 text-sm font-bold text-academic-600 hover:text-academic-700 hover:-translate-x-1 transition-transform">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Daftar Pengajuan
            </a>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-500 shadow-2xs">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Portal Terpadu
            </span>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden">
            <!-- Header Banner -->
            <div class="relative bg-gradient-to-r from-academic-900 via-academic-700 to-academic-600 text-white p-6 sm:p-8 overflow-hidden">
                <div class="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5 blur-xl"></div>
                <div class="relative z-10 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v7" />
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-black tracking-tight">Formulir Pengajuan Akademik</h1>
                        <p class="text-academic-100 text-xs sm:text-sm mt-0.5">Layanan administrasi permohonan digital mahasiswa</p>
                    </div>
                </div>
            </div>

            <!-- Petunjuk Singkat -->
            <div class="bg-academic-50/70 border-b border-academic-100 p-4 sm:px-8 text-xs text-academic-700 flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-academic-100 flex items-center justify-center shrink-0 text-academic-700 font-bold text-xs mt-0.5">
                    i
                </div>
                <span class="leading-relaxed">
                    Pilih kategori layanan akademik yang Anda butuhkan. Setelah dikirim, pengajuan akan otomatis diteruskan ke <strong>Dosen Pembimbing Akademik (PA)</strong> Anda untuk diverifikasi secara daring.
                </span>
            </div>

            <!-- Form Body -->
            <form action="{{ route('pengajuan.store') }}" method="POST" class="p-6 sm:p-8 space-y-6">
                @csrf

                <!-- Jenis Layanan -->
                <div>
                    <label for="jenis_layanan_id" class="block text-sm font-bold text-slate-800 mb-2">
                        Pilih Kategori Layanan <span class="text-red-500">*</span>
                    </label>
                    <select
                        id="jenis_layanan_id"
                        name="jenis_layanan_id"
                        class="w-full border border-slate-300 rounded-2xl p-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-academic-500/15 focus:border-academic-500 bg-white transition duration-200 cursor-pointer shadow-2xs @error('jenis_layanan_id') border-red-500 ring-2 ring-red-500/20 @enderror"
                        required
                    >
                        <option value="">-- Klik untuk memilih jenis layanan --</option>
                        @foreach($jenisLayanans as $layanan)
                            <option value="{{ $layanan->id }}" {{ old('jenis_layanan_id') == $layanan->id ? 'selected' : '' }}>
                                {{ $layanan->nama }}
                            </option>
                        @endforeach
                    </select>
                    @error('jenis_layanan_id')
                        <p class="text-red-600 text-xs mt-2 flex items-center gap-1.5 font-semibold">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Keterangan / Keperluan -->
                <div>
                    <label for="keterangan" class="block text-sm font-bold text-slate-800 mb-2">
                        Keterangan / Keperluan Tambahan
                    </label>
                    <textarea
                        id="keterangan"
                        name="keterangan"
                        rows="4"
                        class="w-full border border-slate-300 rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-academic-500/15 focus:border-academic-500 bg-white transition duration-200 shadow-2xs @error('keterangan') border-red-500 ring-2 ring-red-500/20 @enderror"
                        placeholder="Contoh: Pengajuan surat aktif kuliah untuk keperluan kelengkapan beasiswa semester genap tahun akademik 2026/2027..."
                    >{{ old('keterangan') }}</textarea>
                    <p class="text-xs text-slate-400 mt-2">Opsional: Tuliskan tujuan permohonan atau catatan spesifik untuk mempermudah Dosen PA meninjau berkas.</p>
                    @error('keterangan')
                        <p class="text-red-600 text-xs mt-2 flex items-center gap-1.5 font-semibold">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Actions dengan Click Animation -->
                <div class="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                    <a
                        href="{{ route('pengajuan.index') }}"
                        class="px-5 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95 duration-150 cursor-pointer"
                    >
                        Batal
                    </a>
                    <button
                        type="submit"
                        class="click-press px-7 py-3 rounded-2xl bg-academic-600 text-white text-sm font-bold shadow-md shadow-academic-600/30 flex items-center gap-2 cursor-pointer"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Kirim Pengajuan
                    </button>
                </div>
            </form>
        </div>

        <p class="text-center text-xs text-slate-400 mt-6">
            © {{ date('Y') }} Sistem Informasi Layanan Administrasi Akademik Terpadu
        </p>
    </div>
</body>
</html>