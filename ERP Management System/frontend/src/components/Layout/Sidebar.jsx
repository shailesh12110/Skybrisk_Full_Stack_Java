import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box } from '@mui/material';
import {
  Dashboard,
  Inventory,
  People,
  LocalShipping,
  ShoppingCart,
  Receipt,
  Description,
  Assessment,
  Group,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DRAWER_WIDTH = 260;

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['Admin', 'Sales', 'Purchase', 'Inventory'] },
    { text: 'Products', icon: <Inventory />, path: '/products', roles: ['Admin', 'Sales', 'Purchase', 'Inventory'] },
    { text: 'Customers', icon: <People />, path: '/customers', roles: ['Admin', 'Sales'] },
    { text: 'Suppliers', icon: <LocalShipping />, path: '/suppliers', roles: ['Admin', 'Purchase'] },
    { text: 'Sales Orders', icon: <ShoppingCart />, path: '/sales-orders', roles: ['Admin', 'Sales'] },
    { text: 'Purchase Orders', icon: <Receipt />, path: '/purchase-orders', roles: ['Admin', 'Purchase'] },
    { text: 'GRNs', icon: <Description />, path: '/grns', roles: ['Admin', 'Inventory', 'Purchase'] },
    { text: 'Invoices', icon: <Assessment />, path: '/invoices', roles: ['Admin', 'Sales'] },
    { text: 'Users', icon: <Group />, path: '/users', roles: ['Admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.dark',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.dark',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.dark' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
