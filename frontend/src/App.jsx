import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HeaderApp from "./components/HeaderApp";
import StatusMuat from "./components/StatusMuat";
import Beranda from "./pages/Beranda";
import DaftarTugasPage from "./pages/DaftarTugasPage";
import TambahTugasPage from "./pages/TambahTugasPage";
import EditTugasPage from "./pages/EditTugasPage";
import MatkulPage from "./pages/MatkulPage";
import TidakDitemukan from "./pages/TidakDitemukan";
import { matkulAwal } from "./data/dataAwal";
import {
  ambilSemuaTugas,
  tambahTugasKeServer,
  ubahTugasDiServer,
  hapusTugasDiServer,
  ambilPesanError,
} from "./api/tugasBackend";

const menuUtama = [
  { label: "Beranda", to: "/" },
  { label: "Daftar Tugas", to: "/tugas" },
  { label: "Tambah Tugas", to: "/tambah" },
  { label: "Mata Kuliah", to: "/matkul" },
];

function App() {
  const [daftarTugas, setDaftarTugas] = useState([]);
  const [daftarMatkul, setDaftarMatkul] = useState(matkulAwal);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [percobaan, setPercobaan] = useState(0);
  const [galatAksi, setGalatAksi] = useState([]);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // GET /tugas saat aplikasi dibuka (dan saat tombol "Coba Lagi" ditekan)
  useEffect(() => {
    let dibatalkan = false;

    async function muatData() {
      try {
        setLoading(true);
        setError(null);
        const data = await ambilSemuaTugas();
        if (!dibatalkan) setDaftarTugas(data);
      } catch (err) {
        if (!dibatalkan) setError(ambilPesanError(err).join(" "));
      } finally {
        if (!dibatalkan) setLoading(false);
      }
    }

    muatData();
    return () => {
      dibatalkan = true;
    };
  }, [percobaan]);

  // Kode dosen diambil dari mata kuliah yang dipilih.
  function siapkanPayload(data) {
    const mk = daftarMatkul.find((m) => m.nama === data.matkul);
    return { ...data, dosen: mk ? mk.dosen : "" };
  }

  // POST /tugas. Error dilempar ke form agar pesan validasi server bisa ditampilkan.
  async function tambahTugas(dataBaru) {
    const tugasBaru = await tambahTugasKeServer(siapkanPayload(dataBaru));
    setDaftarTugas((sebelumnya) => [...sebelumnya, tugasBaru]);
  }

  // PATCH /tugas/:id dari halaman Edit
  async function ubahTugas(id, dataBaru) {
    const hasil = await ubahTugasDiServer(id, siapkanPayload(dataBaru));
    setDaftarTugas((sebelumnya) => sebelumnya.map((t) => (t.id === id ? hasil : t)));
  }

  // PATCH /tugas/:id hanya untuk status (dropdown pada kartu tugas)
  async function ubahStatus(id, status) {
    try {
      setGalatAksi([]);
      const hasil = await ubahTugasDiServer(id, { status });
      setDaftarTugas((sebelumnya) => sebelumnya.map((t) => (t.id === id ? hasil : t)));
    } catch (err) {
      setGalatAksi(ambilPesanError(err));
    }
  }

  // DELETE /tugas/:id
  async function hapusTugas(id) {
    try {
      setGalatAksi([]);
      await hapusTugasDiServer(id);
      setDaftarTugas((sebelumnya) => sebelumnya.filter((t) => t.id !== id));
    } catch (err) {
      setGalatAksi(ambilPesanError(err));
    }
  }

  function tambahMatkul(matkulBaru) {
    setDaftarMatkul([...daftarMatkul, matkulBaru]);
  }

  const urutDeadline = (a, b) => new Date(a.deadline) - new Date(b.deadline);
  const tugasAktif = daftarTugas.filter((t) => t.status !== "selesai").sort(urutDeadline);
  const tugasSelesai = daftarTugas.filter((t) => t.status === "selesai").sort(urutDeadline);
  const tugasUrut = [...tugasAktif, ...tugasSelesai];
  const jumlahMatkul = new Set(tugasAktif.map((t) => t.matkul)).size;

  const muatUlang = () => setPercobaan((n) => n + 1);

  return (
    <>
      <HeaderApp judul="DeadlineIn" menu={menuUtama} />

      <main className="container py-4 py-md-5">
        {galatAksi.length > 0 && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {galatAksi.map((pesan) => (
              <div key={pesan}>{pesan}</div>
            ))}
            <button
              type="button"
              className="btn-close"
              aria-label="Tutup"
              onClick={() => setGalatAksi([])}
            ></button>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <StatusMuat loading={loading} error={error} onCobaLagi={muatUlang}>
                <Beranda tugasAktif={tugasAktif} jumlahMatkul={jumlahMatkul} />
              </StatusMuat>
            }
          />
          <Route
            path="/tugas"
            element={
              <StatusMuat loading={loading} error={error} onCobaLagi={muatUlang}>
                <DaftarTugasPage
                  daftarTugas={tugasUrut}
                  onHapus={hapusTugas}
                  onUbahStatus={ubahStatus}
                />
              </StatusMuat>
            }
          />
          <Route
            path="/tambah"
            element={<TambahTugasPage daftarMatkul={daftarMatkul} onTambah={tambahTugas} />}
          />
          <Route
            path="/tugas/:id/edit"
            element={
              <StatusMuat loading={loading} error={error} onCobaLagi={muatUlang}>
                <EditTugasPage
                  daftarTugas={daftarTugas}
                  daftarMatkul={daftarMatkul}
                  onUbah={ubahTugas}
                />
              </StatusMuat>
            }
          />
          <Route
            path="/matkul"
            element={
              <StatusMuat loading={loading} error={error} onCobaLagi={muatUlang}>
                <MatkulPage
                  daftarMatkul={daftarMatkul}
                  daftarTugas={daftarTugas}
                  onTambahMatkul={tambahMatkul}
                />
              </StatusMuat>
            }
          />
          <Route path="*" element={<TidakDitemukan />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
