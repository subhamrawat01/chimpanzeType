/**
 * Main App Component
 * Root component that manages the overall application state and layout
 */

import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import TypingGame from './components/TypingGame';
import AuthModal from './components/AuthModal';
import { GlobalStyle } from './styles/GlobalStyles';

function App() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleLoginClick = () => {
        setIsAuthModalOpen(true);
    };

    const handleCloseAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    return (
        <AuthProvider>
            <GlobalStyle />
            <div className="App">
                <Header onLoginClick={handleLoginClick} />
                
                <main>
                    <TypingGame />
                </main>

                <AuthModal 
                    isOpen={isAuthModalOpen} 
                    onClose={handleCloseAuthModal} 
                />
            </div>
        </AuthProvider>
    );
}

export default App;
