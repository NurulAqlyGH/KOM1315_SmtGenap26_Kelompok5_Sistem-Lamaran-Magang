import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { getActiveLowongan, getAuthToken } from '../../services/api';

export default function LihatLowongan() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [lowonganData, setLowonganData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setError('Silakan login terlebih dahulu untuk melihat lowongan.');
      return;
    }

    setLoading(true);
    getActiveLowongan()
      .then((data) => setLowonganData(data || []))
      .catch((err) => setError(err.message || 'Gagal memuat lowongan.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredLowongan = lowonganData.filter((job) => {
    const q = searchTerm.toLowerCase();
    return (
      job.judul_posisi.toLowerCase().includes(q) ||
      job.perusahaan.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Lihat Lowongan" userName="Mahasiswa" userDetail="Silakan login" bgColor="bg-blue-600" />
      
      <main className="max-w-4xl mx-auto px-6 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Lowongan Magang</h2>
              <p className="text-sm text-gray-500">Diambil langsung dari backend API.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/mahasiswa/daftar')}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Daftar Magang
            </button>
          </div>
          <div className="relative mt-4">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Cari posisi atau perusahaan..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-500">Memuat lowongan...</div>
        ) : (
          <div className="space-y-4">
            {filteredLowongan.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
                Tidak ada lowongan yang sesuai. Silakan perbarui pencarian atau kembali setelah login.
              </div>
            ) : (
              filteredLowongan.map((job) => (
                <div key={job.lowongan_id} className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl font-bold">
                      {job.perusahaan?.charAt(0) ?? 'L'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{job.judul_posisi}</h3>
                      <p className="text-sm text-gray-500">{job.perusahaan}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                        <span>📍 Deadline: {job.deadline || 'N/A'}</span>
                        <span>⚙️ {Array.isArray(job.kualifikasi) ? job.kualifikasi.length : '0'} kualifikasi</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/mahasiswa/daftar')}
                    className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Daftar
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}