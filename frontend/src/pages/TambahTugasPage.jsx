import { useNavigate } from "react-router-dom";
import FormTugas from "../components/FormTugas";

function TambahTugasPage({ daftarMatkul, onTambah }) {
  const navigate = useNavigate();

  async function simpan(dataBaru) {
    await onTambah(dataBaru); // jika server menolak, error dilempar ke form
    navigate("/tugas");
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-7">
        <FormTugas
          judul="Tambah Tugas"
          keterangan="Catat sekarang sebelum lupa."
          labelTombol="Tambah"
          daftarMatkul={daftarMatkul}
          onSimpan={simpan}
        />
      </div>
    </div>
  );
}

export default TambahTugasPage;
