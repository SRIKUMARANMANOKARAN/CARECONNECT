import React from 'react';
// FIX: Import Facility type.
import { Hospital, ResourceStatus, Facility } from '../types';
import { BedIcon, IcuIcon, OxygenIcon, MapPinIcon, VentilatorIcon, DoctorIcon, MedicineIcon, AttendantIcon, PhoneIcon, EmailIcon, SurgeryIcon, BloodIcon, TraumaIcon, PediatricIcon } from './Icons';

interface HospitalCardProps {
    hospital: Hospital;
    distance?: number;
}

// FIX: Access facilities from the facilities array instead of directly on the hospital object.
const getOverallStatus = (hospital: Hospital): ResourceStatus => {
    const getFacility = (id: string): Facility | undefined => hospital.facilities.find(f => f.id === id);

    const beds = getFacility('beds');
    const icu = getFacility('icu');
    const doctors = getFacility('doctors');

    const bedPercent = beds && beds.total > 0 ? beds.available / beds.total : 1;
    const icuPercent = icu && icu.total > 0 ? icu.available / icu.total : 1;
    const doctorsPercent = doctors && doctors.total > 0 ? doctors.available / doctors.total : 1;

    const criticalMetric = Math.min(bedPercent, icuPercent, doctorsPercent);

    if (criticalMetric < 0.1) return ResourceStatus.Critical;
    if (criticalMetric < 0.4) return ResourceStatus.Low;
    return ResourceStatus.Good;
};

const statusStyles = {
    [ResourceStatus.Good]: {
        borderColor: 'border-green-500',
        textColor: 'text-green-600',
        bgColor: 'bg-green-100'
    },
    [ResourceStatus.Low]: {
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
    },
    [ResourceStatus.Critical]: {
        borderColor: 'border-red-500',
        textColor: 'text-red-600',
        bgColor: 'bg-red-100'
    },
};


const ResourceItem: React.FC<{ icon: React.ReactNode, label: string, available: number, total: number }> = ({ icon, label, available, total }) => {
    const percentage = total > 0 ? (available / total) * 100 : 0;
    let color = 'bg-green-500';
    if (percentage < 40) color = 'bg-yellow-500';
    if (percentage < 10) color = 'bg-red-500';

    return (
        <div className="text-sm">
            <div className="flex items-center space-x-2 text-slate-600 mb-1">
                {icon}
                <span>{label}</span>
                <span className="font-bold text-slate-800 ml-auto">{available} <span className="text-slate-500 font-normal">/ {total}</span></span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className={`${color} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const CapabilityIcon: React.FC<{ icon: React.ReactNode, label: string, available: boolean }> = ({ icon, label, available }) => (
    <div className="flex flex-col items-center space-y-1 text-center" title={label}>
        <div className={`${available ? 'text-green-600' : 'text-slate-300'}`}>
            {icon}
        </div>
        <span className={`text-[10px] font-semibold tracking-tighter ${available ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
    </div>
);


const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, distance }) => {
    const status = getOverallStatus(hospital);
    const styles = statusStyles[status];

    // FIX: Helper to find facility data. This avoids errors from trying to access properties that don't exist on the Hospital type.
    const getFacility = (id: string) => hospital.facilities.find(f => f.id === id) || { available: 0, total: 0 };
    const getCapability = (id: string) => (hospital.facilities.find(f => f.id === id)?.available ?? 0) > 0;

    return (
        <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 ${styles.borderColor} overflow-hidden flex flex-col`}>
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{hospital.name}</h3>
                        {distance !== undefined && (
                            <p className="text-sm font-semibold text-slate-600 mt-1">
                                {distance.toFixed(1)} km away
                            </p>
                        )}
                        <p className="text-sm text-slate-500 flex items-start space-x-1.5 mt-1">
                            <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{hospital.address}</span>
                        </p>
                         <p className="text-sm text-slate-500 flex items-center space-x-1.5 mt-1">
                            <PhoneIcon className="w-4 h-4 flex-shrink-0" />
                            <span>{hospital.phone}</span>
                        </p>
                         <p className="text-sm text-slate-500 flex items-center space-x-1.5 mt-1">
                            <EmailIcon className="w-4 h-4 flex-shrink-0" />
                            <span>{hospital.email}</span>
                        </p>
                    </div>
                    <div className={`text-xs font-bold px-3 py-1 rounded-full ${styles.bgColor} ${styles.textColor} flex-shrink-0 ml-2`}>
                        {status}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-x-4 gap-y-3">
                    {/* FIX: Use helper to get correct facility data. */}
                    <ResourceItem icon={<BedIcon className="w-5 h-5"/>} label="Beds" available={getFacility('beds').available} total={getFacility('beds').total} />
                    <ResourceItem icon={<IcuIcon className="w-5 h-5"/>} label="ICU" available={getFacility('icu').available} total={getFacility('icu').total} />
                    <ResourceItem icon={<DoctorIcon className="w-5 h-5"/>} label="Doctors" available={getFacility('doctors').available} total={getFacility('doctors').total} />
                    <ResourceItem icon={<OxygenIcon className="w-5 h-5"/>} label="Oxygen" available={getFacility('oxygen').available} total={getFacility('oxygen').total} />
                    <ResourceItem icon={<MedicineIcon className="w-5 h-5"/>} label="Medicine" available={getFacility('medicines').available} total={getFacility('medicines').total} />
                    <ResourceItem icon={<AttendantIcon className="w-5 h-5"/>} label="Staff" available={getFacility('attendants').available} total={getFacility('attendants').total} />
                </div>
            </div>
             <div className="px-5 py-3 bg-slate-50 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Emergency Capabilities</h4>
                 <div className="flex items-center justify-around text-slate-600">
                    {/* FIX: Use helper to get correct capability data. */}
                    <CapabilityIcon icon={<SurgeryIcon className="w-5 h-5"/>} label="Surgery" available={getCapability('surgery')} />
                    <CapabilityIcon icon={<BloodIcon className="w-5 h-5"/>} label="Blood Bank" available={getCapability('blood_bank')} />
                    <CapabilityIcon icon={<TraumaIcon className="w-5 h-5"/>} label="Trauma" available={getCapability('trauma')} />
                    <CapabilityIcon icon={<PediatricIcon className="w-5 h-5"/>} label="Peds ICU" available={getCapability('pediatric_icu')} />
                 </div>
            </div>
        </div>
    );
};

export default HospitalCard;