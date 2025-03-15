
import React from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { ParkingSlot } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Car, CircleParking } from 'lucide-react';

const EmptySlots = () => {
  const { parkingLevels } = useParking();
  
  // Group slots by level
  const slotsByLevel = parkingLevels.reduce<Record<number, ParkingSlot[]>>(
    (acc, level) => {
      acc[level.level] = level.slots.filter(slot => !slot.isOccupied);
      return acc;
    }, 
    {}
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Empty Parking Slots</h1>
        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
          <CircleParking className="h-4 w-4 text-parking-empty" />
          <span className="text-sm font-medium">
            {parkingLevels.reduce((total, level) => 
              total + level.slots.filter(slot => !slot.isOccupied).length, 0
            )} Available
          </span>
        </div>
      </div>
      
      <Tabs defaultValue={`${parkingLevels[0]?.level || '1'}`}>
        <TabsList className="mb-4">
          {parkingLevels.map((level) => (
            <TabsTrigger key={level.level} value={`${level.level}`}>
              Level {level.level}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {parkingLevels.map((level) => (
          <TabsContent key={level.level} value={`${level.level}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Level {level.level} Parking</span>
                  <span className="text-sm font-normal bg-gray-100 px-3 py-1 rounded-full">
                    {level.totalSlots - level.occupiedSlots} / {level.totalSlots} Available
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {level.slots
                    .filter(slot => !slot.isOccupied)
                    .map((slot) => (
                      <div 
                        key={slot.id}
                        className="bg-white border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center h-24 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <Car className="h-6 w-6 text-parking-empty mb-2" />
                        <span className="font-semibold">Slot {slot.slotNumber}</span>
                        <span className="text-xs text-gray-500">Available</span>
                      </div>
                    ))
                  }
                </div>
                
                {level.slots.filter(slot => !slot.isOccupied).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No empty slots available on this level</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default EmptySlots;
