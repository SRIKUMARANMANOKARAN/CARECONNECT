import { Hospital, UserRole, Coordinates } from './types';

export const USER_COORDINATES: Coordinates = { lat: 34.0522, lon: -118.2437 }; // Mock user location (Los Angeles)

const createFacilities = (available: any, total: any, capabilities: any) => [
    { id: 'beds', name: 'Beds', available: available.beds, total: total.beds },
    { id: 'icu', name: 'ICU Beds', available: available.icu, total: total.icu },
    { id: 'ventilators', name: 'Ventilators', available: available.ventilators, total: total.ventilators },
    { id: 'oxygen', name: 'Oxygen (Liters)', available: available.oxygen, total: total.oxygen },
    { id: 'doctors', name: 'Doctors', available: available.doctors, total: total.doctors },
    { id: 'medicines', name: 'Medicines (%)', available: available.medicines, total: total.medicines },
    { id: 'attendants', name: 'Attendants', available: available.attendants, total: total.attendants },
    { id: 'surgery', name: 'Surgery Capability', available: capabilities.emergencySurgeryCapability ? 1 : 0, total: 1 },
    { id: 'blood_bank', name: 'Blood Bank', available: capabilities.bloodBankAvailability ? 1 : 0, total: 1 },
    { id: 'trauma', name: 'Trauma Care', available: capabilities.traumaCare ? 1 : 0, total: 1 },
    { id: 'pediatric_icu', name: 'Pediatric & Neonatal ICU', available: capabilities.pediatricNeonatalICU ? 1 : 0, total: 1 },
];

export const MOCK_HOSPITALS: Hospital[] = [
    {
        id: 1,
        name: "St. Mary's Medical Center",
        address: "123 Health St, Los Angeles, CA",
        phone: "555-0101",
        email: "emergency@stmarys.org",
        location: { lat: 34.0622, lon: -118.2537 },
        facilities: createFacilities(
            { beds: 25, icu: 5, ventilators: 3, oxygen: 4000, doctors: 12, medicines: 80, attendants: 30 },
            { beds: 50, icu: 10, ventilators: 8, oxygen: 10000, doctors: 20, medicines: 100, attendants: 40 },
            { emergencySurgeryCapability: true, bloodBankAvailability: true, traumaCare: true, pediatricNeonatalICU: false }
        ),
        lastUpdated: new Date().toISOString(),
    },
    {
        id: 2,
        name: "City General Hospital",
        address: "456 Wellness Ave, Los Angeles, CA",
        phone: "555-0102",
        email: "contact@citygeneral.org",
        location: { lat: 34.0422, lon: -118.2337 },
        facilities: createFacilities(
            { beds: 8, icu: 1, ventilators: 1, oxygen: 1500, doctors: 5, medicines: 30, attendants: 15 },
            { beds: 40, icu: 8, ventilators: 5, oxygen: 8000, doctors: 15, medicines: 100, attendants: 30 },
            { emergencySurgeryCapability: true, bloodBankAvailability: false, traumaCare: true, pediatricNeonatalICU: true }
        ),
        lastUpdated: new Date().toISOString(),
    },
    {
        id: 3,
        name: "Community Health Clinic",
        address: "789 Hope Blvd, Los Angeles, CA",
        phone: "555-0103",
        email: "info@communityhealth.org",
        location: { lat: 34.0555, lon: -118.2699 },
        facilities: createFacilities(
            { beds: 45, icu: 9, ventilators: 8, oxygen: 9500, doctors: 18, medicines: 95, attendants: 38 },
            { beds: 60, icu: 12, ventilators: 10, oxygen: 12000, doctors: 22, medicines: 100, attendants: 45 },
            { emergencySurgeryCapability: true, bloodBankAvailability: true, traumaCare: true, pediatricNeonatalICU: true }
        ),
        lastUpdated: new Date().toISOString(),
    },
     {
        id: 4,
        name: "Metro Central Hospital",
        address: "101 Downtown Cir, Los Angeles, CA",
        phone: "555-0104",
        email: "ops@metrocentral.org",
        location: { lat: 34.0500, lon: -118.2400 },
        facilities: createFacilities(
            { beds: 3, icu: 0, ventilators: 0, oxygen: 500, doctors: 1, medicines: 15, attendants: 5 },
            { beds: 30, icu: 5, ventilators: 5, oxygen: 5000, doctors: 10, medicines: 100, attendants: 20 },
            { emergencySurgeryCapability: false, bloodBankAvailability: false, traumaCare: true, pediatricNeonatalICU: false }
        ),
        lastUpdated: new Date().toISOString(),
    },
];

export const USER_CREDENTIALS: Record<UserRole, { username: string; password: string }> = {
    [UserRole.Admin]: { username: "admin", password: "123" },
    [UserRole.Doctor]: { username: "doctor", password: "123" },
    [UserRole.Coordinator]: { username: "coordinator", password: "123" },
};
