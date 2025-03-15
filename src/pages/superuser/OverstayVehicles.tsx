
import React, { useState } from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Car, Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Vehicle } from '@/types';

const OverstayVehicles = () => {
  const { getOverstayVehicles } = useParking();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  const overstayVehicles = getOverstayVehicles();
  
  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };
  
  const handleCloseDialog = () => {
    setSelectedVehicle(null);
  };
  
  const calculateOverstayTime = (vehicle: Vehicle) => {
    if (!vehicle.expectedExitTime) return 'Unknown';
    
    const expected = new Date(vehicle.expectedExitTime);
    const now = new Date();
    const diffMs = now.getTime() - expected.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overstay Vehicles</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vehicles Exceeding Time Limits</span>
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
              {overstayVehicles.length} Overstay
            </Badge>
          </CardTitle>
          <CardDescription>
            Vehicles that have exceeded their expected exit time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {overstayVehicles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>License Plate</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Parking Slot</TableHead>
                  <TableHead>Overstay Duration</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overstayVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.driverName}</TableCell>
                    <TableCell>{vehicle.slotId}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-red-600">
                        <Clock className="h-4 w-4" />
                        <span>{calculateOverstayTime(vehicle)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(vehicle)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <Car className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>No overstay vehicles at the moment</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Vehicle Details Dialog */}
      <Dialog open={!!selectedVehicle} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
            <DialogDescription>
              Details for overstay vehicle
            </DialogDescription>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">License Plate</h3>
                  <p className="font-semibold">{selectedVehicle.licensePlate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Driver Name</h3>
                  <p>{selectedVehicle.driverName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Entry Time</h3>
                  <p>{format(new Date(selectedVehicle.entryTime), 'MMM d, yyyy h:mm a')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Expected Exit</h3>
                  <p>{selectedVehicle.expectedExitTime ? 
                      format(new Date(selectedVehicle.expectedExitTime), 'MMM d, yyyy h:mm a') :
                      'Not specified'
                  }</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Parking Duration</h3>
                  <p>{formatDistanceToNow(new Date(selectedVehicle.entryTime))}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Overstay</h3>
                  <p className="text-red-600">{calculateOverstayTime(selectedVehicle)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Parking Slot</h3>
                  <p>{selectedVehicle.slotId || 'Not assigned'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge className="bg-red-50 text-red-600 border-red-200">
                    Overstay
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OverstayVehicles;
