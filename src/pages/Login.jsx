import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const [error, setError] = useState('');
  const { login, register, isLoggedIn, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  useEffect(() => {
    if (isLoggedIn) {
      navigate(isAdmin ? '/catalog' : from, { replace: true });
    }
  }, [isLoggedIn, isAdmin, from, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      const result = await login(form.username, form.password);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      showToast(`Welcome back, ${result.user.name}!`, 'success');
      const dest =
        result.user.role === 'admin'
          ? '/catalog'
          : from === '/admin/add'
            ? '/catalog'
            : from;
      navigate(dest, { replace: true });
    } else {
      const result = await register(form.name, form.username, form.password);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      showToast('Account created! You are now logged in.', 'success');
      navigate(from === '/login' ? '/catalog' : from, { replace: true });
    }
  };

  return (
    <div className="page page--login">
      <div className="container container--narrow">
        <div className="auth-card auth-card--spice">
          <header className="auth-card__header">
            <span className="auth-card__logo" aria-hidden="true">🪔</span>
            <h1 className="auth-card__title">
              {mode === 'login' ? 'Welcome back' : 'Join Ganesh Spices'}
            </h1>
            <p className="auth-card__subtitle">
              {mode === 'login'
                ? 'Sign in to order fresh spices and view your past orders.'
                : 'Choose a username and password — no email needed.'}
            </p>
          </header>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tabs__btn${mode === 'login' ? ' auth-tabs__btn--active' : ''}`}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Log in
            </button>
            <button
              type="button"
              className={`auth-tabs__btn${mode === 'register' ? ' auth-tabs__btn--active' : ''}`}
              onClick={() => {
                setMode('register');
                setError('');
              }}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full name <span className="required">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username <span className="required">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="form-input"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder={mode === 'login' ? 'Your username' : 'Choose a username'}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password <span className="required">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                value={form.password}
                onChange={handleChange}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
            </div>

            {error && (
              <p className="form-error auth-form__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn--primary btn--lg auth-form__submit">
              {mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>

          <div className="auth-demo">
            <p className="auth-demo__title">Store admin</p>
            <p className="auth-demo__text">
              <strong>Username:</strong> admin · <strong>Password:</strong> admin123
              <br />
              <span className="auth-demo__hint">
                Admins can add products, edit prices, and delete items.
              </span>
            </p>
          </div>

          <p className="auth-card__footer">
            <Link to="/catalog">← Continue browsing without an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
