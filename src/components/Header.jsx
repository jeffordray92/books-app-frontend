import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Header = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    if (isAuthPage) return null;

    return (
        <AppBar position="static" color="primary" sx={{ mb: 3 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Book Club App
                </Typography>
                <Box>
                    <Button color="inherit" component={Link} to="/">
                        HOME
                    </Button>
                    <Button color="inherit" component={Link} to="/meetings">
                        MEETINGS
                    </Button>
                    <Button color="inherit" component={Link} to="/notes">
                        NOTES
                    </Button>
                    <Button color="inherit" onClick={logout}>
                        LOGOUT
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
