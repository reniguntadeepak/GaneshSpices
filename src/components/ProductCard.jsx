import { isInStock } from '../context/CatalogContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductImage from './ProductImage';
import { getCategorySlug } from '../utils/spiceTheme';
import { formatPrice } from '../utils/currency';

export default function ProductCard({
  product,
  onAddToCart,
  onDelete,
  onEdit,
}) {
  const { isAdmin } = useAuth();
  const { items } = useCart();
  const inStock = isInStock(product);
  const inCart = items.find((i) => i.productId === product.id);
  const slug = getCategorySlug(product.category);

  return (
    <article className={`product-card product-card--${slug}`}>
      <div className="product-card__image">
        <ProductImage product={product} size="lg" />
        {!inStock && <span className="product-card__sold-out">Sold out</span>}
      </div>

      <div className="product-card__body">
        <div className="product-card__header">
          <span className="product-card__category">{product.category}</span>
          <h3 className="product-card__name">{product.name}</h3>
        </div>

        <p className="product-card__price">
          <span className="product-card__price-value">{formatPrice(product.price)}</span>
        </p>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__actions">
          {!isAdmin && (
            <button
              type="button"
              className="btn btn--primary btn--sm"
              disabled={!inStock}
              onClick={() => onAddToCart(product)}
            >
              {inCart ? 'Add more' : 'Add to cart'}
            </button>
          )}

          {isAdmin && (
            <>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => onEdit(product)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn--danger btn--sm"
                onClick={() => onDelete(product)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
