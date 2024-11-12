import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { TextField, Paper, List, ListItem, ListItemText } from '@mui/material';

import axiosInstance from '../../api/axiosInstance';


const SearchBooks = forwardRef(({ onSelectBook }, ref) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const itemRefs = useRef([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim() === '') {
                setSuggestions([]);
                setNextPageUrl(null);
                return;
            }
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/books/search?q=${query}`);
                setSuggestions(response.data.results);
                setNextPageUrl(response.data.next);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
            setLoading(false);
        };
        fetchSuggestions();
    }, [query]);

    useImperativeHandle(ref, () => ({
        clearInput() {
            setQuery('');
            setActiveIndex(-1);
            setShowSuggestions(false);
        }
    }));

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setShowSuggestions(true);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setActiveIndex((prevIndex) => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex));
            scrollIntoView(activeIndex + 1);
        } else if (e.key === 'ArrowUp') {
            setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
            scrollIntoView(activeIndex - 1);
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            if (activeIndex >= 0 && activeIndex < suggestions.length) {
                onSelectBook(suggestions[activeIndex]);
                setQuery(suggestions[activeIndex].book_title);
                setShowSuggestions(false);
                e.preventDefault();
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const scrollIntoView = (index) => {
        if (itemRefs.current[index]) {
            itemRefs.current[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    };

    const handleSuggestionClick = (book) => {
        onSelectBook(book);
        setQuery(book.book_title);
        setShowSuggestions(false);
    };

    const handleMouseEnter = (index) => {
        setActiveIndex(index);
    };

    const handleScroll = async (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 10 && nextPageUrl && !loading) {
            setLoading(true);
            try {

                const url = new URL(nextPageUrl);
                let relativePath = url.pathname + url.search;

                if (relativePath.startsWith('/api')) {
                    relativePath = relativePath.replace('/api', '');
                }

                const response = await axiosInstance.get(relativePath);
                setSuggestions((prevSuggestions) => [...prevSuggestions, ...response.data.results]);
                setNextPageUrl(response.data.next);
            } catch (error) {
                console.error("Error fetching next page of suggestions:", error);
            }
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', maxWidth: '400px', margin: 'auto' }}>
            <TextField
                label="Search for a book"
                variant="outlined"
                fullWidth
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <Paper
                    onScroll={handleScroll} 
                    style={{
                        position: 'absolute',
                        width: '100%',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 10,
                    }}
                >
                    <List>
                        {suggestions.map((suggestion, index) => (
                            <ListItem
                                key={suggestion.id}
                                onClick={() => handleSuggestionClick(suggestion)}
                                onMouseEnter={() => handleMouseEnter(index)}
                                selected={index === activeIndex}
                                ref={(el) => (itemRefs.current[index] = el)}
                                sx={{
                                    backgroundColor: index === activeIndex ? 'primary.light' : 'inherit',
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={suggestion.book_title}
                                    secondary={`${suggestion.book_author} (${suggestion.publication_year})`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </div>
    );
});

export default SearchBooks;
