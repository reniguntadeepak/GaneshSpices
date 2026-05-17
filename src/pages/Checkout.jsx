import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCatalog, isInStock } from '../context/CatalogContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/currency';

export default function Checkout() {
  const { cartLines, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { refreshProducts } = useCatalog();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: '',
    city: '',
    zip: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const unavailable = cartLines.filter((line) => !isInStock(line.product));
  const overStock = cartLines.filter((line) => line.quantity > line.product.stock);

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

  const validate = () => {
    const next = {};
    if (!form.address.trim()) next.address = 'Address is required.';
    if (!form.city.trim()) next.city = 'City is required.';
    if (!form.zip.trim()) next.zip = 'ZIP code is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (unavailable.length > 0 || overStock.length > 0) {
      showToast('Please update your cart before placing the order.', 'error');
      return;
    }

    const orderItems = cartLines.map((line) => ({
      productId: line.product.id,
      name: line.product.name,
      price: line.product.price,
      quantity: line.quantity,
    }));

    setSubmitting(true);
    try {
      await placeOrder({
        userId: user.id,
        items: orderItems,
        total: subtotal,
        shipping: {
          address: form.address.trim(),
          city: form.city.trim(),
          zip: form.zip.trim(),
        },
      });
      await refreshProducts();
      clearCart();
      showToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (err) {
      showToast(err.message || 'Could not place order.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLines.length === 0) {
    return (
      <div className="page page--checkout">
        <div className="container container--narrow">
          <div className="empty-state">
            <p className="empty-state__title">Nothing to checkout</p>
            <p className="empty-state__text">Your cart is empty.</p>
            <Link to="/catalog" className="btn btn--primary cart-empty-cta">
              Shop catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--checkout">
      <div className="container container--narrow">
        <header className="page-header">
          <h1 className="page-header__title">Complete your order</h1>
          <p className="page-header__subtitle">
            Placing order as {user.name} (@{user.username})
          </p>
        </header>

        {(unavailable.length > 0 || overStock.length > 0) && (
          <div className="alert alert--error" role="alert">
            Some items in your cart are unavailable or exceed stock. Please update
            your cart.
            <Link to="/cart"> Go to cart</Link>
          </div>
        )}

        <div className="checkout-layout">
          <form className="product-form checkout-form" onSubmit={handleSubmit} noValidate>
            <h2 className="checkout-form__heading">Shipping details</h2>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Street address <span className="required">*</span>
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className={`form-input${errors.address ? ' form-input--error' : ''}`}
                value={form.address}
                onChange={handleChange}
                placeholder="123 Main St"
              />
              {errors.address && (
                <p className="form-error" role="alert">
                  {errors.address}
                </p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  City <span className="required">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className={`form-input${errors.city ? ' form-input--error' : ''}`}
                  value={form.city}
                  onChange={handleChange}
                />
                {errors.city && (
                  <p className="form-error" role="alert">
                    {errors.city}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="zip" className="form-label">
                  ZIP <span className="required">*</span>
                </label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  className={`form-input${errors.zip ? ' form-input--error' : ''}`}
                  value={form.zip}
                  onChange={handleChange}
                />
                {errors.zip && (
                  <p className="form-error" role="alert">
                    {errors.zip}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--lg"
              disabled={submitting || unavailable.length > 0 || overStock.length > 0}
            >
              {submitting ? 'Placing order…' : `Place order · ${formatPrice(subtotal)}`}
            </button>
          </form>

          <aside className="checkout-summary">
            <h2 className="checkout-summary__title">Your order</h2>
            <ul className="checkout-summary__list">
              {cartLines.map((line) => (
                <li key={line.product.id} className="checkout-summary__item">
                  <span>
                    {line.product.name} × {line.quantity}
                  </span>
                  <span>{formatPrice(line.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="checkout-summary__total">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
