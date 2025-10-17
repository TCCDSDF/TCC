import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Scissors,
  Gift,
  BarChart,
  Settings,
  LogOut,
  MessageSquare,
  Calendar,
  Star,
  Menu,
  X,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [animateItems, setAnimateItems] = useState(false);

  useEffect(() => {
    // Efeito cinematográfico: animar itens do menu após carregar
    setTimeout(() => setAnimateItems(true), 300);
  }, []);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/appointments', icon: Calendar, label: 'Agendamentos' },
    { path: '/admin/barbers', icon: Users, label: 'Barbeiros' },
    { path: '/admin/services', icon: Scissors, label: 'Serviços' },
    { path: '/admin/parceiros', icon: MapPin, label: 'RazorMap' },
    { path: '/admin/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/admin/promotions', icon: Gift, label: 'Promoções' },

    { path: '/admin/reports', icon: BarChart, label: 'Relatórios' },

  ];

  return (
    <div className="min-h-screen flex bg-black">
      {/* Overlay de fundo com efeito cinematográfico */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop)',
          filter: 'brightness(0.2) contrast(1.2) saturate(0.8)',
        }}
      />
      
      {/* Sidebar */}
      <div 
        className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-black/80 backdrop-blur-lg border-r border-[#c4a47c]/30 shadow-[0_0_25px_rgba(196,164,124,0.15)] z-10 transition-all duration-500 ease-in-out`}
      >
        <div className="p-6 border-b border-[#c4a47c]/30 flex items-center justify-between">
          <Link to="/admin" className="group flex items-center space-x-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-[#c4a47c] rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500"></div>
              <Scissors className="relative h-8 w-8 text-black bg-[#c4a47c] p-1.5 rounded-full group-hover:rotate-12 transition-transform duration-500" />
            </div>
            {sidebarOpen && (
              <span className="text-2xl font-bold bg-gradient-to-r from-[#c4a47c] to-[#e9d5b9] bg-clip-text text-transparent">LUXURY</span>
            )}
          </Link>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#c4a47c] hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8 px-4">
          {menuItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center space-x-3 px-4 py-4 mb-2 rounded-lg
                ${location.pathname === item.path 
                  ? 'bg-gradient-to-r from-[#c4a47c]/30 to-[#c4a47c]/10 text-[#c4a47c] border-l-4 border-[#c4a47c]' 
                  : 'text-gray-400 hover:bg-[#c4a47c]/10 hover:text-[#c4a47c] border-l-4 border-transparent'}
                transition-all duration-500 ease-in-out
                ${animateItems ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}
              `}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="relative">
                <div className={`${location.pathname === item.path ? 'absolute -inset-1 bg-[#c4a47c] rounded-full blur-sm opacity-50' : 'hidden group-hover:block absolute -inset-1 bg-[#c4a47c] rounded-full blur-sm opacity-0 group-hover:opacity-30'} transition-opacity duration-500`}></div>
                <item.icon className="relative h-5 w-5" />
              </div>
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          ))}

          <button
            onClick={logout}
            className={`group flex items-center space-x-3 px-4 py-4 mt-8 mb-2 rounded-lg w-full
              text-gray-400 hover:bg-red-900/20 hover:text-red-400 border-l-4 border-transparent hover:border-red-500
              transition-all duration-500 ease-in-out
              ${animateItems ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}
            `}
            style={{ transitionDelay: `${menuItems.length * 50}ms` }}
          >
            <div className="relative">
              <div className="hidden group-hover:block absolute -inset-1 bg-red-500 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <LogOut className="relative h-5 w-5" />
            </div>
            {sidebarOpen && (
              <span className="font-medium">Sair</span>
            )}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 z-10 backdrop-blur-sm">
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;