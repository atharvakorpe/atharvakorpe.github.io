
import React from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Car, CircleParking, User } from 'lucide-react';

const EmptySlots = () => {
  const { parkingLevels } = useParking();
  
  // Get total available slots across all levels
  const totalAvailableSlots = parkingLevels.reduce(
    (total, level) => total + level.slots.filter(slot => !slot.isOccupied).length, 
    0
  );
  
  // Group empty slots by tenant for each level
  const getEmptySlotsByTenant = (levelIndex: number) => {
    const level = parkingLevels[levelIndex];
    const emptySlots = level.slots.filter(slot => !slot.isOccupied);
    
    const tenantMap = new Map<string, number>();
    
    emptySlots.forEach(slot => {
      const tenantName = getTenantName(slot.slotNumber);
      const currentCount = tenantMap.get(tenantName) || 0;
      tenantMap.set(tenantName, currentCount + 1);
    });
    
    return Array.from(tenantMap.entries()).map(([tenant, count]) => ({
      tenant,
      count
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Available Parking Slots</h1>
        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
          <CircleParking className="h-4 w-4 text-parking-empty" />
          <span className="text-sm font-medium">
            {totalAvailableSlots} Available
          </span>
        </div>
      </div>
      
      <div className="grid gap-6">
        {parkingLevels.map((level, index) => (
          <Card key={level.level}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span>Level {level.level} Parking</span>
                </div>
                <span className="text-sm font-normal bg-gray-100 px-3 py-1 rounded-full">
                  {level.totalSlots - level.occupiedSlots} / {level.totalSlots} Available
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {level.slots.filter(slot => !slot.isOccupied).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {getEmptySlotsByTenant(index).map((tenantData, idx) => (
                    <div 
                      key={idx}
                      className="bg-white border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center h-28 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="bg-gray-50 p-2 rounded-full mb-2">
                        <User className="h-6 w-6 text-parking-empty" />
                      </div>
                      <span className="font-semibold text-center text-sm">
                        {tenantData.tenant}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {tenantData.count} {tenantData.count === 1 ? 'Slot' : 'Slots'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Car className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No available slots on this level</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper function to generate random tenant names based on slot number
// In a real app, this would come from your database
const getTenantName = (slotNumber: string): string => {
  const tenants = [
    "ABC Corp",
    "Tech Solutions",
    "Horizon Inc",
    "Summit Group",
    "Metro Holdings",
    "Stellar Enterprises",
    "Vertex Systems",
    "Prime Properties",
    "Nexus Partners",
    "Global Transit"
  ];
  
  // Use the slot number to deterministically pick a tenant name
  const index = parseInt(slotNumber.replace(/[^0-9]/g, '')) % tenants.length;
  return tenants[index];
};

export default EmptySlots;
