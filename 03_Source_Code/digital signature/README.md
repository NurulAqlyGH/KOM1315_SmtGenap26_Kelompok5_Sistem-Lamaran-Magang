# Digital Signature Integration

Folder ini berisi implementasi fitur tanda tangan digital untuk Career Tracker.

## Ringkasan

Fitur yang ditambahkan:
- Backend helper service untuk memvalidasi dan meng-upload dokumen tanda tangan digital.
- Router API khusus `POST /api/v1/digital-signature/verify` untuk memverifikasi dan menyimpan file PDF tanda tangan.
- Integrasi digital signature untuk proses surat rekomendasi.
- Frontend page `DigitalSignature` untuk dosen meng-upload surat rekomendasi yang sudah ditandatangani.

## Lokasi Implementasi

- Backend:
  - `backend/app/digital_signature/service.py`
  - `backend/app/api/v1/routers/digital_signature_router.py`
  - `backend/app/api/v1/routers/rekomendasi_router.py` (integrasi)
  - `backend/app/main.py` (daftarkan router baru)

- Frontend:
  - `frontend/src/pages/dosen/DigitalSignature.jsx`
  - `frontend/src/services/api.js` (fungsi upload tanda tangan digital)
  - `frontend/src/routes/index.jsx` (rute baru)

## Cara Menggunakan

1. Jalankan backend seperti biasa.
2. Buka halaman `/dosen/tanda-tangan` di aplikasi frontend.
3. Masukkan `Surat ID` dan pilih file PDF tanda tangan.
4. Tekan tombol upload untuk memproses status APPROVED dengan file bertanda tangan.
