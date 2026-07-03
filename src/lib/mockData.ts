import { useState, useEffect } from 'react';

export function useMockData() {
  const [cars, setCars] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    // Generate some mock data for the UI
    setCars([
      { id: '1', make: 'Renault', model: 'Clio', year: 2023, registrationPlate: '12345-A-1', status: 'available', dailyRate: 250 },
      { id: '2', make: 'Dacia', model: 'Logan', year: 2022, registrationPlate: '67890-B-2', status: 'rented', dailyRate: 200 },
      { id: '3', make: 'Peugeot', model: '208', year: 2024, registrationPlate: '11223-C-3', status: 'available', dailyRate: 300 },
    ]);

    setClients([
      { id: '1', firstName: 'Mohammed', lastName: 'Alaoui', phone: '0612345678', cin: 'AB123456', driverLicense: '98765432' },
      { id: '2', firstName: 'Fatima', lastName: 'Zahra', phone: '0698765432', cin: 'CD987654', driverLicense: '12345678' },
    ]);

    setReservations([
      { id: '1', carId: '2', clientId: '1', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000 * 3).toISOString(), totalPrice: 600, status: 'active' }
    ]);
  }, []);

  return { cars, clients, reservations };
}
