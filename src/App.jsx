import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Login from './pages/Auth/login';
import Register from './pages/Auth/register';
import MainPage from './pages/Main/mainPage';
import ClubMeetingsPage from './pages/Main/clubMeetings';
import BookNotesPage from './pages/Main/bookNotes';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/meetings" element={<PrivateRoute><ClubMeetingsPage /></PrivateRoute>} />
                <Route path="/notes" element={<PrivateRoute><BookNotesPage /></PrivateRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
