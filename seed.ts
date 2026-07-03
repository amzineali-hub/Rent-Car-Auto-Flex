import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "giga-emblem-7tgzl",
  appId: "1:533301440265:web:3872cfd6151022c11d2dd8",
  apiKey: "AIzaSyB0xLAnnZb5qmnFU71CzHf_fMtXMNssX9E",
  authDomain: "giga-emblem-7tgzl.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-autoflexmaroc-985887cb-2f10-405e-b523-bbc49e0952c6",
  storageBucket: "giga-emblem-7tgzl.firebasestorage.app",
  messagingSenderId: "533301440265",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const agencies = [
  { id: 'agency1', name: 'Auto Flex Premium', address: 'Casablanca, Centre', phone: '0522123456' },
  { id: 'agency2', name: 'Maroc Voitures', address: 'Rabat, Agdal', phone: '0537123456' },
  { id: 'agency3', name: 'Atlas Rent', address: 'Marrakech, Gueliz', phone: '0524123456' },
  { id: 'agency4', name: 'Tanger Auto', address: 'Tanger, Centre', phone: '0539123456' },
  { id: 'agency5', name: 'Fès Loc', address: 'Fès, Ville Nouvelle', phone: '0535123456' },
];

const carsByAgency = {
  agency1: [
    { id: 'car1', make: 'Renault', model: 'Clio', year: 2023, registrationPlate: '12345-A-1', status: 'available', dailyRate: 250 },
    { id: 'car2', make: 'Dacia', model: 'Logan', year: 2022, registrationPlate: '67890-B-1', status: 'rented', dailyRate: 200 },
    { id: 'car3', make: 'Peugeot', model: '208', year: 2024, registrationPlate: '11223-C-1', status: 'available', dailyRate: 300 },
    { id: 'car4', make: 'Hyundai', model: 'Tucson', year: 2023, registrationPlate: '44556-D-1', status: 'maintenance', dailyRate: 450 },
  ],
  agency2: [
    { id: 'car5', make: 'Fiat', model: 'i10', year: 2022, registrationPlate: '12345-A-2', status: 'available', dailyRate: 250 },
    { id: 'car6', make: 'Dacia', model: 'Duster', year: 2023, registrationPlate: '67890-B-2', status: 'available', dailyRate: 350 },
    { id: 'car7', make: 'Renault', model: 'Megane', year: 2021, registrationPlate: '11223-C-2', status: 'rented', dailyRate: 300 },
    { id: 'car8', make: 'Kia', model: 'Sportage', year: 2024, registrationPlate: '44556-D-2', status: 'available', dailyRate: 500 },
  ],
  agency3: [
    { id: 'car9', make: 'Volkswagen', model: 'Accent', year: 2023, registrationPlate: '12345-A-3', status: 'available', dailyRate: 250 },
    { id: 'car10', make: 'Dacia', model: 'Sandero', year: 2022, registrationPlate: '67890-B-3', status: 'rented', dailyRate: 300 },
    { id: 'car11', make: 'Peugeot', model: '308', year: 2024, registrationPlate: '11223-C-3', status: 'available', dailyRate: 400 },
    { id: 'car12', make: 'Toyota', model: 'Yaris', year: 2023, registrationPlate: '44556-D-3', status: 'available', dailyRate: 350 },
  ],
  agency4: [
    { id: 'car13', make: 'Renault', model: 'Captur', year: 2023, registrationPlate: '12345-A-4', status: 'available', dailyRate: 350 },
    { id: 'car14', make: 'Dacia', model: 'Logan', year: 2022, registrationPlate: '67890-B-4', status: 'available', dailyRate: 200 },
    { id: 'car15', make: 'Citroen', model: 'C3', year: 2024, registrationPlate: '11223-C-4', status: 'rented', dailyRate: 280 },
    { id: 'car16', make: 'Nissan', model: 'Corolla', year: 2023, registrationPlate: '44556-D-4', status: 'available', dailyRate: 300 },
  ],
  agency5: [
    { id: 'car17', make: 'Renault', model: 'Clio', year: 2024, registrationPlate: '12345-A-5', status: 'available', dailyRate: 260 },
    { id: 'car18', make: 'Dacia', model: 'Duster', year: 2023, registrationPlate: '67890-B-5', status: 'rented', dailyRate: 350 },
    { id: 'car19', make: 'Peugeot', model: '208', year: 2022, registrationPlate: '11223-C-5', status: 'available', dailyRate: 280 },
    { id: 'car20', make: 'Jeep', model: 'Picanto', year: 2023, registrationPlate: '44556-D-5', status: 'maintenance', dailyRate: 220 },
  ],
};

const clientsByAgency = {
  agency1: [
    { id: 'client1', firstName: 'Mohammed', lastName: 'Alaoui', phone: '0612345678', cin: 'AB123456', driverLicense: '98765432' },
    { id: 'client2', firstName: 'Fatima', lastName: 'Zahra', phone: '0698765432', cin: 'CD987654', driverLicense: '12345678' },
  ],
  agency2: [
    { id: 'client3', firstName: 'Youssef', lastName: 'Benali', phone: '0611223344', cin: 'EF112233', driverLicense: '87654321' },
    { id: 'client4', firstName: 'Amina', lastName: 'Idrissi', phone: '0655443322', cin: 'GH554433', driverLicense: '23456789' },
  ],
  agency3: [
    { id: 'client5', firstName: 'Hassan', lastName: 'Tazi', phone: '0699887766', cin: 'IJ998877', driverLicense: '34567890' },
  ],
  agency4: [
    { id: 'client6', firstName: 'Khadija', lastName: 'Chraibi', phone: '0622334455', cin: 'KL223344', driverLicense: '45678901' },
  ],
  agency5: [
    { id: 'client7', firstName: 'Omar', lastName: 'Bennani', phone: '0677889900', cin: 'MN778899', driverLicense: '56789012' },
  ],
};

const reservationsByAgency = {
  agency1: [
    { id: 'res1', carId: 'car2', clientId: 'client1', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000 * 3).toISOString(), totalPrice: 600, status: 'active' },
  ],
  agency2: [
    { id: 'res2', carId: 'car7', clientId: 'client3', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000 * 5).toISOString(), totalPrice: 1500, status: 'active' },
  ],
  agency3: [
    { id: 'res3', carId: 'car10', clientId: 'client5', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000 * 2).toISOString(), totalPrice: 600, status: 'active' },
  ],
  agency4: [
    { id: 'res4', carId: 'car15', clientId: 'client6', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000 * 4).toISOString(), totalPrice: 1120, status: 'active' },
  ],
  agency5: [
    { id: 'res5', carId: 'car18', clientId: 'client7', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000 * 7).toISOString(), totalPrice: 2450, status: 'active' },
  ]
};

async function seed() {
  console.log('Seeding...');
  try {
    for (const agency of agencies) {
      await setDoc(doc(db, 'agencies', agency.id), {
        name: agency.name,
        address: agency.address,
        phone: agency.phone,
      });

      const cars = carsByAgency[agency.id as keyof typeof carsByAgency] || [];
      for (const car of cars) {
        await setDoc(doc(db, `agencies/${agency.id}/cars`, car.id), car);
      }

      const clients = clientsByAgency[agency.id as keyof typeof clientsByAgency] || [];
      for (const client of clients) {
        await setDoc(doc(db, `agencies/${agency.id}/clients`, client.id), client);
      }

      const reservations = reservationsByAgency[agency.id as keyof typeof reservationsByAgency] || [];
      for (const res of reservations) {
        await setDoc(doc(db, `agencies/${agency.id}/reservations`, res.id), res);
      }
      
      console.log(`Seeded agency ${agency.name}`);
    }
    console.log('Done seeding!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
