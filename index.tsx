import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Mock API for bot status
let mockBotState: 'ON' | 'OFF' = 'OFF';
const MOCK_API_DELAY = 800;

const mockApiRequest = <T,>(resolver: () => T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(resolver());
        }, MOCK_API_DELAY);
    });
};

const getBotStatus = () => mockApiRequest(() => ({ status: 'success' as const, bot_state: mockBotState }));

const setBotState = (action: 'on' | 'off') => mockApiRequest(() => {
    mockBotState = action === 'on' ? 'ON' : 'OFF';
    return { status: 'success' as const };
});

// SVG Icons
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-icon">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

const BotIcon = ({ active = false }: { active?: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? 'var(--accent-color)' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
        <rect x="3" y="3" width="6" height="6" rx="1"></rect>
        <rect x="15" y="3" width="6" height="6" rx="1"></rect>
        <rect x="3" y="15" width="6" height="6" rx="1"></rect>
        <rect x="15" y="15" width="6" height="6" rx="1"></rect>
        <line x1="9" y1="6" x2="15" y2="6"></line>
        <line x1="9" y1="18" x2="15" y2="18"></line>
        <line x1="6" y1="9" x2="6" y2="15"></line>
        <line x1="18" y1="9" x2="18" y2="15"></line>
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51-1z"></path>
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const LockIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);


const LoginScreen = ({ onLogin, error, isLoading }: { onLogin: (user: string, pass: string) => void; error: string; isLoading: boolean }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className="app-shell">
            <main className="app-main login-main">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Panel de Control de Maya</h1>
                        <p>Inicia sesión para continuar</p>
                    </div>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <UserIcon />
                            <input
                                type="text"
                                id="username"
                                placeholder="Usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                aria-label="Nombre de usuario"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="input-group">
                           <LockIcon />
                           <input
                                type="password"
                                id="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                aria-label="Contraseña"
                                disabled={isLoading}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="login-button" disabled={isLoading}>
                             {isLoading ? <span className="loader"></span> : null}
                             {isLoading ? 'Verificando...' : 'Ingresar'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};


const MayaStatusDashboard = () => {
    const [botStatus, setBotStatus] = useState('LOADING');
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchBotStatus = useCallback(async () => {
        if (botStatus !== 'LOADING') setIsLoading(true);
        try {
            const data = await getBotStatus();
            if (data.status === 'success' && data.bot_state) {
                setBotStatus(data.bot_state);
                setLastUpdated(new Date());
            } else {
                throw new Error('Respuesta inesperada del servidor simulado.');
            }
        } catch (error) {
            setBotStatus('ERROR');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [botStatus]);

    useEffect(() => {
        fetchBotStatus();
    }, [fetchBotStatus]);

    const handleToggle = async () => {
        const action = botStatus === 'ON' ? 'off' : 'on';
        setIsLoading(true);
        try {
            const data = await setBotState(action);
            if (data.status === 'success') {
                setBotStatus(action === 'on' ? 'ON' : 'OFF');
                setLastUpdated(new Date());
            } else {
                throw new Error('La operación simulada falló.');
            }
        } catch (error) {
            setBotStatus('ERROR');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatLastUpdated = (date: Date | null) => {
        if (!date) return '';
        return `Última actualización: ${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    };

    const getStatusInfo = () => {
        switch (botStatus) {
            case 'ON': return { title: 'Maya está actualmente ENCENDIDA', description: 'El bot está asistiendo activamente a los usuarios y procesando solicitudes.', className: 'on' };
            case 'OFF': return { title: 'Maya está actualmente APAGADA', description: 'El bot está inactivo. No procesará ninguna solicitud de usuario.', className: 'off' };
            case 'ERROR': return { title: 'Error de Conexión', description: 'No se pudo comunicar con el servidor. Inténtalo de nuevo más tarde.', className: 'error' };
            default: return { title: 'Obteniendo estado...', description: 'Por favor, espera un momento.', className: 'loading' };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="app-shell">
            <header className="app-header">
                <BackIcon />
                <h1>Estado del Bot Maya</h1>
                <div className="header-placeholder" />
            </header>
            <main className="app-main">
                <div className="status-card">
                    <div className="status-info">
                        <h2 className={statusInfo.className}>{statusInfo.title}</h2>
                        <p>{statusInfo.description}</p>
                    </div>
                    <button
                        className="toggle-button"
                        onClick={handleToggle}
                        disabled={isLoading || botStatus === 'LOADING' || botStatus === 'ERROR'}
                        aria-live="polite"
                    >
                        {isLoading ? <span className="loader"></span> : null}
                        {isLoading ? 'Procesando...' : (botStatus === 'ON' ? 'Apagar' : 'Encender')}
                    </button>
                    <div className="last-updated">
                        {formatLastUpdated(lastUpdated)}
                    </div>
                </div>
            </main>
            <footer className="app-footer">
                <a href="#" className="nav-item">
                    <HomeIcon />
                    <span>Inicio</span>
                </a>
                <a href="#" className="nav-item active">
                    <BotIcon active={true} />
                    <span>Maya</span>
                </a>
                <a href="#" className="nav-item">
                    <SettingsIcon />
                    <span>Ajustes</span>
                </a>
            </footer>
        </div>
    );
};


const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (username, password) => {
        setLoginError('');
        setIsLoading(true);

        // Simulate network request for login
        setTimeout(() => {
            if (username === 'origin' && password === 'casapatio2025') {
                setIsLoggedIn(true);
            } else {
                setLoginError('Usuario o contraseña incorrectos.');
            }
            setIsLoading(false);
        }, 1000);
    };

    return isLoggedIn 
        ? <MayaStatusDashboard /> 
        : <LoginScreen onLogin={handleLogin} error={loginError} isLoading={isLoading} />;
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<React.StrictMode><App /></React.StrictMode>);
}