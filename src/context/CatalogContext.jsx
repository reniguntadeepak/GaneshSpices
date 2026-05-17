import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { SPICE_CATEGORIES } from '../utils/spiceTheme';
import { api, dataUrlToFile } from '../api/client';

export function isInStock(product) {
  return product.stock > 0;
}

export const CATEGORIES = SPICE_CATEGORIES;

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load catalog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const addProduct = useCallback(async (product) => {
    const created = await api.createProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      stock: product.stock,
    });

    let result = created;
    if (product.image?.startsWith('data:')) {
      const file = await dataUrlToFile(product.image);
      result = await api.uploadProductImage(created.id, file);
    }

    setProducts((prev) => [result, ...prev]);
    return result;
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    const { image, ...fields } = updates;
    let updated = await api.updateProduct(id, fields);

    if (image?.startsWith('data:')) {
      const file = await dataUrlToFile(image);
      updated = await api.uploadProductImage(id, file);
    } else if (image === null && updated.image) {
      updated = await api.updateProduct(id, { image_url: null });
    }

    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await api.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProduct = useCallback(
    (id) => products.find((p) => p.id === id),
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      refreshProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
    }),
    [
      products,
      loading,
      error,
      refreshProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
    ]
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
