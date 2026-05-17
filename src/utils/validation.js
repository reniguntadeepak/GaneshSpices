export function validateProductForm({ name, category, price, description, stock }) {
  const errors = {};

  const trimmedName = name?.trim() ?? '';
  if (!trimmedName) {
    errors.name = 'Product name is required.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Product name must be at least 2 characters.';
  }

  if (!category) {
    errors.category = 'Please select a category.';
  }

  const priceNum = parseFloat(price);
  if (price === '' || price === null || price === undefined || Number.isNaN(priceNum)) {
    errors.price = 'Price is required.';
  } else if (priceNum < 0) {
    errors.price = 'Price cannot be negative.';
  } else if (priceNum === 0) {
    errors.price = 'Price must be greater than zero.';
  }

  const trimmedDesc = description?.trim() ?? '';
  if (!trimmedDesc) {
    errors.description = 'Description is required.';
  } else if (trimmedDesc.length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }

  if (stock !== undefined && stock !== null && stock !== '') {
    const stockNum = parseInt(stock, 10);
    if (Number.isNaN(stockNum) || stockNum < 0) {
      errors.stock = 'Stock must be zero or greater.';
    }
  } else if (stock === '') {
    errors.stock = 'Stock quantity is required.';
  }

  return errors;
}
