import React, { useMemo } from 'react';
import { Hospital } from '../types';
import HospitalCard from './HospitalCard';
import { MapPinIcon, AlertTriangleIcon } from './Icons';
import useGeolocation from '../hooks/useGeolocation';
import { calculateDistance } from '../utils';

interface PatientPortalProps {
    hospitals: Hospital[];
}

const PatientPortal: React.FC<PatientPortalProps> = ({ hospitals }) => {
    const { location, loading, error } = useGeolocation();
    
    const hospitalsWithDistance = useMemo(() => {
        if (!location) return [];
        
        return hospitals.map(hospital => ({
            ...hospital,
            distance: calculateDistance(
                location.lat,
                location.lon,
                hospital.location.lat,
                hospital.location.lon
            )
        })).sort((a, b) => a.distance - b.distance);
    }, [hospitals, location]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-slate-800">Find Nearby Hospitals</h2>
                <p className="text-slate-500 mt-1 flex items-center justify-center space-x-2">
                    <MapPinIcon className="w-5 h-5"/>
                    <span>Showing results sorted by distance from your location.</span>
                </p>
            </div>
            
            {loading && (
                <div className="text-center p-8 text-slate-600">
                    <p>Detecting your location...</p>
                </div>
            )}

            {error && (
                 <div className="max-w-md mx-auto bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg" role="alert">
                    <div className="flex">
                        <div className="py-1"><AlertTriangleIcon className="w-6 h-6 text-yellow-500 mr-4"/></div>
                        <div>
                            <p className="font-bold">Could not get your location</p>
                            <p className="text-sm">{error.message}. Please enable location services in your browser.</p>
                        </div>
                    </div>
                </div>
            )}

            {location && !loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {hospitalsWithDistance.map(hospital => (
                        <HospitalCard key={hospital.id} hospital={hospital} distance={hospital.distance} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientPortal;