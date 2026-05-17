import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page page--home">
      <section className="hero hero--spice">
        <div className="hero__pattern" aria-hidden="true" />
        <div className="hero__content container">
          <p className="hero__eyebrow">Since generations · Trusted quality</p>
          <h1 className="hero__title">Ganesh Spices</h1>
          <p className="hero__subtitle">
            Handpicked whole spices, freshly ground masalas, and signature blends —
            delivered from our family kitchen to yours.
          </p>
          <div className="hero__actions">
            <Link to="/catalog" className="btn btn--primary">
              Shop spices
            </Link>
            <Link to="/cart" className="btn btn--secondary">
              View cart
            </Link>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <span className="hero__spice-float hero__spice-float--1">🌶️</span>
          <span className="hero__spice-float hero__spice-float--2">🟡</span>
          <span className="hero__spice-float hero__spice-float--3">🍛</span>
          <span className="hero__spice-float hero__spice-float--4">🌿</span>
        </div>
      </section>

      <section className="trust-bar">
        <div className="container trust-bar__inner">
          <div className="trust-bar__item">
            <span className="trust-bar__icon">✓</span>
            <span>100% pure spices</span>
          </div>
          <div className="trust-bar__item">
            <span className="trust-bar__icon">✓</span>
            <span>Small-batch ground</span>
          </div>
          <div className="trust-bar__item">
            <span className="trust-bar__icon">✓</span>
            <span>No artificial colors</span>
          </div>
        </div>
      </section>
    </div>
  );
}
