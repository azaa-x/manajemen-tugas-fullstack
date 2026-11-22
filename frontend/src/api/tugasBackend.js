import axios from "axios";

// Alamat backend NestJS (lihat src/main.ts di folder backend: app.listen(3001)).
export const API_URL = "http://localhost:3001";

const api = axios.create({ baseURL: API_URL, timeout: 10000 });

export async function ambilSemuaTugas() {
  const response = await api.get("/tugas");
  return response.data;
}

export async function tambahTugasKeServer(data) {
  const response = await api.post("/tugas", data);
  return response.data;
}

export async function ubahTugasDiServer(id, data) {
  const response = await api.patch(`/tugas/${id}`, data);
  return response.data;
}

export async function hapusTugasDiServer(id) {
  await api.delete(`/tugas/${id}`); // server membalas 204 tanpa isi
}

// Mengubah error axios menjadi daftar pesan yang siap ditampilkan.
// Backend selalu membalas { statusCode, error, message: string | string[] }.
export function ambilPesanError(err) {
  if (err.response) {
    const pesan = err.response.data?.message;
    if (Array.isArray(pesan)) return pesan;
    if (typeof pesan === "string") return [pesan];
    return [`Server membalas dengan status ${err.response.status}.`];
  }
  if (err.code === "ECONNABORTED") {
    return ["Server terlalu lama merespons. Silakan coba lagi."];
  }
  return [`Tidak dapat terhubung ke server. Pastikan backend NestJS berjalan di ${API_URL}.`];
}
