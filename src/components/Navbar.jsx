import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAdmin, isLoggedIn, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <NavLink to="/" className="navbar__brand">
          <span className="navbar__logo" aria-hidden="true">
            🪔
          </span>
          <span className="navbar__brand-text">
            <span className="navbar__brand-name">Ganesh Spices</span>
            <span className="navbar__brand-tagline">Pure · Fresh · Authentic</span>
          </span>
        </NavLink>

        <nav className="navbar__nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            Spices
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `navbar__link navbar__link--cart${isActive ? ' navbar__link--active' : ''}`
            }
          >
            Cart
            {itemCount > 0 && (
              <span className="navbar__badge" aria-label={`${itemCount} items in cart`}>
                {itemCount}
              </span>
            )}
          </NavLink>

          {isLoggedIn && !isAdmin && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `navbar__link${isActive ? ' navbar__link--active' : ''}`
              }
            >
              My orders
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin/add"
              className={({ isActive }) =>
                `navbar__link navbar__link--admin${isActive ? ' navbar__link--active' : ''}`
              }
            >
              Add spice
            </NavLink>
          )}

          {isLoggedIn ? (
            <div className="navbar__user">
              <span className="navbar__user-name">
                {user.name}
                {isAdmin && <span className="navbar__role">Admin</span>}
              </span>
              <button type="button" className="navbar__logout" onClick={logout}>
                Log out
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `navbar__link${isActive ? ' navbar__link--active' : ''}`
              }
            >
              Log in
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
