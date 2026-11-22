function StatusMuat({ loading, error, onCobaLagi, children }) {
  if (loading) {
    return (
      <div role="status" className="panel-putih text-center">
        <p className="fw-bold d-flex justify-content-center align-items-center gap-2 mb-0">
          <span className="spinner-border spinner-border-sm text-secondary" aria-hidden="true"></span>
          Memuat data dari server...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <p className="fw-bold mb-1">Gagal memuat data dari server.</p>
        <p className="mb-3">{error}</p>
        <button type="button" className="btn btn-brand btn-sm" onClick={onCobaLagi}>
          Coba Lagi
        </button>
      </div>
    );
  }

  return children;
}

export default StatusMuat;
