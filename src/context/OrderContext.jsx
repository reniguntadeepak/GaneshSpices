import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshOrders = useCallback(async () => {
    if (!isLoggedIn) {
      setOrders([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders, user?.id]);

  const placeOrder = useCallback(
    async (order) => {
      const placed = await api.placeOrder({
        items: order.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        total: order.total,
        shipping: order.shipping,
      });
      setOrders((prev) => [placed, ...prev]);
      return placed;
    },
    []
  );

  const getOrdersForUser = useCallback(
    (userId) => orders.filter((o) => o.userId === userId),
    [orders]
  );

  const value = useMemo(
    () => ({
      orders,
      loading,
      placeOrder,
      getOrdersForUser,
      refreshOrders,
    }),
    [orders, loading, placeOrder, getOrdersForUser, refreshOrders]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
