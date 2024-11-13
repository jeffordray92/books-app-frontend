import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchBooks from './bookSearch';
import axiosInstance from '../../api/axiosInstance';

const ClubMeetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [duration, setDuration] = useState('');
    const [error, setError] = useState('');
    const searchBooksRef = useRef(null);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await axiosInstance.get('/club/meetings');
            setMeetings(response.data);
        } catch (error) {
            console.error("Error fetching meetings:", error);
        }
    };

    const handleAddMeeting = async () => {
        if (!selectedBook || !description || !startTime || !duration) {
            setError("Please fill out all fields.");
            return;
        }

        try {
            await axiosInstance.post('/club/meetings/', {
                book_id: selectedBook.id,
                description,
                start_time: startTime.toISOString().slice(0, 19), // Format for API requirement
                duration,
            });
            fetchMeetings(); // Refresh meetings list after adding a new one
            // Clear form fields
            setSelectedBook(null);
            setDescription('');
            setStartTime(null);
            setDuration('');
            setError('');
            // Clear the search book input field
            if (searchBooksRef.current) {
                searchBooksRef.current.clearInput();
            }
        } catch (error) {
            console.error("Error adding meeting:", error);
            setError("Failed to add meeting. Please try again.");
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: 500, textAlign: 'center', mb: 4 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            Book Club Meetings
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                            Add a new meeting or check out available meetings below.
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
                            label="Description"
                            multiline
                            rows={4}
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <DateTimePicker
                            label="Start Time"
                            value={startTime}
                            onChange={setStartTime}
                            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                        />

                        <TextField
                            label="Duration"
                            fullWidth
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mb: 2 }}
                            onClick={handleAddMeeting}
                        >
                            Add Meeting
                        </Button>
                    </Paper>
                </Box>

                <Box sx={{ width: '100%', maxWidth: 500, overflowY: 'auto', maxHeight: '50vh', mt: 4 }}>
                    <Typography variant="h5" gutterBottom>Available Meetings</Typography>
                    {meetings.length === 0 ? (
                        <Typography variant="body1">No meetings available.</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Book ID</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Start Time</TableCell>
                                        <TableCell>Duration</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {meetings.map((meeting) => (
                                        <TableRow key={meeting.id}>
                                            <TableCell>{meeting.book.book_title}</TableCell>
                                            <TableCell>{meeting.description}</TableCell>
                                            <TableCell>{new Date(meeting.start_time).toLocaleString()}</TableCell>
                                            <TableCell>{meeting.duration}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Container>
        </LocalizationProvider>
    );
};

export default ClubMeetings;
