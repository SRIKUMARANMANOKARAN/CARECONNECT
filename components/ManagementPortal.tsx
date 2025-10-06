import React, { useState, useEffect, useCallback } from 'react';
import { Hospital, Facility, UserRole } from '../types';
import { PhoneIcon, MapPinIcon, CheckCircleIcon, AlertTriangleIcon, EditIcon, PlusCircleIcon, TrashIcon, EmailIcon } from './Icons';

interface ManagementPortalProps {
    hospital: Hospital;
    userRole: UserRole;
    onUpdate: (updatedHospital: Hospital) => void;
}

const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
    // FIX: Replace NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
    const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const newTimeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
        setTimeoutId(newTimeoutId);
    };
};

const FacilityRow: React.FC<{
    facility: Facility;
    onAvailableChange: (facilityId: string, available: number) => void;
    isAdmin: boolean;
    onEdit: (facility: Facility) => void;
    onDelete: (facilityId: string) => void;
}> = ({ facility, onAvailableChange, isAdmin, onEdit, onDelete }) => {
    const isCapability = facility.total === 1; // Treat items with total of 1 as on/off capabilities
    const percentage = facility.total > 0 ? (facility.available / facility.total) * 100 : 0;
    
    let color = 'bg-green-500';
    let statusText = 'Good';
    if (percentage < 40) { color = 'bg-yellow-500'; statusText = 'Low'; }
    if (percentage < 10) { color = 'bg-red-500'; statusText = 'Critical'; }

    const handleAvailableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        const newAvailable = Math.max(0, Math.min(isNaN(val) ? 0 : val, facility.total));
        onAvailableChange(facility.id, newAvailable);
    };

    const handleCapabilityToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        onAvailableChange(facility.id, e.target.checked ? 1 : 0);
    }
    
    return (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-slate-700">{facility.name}</span>
                {isAdmin && (
                    <div className="flex items-center space-x-3">
                        <button onClick={() => onEdit(facility)} className="text-slate-400 hover:text-blue-500"><EditIcon className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(facility.id)} className="text-slate-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                )}
            </div>
            
            {isCapability ? (
                 <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={facility.available === 1} onChange={handleCapabilityToggle} className="h-5 w-5 rounded text-red-500 focus:ring-red-500" />
                    <span className={`font-medium ${facility.available ? 'text-green-600' : 'text-slate-500'}`}>
                        {facility.available ? 'Available' : 'Unavailable'}
                    </span>
                </label>
            ) : (
                <>
                    <div className="flex items-center space-x-3">
                        <input
                            type="number"
                            value={facility.available}
                            onChange={handleAvailableChange}
                            className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                            min="0"
                            max={facility.total}
                        />
                        <span className="text-slate-500 font-medium whitespace-nowrap">/ {facility.total}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }} title={`${statusText} (${percentage.toFixed(0)}%)`}></div>
                    </div>
                </>
            )}
        </div>
    );
};

const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void; }> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);


const ManagementPortal: React.FC<ManagementPortalProps> = ({ hospital, userRole, onUpdate }) => {
    const [currentHospital, setCurrentHospital] = useState(hospital);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
    const [isAddingFacility, setIsAddingFacility] = useState(false);

    const isAdmin = userRole === UserRole.Admin;

    useEffect(() => {
        setCurrentHospital(hospital);
    }, [hospital]);

    const debouncedUpdate = useDebounce((updatedHospital: Hospital) => {
        onUpdate(updatedHospital);
        setSaveStatus('saved');
    }, 1500);

    const triggerUpdate = (updatedHospital: Hospital) => {
        setCurrentHospital(updatedHospital);
        setSaveStatus('saving');
        debouncedUpdate(updatedHospital);
    }

    const handleAvailableChange = (facilityId: string, available: number) => {
        const updatedFacilities = currentHospital.facilities.map(f => 
            f.id === facilityId ? { ...f, available } : f
        );
        triggerUpdate({ ...currentHospital, facilities: updatedFacilities });
    };

    const handleDetailsSave = (updatedDetails: Partial<Hospital>) => {
        triggerUpdate({ ...currentHospital, ...updatedDetails });
        setIsEditingDetails(false);
    };

    const handleFacilitySave = (updatedFacility: Facility) => {
        const updatedFacilities = currentHospital.facilities.map(f => 
            f.id === updatedFacility.id ? updatedFacility : f
        );
        triggerUpdate({ ...currentHospital, facilities: updatedFacilities });
        setEditingFacility(null);
    };

    const handleFacilityAdd = (newFacility: Omit<Facility, 'id'>) => {
        const facilityWithId: Facility = { ...newFacility, id: `custom-${Date.now()}` };
        const updatedFacilities = [...currentHospital.facilities, facilityWithId];
        triggerUpdate({ ...currentHospital, facilities: updatedFacilities });
        setIsAddingFacility(false);
    }

    const handleFacilityDelete = (facilityId: string) => {
        if(window.confirm("Are you sure you want to delete this facility? This action cannot be undone.")) {
            const updatedFacilities = currentHospital.facilities.filter(f => f.id !== facilityId);
            triggerUpdate({ ...currentHospital, facilities: updatedFacilities });
        }
    }

    const timeAgo = (date: string) => {
       const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
       if (seconds < 5) return "just now";
       return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-seconds, 'second');
    }
    
    return (
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 bg-slate-50 border-b border-slate-200">
                     <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{currentHospital.name}</h2>
                            <p className="text-slate-500 mt-2 flex items-start space-x-2"><MapPinIcon className="w-4 h-4 mt-1 flex-shrink-0" /><span>{currentHospital.address}</span></p>
                            <p className="text-slate-500 mt-2 flex items-center space-x-2"><PhoneIcon className="w-4 h-4" /><span>{currentHospital.phone}</span></p>
                            <p className="text-slate-500 mt-2 flex items-center space-x-2"><EmailIcon className="w-4 h-4" /><span>{currentHospital.email}</span></p>
                        </div>
                        {isAdmin && (
                            <button onClick={() => setIsEditingDetails(true)} className="flex items-center space-x-2 text-sm font-semibold bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-50 transition">
                                <EditIcon className="w-4 h-4" />
                                <span>Edit Info</span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Facilities Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentHospital.facilities.map(facility => (
                            <FacilityRow 
                                key={facility.id} 
                                facility={facility}
                                onAvailableChange={handleAvailableChange}
                                isAdmin={isAdmin}
                                onEdit={setEditingFacility}
                                onDelete={handleFacilityDelete}
                            />
                        ))}
                        {isAdmin && (
                            <button onClick={() => setIsAddingFacility(true)} className="flex flex-col items-center justify-center space-y-2 text-slate-500 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-100 hover:border-red-400 hover:text-red-500 transition-colors py-12">
                                <PlusCircleIcon className="w-8 h-8" />
                                <span className="font-semibold">Add New Facility</span>
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-6 border-t border-slate-200">
                         <p className="text-sm text-slate-500 mb-4 sm:mb-0">
                            Last updated: <span className="font-semibold">{timeAgo(hospital.lastUpdated)}</span>
                        </p>
                        <div>
                            {saveStatus === 'saving' && <span className="text-sm text-slate-500">Saving...</span>}
                            {saveStatus === 'saved' && <span className="text-sm text-green-600 flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1"/> All changes saved</span>}
                        </div>
                    </div>
                </div>
            </div>

            {isEditingDetails && (
                <HospitalDetailsEditor hospital={currentHospital} onSave={handleDetailsSave} onClose={() => setIsEditingDetails(false)} />
            )}
            {editingFacility && (
                <FacilityEditor facility={editingFacility} onSave={handleFacilitySave} onClose={() => setEditingFacility(null)} />
            )}
            {isAddingFacility && (
                <FacilityEditor onSave={handleFacilityAdd} onClose={() => setIsAddingFacility(false)} />
            )}
        </div>
    );
};

const HospitalDetailsEditor: React.FC<{ hospital: Hospital, onSave: (details: Partial<Hospital>) => void, onClose: () => void }> = ({ hospital, onSave, onClose }) => {
    const [form, setForm] = useState({ name: hospital.name, address: hospital.address, phone: hospital.phone, email: hospital.email, lat: hospital.location.lat, lon: hospital.location.lon });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name: form.name, address: form.address, phone: form.phone, email: form.email, location: { lat: +form.lat, lon: +form.lon } });
    }

    return (
        <Modal title="Edit Hospital Information" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Hospital Name" name="name" value={form.name} onChange={handleChange} />
                <InputField label="Address" name="address" value={form.address} onChange={handleChange} />
                <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Latitude" name="lat" type="number" value={form.lat} onChange={handleChange} />
                    <InputField label="Longitude" name="lon" type="number" value={form.lon} onChange={handleChange} />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Save Changes</button>
                </div>
            </form>
             <style>{`.btn-primary { background-color: #ef4444; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; } .btn-secondary { background-color: #e2e8f0; color: #1e293b; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; }`}</style>
        </Modal>
    );
};

const FacilityEditor: React.FC<{ facility?: Facility, onSave: (facility: any) => void, onClose: () => void }> = ({ facility, onSave, onClose }) => {
    const [form, setForm] = useState({ name: facility?.name || '', total: facility?.total || 0 });
    const isNew = !facility;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'total' ? parseInt(value, 10) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNew) {
            onSave({ ...form, available: form.total });
        } else {
            onSave({ ...facility, ...form });
        }
    }

    return (
        <Modal title={isNew ? "Add New Facility" : "Edit Facility"} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Facility Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g., MRI Machines" />
                <InputField label="Total Capacity" name="total" type="number" value={form.total} onChange={handleChange} />
                <p className="text-xs text-slate-500">For capabilities like 'Surgery', set Total Capacity to 1.</p>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Save Facility</button>
                </div>
            </form>
            <style>{`.btn-primary { background-color: #ef4444; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; } .btn-secondary { background-color: #e2e8f0; color: #1e293b; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; }`}</style>
        </Modal>
    )
}

const InputField: React.FC<{ label: string, name: string, value: any, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string }> = ({ label, name, value, onChange, type = 'text', placeholder }) => (
    <div>
        <label className="text-sm font-medium text-slate-600 block mb-1">{label}</label>
        <input 
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            step={type === 'number' ? 'any' : undefined}
            className="bg-slate-100 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
            required
        />
    </div>
);


export default ManagementPortal;