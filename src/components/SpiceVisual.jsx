import { getSpiceEmoji, getCategorySlug } from '../utils/spiceTheme';

export default function SpiceVisual({ category, name, size = 'md', className = '' }) {
  const slug = getCategorySlug(category);
  const emoji = getSpiceEmoji(category, name);

  return (
    <div
      className={`spice-visual spice-visual--${size} spice-visual--${slug} ${className}`.trim()}
      aria-hidden="true"
    >
      <span className="spice-visual__emoji">{emoji}</span>
      <span className="spice-visual__grain" />
      <span className="spice-visual__grain spice-visual__grain--2" />
    </div>
  );
}
