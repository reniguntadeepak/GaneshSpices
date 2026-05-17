import { useState, useEffect } from 'react';
import { CATEGORIES } from '../context/CatalogContext';
import { validateProductForm } from '../utils/validation';
import ImageUploadField from './ImageUploadField';

function productToForm(product) {
  if (!product) {
    return { name: '', category: '', price: '', description: '', stock: '' };
  }
  return {
    name: product.name,
    category: product.category,
    price: String(product.price),
    description: product.description,
    stock: String(product.stock ?? 0),
  };
}

export default function EditProductModal({ product, onSave, onCancel }) {
  const [form, setForm] = useState(productToForm(product));
  const [image, setImage] = useState(product?.image ?? product?.image_url ?? null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(productToForm(product));
    setImage(product?.image ?? product?.image_url ?? null);
    setErrors({});
  }, [product]);

  if (!product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateProductForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    try {
      await onSave(product.id, {
      name: form.name.trim(),
      category: form.category,
      price: parseFloat(form.price),
      description: form.description.trim(),
      stock: parseInt(form.stock, 10),
      image: image || null,
      });
    } finally {
      setSaving(false);
    }
  };

  const fieldError = (field) => errors[field];

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal modal--wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="edit-product-title" className="modal__title">
          Edit product
        </h2>
        <p className="modal__text">Update all details including the product photo.</p>

        <form onSubmit={handleSubmit} className="edit-product-form" noValidate>
          <ImageUploadField
            id="edit-product-image"
            value={image}
            onChange={setImage}
          />

          <div className="form-group">
            <label htmlFor="edit-name" className="form-label">
              Product name <span className="required">*</span>
            </label>
            <input
              id="edit-name"
              name="name"
              type="text"
              className={`form-input${fieldError('name') ? ' form-input--error' : ''}`}
              value={form.name}
              onChange={handleChange}
            />
            {fieldError('name') && (
              <p className="form-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="edit-category"
              name="category"
              className={`form-input form-select${fieldError('category') ? ' form-input--error' : ''}`}
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {fieldError('category') && (
              <p className="form-error" role="alert">
                {errors.category}
              </p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-price" className="form-label">
                Price (₹) <span className="required">*</span>
              </label>
              <input
                id="edit-price"
                name="price"
                type="number"
                step="1"
                min="0"
                className={`form-input${fieldError('price') ? ' form-input--error' : ''}`}
                value={form.price}
                onChange={handleChange}
              />
              {fieldError('price') && (
                <p className="form-error" role="alert">
                  {errors.price}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-stock" className="form-label">
                Stock (units) <span className="required">*</span>
              </label>
              <input
                id="edit-stock"
                name="stock"
                type="number"
                step="1"
                min="0"
                className={`form-input${fieldError('stock') ? ' form-input--error' : ''}`}
                value={form.stock}
                onChange={handleChange}
              />
              {fieldError('stock') && (
                <p className="form-error" role="alert">
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-description" className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="edit-description"
              name="description"
              rows={3}
              className={`form-input form-textarea${fieldError('description') ? ' form-input--error' : ''}`}
              value={form.description}
              onChange={handleChange}
            />
            {fieldError('description') && (
              <p className="form-error" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
