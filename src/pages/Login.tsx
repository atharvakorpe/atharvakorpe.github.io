import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UserRole } from '@/types';
import { CircleParking } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    let userId = '1'; // Default to security
    
    if (role === 'admin') {
      userId = '2';
    } else if (role === 'superuser') {
      userId = '3';
    }
    
    login(userId);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <CircleParking className="h-12 w-12 text-parking-highlight" />
          </div>
          <CardTitle className="text-2xl font-bold">Parking Pulse Admin</CardTitle>
          <CardDescription>Select your role to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="security" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="superuser">Superuser</TabsTrigger>
            </TabsList>
            
            <TabsContent value="security" className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-lg">Security Role</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Raise requests for admin approval and view empty parking slots
                </p>
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleRoleSelect('security')}
              >
                Login as Security
              </Button>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-lg">Admin Role</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Add entries to database and approve requests from security
                </p>
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleRoleSelect('admin')}
              >
                Login as Admin
              </Button>
            </TabsContent>
            
            <TabsContent value="superuser" className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-lg">Superuser Role</h3>
                <p className="text-sm text-gray-600 mt-2">
                  View all parking levels, occupancy data, overstay vehicles, and pending approvals
                </p>
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleRoleSelect('superuser')}
              >
                Login as Superuser
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
