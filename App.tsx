import React, { useState, useEffect } from 'react';
import { UserRole, Hospital, Facility } from './types';
import { MOCK_HOSPITALS, USER_CREDENTIALS } from './constants';
import LoginPage from './components/LoginPage';
import ManagementPortal from './components/ManagementPortal';
import RegistrationPage from './components/RegistrationPage';
import { HeartIcon, LogoutIcon } from './components/Icons';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<{ role: UserRole } | null>(null);
    const [hospitals, setHospitals] = useState<Hospital[]>(MOCK_HOSPITALS);
    const [view, setView] = useState<'login' | 'register' | 'portal'>('login');

    useEffect(() => {
        const savedRole = localStorage.getItem('careConnectUserRole');
        if (savedRole) {
            setCurrentUser({ role: savedRole as UserRole });
            setView('portal');
        } else {
            setView('login');
        }
    }, []);

    const handleLogin = (role: UserRole, username: string, password: string): boolean => {
        const credentials = USER_CREDENTIALS[role];
        if (credentials && credentials.username === username && credentials.password === password) {
            localStorage.setItem('careConnectUserRole', role);
            setCurrentUser({ role });
            setView('portal');
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        localStorage.removeItem('careConnectUserRole');
        setCurrentUser(null);
        setView('login');
    };
    
    const handleHospitalUpdate = (updatedHospital: Hospital) => {
        setHospitals(prevHospitals => 
            prevHospitals.map(h => h.id === updatedHospital.id ? {...updatedHospital, lastUpdated: new Date().toISOString()} : h)
        );
    };

    const handleRegisterHospital = (newHospitalData: Omit<Hospital, 'id' | 'lastUpdated'>) => {
        const newHospital: Hospital = {
            ...newHospitalData,
            id: hospitals.length > 0 ? Math.max(...hospitals.map(h => h.id)) + 1 : 1,
            lastUpdated: new Date().toISOString(),
        };
        // When registering, available starts equal to total
        newHospital.facilities.forEach(f => f.available = f.total);
        setHospitals(prev => [...prev, newHospital]);
        setView('login');
    };

    const renderPortal = () => {
        if (!currentUser) return null;

        // For this demo, all roles manage the first hospital.
        // In a real app, this would be determined by user's affiliation.
        const managedHospital = hospitals[0]; 
        
        switch (currentUser.role) {
            case UserRole.Admin:
            case UserRole.Doctor:
            case UserRole.Coordinator:
                return <ManagementPortal 
                            hospital={managedHospital} 
                            userRole={currentUser.role} 
                            onUpdate={handleHospitalUpdate} />;
            default:
                return <div className="text-center p-8">Invalid user role.</div>;
        }
    };
    
    const Header = () => (
        <header className="bg-white shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-3">
                        <HeartIcon className="w-8 h-8 text-red-500" />
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">CareConnect</h1>
                    </div>
                    {currentUser && (
                        <div className="flex items-center space-x-4">
                             <span className="font-semibold px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm">{currentUser.role}</span>
                            <button onClick={handleLogout} className="flex items-center space-x-2 text-sm text-slate-600 hover:text-red-500 font-semibold transition-colors">
                                <LogoutIcon className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );

    const renderContent = () => {
        if (view === 'portal') {
            return renderPortal();
        }
        if (view === 'register') {
            return <RegistrationPage onRegister={handleRegisterHospital} onBackToLogin={() => setView('login')} />;
        }
        return <LoginPage onLogin={handleLogin} onShowRegister={() => setView('register')} />;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
