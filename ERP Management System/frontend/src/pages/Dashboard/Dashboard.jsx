import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import {
  Inventory,
  People,
  ShoppingCart,
  AttachMoney,
  Warning,
  TrendingUp,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getDashboardOverview, getSalesTrends } from '../../redux/slices/dashboardSlice';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card elevation={2}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: color,
            borderRadius: '50%',
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.9,
          }}
        >
          <Icon sx={{ fontSize: 32, color: 'white' }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { overview, salesTrends, isLoading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardOverview());
    dispatch(getSalesTrends('month'));
  }, [dispatch]);

  if (isLoading || !overview) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={overview.inventory?.totalProducts || 0}
            icon={Inventory}
            color="#1976d2"
            subtitle={`${overview.inventory?.lowStockCount || 0} low stock`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={overview.customers?.total || 0}
            icon={People}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sales Orders"
            value={overview.sales?.totalOrders || 0}
            icon={ShoppingCart}
            color="#ed6c02"
            subtitle={`${overview.sales?.pendingOrders || 0} pending`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${(overview.revenue?.total || 0).toLocaleString()}`}
            icon={AttachMoney}
            color="#9c27b0"
            subtitle={`$${(overview.revenue?.pending || 0).toLocaleString()} pending`}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Sales Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id.day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalRevenue" stroke="#1976d2" name="Revenue" />
                <Line type="monotone" dataKey="totalOrders" stroke="#2e7d32" name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Alerts
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Warning color="warning" />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {overview.inventory?.lowStockCount || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Low Stock Products
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Warning color="error" />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {overview.revenue?.overdueInvoices || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Overdue Invoices
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrendingUp color="success" />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {overview.purchases?.pendingOrders || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pending Purchase Orders
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
