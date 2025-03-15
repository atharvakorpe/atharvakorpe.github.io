
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';

// Security
import EmptySlots from '@/pages/security/EmptySlots';
// Admin
import AddEntry from '@/pages/admin/AddEntry';
// Superuser
import Occupancy from '@/pages/superuser/Occupancy';

const Index = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Render different content based on user role
  let content;
  if (currentUser.role === 'security') {
    content = <EmptySlots />;
  } else if (currentUser.role === 'admin') {
    content = <AddEntry />;
  } else if (currentUser.role === 'superuser') {
    content = <Occupancy />;
  } else {
    content = <div>Unknown user role</div>;
  }

  return <Layout>{content}</Layout>;
};

export default Index;
