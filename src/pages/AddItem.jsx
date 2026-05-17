import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog, CATEGORIES } from '../context/CatalogContext';
import { useToast } from '../context/ToastContext';
import { validateProductForm } from '../utils/validation';
import ImageUploadField from '../components/ImageUploadField';

const INITIAL = {
  name: '',
  category: '',
  price: '',
  description: '',
  stock: '',
};

export default function AddItem() {
  const navigate = useNavigate();
  const { addProduct } = useCatalog();
  const { showToast } = useToast();
  const [form, setForm] = useState(INITIAL);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validateProductForm(form);
    if (fieldErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateProductForm(form);
    setErrors(validationErrors);
    setTouched({ name: true, category: true, price: true, description: true });

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await addProduct({
        name: form.name.trim(),
        category: form.category,
        price: parseFloat(form.price),
        description: form.description.trim(),
        stock: form.stock !== '' ? parseInt(form.stock, 10) : undefined,
        image: image || null,
      });
      showToast('Product added successfully!', 'success');
      setTimeout(() => navigate('/catalog'), 600);
    } catch (err) {
      showToast(err.message || 'Could not add product.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <div className="page page--add">
      <div className="container container--narrow">
        <header className="page-header">
          <h1 className="page-header__title">Add new spice</h1>
          <p className="page-header__subtitle">
            List a new masala, whole spice, or blend in the Ganesh Spices shop.
          </p>
        </header>

        <form className="product-form" onSubmit={handleSubmit} noValidate>
          <ImageUploadField
            id="add-product-image"
            value={image}
            onChange={setImage}
          />

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Product Name <span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-input${showError('name') ? ' form-input--error' : ''}`}
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Turmeric Powder (Haldi)"
              autoComplete="off"
            />
            {showError('name') && (
              <p className="form-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              className={`form-input form-select${showError('category') ? ' form-input--error' : ''}`}
              value={form.category}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {showError('category') && (
              <p className="form-error" role="alert">
                {errors.category}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price (₹) <span className="required">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              className={`form-input${showError('price') ? ' form-input--error' : ''}`}
              value={form.price}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0"
            />
            {showError('price') && (
              <p className="form-error" role="alert">
                {errors.price}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="stock" className="form-label">
              Stock (units)
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              step="1"
              min="0"
              className={`form-input${showError('stock') ? ' form-input--error' : ''}`}
              value={form.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Defaults to 50 if empty"
            />
            {showError('stock') && (
              <p className="form-error" role="alert">
                {errors.stock}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className={`form-input form-textarea${showError('description') ? ' form-input--error' : ''}`}
              value={form.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Weight, origin, aroma notes, and cooking uses…"
            />
            {showError('description') && (
              <p className="form-error" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary btn--lg" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add to shop'}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate('/catalog')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
