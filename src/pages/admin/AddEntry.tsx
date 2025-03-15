
import React, { useState } from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ParkingSlot } from '@/types';
import { Car, Check } from 'lucide-react';

const AddEntry = () => {
  const { addVehicle, parkingLevels } = useParking();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    licensePlate: '',
    driverName: '',
    level: '',
    expectedExitTime: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const emptySlots = parkingLevels.reduce<Record<number, ParkingSlot[]>>(
    (acc, level) => {
      acc[level.level] = level.slots.filter(slot => !slot.isOccupied);
      return acc;
    }, 
    {}
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLevelChange = (value: string) => {
    setFormData(prev => ({ ...prev, level: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Calculate expected exit time if not provided
      const entryTime = new Date();
      const exitTime = formData.expectedExitTime 
        ? new Date(formData.expectedExitTime) 
        : new Date(entryTime.getTime() + 3 * 60 * 60 * 1000); // Default 3 hours
      
      // Find an empty slot in the selected level
      const level = parseInt(formData.level);
      const availableSlots = emptySlots[level] || [];
      
      if (availableSlots.length === 0) {
        throw new Error('No available slots in the selected level');
      }
      
      const slot = availableSlots[0];
      
      addVehicle({
        licensePlate: formData.licensePlate,
        driverName: formData.driverName,
        entryTime: entryTime.toISOString(),
        expectedExitTime: exitTime.toISOString(),
        isOverstay: false,
        slotId: slot.id,
        status: 'parked',
      });
      
      setSuccess(true);
      toast({
        title: "Entry Added",
        description: `Vehicle ${formData.licensePlate} added to parking slot ${slot.slotNumber}`,
      });
      
      // Reset form
      setFormData({
        licensePlate: '',
        driverName: '',
        level: '',
        expectedExitTime: '',
      });
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add entry",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Parking Entry</h1>
      
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Vehicle entry has been successfully added to the database.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Entry Form</CardTitle>
          <CardDescription>
            Add a new vehicle entry directly to the parking database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                placeholder="e.g., ABC-1234"
                value={formData.licensePlate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="driverName">Driver Name</Label>
              <Input
                id="driverName"
                name="driverName"
                placeholder="Enter driver's name"
                value={formData.driverName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">Parking Level</Label>
              <Select
                value={formData.level}
                onValueChange={handleLevelChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a parking level" />
                </SelectTrigger>
                <SelectContent>
                  {parkingLevels.map((level) => (
                    <SelectItem
                      key={level.level}
                      value={level.level.toString()}
                      disabled={emptySlots[level.level]?.length === 0}
                    >
                      Level {level.level} ({emptySlots[level.level]?.length || 0} slots available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expectedExitTime">Expected Exit Time (Optional)</Label>
              <Input
                id="expectedExitTime"
                name="expectedExitTime"
                type="datetime-local"
                value={formData.expectedExitTime}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">
                If not specified, defaults to 3 hours from entry
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Adding Entry..." : "Add Entry"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEntry;
