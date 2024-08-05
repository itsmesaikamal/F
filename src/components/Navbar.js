import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import './Navbar.css';

const drawerWidth = 240;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication state here
    // For example, if using Firebase auth:
    // firebase.auth().signOut().then(() => {
    //   navigate('/login', { replace: true });
    // });

    // Directly navigating to login page for simplicity
    navigate('/login', { replace: true });
  };

  const drawerStyle = {
    width: drawerWidth,
    flexShrink: 0,
    backgroundImage: `url('https://images.pexels.com/photos/3772353/pexels-photo-3772353.jpeg?auto=compress&cs=tinysrgb&w=600')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    fontFamily: 'Cursive, Arial, sans-serif',
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: drawerStyle,
      }}
    >
      <div className="admin-logo">Factory Admin</div>
      <List>
        <ListItem button component={Link} to="/home/raw-materials">
          <ListItemText primary="Raw Materials" />
        </ListItem>
        {location.pathname.includes('/home/raw-materials') && (
          <div className="sub-nav">
            <ListItem button component={Link} to="/home/raw-materials/insert">
              <ListItemText primary="Insert Raw Materials" />
            </ListItem>
            <ListItem button component={Link} to="/home/raw-materials/view">
              <ListItemText primary="View Raw Materials" />
            </ListItem>
            <ListItem button component={Link} to="/home/raw-materials/available">
              <ListItemText primary="Available Raw Materials" />
            </ListItem>
            <ListItem button component={Link} to="/home/raw-materials/consumed">
              <ListItemText primary="Consumed Raw Materials" />
            </ListItem>
          </div>
        )}
        <ListItem button component={Link} to="/home/products">
          <ListItemText primary="Products" />
        </ListItem>
        {location.pathname.includes('/home/products') && (
          <div className="sub-nav">
            <ListItem button component={Link} to="/home/products/insert">
              <ListItemText primary="Insert Products" />
            </ListItem>
            <ListItem button component={Link} to="/home/products/view">
              <ListItemText primary="View Products" />
            </ListItem>
          </div>
        )}
        <ListItem button component={Link} to="/home/orders">
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button component={Link} to="/home/invoice">
          <ListItemText primary="Invoice" />
        </ListItem>
        <ListItem button component={Link} to="/home/accounts">
          <ListItemText primary="Accounts" />
        </ListItem>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Log Out" />
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  );
};

export default Navbar;
