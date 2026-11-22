import { Link, useNavigate, useParams } from "react-router-dom";
import FormTugas from "../components/FormTugas";

function EditTugasPage({ daftarTugas, daftarMatkul, onUbah }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const tugas = daftarTugas.find((t) => t.id === id);

  if (!tugas) {
    return (
      <section className="panel-putih text-center">
        <h2 className="h4">Tugas tidak ditemukan</h2>
        <p className="text-secondary">Tugas ini mungkin sudah dihapus.</p>
        <Link className="btn btn-brand" to="/tugas">Kembali ke Daftar Tugas</Link>
      </section>
    );
  }

  async function simpan(dataBaru) {
    await onUbah(id, dataBaru);
    navigate("/tugas");
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-7">
        <FormTugas
          judul="Edit Tugas"
          keterangan="Ubah data tugas, lalu simpan perubahan."
          labelTombol="Simpan Perubahan"
          daftarMatkul={daftarMatkul}
          nilaiAwal={tugas}
          onSimpan={simpan}
        />
      </div>
    </div>
  );
}

export default EditTugasPage;
