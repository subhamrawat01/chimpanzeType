/**
 * Typing Game Component
 * Handles the main typing test functionality with direct keyboard input
 */

import React, { useState, useEffect, useCallback } from 'react';
import { quotesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import * as S from '../styles/GlobalStyles';

const TypingGame = () => {
    const { updateTestResults } = useAuth();
    
    const [gameState, setGameState] = useState({
        currentText: '',
        charIndex: 0,
        startTime: 0,
        inAccuracyCount: 0,
        totalErrorsMade: 0, // Track total errors made during typing
        elapsedTime: 0,
        isGameActive: false,
        isGameFinished: false,
        charStatuses: [],
        wpm: 0,
        accuracy: 0
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [finalResults, setFinalResults] = useState(null);
    const testCompletedRef = React.useRef(false);
    
    // Refs to avoid stale closures in event handlers
    const gameStateRef = React.useRef(gameState);
    const isLoadingRef = React.useRef(isLoading);
    const handlersRef = React.useRef({});
    
    // Update refs when state changes
    React.useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);
    
    React.useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    // Initialize new typing test
    const initializeTest = useCallback(async () => {
        const wasActive = gameStateRef.current.isGameActive;
        setIsLoading(true);
        setMessage(wasActive ? 'Starting new test...' : 'Loading new typing test...');
        
        try {
            const text = await quotesAPI.getRandomQuote();
            const charStatuses = new Array(text.length).fill('');
            charStatuses[0] = 'highlight'; // Highlight first character
            
            setGameState({
                currentText: text,
                charIndex: 0,
                startTime: 0,
                inAccuracyCount: 0,
                totalErrorsMade: 0,
                elapsedTime: 0,
                isGameActive: false,
                isGameFinished: false,
                charStatuses,
                wpm: 0,
                accuracy: 0
            });
            testCompletedRef.current = false;
            setFinalResults(null);
            setMessage('Start typing to begin the test!');
        } catch (error) {
            setMessage('Failed to load typing test. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Finish the test and calculate results
    const finishTest = useCallback((startTime, totalErrors, totalChars) => {
        if (testCompletedRef.current) {
            return;
        }
        
        const endTime = new Date().getTime();
        const elapsedTimeInSeconds = (endTime - startTime) / 1000;
        const elapsedTimeInMinutes = elapsedTimeInSeconds / 60;
        
        const wpm = Math.max(1, Math.round((totalChars / 5) / Math.max(elapsedTimeInMinutes, 0.01)));
        // Calculate accuracy based on total errors made during typing
        const accuracy = Math.max(0, Math.round(((totalChars - totalErrors) / totalChars) * 100));
        
        testCompletedRef.current = true;
        
        const results = {
            wpm,
            accuracy,
            errors: totalErrors,
            totalChars,
            elapsedTime: elapsedTimeInMinutes
        };
        setFinalResults(results);
        
        updateTestResults({ wpm, accuracy }).then(result => {
        }).catch(error => {
        });
        
        setGameState(prev => ({
            ...prev,
            elapsedTime: elapsedTimeInMinutes,
            isGameActive: false,
            isGameFinished: true,
            wpm,
            accuracy
        }));

        setMessage(`Perfect! Test completed with ${accuracy}% accuracy and ${wpm} WPM!`);
    }, [updateTestResults]);

    // Handle character input
    const handleCharacterInput = useCallback((typedChar) => {
        const currentGameState = gameStateRef.current;
        const currentIsLoading = isLoadingRef.current;
        
        if (currentGameState.isGameFinished || currentIsLoading) {
            return;
        }

        // Don't allow typing beyond the text length if there are uncorrected errors
        if (currentGameState.charIndex >= currentGameState.currentText.length) {
            const hasErrors = currentGameState.charStatuses.some(status => status === 'error');
            if (hasErrors) {
                setMessage('Please use backspace to go back and correct the highlighted errors!');
                return;
            }
            return;
        }

        const expectedChar = currentGameState.currentText[currentGameState.charIndex];

        setGameState(prev => {
            // Auto-start the test if not started yet
            let currentStartTime = prev.startTime;
            let isActive = prev.isGameActive;
            
            if (!prev.isGameActive) {
                currentStartTime = new Date().getTime();
                isActive = true;
                setMessage('Great! Keep typing...');
            }
            
            const newCharStatuses = [...prev.charStatuses];
            let newInAccuracyCount = prev.inAccuracyCount;
            let newTotalErrorsMade = prev.totalErrorsMade;
            
            // Update character status
            if (typedChar === expectedChar) {
                // If this was previously an error, don't count it as an error anymore
                if (newCharStatuses[prev.charIndex] === 'error') {
                    // Correcting an error
                    newInAccuracyCount = Math.max(0, newInAccuracyCount - 1);
                }
                newCharStatuses[prev.charIndex] = 'done';
            } else {
                // Only increment error counts if this wasn't already marked as error
                if (newCharStatuses[prev.charIndex] !== 'error') {
                    newInAccuracyCount++;
                    newTotalErrorsMade++;
                }
                newCharStatuses[prev.charIndex] = 'error';
            }
            
            const newCharIndex = prev.charIndex + 1;
            
            // Clear any existing highlights and highlight next character
            for (let i = 0; i < newCharStatuses.length; i++) {
                if (newCharStatuses[i] === 'highlight') {
                    newCharStatuses[i] = '';
                }
            }
            
            if (newCharIndex < prev.currentText.length) {
                newCharStatuses[newCharIndex] = 'highlight';
            }
            
            // Check if test is finished - only complete if user reached end AND no errors remain
            const reachedEnd = newCharIndex >= prev.currentText.length;
            const hasErrors = newCharStatuses.some(status => status === 'error');
            const isFinished = reachedEnd && !hasErrors;
            
            if (reachedEnd && hasErrors) {
                setMessage('You have errors! Use backspace to go back and correct them.');
            } else if (isFinished) {
                // Use setTimeout to ensure the state update happens first, then call finishTest
                setTimeout(() => {
                    handlersRef.current.finishTest(currentStartTime, newTotalErrorsMade, prev.currentText.length);
                }, 0);
            }
            
            return {
                ...prev,
                startTime: currentStartTime,
                isGameActive: isActive,
                charIndex: newCharIndex,
                inAccuracyCount: newInAccuracyCount,
                totalErrorsMade: newTotalErrorsMade,
                charStatuses: newCharStatuses,
                isGameFinished: isFinished
            };
        });
    }, []);

    // Handle backspace
    const handleBackspace = useCallback(() => {
        const currentGameState = gameStateRef.current;
        
        if (currentGameState.charIndex > 0 && currentGameState.isGameActive && !currentGameState.isGameFinished) {
            
            setGameState(prev => {
                const newCharStatuses = [...prev.charStatuses];
                const newCharIndex = prev.charIndex - 1;
                
                // Clear current position highlight
                if (prev.charIndex < prev.currentText.length) {
                    newCharStatuses[prev.charIndex] = '';
                }
                
                // Clear the character we're moving back to (so it can be retyped)
                newCharStatuses[newCharIndex] = 'highlight';
                
                // Update message based on current state
                const hasErrors = newCharStatuses.some(status => status === 'error');
                if (hasErrors) {
                    setMessage('Keep using backspace to reach errors, then retype them correctly!');
                } else {
                    setMessage('Great! Keep typing...');
                }
                
                return {
                    ...prev,
                    charIndex: newCharIndex,
                    charStatuses: newCharStatuses
                };
            });
        }
    }, []);

    // Update handlers ref
    React.useEffect(() => {
        handlersRef.current = {
            initializeTest,
            handleCharacterInput,
            handleBackspace,
            finishTest
        };
    }, [initializeTest, handleCharacterInput, handleBackspace, finishTest]);

    // Handle keyboard input directly on the document
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Handle Shift+Enter to start new test
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                handlersRef.current.initializeTest();
                return;
            }

            // Don't interfere with typing in form inputs or if test is finished
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Use refs to get current state to avoid stale closures
            const currentGameState = gameStateRef.current;
            const currentIsLoading = isLoadingRef.current;

            if (currentGameState.isGameFinished || currentIsLoading) {
                return;
            }

            // Prevent default behavior for most keys
            if (e.key.length === 1 || e.key === 'Backspace') {
                e.preventDefault();
            }

            if (e.key === 'Backspace') {
                handlersRef.current.handleBackspace();
            } else if (e.key.length === 1) { // Only handle printable characters
                handlersRef.current.handleCharacterInput(e.key);
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleKeyPress);

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Empty dependency array to prevent re-adding listeners

    // Initialize test on component mount
    useEffect(() => {
        initializeTest();
    }, [initializeTest]);

    const renderText = () => {
        if (!gameState.currentText) return null;
        
        return (
            <S.TypingText>
                {gameState.currentText.split('').map((char, index) => (
                    <S.TypingChar 
                        key={index} 
                        status={gameState.charStatuses[index]}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </S.TypingChar>
                ))}
            </S.TypingText>
        );
    };

    const renderResults = () => {
        const results = finalResults || {
            wpm: gameState.wpm,
            accuracy: gameState.accuracy,
            errors: gameState.totalErrorsMade,
            totalChars: gameState.currentText.length
        };
        
        return (
            <S.ResultBox>
                <h3>🎉 Test Complete!</h3>
                <S.StatItem>
                    <span className="label">Speed</span>
                    <span className="value">{results.wpm} WPM</span>
                </S.StatItem>
                <S.StatItem>
                    <span className="label">Accuracy</span>
                    <span className="value">{results.accuracy}%</span>
                </S.StatItem>
                <S.StatItem>
                    <span className="label">Errors</span>
                    <span className="value">{results.errors}</span>
                </S.StatItem>
                <S.StatItem>
                    <span className="label">Characters</span>
                    <span className="value">{results.totalChars}</span>
                </S.StatItem>
                <S.TryAgainButton 
                    onClick={initializeTest}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Try Again'}
                </S.TryAgainButton>
            </S.ResultBox>
        );
    };

    return (
        <>
            <S.TypingArea>
                <S.Content>
                    {isLoading ? (
                        <div style={{ textAlign: 'center' }}>
                            <S.LoadingSpinner />
                            <p>Loading new text...</p>
                        </div>
                    ) : gameState.isGameFinished ? (
                        renderResults()
                    ) : (
                        renderText()
                    )}
                </S.Content>
            </S.TypingArea>
            
            {/* New Test Button - Always visible */}
            <S.ControlsArea>
                <S.StartButton 
                    onClick={initializeTest}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : '🔄 New Test'}
                </S.StartButton>
                <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-secondary)', 
                    textAlign: 'center',
                    marginTop: '0.5rem'
                }}>
                    Press <strong>Shift + Enter</strong> anytime to start a new test
                </div>
            </S.ControlsArea>
            
            {message && !gameState.isGameFinished && (
                <S.MessageArea>
                    <S.MessageBox type={gameState.isGameActive ? 'success' : 'info'}>
                        {message}
                    </S.MessageBox>
                </S.MessageArea>
            )}
        </>
    );
};

export default TypingGame;
