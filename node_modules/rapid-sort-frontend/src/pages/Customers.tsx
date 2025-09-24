import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Email,
  Phone,
  ShoppingBag,
  Refresh,
} from '@mui/icons-material';
import { useCustomers } from '../hooks/useCustomers';
import { Customer } from '../services/customersApi';

const Customers: React.FC = () => {
  const { customers, stats, loading, error, updateFilters, refreshCustomers } = useCustomers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName} ${customer.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Update filters with search term
    updateFilters({ search: value });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  const handleViewCustomer = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" startIcon={<Refresh />} onClick={refreshCustomers}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Customers
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your customer relationships and track their activity
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={refreshCustomers}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
          >
            Add Customer
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
            >
              Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Customer Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Customers
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Customers
              </Typography>
              <Typography variant="h4" component="div">
                {stats.activeCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" component="div">
                ${stats.totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Order Value
              </Typography>
              <Typography variant="h4" component="div">
                ${stats.averageOrderValue.toFixed(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Customers Table */}
      <Card>
        {filteredCustomers.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Orders</TableCell>
                  <TableCell>Total Spent</TableCell>
                  <TableCell>Last Order</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {customer.firstName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {customer.firstName} {customer.lastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Customer since {new Date(customer.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Email fontSize="small" color="action" />
                          <Typography variant="caption">
                            {customer.email}
                          </Typography>
                        </Box>
                        {customer.phone && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Phone fontSize="small" color="action" />
                            <Typography variant="caption">
                              {customer.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <ShoppingBag fontSize="small" color="action" />
                        <Typography variant="body2">
                          {customer.totalOrders}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        ${customer.totalSpent.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {customer.lastOrderDate 
                          ? new Date(customer.lastOrderDate).toLocaleDateString()
                          : 'Never'
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status}
                        color={getStatusColor(customer.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, customer)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Customers Found
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              {searchTerm 
                ? `No customers match your search for "${searchTerm}"`
                : 'Customers will appear here once you have orders with customer information'
              }
            </Typography>
            {searchTerm && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  updateFilters({});
                }}
              >
                Clear Search
              </Button>
            )}
          </CardContent>
        )}
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewCustomer}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit Customer
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Customer
        </MenuItem>
      </Menu>

      {/* Customer Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Customer Details - {selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : ''}
        </DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {selectedCustomer.firstName} {selectedCustomer.lastName}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {selectedCustomer.email}
                </Typography>
                {selectedCustomer.phone && (
                  <Typography variant="body2">
                    <strong>Phone:</strong> {selectedCustomer.phone}
                  </Typography>
                )}
                {selectedCustomer.fullAddress && (
                  <Typography variant="body2" mt={1}>
                    <strong>Address:</strong><br />
                    {selectedCustomer.fullAddress}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Order History
                </Typography>
                <Typography variant="body2">
                  <strong>Total Orders:</strong> {selectedCustomer.totalOrders}
                </Typography>
                <Typography variant="body2">
                  <strong>Total Spent:</strong> ${selectedCustomer.totalSpent.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  <strong>Average Order Value:</strong> ${selectedCustomer.averageOrderValue.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  <strong>Last Order:</strong> {selectedCustomer.lastOrderDate 
                    ? new Date(selectedCustomer.lastOrderDate).toLocaleDateString()
                    : 'Never'
                  }
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {selectedCustomer.status}
                </Typography>
                <Typography variant="body2">
                  <strong>Customer Since:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
          <Button variant="contained">
            Edit Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;