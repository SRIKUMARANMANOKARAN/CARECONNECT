import React from 'react';
import { Hospital } from '../types';
import HospitalCard from './HospitalCard';
import { DriverIcon } from './Icons';

interface DriverPortalProps {
    hospitals: Hospital[];
}

const DriverPortal: React.FC<DriverPortalProps> = ({ hospitals }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
                <DriverIcon className="w-8 h-8 text-slate-600" />
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Ambulance Driver Dashboard</h2>
                    <p className="text-slate-500 text-sm">Real-time hospital availability.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {hospitals.map(hospital => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                ))}
            </div>
        </div>
    );
};

export default DriverPortal;