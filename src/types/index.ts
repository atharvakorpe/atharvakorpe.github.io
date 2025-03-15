
export type UserRole = 'security' | 'admin' | 'superuser';

export interface ParkingSlot {
  id: string;
  level: number;
  slotNumber: string;
  isOccupied: boolean;
  vehicleId?: string;
  entryTime?: string;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  driverName: string;
  entryTime: string;
  expectedExitTime?: string;
  exitTime?: string;
  isOverstay: boolean;
  slotId?: string;
  status: 'parked' | 'exited' | 'pending';
}

export interface ParkingRequest {
  id: string;
  requestTime: string;
  vehicle: Vehicle;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalTime?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface ParkingLevel {
  level: number;
  totalSlots: number;
  occupiedSlots: number;
  slots: ParkingSlot[];
}
