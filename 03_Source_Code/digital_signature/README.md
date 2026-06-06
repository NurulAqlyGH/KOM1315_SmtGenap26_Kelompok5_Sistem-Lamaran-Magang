# Digital Signature Sederhana

Folder ini menambahkan tanda tangan HMAC-SHA256 sederhana pada URL dokumen surat rekomendasi saat file diunggah.

## Fitur
- Membuat signature dari isi file + nama penandatangan.
- Menambah parameter `sig` dan `signer` pada URL publik dokumen.
- Dapat diverifikasi ulang saat file diunduh kembali.
