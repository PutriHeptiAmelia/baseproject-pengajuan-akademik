import React from 'react';
import { Link } from '@inertiajs/react';

export default function Index({ pengajuans }) {
    return (
        <div className="mx-auto max-w-6xl p-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                    Daftar Pengajuan Akademik
                </h1>
                <a
                    href="/pengajuan/create"
                    className="rounded bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
                >
                    + Buat Pengajuan Baru
                </a>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                No. Pengajuan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Pemohon
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Layanan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {pengajuans.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 font-medium whitespace-nowrap text-blue-600">
                                    {item.nomor_pengajuan}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                    {item.pemohon?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                    {item.jenis_layanan?.nama}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                        {item.status?.nama}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <Link
                                        href={`/pengajuan/${item.id}`}
                                        className="font-medium text-indigo-600 hover:text-indigo-900"
                                    >
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
