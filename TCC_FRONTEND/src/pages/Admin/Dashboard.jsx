import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Calendar, DollarSign, TrendingUp, 
  Scissors, Package, Star, MessageSquare,
  Gift, ChevronRight, Clock, Activity
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalClients: 0,
    appointmentsToday: 0,
    revenueToday: 0,
    recentAppointments: [],
    topServices: []
  });
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Efeito cinematográfico: animar entrada dos elementos
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Dados simulados para desenvolvimento
      setDashboardData({
        totalClients: 42,
        appointmentsToday: 8,
        revenueToday: 450,
        recentAppointments: [
          { id: 1, client: 'Carlos Santos', service: 'Corte Social', time: '14:30', date: 'Hoje' },
          { id: 2, client: 'Maria Silva', service: 'Barba Navalhada', time: '15:45', date: 'Hoje' },
          { id: 3, client: 'João Pereira', service: 'Pacote VIP', time: '17:00', date: 'Amanhã' }
        ],
        topServices: [
          { id: 1, name: 'Corte Social', count: 38 },
          { id: 2, name: 'Barba Navalhada', count: 27 },
          { id: 3, name: 'Pacote VIP', count: 15 }
        ]
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-[#c4a47c] animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Scissors className="h-8 w-8 text-[#c4a47c]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      {/* Header com efeito de entrada */}
      <div className={`mb-12 transition-all duration-1000 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-4xl font-bold">
          <span className="bg-gradient-to-r from-[#c4a47c] to-[#e9d5b9] bg-clip-text text-transparent">Dashboard</span>
        </h1>
        <p className="text-gray-400 mt-2">Bem-vindo ao painel de controle da sua barbearia</p>
      </div>

      {/* Stats Grid com efeito de entrada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { 
            icon: Users, 
            title: "Clientes", 
            value: dashboardData.totalClients, 
            color: "from-blue-500 to-blue-700",
            growth: "+5% este mês"
          },
          { 
            icon: Calendar, 
            title: "Agendamentos Hoje", 
            value: dashboardData.appointmentsToday, 
            color: "from-green-500 to-green-700",
            growth: "+2 desde ontem"
          },
          { 
            icon: DollarSign, 
            title: "Receita Hoje", 
            value: `R$ ${dashboardData.revenueToday}`, 
            color: "from-[#c4a47c] to-[#a38155]",
            growth: "+15% esta semana"
          },
          { 
            icon: TrendingUp, 
            title: "Crescimento", 
            value: "+12.5%", 
            color: "from-purple-500 to-purple-700",
            growth: "vs. mês anterior"
          }
        ].map((stat, index) => (
          <div 
            key={index}
            className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg transition-all duration-1000 ease-out ${
              animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-gray-400 text-sm">{stat.title}</h3>
              <div className="flex items-end justify-between mt-2">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-green-400">{stat.growth}</p>
              </div>
            </div>
            <div className={`h-1 w-full bg-gradient-to-r ${stat.color}`}></div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={`mb-12 transition-all duration-1000 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
           style={{ transitionDelay: '400ms' }}>
        <h2 className="text-2xl font-bold mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Calendar, title: "Agendamentos", path: "/admin/appointments", color: "from-blue-600 to-blue-800" },
            { icon: Star, title: "Fidelidade", path: "/admin/loyalty", color: "from-yellow-600 to-yellow-800" },
            { icon: Gift, title: "Promoções", path: "/admin/promotions", color: "from-red-600 to-red-800" },
            { icon: MessageSquare, title: "Mensagens", path: "/admin/chat", color: "from-[#c4a47c] to-[#a38155]" }
          ].map((action, index) => (
            <Link 
              key={index} 
              to={action.path}
              className="group bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 flex items-center justify-between hover:bg-black/60 transition-all duration-300 hover:border-[#c4a47c]/50"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Gerenciar</p>
                  <p className="text-xl font-bold">{action.title}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#c4a47c] group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div 
          className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg transition-all duration-1000 ease-out ${
            animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Agendamentos Recentes</h2>
            <Link to="/admin/appointments" className="text-[#c4a47c] hover:text-[#e9d5b9] transition-colors text-sm flex items-center">
              Ver todos <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.recentAppointments.map((appointment, index) => (
              <div 
                key={appointment.id} 
                className="flex items-center justify-between p-4 bg-black/60 rounded-lg border border-white/5 hover:border-[#c4a47c]/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-[#c4a47c]/20 rounded-full">
                    <Clock className="h-5 w-5 text-[#c4a47c]" />
                  </div>
                  <div>
                    <p className="font-semibold">{appointment.client}</p>
                    <p className="text-sm text-gray-400">{appointment.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{appointment.time}</p>
                  <p className="text-sm text-gray-400">{appointment.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services & Reviews */}
        <div className="space-y-8">
          {/* Top Services */}
          <div 
            className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg transition-all duration-1000 ease-out ${
              animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Serviços Populares</h2>
              <Link to="/admin/services" className="text-[#c4a47c] hover:text-[#e9d5b9] transition-colors text-sm flex items-center">
                Ver todos <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData.topServices.map((service, index) => (
                <div key={service.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-[#c4a47c]/20 rounded-full">
                      <Scissors className="h-5 w-5 text-[#c4a47c]" />
                    </div>
                    <span>{service.name}</span>
                  </div>
                  <span className="font-semibold">{service.count} agendamentos</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div 
            className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg transition-all duration-1000 ease-out ${
              animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '700ms' }}
          >
            <h2 className="text-2xl font-bold mb-6">Avaliações Recentes</h2>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="p-4 bg-black/60 rounded-lg border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold">{review.client}</p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'text-[#c4a47c] fill-current' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const recentReviews = [
  {
    id: 1,
    client: "Carlos Santos",
    rating: 5,
    comment: "Excelente atendimento e atenção aos detalhes!"
  },
  {
    id: 2,
    client: "Maria Silva",
    rating: 4,
    comment: "Ótima experiência, definitivamente voltarei."
  }
];

export default Dashboard;