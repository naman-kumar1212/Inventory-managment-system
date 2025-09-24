const Product = require('../models/Product');
const Order = require('../models/Order');
const StockMovement = require('../models/StockMovement');
const Supplier = require('../models/Supplier');

// @desc    Generate inventory report
// @route   GET /api/reports/inventory
// @access  Private
const getInventoryReport = async (req, res) => {
  try {
    const { format = 'json', category, supplier, lowStock } = req.query;

    // Build query
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (supplier) {
      query.supplier = supplier;
    }
    
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$quantity', '$minStockLevel'] };
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('supplier', 'name companyName')
      .select('name sku price quantity minStockLevel maxStockLevel category supplier createdAt')
      .sort({ name: 1 });

    // Calculate totals
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
    const lowStockCount = products.filter(p => p.quantity <= p.minStockLevel).length;

    const report = {
      generatedAt: new Date(),
      generatedBy: req.user.id,
      type: 'inventory',
      filters: { category, supplier, lowStock },
      summary: {
        totalProducts: products.length,
        totalValue,
        totalQuantity,
        lowStockCount
      },
      data: products
    };

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeader = 'Name,SKU,Category,Supplier,Price,Quantity,Min Stock,Max Stock,Value\n';
      const csvData = products.map(p => 
        `"${p.name}","${p.sku}","${p.category?.name || ''}","${p.supplier?.name || ''}",${p.price},${p.quantity},${p.minStockLevel},${p.maxStockLevel},${p.price * p.quantity}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=inventory-report.csv');
      return res.send(csvHeader + csvData);
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Inventory report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating inventory report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate sales report
// @route   GET /api/reports/sales
// @access  Private
const getSalesReport = async (req, res) => {
  try {
    const { 
      format = 'json', 
      startDate, 
      endDate, 
      status = 'confirmed,delivered',
      groupBy = 'day' 
    } = req.query;

    // Date range
    const dateQuery = {};
    if (startDate) dateQuery.$gte = new Date(startDate);
    if (endDate) dateQuery.$lte = new Date(endDate);

    // Status filter
    const statusArray = status.split(',');

    const orders = await Order.find({
      type: 'sale',
      status: { $in: statusArray },
      ...(Object.keys(dateQuery).length > 0 && { createdAt: dateQuery })
    })
    .populate('items.product', 'name sku category')
    .sort({ createdAt: -1 });

    // Group data based on groupBy parameter
    const groupedData = {};
    let dateFormat;
    
    switch (groupBy) {
      case 'month':
        dateFormat = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'week':
        dateFormat = (date) => {
          const year = date.getFullYear();
          const week = Math.ceil((date.getDate() - date.getDay() + 1) / 7);
          return `${year}-W${String(week).padStart(2, '0')}`;
        };
        break;
      default: // day
        dateFormat = (date) => date.toISOString().split('T')[0];
    }

    orders.forEach(order => {
      const key = dateFormat(order.createdAt);
      if (!groupedData[key]) {
        groupedData[key] = {
          date: key,
          orderCount: 0,
          totalRevenue: 0,
          totalItems: 0
        };
      }
      
      groupedData[key].orderCount += 1;
      groupedData[key].totalRevenue += order.totalAmount;
      groupedData[key].totalItems += order.items.reduce((sum, item) => sum + item.quantity, 0);
    });

    // Calculate summary
    const summary = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
      totalItemsSold: orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
    };

    const report = {
      generatedAt: new Date(),
      generatedBy: req.user.id,
      type: 'sales',
      filters: { startDate, endDate, status, groupBy },
      summary,
      groupedData: Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date)),
      orders: format === 'detailed' ? orders : undefined
    };

    if (format === 'csv') {
      const csvHeader = 'Date,Order Count,Total Revenue,Total Items\n';
      const csvData = Object.values(groupedData)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(d => `${d.date},${d.orderCount},${d.totalRevenue},${d.totalItems}`)
        .join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=sales-report.csv');
      return res.send(csvHeader + csvData);
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating sales report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate stock movement report
// @route   GET /api/reports/stock-movements
// @access  Private
const getStockMovementReport = async (req, res) => {
  try {
    const { 
      format = 'json', 
      startDate, 
      endDate, 
      product, 
      type,
      reason 
    } = req.query;

    // Build query
    let query = {};
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (product) query.product = product;
    if (type) query.type = type;
    if (reason) query.reason = reason;

    const movements = await StockMovement.find(query)
      .populate('product', 'name sku')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Calculate summary
    const summary = {
      totalMovements: movements.length,
      totalIn: movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0),
      totalOut: movements.filter(m => m.type === 'out').reduce((sum, m) => sum + Math.abs(m.quantity), 0),
      netMovement: movements.reduce((sum, m) => sum + m.quantity, 0)
    };

    // Group by reason
    const byReason = movements.reduce((acc, movement) => {
      if (!acc[movement.reason]) {
        acc[movement.reason] = { count: 0, totalQuantity: 0 };
      }
      acc[movement.reason].count += 1;
      acc[movement.reason].totalQuantity += movement.quantity;
      return acc;
    }, {});

    const report = {
      generatedAt: new Date(),
      generatedBy: req.user.id,
      type: 'stock-movements',
      filters: { startDate, endDate, product, type, reason },
      summary,
      byReason,
      data: movements
    };

    if (format === 'csv') {
      const csvHeader = 'Date,Product,SKU,Type,Quantity,Previous Qty,New Qty,Reason,Reference,Created By\n';
      const csvData = movements.map(m => 
        `${m.createdAt.toISOString().split('T')[0]},"${m.product?.name || ''}","${m.product?.sku || ''}",${m.type},${m.quantity},${m.previousQuantity},${m.newQuantity},${m.reason},"${m.reference || ''}","${m.createdBy?.firstName || ''} ${m.createdBy?.lastName || ''}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=stock-movements-report.csv');
      return res.send(csvHeader + csvData);
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Stock movement report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating stock movement report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate supplier performance report
// @route   GET /api/reports/supplier-performance
// @access  Private
const getSupplierPerformanceReport = async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;

    // Date range for orders
    const dateQuery = {};
    if (startDate) dateQuery.$gte = new Date(startDate);
    if (endDate) dateQuery.$lte = new Date(endDate);

    // Get supplier performance data
    const supplierPerformance = await Order.aggregate([
      {
        $match: {
          type: 'purchase',
          supplier: { $exists: true },
          ...(Object.keys(dateQuery).length > 0 && { createdAt: dateQuery })
        }
      },
      {
        $group: {
          _id: '$supplier',
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          onTimeDeliveries: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: '_id',
          foreignField: '_id',
          as: 'supplier'
        }
      },
      { $unwind: '$supplier' },
      {
        $project: {
          supplierName: '$supplier.name',
          companyName: '$supplier.companyName',
          email: '$supplier.email',
          totalOrders: 1,
          totalAmount: 1,
          averageOrderValue: 1,
          onTimeDeliveries: 1,
          cancelledOrders: 1,
          deliveryRate: {
            $cond: {
              if: { $gt: ['$totalOrders', 0] },
              then: { $multiply: [{ $divide: ['$onTimeDeliveries', '$totalOrders'] }, 100] },
              else: 0
            }
          },
          cancellationRate: {
            $cond: {
              if: { $gt: ['$totalOrders', 0] },
              then: { $multiply: [{ $divide: ['$cancelledOrders', '$totalOrders'] }, 100] },
              else: 0
            }
          }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    const report = {
      generatedAt: new Date(),
      generatedBy: req.user.id,
      type: 'supplier-performance',
      filters: { startDate, endDate },
      summary: {
        totalSuppliers: supplierPerformance.length,
        totalPurchaseValue: supplierPerformance.reduce((sum, s) => sum + s.totalAmount, 0),
        averageDeliveryRate: supplierPerformance.length > 0 
          ? supplierPerformance.reduce((sum, s) => sum + s.deliveryRate, 0) / supplierPerformance.length 
          : 0
      },
      data: supplierPerformance
    };

    if (format === 'csv') {
      const csvHeader = 'Supplier Name,Company,Email,Total Orders,Total Amount,Avg Order Value,On-Time Deliveries,Cancelled Orders,Delivery Rate %,Cancellation Rate %\n';
      const csvData = supplierPerformance.map(s => 
        `"${s.supplierName}","${s.companyName}","${s.email}",${s.totalOrders},${s.totalAmount},${s.averageOrderValue.toFixed(2)},${s.onTimeDeliveries},${s.cancelledOrders},${s.deliveryRate.toFixed(2)},${s.cancellationRate.toFixed(2)}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=supplier-performance-report.csv');
      return res.send(csvHeader + csvData);
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Supplier performance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating supplier performance report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getInventoryReport,
  getSalesReport,
  getStockMovementReport,
  getSupplierPerformanceReport
};