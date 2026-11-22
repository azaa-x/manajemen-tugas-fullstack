import { Link } from "react-router-dom";
import Status from "./Status";
import { STATUS } from "../data/dataAwal";
import { pecahTanggal } from "../utils/tanggal";

function KartuTugas({
  id,
  nama,
  matkul,
  dosen,
  deadline,
  status,
  deskripsi,
  bobot,
  pengingat,
  onHapus,
  onUbahStatus,
}) {
  const { tanggal, bulan, tahun, jam } = pecahTanggal(deadline);

  function konfirmasiHapus() {
    if (window.confirm(`Hapus tugas "${nama}"?`)) {
      onHapus(id);
    }
  }

  return (
    <article className="card shadow-sm border-0">
      <div className="card-body">
        <div className="row g-3 align-items-center">
          <div className="col-4 col-sm-3">
            <div className="tanggal-tugas">
              <time dateTime={deadline}>
                <span className="angka-tanggal">{tanggal}</span>
                <span>{bulan}</span>
                <span>{tahun}</span>
                <span className="jam-tugas">{jam}</span>
              </time>
            </div>
          </div>

          <div className="col-8 col-sm-6">
            <h3 className="h6 mb-1">{nama}</h3>
            <p className="mb-1">
              {matkul}
              {dosen && <span className="text-secondary"> &middot; {dosen}</span>}
            </p>
            <Status status={status} />
            {(bobot > 0 || pengingat) && (
              <small className="d-block text-secondary mt-1">
                {bobot > 0 && `Bobot ${bobot}%`}
                {bobot > 0 && pengingat && " · "}
                {pengingat && "Pengingat aktif"}
              </small>
            )}
          </div>

          {onHapus && (
            <div className="col-12 col-sm-3 d-grid gap-2">
              {onUbahStatus && (
                <select
                  className="form-select form-select-sm"
                  aria-label={`Ubah status ${nama}`}
                  value={status}
                  onChange={(e) => onUbahStatus(id, e.target.value)}
                >
                  {Object.entries(STATUS).map(([kunci, { label }]) => (
                    <option key={kunci} value={kunci}>{label}</option>
                  ))}
                </select>
              )}
              <Link className="btn btn-sm btn-outline-secondary" to={`/tugas/${id}/edit`}>
                Edit
              </Link>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={konfirmasiHapus}
              >
                Hapus
              </button>
            </div>
          )}
        </div>

        {deskripsi && <p className="deskripsi-tugas mt-3 mb-0">{deskripsi}</p>}
      </div>
    </article>
  );
}

export default KartuTugas;
