<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PengajuanApprovalController;
use App\Http\Controllers\PengajuanController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

require __DIR__.'/settings.php';

Route::middleware(['auth'])->group(function () {
    Route::get('/pengajuan', [PengajuanController::class, 'index'])->name('pengajuan.index');
    Route::get('/pengajuan/create', [PengajuanController::class, 'create'])->name('pengajuan.create');
    Route::post('/pengajuan', [PengajuanController::class, 'store'])->name('pengajuan.store');
    Route::get('/pengajuan/{pengajuan}', [PengajuanController::class, 'show'])->name('pengajuan.show');
    Route::post('/pengajuan/{pengajuan}/approve', [PengajuanApprovalController::class, 'approve'])->name('pengajuan.approve');
    Route::post('/pengajuan/{pengajuan}/revisi', [PengajuanApprovalController::class, 'revisi'])->name('pengajuan.revisi');
    Route::post('/pengajuan/{pengajuan}/tolak', [PengajuanApprovalController::class, 'tolak'])->name('pengajuan.tolak');
    Route::post('/pengajuan/{pengajuan}/ajukan-ulang', [PengajuanController::class, 'ajukanUlang'])->name('pengajuan.ajukan-ulang');
});
