import React from 'react';
import { Link } from '@inertiajs/react';

export default function Index({ pengajuans }) {
    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Daftar Pengajuan Akademik</h1>
                <a href="/pengajuan/create" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
                    + Buat Pengajuan Baru
                </a>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Pengajuan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pemohon</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Layanan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pengajuans.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{item.nomor_pengajuan}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.pemohon?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.jenis_layanan?.nama}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                        {item.status?.nama}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <Link href={`/pengajuan/${item.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}