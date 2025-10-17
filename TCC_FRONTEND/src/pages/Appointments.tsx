import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Calendar, Clock, User, Scissors, Check, X, MapPin } from 'lucide-react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Appointments = () => {
  const location = useLocation();
  const selectedBarbearia = location.state?.selectedBarbearia;
  const { user } = useAuth();
  
  if (user?.userType === 'barbeiro') {
    return (
      <div className="bg-black text-white font-mono min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter mb-4">ACCESS DENIED</h1>
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-400">Barbers cannot access this page</p>
        </div>
      </div>
    );
  }
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [animateIn, setAnimateIn] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 200);
  }, []);

  useEffect(() => {
    const storedBarbearia = localStorage.getItem('selectedBarbearia');
    const barbearia = selectedBarbearia || (storedBarbearia ? JSON.parse(storedBarbearia) : null);
    
    if (barbearia) {
      fetchServices(barbearia);
      fetchBarbers(barbearia);
      fetchAppointments();
    }
    setLoading(false);
  }, [selectedBarbearia]);

  const fetchServices = async (barbearia) => {
    try {
      const response = await axios.get('http://localhost:8080/api/servicos');
      const filteredServices = response.data.filter(service => 
        !service.barbearia_id || service.barbearia_id == barbearia?.id
      );
      setServices(filteredServices);
    } catch (error) {
      setErrors({ services: 'Failed to load services' });
    }
  };

  const fetchBarbers = async (barbearia) => {
    try {
      const response = await axios.get('http://localhost:8080/api/barbeiros');
      const filteredBarbers = response.data.filter(barber => 
        barber.barbearia_id == barbearia?.id
      );
      setBarbers(filteredBarbers);
    } catch (error) {
      setErrors({ barbers: 'Failed to load barbers' });
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/agendamentos');
      const userAppointments = response.data.filter(appointment => 
        appointment.usuario_id === user?.id
      );
      setAppointments(userAppointments);
      setAllAppointments(response.data);
    } catch (error) {
      setErrors({ appointments: 'Failed to load appointments' });
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = { ...errors };
    
    switch (currentStep) {
      case 1:
        if (!selectedService) {
          newErrors.service = 'Service required';
        } else {
          delete newErrors.service;
        }
        break;
      case 2:
        if (!selectedBarber) {
          newErrors.barber = 'Barber required';
        } else {
          delete newErrors.barber;
        }
        break;
      case 3:
        if (!selectedTime) {
          newErrors.time = 'Time required';
        } else {
          delete newErrors.time;
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async () => {
    if (!validateStep(3)) return;

    const hasPendingAppointment = appointments.some(appointment => 
      appointment.statusAgendamento === 'Pendente'
    );
    
    if (hasPendingAppointment) {
      setErrors({ booking: 'You already have a pending appointment' });
      return;
    }

    setLoading(true);
    
    try {
      const barbearia = selectedBarbearia || JSON.parse(localStorage.getItem('selectedBarbearia') || '{}');
      const localDateTime = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00-03:00`;
      
      const appointmentData = {
        usuario_id: user?.id,
        servico_id: parseInt(selectedService),
        barbeiro_id: parseInt(selectedBarber),
        barbearia_id: barbearia?.id,
        dataAgendamento: localDateTime
      };
      
      await axios.post('http://localhost:8080/api/agendamentos', appointmentData);
      await fetchAppointments();
      
      setBookingSuccess(true);
      setTimeout(() => {
        setSelectedService('');
        setSelectedBarber('');
        setSelectedTime('');
        setStep(1);
        setBookingSuccess(false);
      }, 3000);
      
    } catch (error) {
      setErrors({ booking: 'Booking failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    
    for (let hour = 9; hour <= 17; hour++) {
      const times = [`${hour.toString().padStart(2, '0')}:00`];
      if (hour !== 17) times.push(`${hour.toString().padStart(2, '0')}:30`);
      
      times.forEach(time => {
        const [timeHour, timeMinute] = time.split(':').map(Number);
        
        const dateTimeString = `${format(selectedDate, 'yyyy-MM-dd')}T${time}:00`;
        const isTimeOccupied = allAppointments.some(appointment => {
          if (!appointment.dataAgendamento) return false;
          const appointmentDateTime = new Date(appointment.dataAgendamento);
          const slotDateTime = new Date(dateTimeString);
          return appointmentDateTime.getTime() === slotDateTime.getTime() && 
                 appointment.barbeiro_id == selectedBarber;
        });
        
        if (isTimeOccupied) return;
        
        if (isSameDay(selectedDate, now)) {
          if (timeHour > now.getHours() || (timeHour === now.getHours() && timeMinute > now.getMinutes())) {
            slots.push(time);
          }
        } else {
          slots.push(time);
        }
      });
    }
    return slots;
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/agendamentos/${appointmentId}`);
      await fetchAppointments();
    } catch (error) {
      setErrors({ cancel: 'Failed to cancel appointment' });
    }
  };

  const barbearia = selectedBarbearia || JSON.parse(localStorage.getItem('selectedBarbearia') || 'null');

  if (!barbearia) {
    return (
      <div className="bg-black text-white font-mono">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="w-px h-12 bg-white mx-auto mb-6"></div>
              <MapPin className="h-8 w-8 text-white mx-auto" />
              <div className="w-px h-12 bg-white mx-auto mt-6"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none">
              SELECT<br />BARBERSHOP
            </h1>
            
            <div className="w-16 h-px bg-white mx-auto mb-8"></div>
            
            <p className="text-xs tracking-[0.3em] text-zinc-400 uppercase mb-8">
              Choose a barbershop first
            </p>
            
            <Link 
              to="/razormap" 
              className="border border-white text-white px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors"
            >
              Go to RazorMap
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !bookingSuccess) {
    return (
      <div className="bg-black text-white font-mono min-h-screen flex items-center justify-center">
        <div className="w-px h-8 bg-white animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white font-mono">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative z-10 min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`mb-12 text-center transition-all duration-1000 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-8">
              <div className="w-px h-8 bg-white mx-auto mb-4"></div>
              <Scissors className="h-8 w-8 text-white mx-auto rotate-45" />
              <div className="w-px h-8 bg-white mx-auto mt-4"></div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none">
              BOOK<span className="text-zinc-400">ING</span>
            </h1>
            
            <div className="w-32 h-px bg-white mx-auto mb-8"></div>
            
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-4 w-4 text-zinc-400 mr-2" />
              <span className="text-xs tracking-[0.2em] uppercase text-zinc-400">{barbearia.nome}</span>
            </div>
          </div>

          {bookingSuccess ? (
            <div className="max-w-md mx-auto text-center bg-black border border-zinc-800 p-8">
              <Check className="h-12 w-12 text-white mx-auto mb-6" />
              <h2 className="text-2xl font-black tracking-tighter mb-4">BOOKED</h2>
              <p className="text-xs tracking-[0.2em] uppercase text-zinc-400">
                Appointment confirmed successfully
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-800">
              <div className="bg-black p-8">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm tracking-[0.2em] uppercase font-bold">New Booking</span>
                    <div className="flex space-x-2">
                      {[1, 2, 3].map((s) => (
                        <div 
                          key={s}
                          className={`w-2 h-2 ${step === s ? 'bg-white' : 'bg-zinc-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-px bg-zinc-800"></div>
                </div>

                {Object.keys(errors).length > 0 && (
                  <div className="bg-zinc-950 border border-zinc-800 p-4 mb-6 text-center">
                    <p className="text-xs tracking-[0.2em] uppercase text-zinc-400">
                      {Object.values(errors)[0]}
                    </p>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold tracking-wide uppercase">Select Service</h3>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {services.map((service) => (
                        <div 
                          key={service.id}
                          onClick={() => setSelectedService(service.id.toString())}
                          className={`p-4 border cursor-pointer transition-colors ${
                            selectedService === service.id.toString() 
                              ? 'border-white bg-zinc-950' 
                              : 'border-zinc-800 hover:border-zinc-600'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm tracking-wide uppercase">{service.nome}</h4>
                              <p className="text-xs text-zinc-400 mt-1">{service.duracao}min</p>
                            </div>
                            <span className="text-xs font-mono">R$ {service.preco}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => validateStep(1) && setStep(2)}
                      disabled={!selectedService}
                      className="w-full border border-white text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold tracking-wide uppercase">Select Barber</h3>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {barbers.map((barber) => (
                        <div 
                          key={barber.id}
                          onClick={() => setSelectedBarber(barber.id.toString())}
                          className={`p-4 border cursor-pointer transition-colors ${
                            selectedBarber === barber.id.toString() 
                              ? 'border-white bg-zinc-950' 
                              : 'border-zinc-800 hover:border-zinc-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-sm tracking-wide uppercase">{barber.nome}</h4>
                              <p className="text-xs text-zinc-400 mt-1">{barber.especialidades || 'Specialist'}</p>
                            </div>
                            <div className="text-xs font-mono text-zinc-400">
                              ★ {barber.mediaAvaliacao || 4.5}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 border border-zinc-800 text-zinc-400 py-3 text-xs tracking-[0.2em] uppercase hover:border-zinc-600 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => validateStep(2) && setStep(3)}
                        disabled={!selectedBarber}
                        className="flex-1 border border-white text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold tracking-wide uppercase">Select Date & Time</h3>
                    
                    <div>
                      <div className="grid grid-cols-4 gap-2 mb-6">
                        {generateDateOptions().slice(0, 8).map((date, index) => (
                          <div 
                            key={index}
                            onClick={() => setSelectedDate(date)}
                            className={`p-2 border text-center cursor-pointer transition-colors ${
                              format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                                ? 'border-white bg-zinc-950' 
                                : 'border-zinc-800 hover:border-zinc-600'
                            }`}
                          >
                            <p className="text-xs text-zinc-400">{format(date, 'EEE')}</p>
                            <p className="font-bold">{format(date, 'd')}</p>
                            <p className="text-xs">{format(date, 'MMM')}</p>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                        {generateTimeSlots().map((time, index) => (
                          <div 
                            key={index}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2 border text-center cursor-pointer transition-colors ${
                              selectedTime === time
                                ? 'border-white bg-zinc-950' 
                                : 'border-zinc-800 hover:border-zinc-600'
                            }`}
                          >
                            <p className="text-xs font-mono">{time}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 border border-zinc-800 text-zinc-400 py-3 text-xs tracking-[0.2em] uppercase hover:border-zinc-600 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleBooking}
                        disabled={!selectedTime || loading}
                        className="flex-1 border border-white text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Booking...' : 'Confirm'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-black p-8">
                <div className="mb-8">
                  <span className="text-sm tracking-[0.2em] uppercase font-bold">Your Appointments</span>
                  <div className="w-full h-px bg-zinc-800 mt-6"></div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <div key={appointment.id || index} className="p-4 border border-zinc-800">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-sm tracking-wide uppercase">
                              {appointment.servicoNome || 'Service'}
                            </h4>
                            <p className="text-xs text-zinc-400 mt-1">
                              {appointment.barbeiroNome || 'Barber'}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 ${
                            appointment.statusAgendamento === 'Confirmado' ? 'bg-zinc-800 text-white' :
                            appointment.statusAgendamento === 'Pendente' ? 'bg-zinc-700 text-zinc-300' :
                            'bg-zinc-600 text-zinc-400'
                          }`}>
                            {appointment.statusAgendamento || 'Pending'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-xs font-mono text-zinc-400">
                            {appointment.dataAgendamento ? 
                              `${format(new Date(appointment.dataAgendamento), 'dd/MM/yyyy HH:mm')}` : 
                              'Date not available'
                            }
                          </div>
                          
                          {appointment.statusAgendamento === 'Pendente' && (
                            <button 
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="text-xs text-zinc-400 hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                      <p className="text-xs tracking-[0.2em] uppercase text-zinc-400">No Appointments</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;