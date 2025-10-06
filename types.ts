export enum UserRole {
  Admin = "Admin",
  Doctor = "Doctor",
  Coordinator = "Emergency Coordinator",
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Facility {
  id: string;
  name: string;
  available: number;
  total: number;
}


export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  location: Coordinates;
  facilities: Facility[];
  lastUpdated: string;
}

export enum ResourceStatus {
    Good = "Good",
    Low = "Low",
    Critical = "Critical",
}
