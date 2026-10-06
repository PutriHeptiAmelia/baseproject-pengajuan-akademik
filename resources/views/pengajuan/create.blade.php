<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Buat Pengajuan Akademik</title>
    <!-- Tailwind CSS CDN untuk styling cepat -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-6">
    <div class="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 class="text-2xl font-bold mb-4 text-gray-800">Formulir Pengajuan Layanan Akademik</h1>
        
        <form action="{{ route('pengajuan.store') }}" method="POST">
            @csrf
            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">Jenis Layanan</label>
                <select name="jenis_layanan_id" class="w-full border-gray-300 rounded-md p-2 border" required>
                    <option value="">-- Pilih Jenis Layanan --</option>
                    @foreach($jenisLayanans as $layanan)
                        <option value="{{ $layanan->id }}">{{ $layanan->nama }}</option>
                    @endforeach
                </select>
                @error('jenis_layanan_id')
                    <span class="text-red-500 text-sm">{{ $message }}</span>
                @enderror
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">Keterangan / Keperluan</label>
                <textarea name="keterangan" rows="4" class="w-full border-gray-300 rounded-md p-2 border" placeholder="Tuliskan keterangan..."></textarea>
                @error('keterangan')
                    <span class="text-red-500 text-sm">{{ $message }}</span>
                @enderror
            </div>

            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Kirim Pengajuan</button>
        </form>
    </div>
</body>
</html>