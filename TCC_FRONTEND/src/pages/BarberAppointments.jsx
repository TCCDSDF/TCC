import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Check, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const BarberAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`https://tcc-upeo.onrender.com/api/agendamentos/barbeiro/${user.id}`);
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Falha ao carregar agendamentos');
      setLoading(false);
    }
  };

  const handleComplete = async (appointmentId) => {
    try {
      setError('');
      setSuccess('');

      await axios.put(`https://tcc-upeo.onrender.com/api/agendamentos/confirmar/${appointmentId}`);
      setSuccess('Agendamento concluído com sucesso!');
      
      fetchAppointments();
    } catch (error) {
      console.error('Error completing appointment:', error);
      setError('Erro ao concluir agendamento');
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      setError('');
      setSuccess('');

      await axios.put(`https://tcc-upeo.onrender.com/api/agendamentos/rejeitar/${appointmentId}`);
      setSuccess('Agendamento cancelado com sucesso!');
      
      fetchAppointments();
    } catch (error) {
      console.error('Error canceling appointment:', error);
      setError('Erro ao cancelar agendamento');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-[#c4a47c] text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div 
        className="fixed inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop)',
          filter: 'brightness(0.2) contrast(1.2) saturate(0.8)',
        }}
      />
      
      <div className="container mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Meus <span className="bg-gradient-to-r from-[#c4a47c] to-[#e9d5b9] bg-clip-text text-transparent">Agendamentos</span>
        </h1>

        {error && (
          <div className="bg-red-900/20 border-2 border-red-500/50 text-red-200 p-4 rounded-md mb-6 flex items-center space-x-2 max-w-4xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border-2 border-green-500/50 text-green-200 p-4 rounded-md mb-6 max-w-4xl mx-auto">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-[0_0_25px_rgba(196,164,124,0.15)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{appointment.servicoNome || 'Serviço não informado'}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.statusAgendamento === 'Completo' ? 'bg-green-900/50 text-green-300 border border-green-500/30' :
                  appointment.statusAgendamento === 'Confirmado' ? 'bg-blue-900/50 text-blue-300 border border-blue-500/30' :
                  appointment.statusAgendamento === 'Pendente' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30' :
                  'bg-red-900/50 text-red-300 border border-red-500/30'
                }`}>
                  {appointment.statusAgendamento || 'Pendente'}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-[#c4a47c]" />
                  <span>{appointment.clienteNome || 'Cliente não informado'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-[#c4a47c]" />
                  <span>{appointment.dataAgendamento ? format(new Date(appointment.dataAgendamento), 'dd/MM/yyyy') : 'Data não disponível'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-[#c4a47c]" />
                  <span>{appointment.dataAgendamento ? format(new Date(appointment.dataAgendamento), 'HH:mm') : 'Horário não disponível'}</span>
                </div>
              </div>

              {(appointment.statusAgendamento === 'Confirmado' || appointment.statusAgendamento === 'Pendente') && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleComplete(appointment.id)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg flex items-center justify-center space-x-1 text-sm font-medium transition-all duration-300"
                  >
                    <Check className="h-4 w-4" />
                    <span>Concluir</span>
                  </button>
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg flex items-center justify-center space-x-1 text-sm font-medium transition-all duration-300"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="h-24 w-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-gray-500">Você não possui agendamentos no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberAppointments;