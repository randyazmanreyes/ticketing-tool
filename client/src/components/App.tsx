import React from 'react';
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';
import { SessionProvider } from '../hoc/withSession';
import Details from './pages/details/Details';
import Login from './pages/login/Login';
import Main from './pages/main/Main';

const App = (): JSX.Element => {
    return (
        <SessionProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Main />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/ticket/:ticketId" element={<Details />} />

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </SessionProvider>
    );
};

export default App;
