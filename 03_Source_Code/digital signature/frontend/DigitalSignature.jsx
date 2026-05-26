import React, { useState } from 'react';
import { submitSignedRecommendation } from '../../frontend/src/services/api';

export default function DigitalSignatureExample() {
  const [suratId, setSuratId] = useState('');
  const [fileSigned, setFileSigned] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!suratId || !fileSigned) {
      setError('Masukkan ID surat dan pilih file PDF terlebih dahulu.');
      return;
    }

    try {
      await submitSignedRecommendation(suratId, fileSigned);
      setMessage('Surat tanda tangan berhasil diunggah.');
      setError('');
    } catch (err) {
      setError(err.message || 'Gagal mengunggah file tanda tangan.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        ID Surat Rekomendasi
        <input value={suratId} onChange={(e) => setSuratId(e.target.value)} />
      </label>
      <label>
        File PDF TTD
        <input type="file" accept="application/pdf" onChange={(e) => setFileSigned(e.target.files[0])} />
      </label>
      <button type="submit">Unggah</button>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </form>
  );
}
