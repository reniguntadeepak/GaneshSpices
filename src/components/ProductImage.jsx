import SpiceVisual from './SpiceVisual';

export default function ProductImage({
  product,
  size = 'md',
  className = '',
  alt,
}) {
  const label = alt ?? product.name;
  const src = product.image || product.image_url;

  if (src) {
    return (
      <div className={`product-image product-image--${size} ${className}`.trim()}>
        <img src={src} alt={label} className="product-image__img" loading="lazy" />
      </div>
    );
  }

  return (
    <SpiceVisual
      category={product.category}
      name={product.name}
      size={size}
      className={className}
    />
  );
}
