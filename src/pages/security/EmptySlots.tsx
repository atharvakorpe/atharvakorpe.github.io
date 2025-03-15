
import React from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, CircleParking, Building } from 'lucide-react';

const EmptySlots = () => {
  const { parkingLevels } = useParking();
  
  // Get total available slots across all levels
  const totalAvailableSlots = parkingLevels.reduce(
    (total, level) => total + level.slots.filter(slot => !slot.isOccupied).length, 
    0
  );
  
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
        {parkingLevels.map((level) => {
          const emptySlotCount = level.slots.filter(slot => !slot.isOccupied).length;
          
          return (
            <Card key={level.level}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    <span>Level {level.level} Parking</span>
                  </div>
                  <span className="text-sm font-normal bg-gray-100 px-3 py-1 rounded-full">
                    {emptySlotCount} / {level.totalSlots} Available
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {emptySlotCount > 0 ? (
                  <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
                    <div className="bg-gray-50 p-4 rounded-full inline-block mb-3">
                      <CircleParking className="h-8 w-8 text-parking-empty" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Empty Slots Available</h3>
                    <div className="text-3xl font-bold text-green-600 mb-2">{emptySlotCount}</div>
                    <p className="text-gray-500">Parking spaces available on this level</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No available slots on this level</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EmptySlots;
