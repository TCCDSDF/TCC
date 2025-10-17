import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Appointments from './pages/Appointments';
import Services from './pages/Services';
import Products from './pages/Products';
import Chat from './pages/Chat';
// Chatbot agora é um componente flutuante
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import RazorMap from './pages/RazorMap';
import ParceirosBarbearias from './pages/Admin/ParceirosBarbearias';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminBarbers from './pages/Admin/Barbers';
import AdminServices from './pages/Admin/Services';
import AdminPromotions from './pages/Admin/Promotions';
import AdminReports from './pages/Admin/Reports';
import AdminChat from './pages/Admin/Chat';
import AdminAppointments from './pages/Admin/Appointments';
import AdminLoyalty from './pages/Admin/LoyaltySettings';
import BarberAppointments from './pages/BarberAppointments';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="barbers" element={<AdminBarbers />} />
                      <Route path="services" element={<AdminServices />} />
                      <Route path="chat" element={<AdminChat />} />
                      <Route path="promotions" element={<AdminPromotions />} />
                      <Route path="reports" element={<AdminReports />} />
                      <Route path="appointments" element={<AdminAppointments />} />
                      <Route path="loyalty" element={<AdminLoyalty />} />
                      <Route path="parceiros" element={<ParceirosBarbearias />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Client Routes */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route
                      path="appointments"
                      element={
                        <ProtectedRoute>
                          <Appointments />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="services" element={<Services />} />
                    <Route path="products" element={<Products />} />
                    <Route path="razormap" element={<RazorMap />} />
                    {/* Rota de suporte removida - chatbot agora é flutuante */}
                    <Route
                      path="chat"
                      element={
                        <ProtectedRoute barberOnly>
                          <Chat />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="barber-appointments"
                      element={
                        <ProtectedRoute barberOnly>
                          <BarberAppointments />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;