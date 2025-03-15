
import React from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Car, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const PendingApprovals = () => {
  const { requests, approveRequest, rejectRequest, parkingLevels } = useParking();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const pendingRequests = requests.filter(req => req.status === 'pending');
  
  const handleApprove = (requestId: string) => {
    if (!currentUser) return;
    
    // Check if there are empty slots
    const hasEmptySlots = parkingLevels.some(level => 
      level.slots.some(slot => !slot.isOccupied)
    );
    
    if (!hasEmptySlots) {
      toast({
        title: "Error",
        description: "No empty slots available for parking",
        variant: "destructive",
      });
      return;
    }
    
    approveRequest(requestId, currentUser.id);
    toast({
      title: "Request Approved",
      description: "Vehicle entry request has been approved",
    });
  };
  
  const handleReject = (requestId: string) => {
    if (!currentUser) return;
    
    rejectRequest(requestId, currentUser.id);
    toast({
      title: "Request Rejected",
      description: "Vehicle entry request has been rejected",
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pending Approval Requests</h1>
      
      {pendingRequests.length === 0 ? (
        <Alert>
          <AlertDescription>
            There are no pending requests at the moment.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              Requested Vehicle Entries ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>License Plate</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.vehicle.licensePlate}</TableCell>
                    <TableCell>{request.vehicle.driverName}</TableCell>
                    <TableCell>{request.requestedBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-amber-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(new Date(request.requestTime), { addSuffix: true })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleApprove(request.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-medium mb-2">Approvals Dashboard Guide</h2>
        <p className="text-gray-600 mb-4">
          As a superuser, you can approve or reject vehicle entry requests from this dashboard. 
          Here's what you need to know:
        </p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <Check className="h-4 w-4 text-green-500 mt-1 mr-2" />
            <span>Approving a request will assign an available parking slot to the vehicle</span>
          </li>
          <li className="flex items-start">
            <X className="h-4 w-4 text-red-500 mt-1 mr-2" />
            <span>Rejecting a request will notify security that entry was denied</span>
          </li>
          <li className="flex items-start">
            <Car className="h-4 w-4 text-blue-500 mt-1 mr-2" />
            <span>Approved vehicles will appear in the occupancy dashboard</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PendingApprovals;
