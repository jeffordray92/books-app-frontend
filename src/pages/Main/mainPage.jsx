import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import BookSearch from './bookSearch';


const MainPage = () => {
    const [selectedBook, setSelectedBook] = useState(null);
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState('');
    const searchBooksRef = useRef(null);

    useEffect(() => {
        fetchTodoBooks();
    }, []);

    const fetchTodoBooks = async () => {
        try {
            const response = await axiosInstance.get('/books/todo');
            setTodos(response.data);
        } catch (error) {
            console.error("Error fetching todo books:", error);
        }
    };

    const handleAddToTodo = async () => {
        if (!selectedBook) {
            setError("Please select a book first.");
            return;
        }

        try {
            await axiosInstance.post('/books/todo/', { book_id: selectedBook.id });
            fetchTodoBooks();
            setSelectedBook(null);
            setError('');
            console.log(`${selectedBook.book_title} (${selectedBook.isbn}) added to Todo`);
            searchBooksRef.current.clearInput();
        } catch (error) {
            console.error("Error adding book to todo:", error);
            setError("Failed to add book to Todo. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 500, textAlign: 'center', mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome to the Book Search App
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                        Type in a book title to begin your search
                    </Typography>
                    
                    {error && (
                        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <BookSearch
                        ref={searchBooksRef}
                        onSelectBook={setSelectedBook}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleAddToTodo}
                        disabled={!selectedBook}
                    >
                        Add to Todo
                    </Button>
                </Paper>
            </Box>

            <Box sx={{ width: '100%', maxWidth: 500, overflowY: 'auto', maxHeight: '50vh', mt: 4 }}>
                <Typography variant="h5" gutterBottom>Todo Books</Typography>
                {todos.length === 0 ? (
                    <Typography variant="body1">No books added in Todo.</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Author</TableCell>
                                    <TableCell>Publication Year</TableCell>
                                    <TableCell>Date Added</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {todos.map((todo) => (
                                    <TableRow key={todo.id}>
                                        <TableCell>{todo.book.book_title}</TableCell>
                                        <TableCell>{todo.book.book_author}</TableCell>
                                        <TableCell>{todo.book.publication_year}</TableCell>
                                        <TableCell>{new Date(todo.created_at).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Container>
    );
};

export default MainPage;
