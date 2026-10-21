import { useEffect, useState } from "react";

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Cek apakah user sudah pernah lihat pop-up ini di session ini
        const hasSeenModal = sessionStorage.getItem("hasSeenWelcomeModal");

        if (!hasSeenModal) {
            // Kasih delay dikit biar animasinya nggak kaku
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem("hasSeenWelcomeModal", "true");
            }, 1000); // Muncul setelah 1 detik

            return () => clearTimeout(timer);
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#0f172a] border border-slate-700 text-white p-6 rounded-2xl max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
                {/* Tombol Close (X) */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    ✕
                </button>

                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Selamat Datang!</h2>
                    <p className="text-slate-300 text-sm mb-6">
                        Portal Layanan Akademik ini memudahkan kamu mengajukan
                        surat secara digital. Pantau terus status pengajuanmu di
                        sini.
                    </p>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                    >
                        Mulai Gunakan Portal
                    </button>
                </div>
            </div>
        </div>
    );
}