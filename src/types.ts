export interface Car {
  id: string;
  agencyId: string;
  make: string;
  model: string;
  year: number;
  registrationPlate: string;
  status: 'available' | 'rented' | 'maintenance';
  dailyRate: number;
  imageUrl?: string;
}

export interface Client {
  id: string;
  agencyId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  cin: string; // Carte d'Identité Nationale
  driverLicense: string;
}

export interface Reservation {
  id: string;
  agencyId: string;
  carId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Agency {
  id: string;
  name: string;
  address: string;
  phone: string;
}
