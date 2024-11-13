import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/login/', { username, password });
            const userId = response.data.user_id;
            const token = response.data.key;
            login(userId, token);
            navigate('/');
        } catch (err) {
            setError('Login failed. Please check your credentials and try again.');
            console.error("Login error:", err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
                <Typography variant="h4" gutterBottom>Login</Typography>
                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField label="Username" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
                </Box>
                <Typography sx={{ mt: 2 }}>
                    No account yet?{' '}
                    <Button component={Link} to="/register" variant="text" color="primary">
                        Register here
                    </Button>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
