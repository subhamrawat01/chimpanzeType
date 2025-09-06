/**
 * Header Component
 * Displays app logo, title, and user information
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as S from '../styles/GlobalStyles';

const Header = ({ onLoginClick }) => {
    const { isAuthenticated, getCurrentUserStats, logout } = useAuth();
    const userStats = getCurrentUserStats();

    const handleProfileClick = () => {
        if (isAuthenticated) {
            const confirmLogout = window.confirm('Do you want to logout?');
            if (confirmLogout) {
                logout();
            }
        } else {
            onLoginClick();
        }
    };

    return (
        <S.Header>
            <S.LogoSection>
                <S.Logo src="/logo192.png" alt="ChimpanzeType Logo" />
                <S.Title>chimpanzeType</S.Title>
            </S.LogoSection>
            <S.UserProfile>
                <S.LoginButton onClick={handleProfileClick}>
                    {isAuthenticated ? 'Profile/Logout' : 'Login/CreateAccount'}
                </S.LoginButton>
                <S.UserInfo>
                    <span>User:</span>
                    <span>{userStats.username || 'Guest'}</span>
                </S.UserInfo>
                <S.UserInfo>
                    <span>Races:</span>
                    <span>{userStats.races}</span>
                </S.UserInfo>
                <S.UserInfo>
                    <span>Speed:</span>
                    <span>{userStats.speed} wpm</span>
                </S.UserInfo>
            </S.UserProfile>
        </S.Header>
    );
};

export default Header;
