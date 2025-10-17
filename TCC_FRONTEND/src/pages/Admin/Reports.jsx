import React, { useState, useEffect } from 'react';
import { BarChart, Calendar, TrendingUp, DollarSign, Users, Clock } from 'lucide-react';
import axios from 'axios';

const Reports = () => {
  const [dateRange, setDateRange] = useState('week');
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    newClients: 0,
    avgServiceTime: 0,
    bookingRate: 0,
    revenueBreakdown: [],
    staffPerformance: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [agendamentos, servicos, barbeiros] = await Promise.all([
        axios.get('https://tcc-upeo.onrender.com/api/agendamentos'),
        axios.get('https://tcc-upeo.onrender.com/api/servicos'),
        axios.get('https://tcc-upeo.onrender.com/api/barbeiros')
      ]);

      // Calcular métricas baseadas nos dados reais
      const totalAgendamentos = agendamentos.data.length;
      const agendamentosCompletos = agendamentos.data.filter(a => a.statusAgendamento === 'Completo').length;
      
      setReportData({
        totalRevenue: agendamentosCompletos * 45, // Média de preço
        newClients: totalAgendamentos,
        avgServiceTime: 45,
        bookingRate: totalAgendamentos > 0 ? Math.round((agendamentosCompletos / totalAgendamentos) * 100) : 0,
        revenueBreakdown: servicos.data.map(s => ({
          service: s.nome,
          amount: s.preco * 10, // Simulando vendas
          percentage: Math.round((s.preco / 200) * 100)
        })),
        staffPerformance: barbeiros.data.map(b => ({
          name: b.nome,
          clientsServed: Math.floor(Math.random() * 50) + 20,
          revenue: Math.floor(Math.random() * 3000) + 2000,
          rating: (4.5 + Math.random() * 0.5).toFixed(1),
          bookingRate: Math.floor(Math.random() * 20) + 80
        }))
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold">
          Business <span className="text-[#c4a47c]">Reports</span>
        </h1>
        <div className="flex space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-luxury"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="btn-primary flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Custom Range</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card-luxury">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#c4a47c] rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold">R$ {reportData.totalRevenue}</p>
              <p className="text-sm text-green-500">Baseado em agendamentos</p>
            </div>
          </div>
        </div>

        <div className="card-luxury">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#c4a47c] rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">New Clients</p>
              <p className="text-2xl font-bold">{reportData.newClients}</p>
              <p className="text-sm text-green-500">Total de agendamentos</p>
            </div>
          </div>
        </div>

        <div className="card-luxury">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#c4a47c] rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg. Service Time</p>
              <p className="text-2xl font-bold">45 min</p>
              <p className="text-sm text-yellow-500">-2.1% vs last period</p>
            </div>
          </div>
        </div>

        <div className="card-luxury">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#c4a47c] rounded-lg">
              <BarChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Booking Rate</p>
              <p className="text-2xl font-bold">{reportData.bookingRate}%</p>
              <p className="text-sm text-green-500">Taxa de conclusão</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-luxury">
          <h2 className="text-2xl font-bold mb-6">Revenue Breakdown</h2>
          <div className="space-y-4">
            {reportData.revenueBreakdown.map((item) => (
              <div key={item.service} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 rounded-full bg-[#c4a47c]"></div>
                  <span>{item.service}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">R$ {item.amount}</span>
                  <span className="text-sm text-gray-400">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-luxury">
          <h2 className="text-2xl font-bold mb-6">Popular Time Slots</h2>
          <div className="space-y-4">
            {timeSlots.map((slot, index) => (
              <div key={`${slot.time}-${index}`} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Clock className="h-5 w-5 text-[#c4a47c]" />
                  <span>{slot.time}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-[#1c1c1c] rounded-full h-2">
                    <div
                      className="bg-[#c4a47c] h-2 rounded-full"
                      style={{ width: `${slot.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400">{slot.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-luxury lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Staff Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#3c3c3c]">
                  <th className="text-left py-4">Barber</th>
                  <th className="text-left py-4">Clients Served</th>
                  <th className="text-left py-4">Revenue</th>
                  <th className="text-left py-4">Avg. Rating</th>
                  <th className="text-left py-4">Booking Rate</th>
                </tr>
              </thead>
              <tbody>
                {reportData.staffPerformance.map((staff) => (
                  <tr key={staff.name} className="border-b border-[#3c3c3c]">
                    <td className="py-4">{staff.name}</td>
                    <td className="py-4">{staff.clientsServed}</td>
                    <td className="py-4">R$ {staff.revenue}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-1">
                        <span>{staff.rating}</span>
                        <span className="text-[#c4a47c]">★</span>
                      </div>
                    </td>
                    <td className="py-4">{staff.bookingRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const timeSlots = [
  { time: "9:00 AM - 11:00 AM", percentage: 65 },
  { time: "11:00 AM - 1:00 PM", percentage: 85 },
  { time: "1:00 PM - 3:00 PM", percentage: 75 },
  { time: "3:00 PM - 5:00 PM", percentage: 90 },
  { time: "5:00 PM - 7:00 PM", percentage: 95 }
];

export default Reports;