// Fallback Product model that works with in-memory storage
const InMemoryDB = require('../config/db-fallback');

// Validation functions
const validateProduct = (productData) => {
  const errors = [];

  if (!productData.name || !productData.name.trim()) {
    errors.push('Product name is required');
  }

  if (productData.price === undefined || productData.price === null || productData.price < 0) {
    errors.push('Valid price is required');
  }

  if (productData.quantity !== undefined && (productData.quantity < 0 || !Number.isInteger(productData.quantity))) {
    errors.push('Quantity must be a positive integer');
  }

  if (productData.name && productData.name.length > 100) {
    errors.push('Product name cannot exceed 100 characters');
  }

  if (productData.category && productData.category.length > 50) {
    errors.push('Category cannot exceed 50 characters');
  }

  if (productData.description && productData.description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }

  if (productData.supplier && productData.supplier.length > 100) {
    errors.push('Supplier name cannot exceed 100 characters');
  }

  return errors;
};

const ProductFallback = {
  // Find products with filtering, sorting, and pagination
  find: (filter = {}) => {
    return InMemoryDB.find(filter);
  },

  // Find by ID
  findById: (id) => {
    return InMemoryDB.findById(id);
  },

  // Create new product with validation
  create: (productData) => {
    const errors = validateProduct(productData);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.name = 'ValidationError';
      return Promise.reject(error);
    }

    // Check for duplicate name
    const existingProducts = InMemoryDB.find({ name: productData.name });
    return existingProducts.sort({}).skip(0).limit(1000)
      .then(products => {
        const duplicate = products.find(p => 
          p.name.toLowerCase() === productData.name.toLowerCase()
        );
        
        if (duplicate) {
          const error = new Error('Product name already exists');
          error.code = 11000;
          error.keyValue = { name: productData.name };
          return Promise.reject(error);
        }

        return InMemoryDB.create(productData);
      });
  },

  // Update product
  findByIdAndUpdate: (id, updateData, options = {}) => {
    if (options.runValidators) {
      const errors = validateProduct(updateData);
      if (errors.length > 0) {
        const error = new Error(errors.join(', '));
        error.name = 'ValidationError';
        return Promise.reject(error);
      }
    }

    return InMemoryDB.findByIdAndUpdate(id, updateData, options);
  },

  // Delete product
  findByIdAndDelete: (id) => {
    return InMemoryDB.findByIdAndDelete(id);
  },

  // Count documents
  countDocuments: (filter = {}) => {
    return InMemoryDB.countDocuments(filter);
  },

  // Insert many (for bulk operations)
  insertMany: (productsArray, options = {}) => {
    // Validate all products first
    for (const productData of productsArray) {
      const errors = validateProduct(productData);
      if (errors.length > 0) {
        const error = new Error(errors.join(', '));
        error.name = 'ValidationError';
        return Promise.reject(error);
      }
    }

    return InMemoryDB.insertMany(productsArray);
  },

  // Delete many (for bulk operations)
  deleteMany: (filter) => {
    return InMemoryDB.deleteMany(filter);
  }
};

module.exports = ProductFallback;