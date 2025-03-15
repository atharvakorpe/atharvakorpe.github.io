
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ParkingSlot, Vehicle, ParkingRequest, ParkingLevel } from '@/types';
import { generateMockData } from '@/lib/mockData';

interface ParkingContextType {
  parkingLevels: ParkingLevel[];
  vehicles: Vehicle[];
  requests: ParkingRequest[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  createRequest: (vehicle: Omit<Vehicle, 'id' | 'status'>) => void;
  approveRequest: (requestId: string, userId: string) => void;
  rejectRequest: (requestId: string, userId: string) => void;
  getOverstayVehicles: () => Vehicle[];
  getPendingRequests: () => ParkingRequest[];
  getEmptySlots: () => ParkingSlot[];
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [parkingData, setParkingData] = useState<{
    parkingLevels: ParkingLevel[];
    vehicles: Vehicle[];
    requests: ParkingRequest[];
  }>({ parkingLevels: [], vehicles: [], requests: [] });

  useEffect(() => {
    // Initialize with mock data
    const mockData = generateMockData();
    setParkingData(mockData);
  }, []);

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `v-${Date.now()}`,
    };

    setParkingData((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle],
    }));
  };

  const createRequest = (vehicleData: Omit<Vehicle, 'id' | 'status'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `v-${Date.now()}`,
      status: 'pending',
      isOverstay: false,
    };

    const newRequest: ParkingRequest = {
      id: `req-${Date.now()}`,
      requestTime: new Date().toISOString(),
      vehicle: newVehicle,
      requestedBy: 'Security Staff',
      status: 'pending',
    };

    setParkingData((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle],
      requests: [...prev.requests, newRequest],
    }));
  };

  const approveRequest = (requestId: string, userId: string) => {
    setParkingData((prev) => {
      const updatedRequests = prev.requests.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'approved' as const,
            approvedBy: userId,
            approvalTime: new Date().toISOString(),
          };
        }
        return req;
      });

      // Find the request and update the vehicle status
      const request = prev.requests.find((req) => req.id === requestId);
      let updatedVehicles = [...prev.vehicles];

      if (request) {
        updatedVehicles = updatedVehicles.map((v) => {
          if (v.id === request.vehicle.id) {
            return {
              ...v,
              status: 'parked' as const,
            };
          }
          return v;
        });
      }

      return {
        ...prev,
        requests: updatedRequests,
        vehicles: updatedVehicles,
      };
    });
  };

  const rejectRequest = (requestId: string, userId: string) => {
    setParkingData((prev) => {
      const updatedRequests = prev.requests.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'rejected' as const,
            approvedBy: userId,
            approvalTime: new Date().toISOString(),
          };
        }
        return req;
      });

      return {
        ...prev,
        requests: updatedRequests,
      };
    });
  };

  const getOverstayVehicles = () => {
    return parkingData.vehicles.filter((v) => v.isOverstay && v.status === 'parked');
  };

  const getPendingRequests = () => {
    return parkingData.requests.filter((r) => r.status === 'pending');
  };

  const getEmptySlots = () => {
    const emptySlots: ParkingSlot[] = [];
    parkingData.parkingLevels.forEach((level) => {
      level.slots.forEach((slot) => {
        if (!slot.isOccupied) {
          emptySlots.push(slot);
        }
      });
    });
    return emptySlots;
  };

  return (
    <ParkingContext.Provider
      value={{
        parkingLevels: parkingData.parkingLevels,
        vehicles: parkingData.vehicles,
        requests: parkingData.requests,
        addVehicle,
        createRequest,
        approveRequest,
        rejectRequest,
        getOverstayVehicles,
        getPendingRequests,
        getEmptySlots,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
