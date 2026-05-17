export default function DeleteModal({ product, onConfirm, onCancel }) {
  if (!product) return null;

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-modal-title" className="modal__title">
          Delete product?
        </h2>
        <p className="modal__text">
          Are you sure you want to remove <strong>{product.name}</strong> from the
          catalog? This action cannot be undone.
        </p>
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
}
