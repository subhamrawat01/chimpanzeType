/**
 * Professional Global Styled Components
 * Modern, clean design with professional aesthetics
 */

// eslint-disable-next-line no-unused-vars
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';

// Modern CSS Variables and Global Styles
export const GlobalStyle = createGlobalStyle`
    :root {
        --primary-color: #2563eb;
        --primary-hover: #1d4ed8;
        --primary-light: #dbeafe;
        --secondary-color: #64748b;
        --accent-color: #10b981;
        --danger-color: #ef4444;
        --warning-color: #f59e0b;
        --success-color: #22c55e;
        
        --background-primary: #ffffff;
        --background-secondary: #f8fafc;
        --background-tertiary: #f1f5f9;
        --background-card: #ffffff;
        
        --text-primary: #0f172a;
        --text-secondary: #475569;
        --text-muted: #94a3b8;
        --text-light: #cbd5e1;
        
        --border-color: #e2e8f0;
        --border-hover: #cbd5e1;
        --border-focus: #3b82f6;
        
        --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        
        --radius-sm: 0.375rem;
        --radius-md: 0.5rem;
        --radius-lg: 0.75rem;
        --radius-xl: 1rem;
        --radius-2xl: 1.5rem;
        
        --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        --font-family-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html {
        font-size: 16px;
        scroll-behavior: smooth;
    }

    body {
        font-family: var(--font-family-sans);
        background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-tertiary) 100%);
        color: var(--text-primary);
        line-height: 1.6;
        min-height: 100vh;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        transition: all 0.3s ease;
    }

    button {
        cursor: pointer;
        border: none;
        outline: none;
        font-family: inherit;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        
        &:focus-visible {
            outline: 2px solid var(--border-focus);
            outline-offset: 2px;
        }
        
        &:disabled {
            cursor: not-allowed;
            opacity: 0.6;
        }
    }

    input {
        border: none;
        outline: none;
        font-family: inherit;
        transition: all 0.2s ease;
        
        &:focus {
            outline: 2px solid var(--border-focus);
            outline-offset: -2px;
        }
    }

    .App {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
`;

// Modern animations
const slideInFromTop = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const slideInFromLeft = keyframes`
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

const scaleIn = keyframes`
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

const typing = keyframes`
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
`;

// Professional Header Component
export const Header = styled.header`
    background: var(--background-card);
    backdrop-filter: blur(8px);
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
    animation: ${slideInFromTop} 0.6s ease-out;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem;
        position: relative;
    }
`;

export const LogoSection = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

export const Logo = styled.img`
    height: 2.5rem;
    width: 2.5rem;
    border-radius: var(--radius-md);
    transition: transform 0.3s ease;
    
    &:hover {
        transform: scale(1.05);
    }
`;

export const Title = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.025em;
    
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (max-width: 768px) {
        font-size: 1.25rem;
    }
`;

export const UserProfile = styled.div`
    background: var(--background-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 0.75rem;
    min-width: 180px;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;
    
    &:hover {
        box-shadow: var(--shadow-md);
        border-color: var(--border-hover);
    }
    
    @media (max-width: 768px) {
        min-width: auto;
        width: 100%;
        max-width: 280px;
    }
`;

export const UserInfo = styled.div`
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 500;
    margin: 0.2rem 0;
    padding: 0.2rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &:not(:last-child) {
        border-bottom: 1px solid var(--border-color);
    }
    
    &:first-child {
        color: var(--text-primary);
        font-weight: 600;
        font-size: 0.85rem;
    }
`;

export const LoginButton = styled.button`
    background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
    color: white;
    border-radius: var(--radius-md);
    padding: 0.6rem 0.75rem;
    font-weight: 600;
    font-size: 0.8rem;
    width: 100%;
    margin-bottom: 0.6rem;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;
    
    &:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
        background: linear-gradient(135deg, var(--primary-hover), var(--primary-color));
    }
    
    &:active {
        transform: translateY(0);
        box-shadow: var(--shadow-sm);
    }
`;

// Modern main content styles
export const Main = styled.main`
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 2rem;
    
    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

export const TypingArea = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    margin: 2rem 0;
    animation: ${slideInFromLeft} 0.8s ease-out;
    
    @media (max-width: 768px) {
        margin: 1rem 0;
        min-height: 300px;
    }
`;

export const Content = styled.div`
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 2.5rem;
    font-size: 1.25rem;
    background: var(--background-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    animation: ${scaleIn} 0.6s ease-out;
    line-height: 1.8;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    font-family: var(--font-family-mono);
    position: relative;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    }
    
    @media (max-width: 768px) {
        font-size: 1.125rem;
        padding: 1.5rem;
        margin: 0.5rem;
    }
`;

export const ControlsArea = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    margin: 1rem 0;
    background: var(--background-card);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
    
    @media (max-width: 768px) {
        padding: 1.5rem;
        margin: 0.5rem 0;
        gap: 1rem;
    }
`;

export const InputGroup = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    width: 100%;
    max-width: 400px;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.75rem;
    }
`;

export const TypingInput = styled.input`
    flex: 1;
    padding: 0.875rem 1rem;
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-family: var(--font-family-mono);
    background: var(--background-primary);
    transition: all 0.2s ease;
    
    &:focus {
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    }
    
    &:disabled {
        background-color: var(--background-tertiary);
        cursor: not-allowed;
        opacity: 0.6;
    }
    
    @media (max-width: 768px) {
        width: 100%;
        font-size: 1rem;
    }
`;

export const StartButton = styled.button`
    background: ${props => props.disabled 
        ? 'var(--background-tertiary)' 
        : 'linear-gradient(135deg, var(--accent-color), #059669)'};
    color: ${props => props.disabled ? 'var(--text-muted)' : 'white'};
    padding: 0.875rem 2rem;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.025em;
    box-shadow: ${props => props.disabled ? 'none' : 'var(--shadow-sm)'};
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
    }
    
    &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: var(--shadow-sm);
    }
    
    @media (max-width: 768px) {
        width: 100%;
        padding: 1rem 2rem;
    }
`;

// Enhanced Typing Game Styles
export const TypingText = styled.div`
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    hyphens: auto;
    max-width: 100%;
    box-sizing: border-box;
    line-height: 1.8;
    text-align: left;
    font-family: var(--font-family-mono);
    letter-spacing: 0.5px;
`;

export const TypingChar = styled.span`
    display: inline;
    font-family: var(--font-family-mono);
    font-size: 1.25rem;
    line-height: 1.8;
    padding: 0;
    transition: all 0.2s ease;
    
    ${props => {
        if (props.status === 'highlight') {
            return css`
                color: var(--primary-color);
                background-color: var(--primary-light);
                border-radius: var(--radius-sm);
                animation: ${typing} 1s infinite;
            `;
        } else if (props.status === 'error') {
            return css`
                color: var(--danger-color);
                background-color: rgba(239, 68, 68, 0.1);
                border-radius: var(--radius-sm);
                font-weight: 600;
            `;
        } else if (props.status === 'done') {
            return css`
                color: var(--success-color);
                background-color: rgba(34, 197, 94, 0.1);
                border-radius: var(--radius-sm);
            `;
        }
        return css`
            color: var(--text-muted);
        `;
    }}
    
    @media (max-width: 768px) {
        font-size: 1.125rem;
    }
`;

// Enhanced Results Box - Ultra Compact version
export const ResultBox = styled.div`
    background: var(--background-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    padding: 1rem;
    color: var(--text-primary);
    text-align: center;
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
    max-width: 450px;
    margin: 0.5rem auto;
    animation: ${scaleIn} 0.5s ease-out;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color), var(--warning-color));
        border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    }
    
    h3 {
        margin-bottom: 0.75rem;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: -0.025em;
        
        background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    @media (max-width: 768px) {
        padding: 0.875rem;
        margin: 0.25rem;
        max-width: calc(100% - 0.5rem);
        
        h3 {
            font-size: 1.125rem;
            margin-bottom: 0.5rem;
        }
    }
`;

export const StatItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    margin: 0.5rem 0;
    background: var(--background-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    transition: all 0.2s ease;
    
    &:hover {
        background: var(--background-tertiary);
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
    }
    
    .label {
        font-weight: 600;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        
        &::before {
            content: '';
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--accent-color);
        }
    }
    
    .value {
        font-weight: 700;
        color: var(--text-primary);
        font-size: 1rem;
    }
    
    &:nth-child(2) .label::before { background: var(--primary-color); }
    &:nth-child(3) .label::before { background: var(--success-color); }
    &:nth-child(4) .label::before { background: var(--danger-color); }
    &:nth-child(5) .label::before { background: var(--warning-color); }
    
    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        gap: 0.25rem;
        padding: 0.625rem 0.75rem;
        
        .label {
            justify-content: center;
            font-size: 0.85rem;
        }
        
        .value {
            font-size: 0.9rem;
        }
    }
`;

export const TryAgainButton = styled.button`
    background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    margin-top: 1rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: var(--shadow-lg);
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }
    
    &:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: var(--shadow-xl);
        
        &::before {
            left: 100%;
        }
    }
    
    &:active {
        transform: translateY(0) scale(0.98);
        box-shadow: var(--shadow-lg);
    }
    
    @media (max-width: 768px) {
        width: 100%;
        padding: 1rem;
        font-size: 0.95rem;
        margin-top: 1.5rem;
    }
`;

// Modal Styles
export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: ${slideInFromTop} 0.3s ease;
`;

export const ModalContent = styled.div`
    background: var(--background-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    min-width: 400px;
    max-width: 600px;
    padding: 2rem;
    box-shadow: var(--shadow-xl);
    max-height: 90vh;
    overflow-y: auto;
    animation: ${scaleIn} 0.3s ease;
    
    @media (max-width: 768px) {
        margin: 1rem;
        min-width: auto;
        width: calc(100% - 2rem);
        padding: 1.5rem;
    }
`;

// Form Styles
export const FormSection = styled.div`
    margin-bottom: 1.5rem;
`;

export const FormToggle = styled.button`
    background: ${props => props.active ? 'var(--primary-light)' : 'var(--background-secondary)'};
    color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
    border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
    display: block;
    padding: 1rem;
    width: 100%;
    text-align: center;
    font-size: 1rem;
    border-radius: var(--radius-md);
    font-weight: ${props => props.active ? '600' : '500'};
    transition: all 0.2s ease;
    
    &:hover {
        background: ${props => props.active ? 'var(--primary-light)' : 'var(--background-tertiary)'};
        border-color: var(--border-hover);
    }
`;

export const FormContainer = styled.div`
    display: ${props => props.visible ? 'block' : 'none'};
    background: var(--background-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    margin-top: 0.75rem;
`;

export const FormTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    
    th, td {
        padding: 0.75rem 0.5rem;
        text-align: left;
        vertical-align: top;
    }
    
    th {
        font-weight: 600;
        color: var(--text-secondary);
        width: 30%;
        
        @media (max-width: 768px) {
            width: 35%;
            font-size: 0.875rem;
        }
    }
    
    td {
        width: 70%;
    }
`;

export const FormInput = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    background: var(--background-primary);
    transition: all 0.2s ease;
    
    &:focus {
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    }
    
    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

export const FormButton = styled.button`
    background: ${props => props.disabled ? 'var(--background-tertiary)' : 'var(--primary-color)'};
    color: ${props => props.disabled ? 'var(--text-muted)' : 'white'};
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.disabled ? '0.6' : '1'};
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
        background: var(--primary-hover);
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
    }
`;

export const ValidationMessage = styled.p`
    color: ${props => props.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
    font-size: 0.75rem;
    margin: 0.25rem 0;
    font-style: italic;
    display: ${props => props.children ? 'block' : 'none'};
    min-height: 1rem;
`;

export const AuthMessage = styled.div`
    margin: 1rem 0;
    padding: ${props => props.children ? '0.75rem' : '0'};
    background: ${props => {
        if (!props.children) return 'transparent';
        return props.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
    }};
    color: ${props => props.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
    border-radius: var(--radius-md);
    border: ${props => {
        if (!props.children) return 'none';
        return props.type === 'success' ? '1px solid var(--success-color)' : '1px solid var(--danger-color)';
    }};
    display: ${props => props.children ? 'block' : 'none'};
    font-weight: 500;
`;

export const CheckButton = styled.button`
    color: var(--primary-color);
    text-decoration: underline;
    font-size: 0.75rem;
    background: none;
    padding: 0.25rem 0.5rem;
    
    &:hover {
        color: var(--primary-hover);
        background-color: var(--primary-light);
        border-radius: var(--radius-sm);
    }
`;

export const LoadingSpinner = styled.div`
    border: 3px solid var(--background-tertiary);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    animation: spin 1s linear infinite;
    margin: 1.5rem auto;
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

export const MessageArea = styled.section`
    text-align: center;
    padding: 1.5rem;
    margin: 1.5rem 0;
`;

export const MessageBox = styled.div`
    background: var(--background-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
    font-size: 1.125rem;
    color: ${props => 
        props.type === 'error' ? 'var(--danger-color)' : 
        props.type === 'success' ? 'var(--success-color)' : 
        'var(--text-primary)'};
    font-weight: 500;
`;
