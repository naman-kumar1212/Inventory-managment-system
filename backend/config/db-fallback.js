// Fallback in-memory database for demonstration when MongoDB is not available
let products = [
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j1',
    name: 'Wireless Mouse',
    quantity: 50,
    price: 29.99,
    category: 'Electronics',
    description: 'Ergonomic wireless mouse with USB receiver',
    supplier: 'TechCorp',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j2',
    name: 'Mechanical Keyboard',
    quantity: 25,
    price: 79.99,
    category: 'Electronics',
    description: 'RGB mechanical keyboard with blue switches',
    supplier: 'KeyboardCorp',
    createdAt: new Date('2024-01-16T14:20:00Z'),
    updatedAt: new Date('2024-01-16T14:20:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j3',
    name: '4K Monitor',
    quantity: 10,
    price: 299.99,
    category: 'Electronics',
    description: '27-inch 4K UHD monitor with HDR support',
    supplier: 'DisplayTech',
    createdAt: new Date('2024-01-17T09:15:00Z'),
    updatedAt: new Date('2024-01-17T09:15:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j4',
    name: 'Office Chair',
    quantity: 0,
    price: 199.99,
    category: 'Furniture',
    description: 'Ergonomic office chair with lumbar support',
    supplier: 'FurniturePlus',
    createdAt: new Date('2024-01-18T16:45:00Z'),
    updatedAt: new Date('2024-01-18T16:45:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j5',
    name: 'Desk Lamp',
    quantity: 75,
    price: 39.99,
    category: 'Lighting',
    description: 'LED desk lamp with adjustable brightness',
    supplier: 'LightCorp',
    createdAt: new Date('2024-01-19T11:30:00Z'),
    updatedAt: new Date('2024-01-19T11:30:00Z')
  }
];

let nextId = 6;

const generateId = () => {
  return `64f1a2b3c4d5e6f7g8h9i0j${nextId++}`;
};

const InMemoryDB = {
  // Find all products with filtering
  find: (filter = {}) => {
    let result = [...products];

    // Apply filters
    if (filter.name) {
      const nameRegex = new RegExp(filter.name, 'i');
      result = result.filter(p => nameRegex.test(p.name));
    }

    if (filter.category) {
      const categoryRegex = new RegExp(filter.category, 'i');
      result = result.filter(p => categoryRegex.test(p.category || ''));
    }

    if (filter.price) {
      if (filter.price.$gte !== undefined) {
        result = result.filter(p => p.price >= filter.price.$gte);
      }
      if (filter.price.$lte !== undefined) {
        result = result.filter(p => p.price <= filter.price.$lte);
      }
    }

    if (filter.quantity) {
      if (filter.quantity.$gte !== undefined) {
        result = result.filter(p => p.quantity >= filter.quantity.$gte);
      }
      if (filter.quantity.$lte !== undefined) {
        result = result.filter(p => p.quantity <= filter.quantity.$lte);
      }
    }

    return {
      sort: (sortObj) => {
        const sortField = Object.keys(sortObj)[0];
        const sortOrder = sortObj[sortField];
        
        result.sort((a, b) => {
          let aVal = a[sortField];
          let bVal = b[sortField];
          
          if (sortField === 'createdAt' || sortField === 'updatedAt') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
          }
          
          if (aVal < bVal) return sortOrder === 1 ? -1 : 1;
          if (aVal > bVal) return sortOrder === 1 ? 1 : -1;
          return 0;
        });
        
        return {
          skip: (skipCount) => {
            result = result.slice(skipCount);
            return {
              limit: (limitCount) => {
                result = result.slice(0, limitCount);
                return Promise.resolve(result);
              }
            };
          }
        };
      }
    };
  },

  // Find by ID
  findById: (id) => {
    const product = products.find(p => p._id === id);
    return Promise.resolve(product || null);
  },

  // Create new product
  create: (productData) => {
    const newProduct = {
      _id: generateId(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    products.push(newProduct);
    return Promise.resolve(newProduct);
  },

  // Update product
  findByIdAndUpdate: (id, updateData, options = {}) => {
    const index = products.findIndex(p => p._id === id);
    if (index === -1) return Promise.resolve(null);

    products[index] = {
      ...products[index],
      ...updateData,
      updatedAt: new Date()
    };

    return Promise.resolve(products[index]);
  },

  // Delete product
  findByIdAndDelete: (id) => {
    const index = products.findIndex(p => p._id === id);
    if (index === -1) return Promise.resolve(null);

    const deletedProduct = products[index];
    products.splice(index, 1);
    return Promise.resolve(deletedProduct);
  },

  // Count documents
  countDocuments: (filter = {}) => {
    const result = InMemoryDB.find(filter);
    // This is a simplified count - in real implementation, we'd apply the same filters
    let count = products.length;
    
    if (filter.name) {
      const nameRegex = new RegExp(filter.name, 'i');
      count = products.filter(p => nameRegex.test(p.name)).length;
    }
    
    return Promise.resolve(count);
  },

  // Insert many (for bulk operations)
  insertMany: (productsArray) => {
    const newProducts = productsArray.map(productData => ({
      _id: generateId(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    products.push(...newProducts);
    return Promise.resolve(newProducts);
  },

  // Delete many (for bulk operations)
  deleteMany: (filter) => {
    if (filter._id && filter._id.$in) {
      const idsToDelete = filter._id.$in;
      const initialLength = products.length;
      products = products.filter(p => !idsToDelete.includes(p._id));
      const deletedCount = initialLength - products.length;
      return Promise.resolve({ deletedCount });
    }
    return Promise.resolve({ deletedCount: 0 });
  }
};

module.exports = InMemoryDB;