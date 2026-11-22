const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function pecahTanggal(iso) {
  const d = new Date(iso);
  const jam = String(d.getHours()).padStart(2, "0");
  const menit = String(d.getMinutes()).padStart(2, "0");
  return {
    tanggal: d.getDate(),
    bulan: BULAN[d.getMonth()],
    tahun: d.getFullYear(),
    jam: `${jam}:${menit}`,
  };
}

export function formatTanggal(iso) {
  const { tanggal, bulan, tahun, jam } = pecahTanggal(iso);
  return `${tanggal} ${bulan} ${tahun}, ${jam}`;
}

// Mengubah nilai deadline dari server menjadi format <input type="datetime-local">
// (yyyy-MM-ddTHH:mm). Jika berisi zona waktu (Z / +07:00), ubah ke waktu lokal.
export function keInputDatetime(iso) {
  if (!iso) return "";
  const adaZona = /(Z|[+-]\d{2}:?\d{2})$/.test(iso);
  if (!adaZona) return iso.slice(0, 16);

  const d = new Date(iso);
  const dua = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${dua(d.getMonth() + 1)}-${dua(d.getDate())}T${dua(d.getHours())}:${dua(d.getMinutes())}`;
}
