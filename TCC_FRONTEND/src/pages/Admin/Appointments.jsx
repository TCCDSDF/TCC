import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Check, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('https://tcc-upeo.onrender.com/api/agendamentos');
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
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
      <div className="flex items-center justify-center h-full">
        <div className="text-[#c4a47c]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12">
        Manage <span className="text-[#c4a47c]">Appointments</span>
      </h1>

      {error && (
        <div className="bg-red-900/20 border-2 border-red-500/50 text-red-200 p-4 rounded-md mb-6 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-900/20 border-2 border-green-500/50 text-green-200 p-4 rounded-md mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="card-luxury">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{appointment.servicoNome || 'Serviço não informado'}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                appointment.statusAgendamento === 'Completo' ? 'bg-green-900/20 text-green-200' :
                appointment.statusAgendamento === 'Confirmado' ? 'bg-[#c4a47c]/20 text-[#c4a47c]' :
                'bg-red-900/20 text-red-200'
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
                <span>{appointment.dataAgendamento ? format(new Date(appointment.dataAgendamento), 'MMMM d, yyyy') : 'Data não disponível'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-[#c4a47c]" />
                <span>{appointment.dataAgendamento ? format(new Date(appointment.dataAgendamento), 'h:mm a') : 'Horário não disponível'}</span>
              </div>
            </div>

            {(appointment.statusAgendamento === 'Confirmado' || appointment.statusAgendamento === 'Pendente') && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleComplete(appointment.id)}
                  className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center space-x-1 text-sm"
                >
                  <Check className="h-4 w-4" />
                  <span>Complete</span>
                </button>
                <button
                  onClick={() => handleCancel(appointment.id)}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center space-x-1 text-sm"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAppointments;