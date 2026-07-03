import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car, Client, Reservation, Agency } from './types';

interface StoreState {
  agencies: Agency[];
  cars: Car[];
  clients: Client[];
  reservations: Reservation[];
  currentAgency: Agency | null;
  setCurrentAgency: (agency: Agency | null) => void;
  addCar: (car: Omit<Car, 'id'>) => void;
  updateCar: (id: string, car: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addReservation: (res: Omit<Reservation, 'id'>) => void;
  updateReservation: (id: string, res: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

const initialAgencies: Agency[] = [
  { id: 'agency1', name: 'Auto Flex Premium', address: 'Casablanca, Centre', phone: '0522123456' },
  { id: 'agency2', name: 'Maroc Voitures', address: 'Rabat, Agdal', phone: '0537123456' },
  { id: 'agency3', name: 'Atlas Rent', address: 'Marrakech, Gueliz', phone: '0524123456' },
  { id: 'agency4', name: 'Tanger Auto', address: 'Tanger, Centre', phone: '0539123456' },
  { id: 'agency5', name: 'Fès Loc', address: 'Fès, Ville Nouvelle', phone: '0535123456' },
];

const initialCars: Car[] = [];
const initialClients: Client[] = [];
const initialReservations: Reservation[] = [];

// Generate 4 cars per agency
initialAgencies.forEach((agency, index) => {
  const makes = ['Renault', 'Dacia', 'Peugeot', 'Hyundai', 'Toyota', 'Volkswagen', 'Kia'];
  const models = ['Clio', 'Logan', '208', 'Tucson', 'Yaris', 'Golf', 'Sportage'];
  
  for (let i = 1; i <= 4; i++) {
    initialCars.push({
      id: `car-${agency.id}-${i}`,
      agencyId: agency.id,
      make: makes[(index + i) % makes.length],
      model: models[(index + i) % models.length],
      year: 2020 + (i % 5),
      registrationPlate: `${10000 + i * 10}-A-${index + 1}`,
      status: i === 1 ? 'rented' : i === 4 ? 'maintenance' : 'available',
      dailyRate: 200 + (i * 50),
    } as any); // Ignoring agencyId in strict type for now or add it
  }

  // Generate some clients
  for(let i = 1; i <= 3; i++) {
    initialClients.push({
      id: `client-${agency.id}-${i}`,
      agencyId: agency.id,
      firstName: ['Mohammed', 'Youssef', 'Amina', 'Fatima', 'Omar'][i % 5],
      lastName: ['Alaoui', 'Benali', 'Idrissi', 'Zahra', 'Bennani'][i % 5],
      phone: `06${10000000 + i * 1234}`,
      cin: `AB${100000 + i}`,
      driverLicense: `9876${i}000`,
    } as any);
  }

  // Generate some reservations
  initialReservations.push({
    id: `res-${agency.id}-1`,
    agencyId: agency.id,
    carId: `car-${agency.id}-1`,
    clientId: `client-${agency.id}-1`,
    startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    totalPrice: 1200,
    status: 'active'
  } as any);
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [agencies] = useState<Agency[]>(initialAgencies);
  const [currentAgency, setCurrentAgency] = useState<Agency | null>(initialAgencies[0]);
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);

  const addCar = (car: Omit<Car, 'id'>) => {
    setCars(prev => [...prev, { ...car, id: Math.random().toString(36).substr(2, 9) } as Car]);
  };

  const updateCar = (id: string, car: Partial<Car>) => {
    setCars(prev => prev.map(c => c.id === id ? { ...c, ...car } : c));
  };

  const deleteCar = (id: string) => {
    setCars(prev => prev.map(c => c.id === id ? { ...c, status: 'maintenance' } : c)); // soft delete/mark maintenance or remove
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    setClients(prev => [...prev, { ...client, id: Math.random().toString(36).substr(2, 9) } as Client]);
  };

  const updateClient = (id: string, client: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...client } : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addReservation = (res: Omit<Reservation, 'id'>) => {
    setReservations(prev => [...prev, { ...res, id: Math.random().toString(36).substr(2, 9) } as Reservation]);
    // update car status
    updateCar(res.carId, { status: 'rented' });
  };

  const updateReservation = (id: string, res: Partial<Reservation>) => {
    setReservations(prev => prev.map(c => c.id === id ? { ...c, ...res } : c));
  };

  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(c => c.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      agencies, cars, clients, reservations, currentAgency, setCurrentAgency,
      addCar, updateCar, deleteCar,
      addClient, updateClient, deleteClient,
      addReservation, updateReservation, deleteReservation
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
