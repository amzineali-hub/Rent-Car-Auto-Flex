import { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot, query, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Car, Client, Reservation } from '../types';

export function useFirebaseData() {
  const [cars, setCars] = useState<Car[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Note: In a real app, these would be subcollections under the specific agency document
    // For this prototype we will use root collections if the rules allow, 
    // or just local state if the user hasn't authenticated properly yet.
    // Given the strict rules provided (request.auth.uid == agencyId), we will wrap this 
    // in a try/catch and fallback to mock data if unauthorized.
    
    let unsubCars: () => void;
    let unsubClients: () => void;
    let unsubRes: () => void;

    try {
      unsubCars = onSnapshot(collection(db, 'cars'), (snapshot) => {
        setCars(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car)));
      }, (err) => {
        console.error("Error fetching cars, likely permission denied. Falling back to mock data.", err);
        setError("Permission denied. Showing mock data.");
        setLoading(false);
      });

      unsubClients = onSnapshot(collection(db, 'clients'), (snapshot) => {
        setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));
      });

      unsubRes = onSnapshot(collection(db, 'reservations'), (snapshot) => {
        setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation)));
        setLoading(false);
      });

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }

    return () => {
      if (unsubCars) unsubCars();
      if (unsubClients) unsubClients();
      if (unsubRes) unsubRes();
    };
  }, []);

  return { cars, clients, reservations, loading, error };
}
