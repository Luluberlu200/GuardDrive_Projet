import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../services/api';

export type Vehicle = {
  _id: string;
  name: string;
  fuel: number;
  battery: number;
  lock: 'locked' | 'unlocked';
  tirePressure: number;
  temperature: number;
  lastService: string;
  nextService: string;
};

type VehicleContextType = {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  setActiveId: (id: string) => void;
  addVehicle: (name: string) => Promise<boolean>;
  deleteVehicle: (id: string) => Promise<boolean>;
  loading: boolean;
};

const VehicleContext = createContext<VehicleContextType | null>(null);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeId, setActiveIdState] = useState<string | null>(
    () => localStorage.getItem('activeVehicleId')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vehicle').then((data: Vehicle[]) => {
      setVehicles(data);
      setLoading(false);
      if (data.length > 0 && !data.find(v => v._id === activeId)) {
        const firstId = data[0]._id;
        setActiveIdState(firstId);
        localStorage.setItem('activeVehicleId', firstId);
      }
    });
  }, []);

  function setActiveId(id: string) {
    setActiveIdState(id);
    localStorage.setItem('activeVehicleId', id);
  }

  async function addVehicle(name: string): Promise<boolean> {
    const data = await api.post('/vehicle', { name });
    if (!data._id) return false;
    setVehicles(prev => [...prev, data]);
    return true;
  }

  async function deleteVehicle(id: string): Promise<boolean> {
    const data = await api.delete(`/vehicle/${id}`);
    if (!data.message) return false;
    setVehicles(prev => {
      const next = prev.filter(v => v._id !== id);
      if (activeId === id && next.length > 0) setActiveId(next[0]._id);
      return next;
    });
    return true;
  }

  const activeVehicle = vehicles.find(v => v._id === activeId) ?? vehicles[0] ?? null;

  return (
    <VehicleContext.Provider value={{ vehicles, activeVehicle, setActiveId, addVehicle, deleteVehicle, loading }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicle() {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error('useVehicle doit être utilisé dans VehicleProvider');
  return ctx;
}
