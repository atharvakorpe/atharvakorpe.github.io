
import React from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { ArrowUp, ArrowDown, CircleParking } from 'lucide-react';
import { cn } from '@/lib/utils';

const Occupancy = () => {
  const { parkingLevels } = useParking();
  
  const totalSlots = parkingLevels.reduce((total, level) => total + level.totalSlots, 0);
  const totalOccupied = parkingLevels.reduce((total, level) => total + level.occupiedSlots, 0);
  const occupancyPercentage = totalSlots > 0 ? Math.round((totalOccupied / totalSlots) * 100) : 0;
  
  // Prepare data for chart
  const chartData = parkingLevels.map(level => ({
    name: `Level ${level.level}`,
    occupied: level.occupiedSlots,
    empty: level.totalSlots - level.occupiedSlots,
  }));
  
  // Determine occupancy status text and color
  let statusText = 'Moderate';
  let statusColor = 'text-yellow-500';
  let statusIcon = <ArrowUp className="h-4 w-4" />;
  
  if (occupancyPercentage < 50) {
    statusText = 'Low';
    statusColor = 'text-green-500';
    statusIcon = <ArrowDown className="h-4 w-4" />;
  } else if (occupancyPercentage > 80) {
    statusText = 'High';
    statusColor = 'text-red-500';
    statusIcon = <ArrowUp className="h-4 w-4" />;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Parking Occupancy Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold">{occupancyPercentage}%</div>
                <div className={cn("flex items-center space-x-1", statusColor)}>
                  {statusIcon}
                  <span className="text-sm font-medium">{statusText}</span>
                </div>
              </div>
              <Progress 
                value={occupancyPercentage} 
                className="h-2 mt-2"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{totalOccupied} occupied</span>
                <span>{totalSlots - totalOccupied} available</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {parkingLevels.map((level) => {
          const levelPercentage = Math.round((level.occupiedSlots / level.totalSlots) * 100);
          
          let levelStatusColor = 'text-yellow-500';
          if (levelPercentage < 50) {
            levelStatusColor = 'text-green-500';
          } else if (levelPercentage > 80) {
            levelStatusColor = 'text-red-500';
          }
          
          return (
            <Card key={level.level}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Level {level.level} Occupancy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{levelPercentage}%</div>
                    <div className={cn("text-sm font-medium", levelStatusColor)}>
                      {level.occupiedSlots}/{level.totalSlots} slots
                    </div>
                  </div>
                  <Progress 
                    value={levelPercentage} 
                    className="h-2 mt-2"
                  />
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{level.occupiedSlots} occupied</span>
                    <span>{level.totalSlots - level.occupiedSlots} available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Occupancy by Level</CardTitle>
          <CardDescription>
            Comparison of occupied and available parking slots across levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupied" stackId="a" fill="#EF4444" name="Occupied Slots" />
                <Bar dataKey="empty" stackId="a" fill="#10B981" name="Available Slots" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Parking Slots Visualization</CardTitle>
          <CardDescription>
            Visual representation of all parking slots across levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {parkingLevels.map((level) => (
              <div key={level.level} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Level {level.level}</h3>
                  <span className="text-sm text-gray-500">
                    {level.occupiedSlots}/{level.totalSlots} occupied
                  </span>
                </div>
                <div className="grid grid-cols-10 gap-2">
                  {level.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={cn(
                        "aspect-square rounded-md flex items-center justify-center",
                        slot.isOccupied
                          ? "bg-red-100 border border-red-200"
                          : "bg-green-100 border border-green-200"
                      )}
                      title={`Slot ${slot.slotNumber}`}
                    >
                      <CircleParking
                        className={cn(
                          "h-5 w-5",
                          slot.isOccupied ? "text-red-500" : "text-green-500"
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Occupancy;
