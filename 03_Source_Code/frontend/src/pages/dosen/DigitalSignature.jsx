import React, { useState } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { submitSignedRecommendation } from '../../services/api';

export default function DigitalSignature() {
  const navigate = useNavigate();
  const [suratId, setSuratId] = useState('');
  const [fileSigned, setFileSigned] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!suratId) {
      setError('Masukkan ID surat terlebih dahulu.');
      return;
    }

    if (!fileSigned) {
      setError('Pilih berkas PDF tanda tangan terlebih dahulu.');
      return;
    }

    setLoading(true);
    try {
      await submitSignedRecommendation(suratId, fileSigned);
      setMessage('Surat rekomendasi berhasil diunggah dengan tanda tangan digital.');
      setSuratId('');
      setFileSigned(null);
    } catch (err) {
      setError(err.message || 'Gagal mengunggah dokumen tanda tangan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header
        title="Tanda Tangan Digital"
        userName="Dr. Ahmad Suryadi, M.Kom"
        userDetail="NIDN. 0012345678"
        bgColor="bg-green-600"
      />

      <main className="max-w-3xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Upload Surat Rekomendasi Bertanda Tangan</h2>
              <p className="text-sm text-gray-500">Gunakan fitur ini untuk mengunggah surat rekomendasi yang sudah ditandatangani.</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Kembali
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID Surat Rekomendasi</label>
              <input
                type="number"
                value={suratId}
                onChange={(e) => setSuratId(e.target.value)}
                placeholder="Masukkan ID surat"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih File PDF TTD</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFileSigned(e.target.files[0])}
                className="w-full text-sm text-gray-700"
              />
            </div>

            <div className="rounded-2xl border border-dashed border-gray-300 bg-amber-50 p-4 text-sm text-gray-600">
              Pastikan file yang diunggah berformat PDF dan sudah berisi tanda tangan digital/scan tanda tangan asli.
            </div>

            {message && <p className="text-sm text-green-700 bg-green-50 rounded-xl p-3">{message}</p>}
            {error && <p className="text-sm text-red-700 bg-red-50 rounded-xl p-3">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Mengunggah...' : 'Unggah Surat Bertanda Tangan'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
