import { useMemo, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import DeleteModal from '../components/DeleteModal';
import EditProductModal from '../components/EditProductModal';
import { useToast } from '../context/ToastContext';

export default function Catalog() {
  const { products, loading, deleteProduct, updateProduct } = useCatalog();
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }, [products, search]);

  const handleAddToCart = (product) => {
    addToCart(product.id, 1);
    showToast(`"${product.name}" added to cart.`, 'success');
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteProduct(pendingDelete.id);
      showToast(`"${pendingDelete.name}" removed from catalog.`, 'success');
      setPendingDelete(null);
    } catch (err) {
      showToast(err.message || 'Could not delete product.', 'error');
    }
  };

  const handleSaveProduct = async (id, updates) => {
    try {
      await updateProduct(id, updates);
      showToast('Product updated successfully.', 'success');
      setEditingProduct(null);
    } catch (err) {
      showToast(err.message || 'Could not update product.', 'error');
    }
  };

  return (
    <div className="page page--catalog">
      <div className="container">
        <header className="page-header">
          <div>
            <h1 className="page-header__title">
              {isAdmin ? 'Manage spice catalog' : 'Our spices'}
            </h1>
            <p className="page-header__subtitle">
              {isAdmin
                ? 'Edit products, update stock & prices, or remove items from the shop.'
                : `${filtered.length} varieties — pure spices for every dish.`}
            </p>
          </div>
        </header>

        <div className="catalog-toolbar">
          <div className="search-field">
            <span className="search-field__icon" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              className="search-field__input"
              placeholder="Search turmeric, masala, chili…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <p className="empty-state__title">Loading catalog…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__title">No products found</p>
            <p className="empty-state__text">
              {search
                ? 'Try adjusting your search terms.'
                : 'The catalog is empty. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onDelete={setPendingDelete}
                onEdit={setEditingProduct}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteModal
        product={pendingDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <EditProductModal
        product={editingProduct}
        onSave={handleSaveProduct}
        onCancel={() => setEditingProduct(null)}
      />
    </div>
  );
}
