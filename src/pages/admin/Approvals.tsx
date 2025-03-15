
import React, { useState } from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Car } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ParkingRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Approvals = () => {
  const { requests, approveRequest, rejectRequest, parkingLevels } = useParking();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [selectedRequest, setSelectedRequest] = useState<ParkingRequest | null>(null);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const recentActions = requests.filter(req => req.status !== 'pending').slice(0, 5);
  
  const handleOpenDialog = (request: ParkingRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setDialogAction(action);
  };
  
  const handleCloseDialog = () => {
    setSelectedRequest(null);
    setDialogAction(null);
  };
  
  const handleConfirmAction = () => {
    if (!selectedRequest || !dialogAction || !currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      if (dialogAction === 'approve') {
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
          handleCloseDialog();
          setIsSubmitting(false);
          return;
        }
        
        approveRequest(selectedRequest.id, currentUser.id);
        toast({
          title: "Request Approved",
          description: `Vehicle ${selectedRequest.vehicle.licensePlate} has been approved for entry`,
        });
      } else {
        rejectRequest(selectedRequest.id, currentUser.id);
        toast({
          title: "Request Rejected",
          description: `Vehicle ${selectedRequest.vehicle.licensePlate} entry has been rejected`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      handleCloseDialog();
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Approval Requests</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pending Requests</span>
            <Badge variant="outline" className="bg-parking-pending/10 text-parking-pending">
              {pendingRequests.length} Pending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.vehicle.licensePlate}</TableCell>
                    <TableCell>{request.vehicle.driverName}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(request.requestTime), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleOpenDialog(request, 'approve')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleOpenDialog(request, 'reject')}
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
          ) : (
            <div className="text-center py-10 text-gray-500">
              <Car className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>No pending requests at the moment</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActions.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.vehicle.licensePlate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={request.status === 'approved' 
                          ? "bg-green-50 text-green-600 border-green-200" 
                          : "bg-red-50 text-red-600 border-red-200"
                        }
                      >
                        {request.status === 'approved' ? 'Approved' : 'Rejected'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.approvalTime ? 
                        formatDistanceToNow(new Date(request.approvalTime), { addSuffix: true }) :
                        'Unknown'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No recent actions</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Confirmation Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Approve Vehicle Entry' : 'Reject Vehicle Entry'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve' 
                ? 'Are you sure you want to approve this vehicle for entry?' 
                : 'Are you sure you want to reject this vehicle entry request?'
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="py-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">License Plate:</span>
                <span className="font-medium">{selectedRequest.vehicle.licensePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Driver:</span>
                <span>{selectedRequest.vehicle.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Requested By:</span>
                <span>{selectedRequest.requestedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Request Time:</span>
                <span>
                  {formatDistanceToNow(new Date(selectedRequest.requestTime), { addSuffix: true })}
                </span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isSubmitting}
              variant={dialogAction === 'approve' ? 'default' : 'destructive'}
            >
              {isSubmitting ? 'Processing...' : dialogAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Approvals;
