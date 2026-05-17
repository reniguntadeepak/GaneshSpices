import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { isInStock } from '../context/CatalogContext';
import ProductImage from '../components/ProductImage';
import { formatPrice } from '../utils/currency';

export default function Cart() {
  const { cartLines, subtotal, updateQuantity, removeFromCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (cartLines.length === 0) {
    return (
      <div className="page page--cart">
        <div className="container">
          <header className="page-header">
            <h1 className="page-header__title">Your spice cart</h1>
          </header>
          <div className="empty-state empty-state--spice">
            <span className="empty-state__emoji" aria-hidden="true">🪔</span>
            <p className="empty-state__title">Your cart is empty</p>
            <p className="empty-state__text">
              Explore our masalas, whole spices, and blends.
            </p>
            <Link to="/catalog" className="btn btn--primary cart-empty-cta">
              Shop spices
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--cart">
      <div className="container">
        <header className="page-header">
          <h1 className="page-header__title">Your spice cart</h1>
          <p className="page-header__subtitle">
            {cartLines.length} {cartLines.length === 1 ? 'item' : 'items'}
          </p>
        </header>

        <div className="cart-layout">
          <div className="cart-items">
            {cartLines.map(({ product, quantity, lineTotal }) => {
              const available = isInStock(product);
              const maxQty = product.stock;

              return (
                <article key={product.id} className="cart-item">
                  <ProductImage
                    product={product}
                    size="sm"
                    className="cart-item__visual"
                  />
                  <div className="cart-item__details">
                    <h3 className="cart-item__name">{product.name}</h3>
                    <p className="cart-item__meta">
                      {product.category} · {formatPrice(product.price)} each
                    </p>
                    {!available && (
                      <p className="form-error">This item is no longer available.</p>
                    )}
                    <div className="cart-item__controls">
                      <div className="qty-control">
                        <button
                          type="button"
                          className="qty-control__btn"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-control__value" aria-live="polite">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="qty-control__btn"
                          onClick={() =>
                            updateQuantity(
                              product.id,
                              Math.min(quantity + 1, maxQty)
                            )
                          }
                          disabled={quantity >= maxQty}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => removeFromCart(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="cart-item__total">{formatPrice(lineTotal)}</p>
                </article>
              );
            })}
          </div>

          <aside className="cart-summary">
            <h2 className="cart-summary__title">Order summary</h2>
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="cart-summary__row cart-summary__row--muted">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <button
              type="button"
              className="btn btn--primary btn--lg cart-summary__checkout"
              onClick={handleCheckout}
            >
              {isLoggedIn ? 'Proceed to checkout' : 'Log in to checkout'}
            </button>
            <Link to="/catalog" className="cart-summary__continue">
              ← Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
