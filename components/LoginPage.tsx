import React, { useState } from 'react';
import { UserRole } from '../types';
import { AdminIcon, DoctorIcon, CoordinatorIcon, HeartIcon } from './Icons';
import { USER_CREDENTIALS } from '../constants';

interface LoginPageProps {
  onLogin: (role: UserRole, username: string, password: string) => boolean;
  onShowRegister: () => void;
}

const roleConfig = {
    [UserRole.Admin]: { icon: <AdminIcon className="w-6 h-6" />, placeholder: "admin" },
    [UserRole.Doctor]: { icon: <DoctorIcon className="w-6 h-6" />, placeholder: "doctor" },
    [UserRole.Coordinator]: { icon: <CoordinatorIcon className="w-6 h-6" />, placeholder: "coordinator" },
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onShowRegister }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Admin);
  const [username, setUsername] = useState(USER_CREDENTIALS[UserRole.Admin].username);
  const [password, setPassword] = useState(USER_CREDENTIALS[UserRole.Admin].password);
  const [error, setError] = useState<string | null>(null);

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = onLogin(selectedRole, username, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  const handleRoleChange = (role: UserRole) => {
      setSelectedRole(role);
      setUsername(USER_CREDENTIALS[role].username);
      setPassword(USER_CREDENTIALS[role].password);
      setError(null);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <HeartIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-slate-800">CareConnect Portal</h1>
            <p className="text-slate-500 mt-2 text-sm">Sign in to manage hospital readiness.</p>
          </div>
          
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-200 p-1">
              {Object.values(UserRole).map(role => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`flex items-center justify-center space-x-2 text-sm font-semibold py-2 rounded-md transition-colors ${selectedRole === role ? 'bg-white text-red-500 shadow' : 'text-slate-600 hover:bg-slate-300'}`}
                  title={role}
                >
                   {roleConfig[role].icon}
                   <span>{role.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLoginAttempt} className="space-y-4">
            <div>
              <label htmlFor="username-input" className="text-sm font-medium text-slate-600 block mb-1">Username</label>
              <input 
                type="text"
                id="username-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-100 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                placeholder={roleConfig[selectedRole].placeholder}
                required
              />
            </div>
            <div>
              <label htmlFor="password-input" className="text-sm font-medium text-slate-600 block mb-1">Password</label>
              <input 
                type="password"
                id="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-100 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                placeholder="123"
                required
              />
            </div>
          
            {error && <p className="text-xs text-red-500 text-center pt-1">{error}</p>}

            <div className="pt-2">
              <button
                  type="submit"
                  className="w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg text-sm px-5 py-3 text-center transition-colors"
              >
                  Login as {selectedRole.split(' ')[0]}
              </button>
            </div>
          </form>
           <div className="text-center mt-6">
            <p className="text-sm text-slate-600">
                Is your hospital not listed?{' '}
                <button onClick={onShowRegister} className="font-semibold text-red-500 hover:underline focus:outline-none">
                    Register here
                </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
