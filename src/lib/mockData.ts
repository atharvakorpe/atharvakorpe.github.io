
import { ParkingLevel, ParkingSlot, Vehicle, ParkingRequest } from '@/types';

// Generate random parking slot
const generateParkingSlot = (level: number, slotNumber: number, isOccupied: boolean = false): ParkingSlot => {
  return {
    id: `l${level}-s${slotNumber}`,
    level,
    slotNumber: `${level}-${slotNumber.toString().padStart(2, '0')}`,
    isOccupied,
    vehicleId: isOccupied ? `v-${Math.floor(Math.random() * 1000)}` : undefined,
  };
};

// Generate mock vehicles
const generateMockVehicles = (count: number): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  const statuses: Array<'parked' | 'exited' | 'pending'> = ['parked', 'exited', 'pending'];
  
  for (let i = 0; i < count; i++) {
    const entryTime = new Date(Date.now() - Math.floor(Math.random() * 86400000));
    const isOverstay = Math.random() > 0.7; // 30% chance of being overstay
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    vehicles.push({
      id: `v-${i + 1}`,
      licensePlate: `ABC-${Math.floor(Math.random() * 1000)}`,
      driverName: `Driver ${i + 1}`,
      entryTime: entryTime.toISOString(),
      expectedExitTime: new Date(entryTime.getTime() + 3600000).toISOString(),
      exitTime: status === 'exited' ? new Date(entryTime.getTime() + 7200000).toISOString() : undefined,
      isOverstay,
      slotId: status === 'parked' ? `l${Math.floor(Math.random() * 3) + 1}-s${Math.floor(Math.random() * 20) + 1}` : undefined,
      status,
    });
  }
  
  return vehicles;
};

// Generate mock requests
const generateMockRequests = (vehicles: Vehicle[]): ParkingRequest[] => {
  const pendingVehicles = vehicles.filter(v => v.status === 'pending');
  const requests: ParkingRequest[] = [];
  
  pendingVehicles.forEach((vehicle, index) => {
    requests.push({
      id: `req-${index + 1}`,
      requestTime: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
      vehicle,
      requestedBy: 'Security Staff',
      status: 'pending',
    });
  });
  
  // Add some approved and rejected requests
  for (let i = 0; i < 5; i++) {
    const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const status = Math.random() > 0.5 ? 'approved' : 'rejected';
    
    requests.push({
      id: `req-${pendingVehicles.length + i + 1}`,
      requestTime: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
      vehicle: randomVehicle,
      requestedBy: 'Security Staff',
      status: status as 'approved' | 'rejected',
      approvedBy: 'Admin User',
      approvalTime: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
    });
  }
  
  return requests;
};

// Generate parking levels with slots
const generateParkingLevels = (vehicles: Vehicle[]): ParkingLevel[] => {
  const parkedVehicles = vehicles.filter(v => v.status === 'parked');
  const levels: ParkingLevel[] = [];
  
  for (let level = 1; level <= 3; level++) {
    const totalSlots = 20;
    const occupiedSlots = Math.floor(Math.random() * (totalSlots - 5)) + 5; // At least 5 slots occupied
    const slots: ParkingSlot[] = [];
    
    // Generate occupied slots
    for (let slotNum = 1; slotNum <= occupiedSlots; slotNum++) {
      slots.push(generateParkingSlot(level, slotNum, true));
    }
    
    // Generate empty slots
    for (let slotNum = occupiedSlots + 1; slotNum <= totalSlots; slotNum++) {
      slots.push(generateParkingSlot(level, slotNum, false));
    }
    
    levels.push({
      level,
      totalSlots,
      occupiedSlots,
      slots,
    });
  }
  
  return levels;
};

export const generateMockData = () => {
  const vehicles = generateMockVehicles(30);
  const requests = generateMockRequests(vehicles);
  const parkingLevels = generateParkingLevels(vehicles);
  
  return {
    vehicles,
    requests,
    parkingLevels,
  };
};
