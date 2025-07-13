
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/auth/LoginPage';
import Header from '@/components/layout/Header';
import MainDashboard from '@/components/dashboard/MainDashboard';

const HomePage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="f9d09l3fs" data-path="src/pages/HomePage.tsx">
        <div className="text-center" data-id="6085r6uq4" data-path="src/pages/HomePage.tsx">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" data-id="4kco48o1f" data-path="src/pages/HomePage.tsx"></div>
          <p className="text-gray-600" data-id="5zi84sejw" data-path="src/pages/HomePage.tsx">Loading...</p>
        </div>
      </div>);

  }

  if (!user) {
    return <LoginPage data-id="stybtk0u2" data-path="src/pages/HomePage.tsx" />;
  }

  return (
    <div className="min-h-screen bg-gray-50" data-id="kkb9mmggi" data-path="src/pages/HomePage.tsx">
      <Header data-id="mxwify55i" data-path="src/pages/HomePage.tsx" />
      <main data-id="n54fx0czz" data-path="src/pages/HomePage.tsx">
        <MainDashboard data-id="cwie9egeh" data-path="src/pages/HomePage.tsx" />
      </main>
    </div>);

};

export default HomePage;