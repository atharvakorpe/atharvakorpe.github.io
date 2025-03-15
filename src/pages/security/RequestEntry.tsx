
import React, { useState } from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Car } from 'lucide-react';

const RequestEntry = () => {
  const { createRequest } = useParking();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    licensePlate: '',
    driverName: '',
    expectedExitTime: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      
      createRequest({
        licensePlate: formData.licensePlate,
        driverName: formData.driverName,
        entryTime: entryTime.toISOString(),
        expectedExitTime: exitTime.toISOString(),
        isOverstay: false,
      });
      
      setSuccess(true);
      toast({
        title: "Request Submitted",
        description: "Entry request has been submitted for approval",
      });
      
      // Reset form
      setFormData({
        licensePlate: '',
        driverName: '',
        expectedExitTime: '',
      });
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Request Vehicle Entry</h1>
      
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Car className="h-4 w-4 text-green-600" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Entry request submitted successfully. Waiting for admin approval.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Entry Request</CardTitle>
          <CardDescription>
            Submit a request for admin approval to allow vehicle entry
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
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestEntry;
