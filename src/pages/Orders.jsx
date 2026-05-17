import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { formatPrice } from '../utils/currency';

export default function Orders() {
  const { user } = useAuth();
  const { getOrdersForUser, loading } = useOrders();
  const orders = getOrdersForUser(user.id);

  return (
    <div className="page page--orders">
      <div className="container">
        <header className="page-header">
          <h1 className="page-header__title">Your orders</h1>
          <p className="page-header__subtitle">
            {orders.length === 0
              ? 'No orders yet'
              : `${orders.length} order${orders.length === 1 ? '' : 's'}`}
          </p>
        </header>

        {loading ? (
          <div className="empty-state">
            <p className="empty-state__title">Loading orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__title">No orders yet</p>
            <p className="empty-state__text">
              When you place an order, it will appear here.
            </p>
            <Link to="/catalog" className="btn btn--primary cart-empty-cta">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-card__header">
                  <div>
                    <span className="order-card__id">
                      Order #{order.id.slice(0, 8)}
                    </span>
                    <span className="order-card__date">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        dateStyle: 'medium',
                      })}
                    </span>
                  </div>
                  <span className="order-card__status">{order.status}</span>
                </div>
                <ul className="order-card__items">
                  {order.items.map((item) => (
                    <li key={item.productId}>
                      {item.name} × {item.quantity} —{' '}
                      {formatPrice(item.price * item.quantity)}
                    </li>
                  ))}
                </ul>
                <p className="order-card__total">
                  Total: <strong>{formatPrice(order.total)}</strong>
                </p>
                <p className="order-card__shipping">
                  Ships to: {order.shipping.address}, {order.shipping.city}{' '}
                  {order.shipping.zip}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
