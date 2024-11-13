import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography, Paper, TextField, Button, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from '../../api/axiosInstance';
import SearchBooks from './bookSearch';

const NotesPage = () => {
    const [booksWithNotes, setBooksWithNotes] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const searchBooksRef = useRef(null);

    useEffect(() => {
        fetchBooksWithNotes();
    }, []);

    const fetchBooksWithNotes = async () => {
        try {
            const response = await axiosInstance.get('/club/notes/books/');
            setBooksWithNotes(response.data);
        } catch (error) {
            console.error("Error fetching books with notes:", error);
        }
    };

    const handleAddNote = async () => {
        if (!selectedBook || !note) {
            setError("Please select a book and enter a note.");
            return;
        }

        try {
            await axiosInstance.post('/club/notes/', {
                book_id: selectedBook.id,
                note,
            });
            setNote('');
            setSelectedBook(null);
            if (searchBooksRef.current) searchBooksRef.current.clearInput();
            setError('');
            fetchBooksWithNotes();
        } catch (error) {
            console.error("Error adding note:", error);
            setError("Failed to add note. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 500, textAlign: 'center', mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Book Notes
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                        Select a book and add a note, or view public notes on books below.
                    </Typography>

                    {error && (
                        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Box sx={{ mb: 2, width: '100%' }}>
                        <SearchBooks ref={searchBooksRef} onSelectBook={setSelectedBook} fullWidth />
                    </Box>

                    <TextField
                        label="Enter your note"
                        multiline
                        rows={4}
                        fullWidth
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mb: 2 }}
                        onClick={handleAddNote}
                    >
                        Add Note
                    </Button>
                </Paper>
            </Box>

            <Box sx={{ width: '100%', maxWidth: 500, mt: 4 }}>
                <Typography variant="h5" gutterBottom>Books with Notes</Typography>
                {booksWithNotes.length === 0 ? (
                    <Typography variant="body1">No notes available for any books.</Typography>
                ) : (
                    booksWithNotes.map((book) => (
                        <Accordion key={book.isbn} sx={{ mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>{book.book_title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                    Author: {book.book_author} ({book.publication_year})
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    Publisher: {book.publisher}
                                </Typography>
                                <List>
                                    {book.notes.map((note) => (
                                        <ListItem key={note.id} alignItems="flex-start">
                                            <ListItemText
                                                primary={note.note}
                                                secondary={`Posted by User ID: ${note.posted_by}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    ))
                )}
            </Box>
        </Container>
    );
};

export default NotesPage;
