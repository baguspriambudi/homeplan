#!/usr/bin/env bash
#
# deploy.sh — Deploy HomePlan ke VPS
#
# Cara pakai di VPS:
#   cd /var/www/homeplan
#   ./deploy.sh
#
# Catatan penting (dari pengalaman deploy sebelumnya):
#   - Pakai `composer install`, BUKAN `composer update` (hindari jebakan platform 8.4.1)
#   - APP_KEY di VPS jangan sampai berubah
#   - telegram:poll TIDAK auto-start — restart manual bila ada perubahan di bot
#
set -euo pipefail

# Seluruh langkah dibungkus di fungsi main() supaya bash membaca & mem-parse
# semua isi script LEBIH DULU sebelum eksekusi. Ini penting karena `git pull`
# di dalam bisa menimpa file deploy.sh ini sendiri saat sedang berjalan.
main() {
    # Pindah ke folder tempat script ini berada (= root repo)
    cd "$(dirname "$0")"

    echo "==> [1/7] Aktifkan maintenance mode"
    php artisan down || true

    # Jaminan: apa pun yang terjadi (sukses/gagal), situs dikembalikan online
    trap 'php artisan up || true' EXIT

    echo "==> [2/7] Tarik kode terbaru dari GitHub (branch main)"
    git pull origin main

    echo "==> [3/7] Composer install (produksi, tanpa dev)"
    composer install --no-dev --optimize-autoloader --no-interaction

    echo "==> [4/7] Install dependency & build asset frontend (Vite)"
    npm ci
    npm run build

    echo "==> [5/7] Jalankan migrasi database"
    php artisan migrate --force

    echo "==> [6/7] Bersihkan & bangun ulang cache Laravel"
    php artisan optimize:clear
    php artisan optimize

    echo "==> [7/7] Restart queue worker (jika ada)"
    # QUEUE_CONNECTION=database — kalau ada queue worker yang jalan, ini
    # menyuruhnya ambil kode terbaru. Aman diabaikan kalau tidak pakai queue.
    php artisan queue:restart || true

    echo ""
    echo "======================================================"
    echo " SELESAI ✅"
    echo " INGAT: telegram:poll tidak auto-start."
    echo " Kalau ada perubahan di bot Telegram, restart poller-nya manual."
    echo "======================================================"
}

main "$@"
