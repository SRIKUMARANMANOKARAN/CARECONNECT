import React, { useState } from 'react';
import { Hospital, Facility } from '../types';
import { HeartIcon, CheckCircleIcon } from './Icons';

interface RegistrationPageProps {
    onRegister: (hospital: Omit<Hospital, 'id' | 'lastUpdated'>) => void;
    onBackToLogin: () => void;
}

const defaultFacilitiesConfig = [
    { id: 'beds', name: 'Beds', type: 'resource' },
    { id: 'icu', name: 'ICU Beds', type: 'resource' },
    { id: 'ventilators', name: 'Ventilators', type: 'resource' },
    { id: 'oxygen', name: 'Oxygen (Liters)', type: 'resource' },
    { id: 'doctors', name: 'Doctors', type: 'resource' },
    { id: 'medicines', name: 'Medicines (%)', type: 'resource' },
    { id: 'attendants', name: 'Attendants', type: 'resource' },
    { id: 'surgery', name: 'Surgery Capability', type: 'capability' },
    { id: 'blood_bank', name: 'Blood Bank', type: 'capability' },
    { id: 'trauma', name: 'Trauma Care', type: 'capability' },
    { id: 'pediatric_icu', name: 'Pediatric & Neonatal ICU', type: 'capability' },
];

const initialFormData = {
    name: '',
    address: '',
    phone: '',
    email: '',
    lat: '',
    lon: '',
    facilities: defaultFacilitiesConfig.reduce((acc, f) => ({...acc, [f.id]: f.type === 'capability' ? false : 0 }), {})
};

const FormSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4 pt-6">
        <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">{title}</h3>
        {children}
    </div>
);

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onRegister, onBackToLogin }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFacilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            facilities: {
                ...prev.facilities,
                [name]: type === 'checkbox' ? checked : parseInt(value, 10) || 0,
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const facilities: Facility[] = defaultFacilitiesConfig.map(f_config => ({
            id: f_config.id,
            name: f_config.name,
            total: f_config.type === 'capability' ? (formData.facilities[f_config.id] ? 1 : 0) : formData.facilities[f_config.id],
            available: 0, // Will be set to total on App level
        }));

        const newHospitalData: Omit<Hospital, 'id' | 'lastUpdated'> = {
            name: formData.name,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            location: {
                lat: parseFloat(formData.lat),
                lon: parseFloat(formData.lon),
            },
            facilities: facilities,
        };
        onRegister(newHospitalData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-100 p-4">
                <div className="w-full max-w-md text-center bg-white p-8 rounded-2xl shadow-xl">
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800">Registration Successful!</h2>
                    <p className="text-slate-600 mt-2">Thank you for joining the CareConnect network. Your hospital is now visible to emergency responders.</p>
                    <button onClick={onBackToLogin} className="mt-6 w-full text-white bg-red-500 hover:bg-red-600 font-semibold rounded-lg text-sm px-5 py-3 text-center transition-colors">
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-100 p-4 py-8">
            <div className="w-full max-w-2xl">
                <div className="bg-white shadow-2xl rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <HeartIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <h1 className="text-3xl font-bold text-slate-800">Register Your Hospital</h1>
                        <p className="text-slate-500 mt-2 text-sm">Join the CareConnect network to help save lives.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <FormSection title="Basic Information">
                             <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-600 block mb-1">Hospital Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-style" required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600 block mb-1">Full Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-style" required />
                                </div>
                            </div>
                        </FormSection>

                         <FormSection title="Contact & Location">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-600 block mb-1">Emergency Phone</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-style" required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600 block mb-1">Emergency Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-style" required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600 block mb-1">Latitude</label>
                                    <input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} className="input-style" required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600 block mb-1">Longitude</label>
                                    <input type="number" step="any" name="lon" value={formData.lon} onChange={handleChange} className="input-style" required />
                                </div>
                            </div>
                        </FormSection>
                        
                        <FormSection title="Total Resource Capacity">
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {defaultFacilitiesConfig.filter(f => f.type === 'resource').map(f => (
                                    <div key={f.id}>
                                        <label className="text-sm font-medium text-slate-600 block mb-1 capitalize">{f.name}</label>
                                        <input type="number" name={f.id} value={formData.facilities[f.id]} onChange={handleFacilityChange} className="input-style" min="0" required />
                                    </div>
                                ))}
                            </div>
                        </FormSection>

                        <FormSection title="Emergency Capabilities">
                            <div className="grid grid-cols-2 gap-4">
                                {defaultFacilitiesConfig.filter(f => f.type === 'capability').map(f => (
                                    <label key={f.id} className="flex items-center space-x-3">
                                        <input type="checkbox" name={f.id} checked={formData.facilities[f.id]} onChange={handleFacilityChange} className="h-4 w-4 rounded" /> 
                                        <span>{f.name}</span>
                                    </label>
                                ))}
                            </div>
                        </FormSection>

                        <div className="flex items-center justify-between mt-8 pt-6 border-t">
                             <button type="button" onClick={onBackToLogin} className="text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg text-sm px-8 py-3 text-center transition-colors">
                                Register Hospital
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <style>{`.input-style { background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #0f172a; font-size: 0.875rem; border-radius: 0.5rem; display: block; width: 100%; padding: 0.625rem; } .input-style:focus { outline: none; border-color: #ef4444; ring: #ef4444; }`}</style>
        </div>
    );
};

export default RegistrationPage;
