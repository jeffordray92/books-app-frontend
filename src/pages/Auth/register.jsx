import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';


const Register = () => {
    const [username, setUsername] = useState('');
    const [password1, setPassword] = useState('');
    const [password2, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password1 !== password2) {
            setError("Passwords do not match");
            return;
        }
        try {
            await axiosInstance.post('/auth/register/', { username, password1, password2 });
            navigate('/login'); // Redirect to login page after successful registration
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error("Registration error:", err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
                <Typography variant="h4" gutterBottom>Register</Typography>
                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField label="Username" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <TextField label="Password" type="password" fullWidth margin="normal" value={password1} onChange={(e) => setPassword(e.target.value)} required />
                    <TextField label="Confirm Password" type="password" fullWidth margin="normal" value={password2} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
                </Box>
                <Typography sx={{ mt: 2 }}>
                    Already have an account?{' '}
                    <Button component={Link} to="/login" variant="text" color="primary">
                        Click here to login
                    </Button>
                </Typography>
            </Box>
        </Container>
    );
};

export default Register;
