import { useState } from "react";
import { ambilPesanError } from "../api/tugasBackend";
import { keInputDatetime } from "../utils/tanggal";

const FORM_KOSONG = {
  nama: "",
  matkul: "",
  deadline: "",
  status: "belum",
  deskripsi: "",
  bobot: "",
  pengingat: false,
};

// Mengubah data tugas dari server menjadi nilai awal form (mode edit).
function dariTugas(tugas) {
  return {
    nama: tugas.nama,
    matkul: tugas.matkul,
    deadline: keInputDatetime(tugas.deadline),
    status: tugas.status,
    deskripsi: tugas.deskripsi ?? "",
    bobot: String(tugas.bobot ?? 0),
    pengingat: Boolean(tugas.pengingat),
  };
}

// Dipakai untuk Tambah Tugas (nilaiAwal kosong) dan Edit Tugas (nilaiAwal diisi).
// onSimpan harus async dan melempar error jika server menolak data.
function FormTugas({ judul, keterangan, labelTombol, daftarMatkul, nilaiAwal, onSimpan }) {
  const [form, setForm] = useState(nilaiAwal ? dariTugas(nilaiAwal) : FORM_KOSONG);
  const [galat, setGalat] = useState({});
  const [galatServer, setGalatServer] = useState([]);
  const [menyimpan, setMenyimpan] = useState(false);

  function ubahInput(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (galat[name]) {
      setGalat({ ...galat, [name]: "" });
    }
  }

  async function kirimForm(e) {
    e.preventDefault();

    const bobot = form.bobot === "" ? 0 : Number(form.bobot);

    const galatBaru = {};
    if (form.nama.trim().length < 3) {
      galatBaru.nama = "Nama tugas wajib diisi (minimal 3 karakter).";
    }
    if (form.matkul === "") {
      galatBaru.matkul = "Silakan pilih mata kuliah.";
    }
    if (form.deadline === "") {
      galatBaru.deadline = "Deadline wajib diisi.";
    }
    if (!Number.isInteger(bobot) || bobot < 0 || bobot > 100) {
      galatBaru.bobot = "Bobot harus bilangan bulat antara 0 dan 100.";
    }
    setGalat(galatBaru);
    if (Object.keys(galatBaru).length > 0) {
      return;
    }

    try {
      setMenyimpan(true);
      setGalatServer([]);
      await onSimpan({
        nama: form.nama.trim(),
        matkul: form.matkul,
        deadline: form.deadline,
        status: form.status,
        deskripsi: form.deskripsi.trim(),
        bobot,
        pengingat: form.pengingat,
      });
    } catch (err) {
      // Pesan dari server: validasi DTO (400), data duplikat (409), dll.
      setGalatServer(ambilPesanError(err));
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <section className="panel-putih">
      <h2 className="h4 judul-seksi">{judul}</h2>
      <p className="text-secondary">{keterangan}</p>

      <form onSubmit={kirimForm} noValidate>
        <div className="mb-3">
          <label htmlFor="nama" className="form-label">Nama Tugas</label>
          <input
            id="nama"
            name="nama"
            type="text"
            className={`form-control ${galat.nama ? "is-invalid" : ""}`}
            placeholder="Contoh: Laporan Praktikum Basis Data"
            value={form.nama}
            onChange={ubahInput}
          />
          <div className="invalid-feedback">{galat.nama}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="matkul" className="form-label">Mata Kuliah</label>
          <select
            id="matkul"
            name="matkul"
            className={`form-select ${galat.matkul ? "is-invalid" : ""}`}
            value={form.matkul}
            onChange={ubahInput}
          >
            <option value="">-- Pilih Mata Kuliah --</option>
            {daftarMatkul.map((mk) => (
              <option key={mk.kode} value={mk.nama}>{mk.nama}</option>
            ))}
          </select>
          <div className="invalid-feedback">{galat.matkul}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="deadline" className="form-label">Deadline</label>
          <input
            id="deadline"
            name="deadline"
            type="datetime-local"
            className={`form-control ${galat.deadline ? "is-invalid" : ""}`}
            value={form.deadline}
            onChange={ubahInput}
          />
          <div className="invalid-feedback">{galat.deadline}</div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-md-7">
            <label htmlFor="status" className="form-label">Status Pengerjaan</label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={form.status}
              onChange={ubahInput}
            >
              <option value="belum">Belum dikerjakan</option>
              <option value="proses">Sedang dikerjakan</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          <div className="col-12 col-md-5">
            <label htmlFor="bobot" className="form-label">Bobot nilai (%)</label>
            <input
              id="bobot"
              name="bobot"
              type="number"
              min="0"
              max="100"
              className={`form-control ${galat.bobot ? "is-invalid" : ""}`}
              placeholder="0"
              value={form.bobot}
              onChange={ubahInput}
            />
            <div className="invalid-feedback">{galat.bobot}</div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="deskripsi" className="form-label">Instruksi / Detail (opsional)</label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            rows="3"
            className="form-control"
            placeholder="Tuliskan detail instruksi tugas di sini..."
            value={form.deskripsi}
            onChange={ubahInput}
          />
        </div>

        <div className="form-check mb-3">
          <input
            id="pengingat"
            name="pengingat"
            type="checkbox"
            className="form-check-input"
            checked={form.pengingat}
            onChange={ubahInput}
          />
          <label htmlFor="pengingat" className="form-check-label">
            Aktifkan pengingat untuk tugas ini
          </label>
        </div>

        {galatServer.length > 0 && (
          <div className="alert alert-danger py-2" role="alert">
            <p className="fw-bold mb-1">Server menolak data:</p>
            <ul className="mb-0 ps-3">
              {galatServer.map((pesan) => (
                <li key={pesan}>{pesan}</li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="btn btn-brand w-100" disabled={menyimpan}>
          {menyimpan ? "Menyimpan..." : labelTombol}
        </button>
      </form>
    </section>
  );
}

export default FormTugas;
