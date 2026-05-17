import { useRef, useState } from 'react';
import { processImageFile } from '../utils/imageUpload';

export default function ImageUploadField({
  id = 'product-image',
  label = 'Product image',
  value = null,
  onChange,
  error = '',
  hint = 'JPG, PNG or WebP · max 2 MB',
}) {
  const inputRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [localError, setLocalError] = useState('');

  const displayError = error || localError;

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setLocalError('');
    try {
      const dataUrl = await processImageFile(file);
      onChange(dataUrl);
    } catch (err) {
      setLocalError(err.message || 'Failed to process image.');
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange(null);
    setLocalError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="form-group image-upload">
      <span className="form-label">{label}</span>

      {value ? (
        <div className="image-upload__preview-wrap">
          <img src={value} alt="Product preview" className="image-upload__preview" />
          <div className="image-upload__preview-actions">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => inputRef.current?.click()}
              disabled={processing}
            >
              {processing ? 'Processing…' : 'Change image'}
            </button>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={handleRemove}
              disabled={processing}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`image-upload__dropzone${displayError ? ' image-upload__dropzone--error' : ''}`}
        >
          <span className="image-upload__icon" aria-hidden="true">
            📷
          </span>
          <span className="image-upload__text">
            {processing ? 'Processing image…' : 'Click to upload product photo'}
          </span>
          <span className="image-upload__hint">{hint}</span>
        </label>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="image-upload__input"
        onChange={handleFile}
        disabled={processing}
      />

      {displayError && (
        <p className="form-error" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}
