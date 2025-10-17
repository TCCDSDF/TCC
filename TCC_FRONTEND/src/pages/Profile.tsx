import { useState, useEffect } from 'react';
import { User, Star, Gift, Clock, Shield, LogOut, Edit, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState({
    name: user?.nome || '',
    email: user?.email || '',
    phone: user?.telefone || ''
  });
  const [userAppointments, setUserAppointments] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 200);
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (user?.id) {
      try {
        const appointmentsResponse = await axios.get('https://tcc-upeo.onrender.com/api/agendamentos');
        const filteredAppointments = appointmentsResponse.data.filter(appointment => 
          appointment.usuario_id === user.id
        );
        setUserAppointments(filteredAppointments);
        
        const completedAppointments = filteredAppointments.filter(appointment => 
          appointment.statusAgendamento === 'Completo'
        );
        setUserPoints(completedAppointments.length * 50);
        
        setProfileData({
          name: user.nome || '',
          email: user.email || '',
          phone: user.telefone || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    setLoading(false);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name too short';
        } else {
          delete newErrors.name;
        }
        break;
      case 'phone':
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        if (value && !phoneRegex.test(value)) {
          newErrors.phone = 'Format: (11) 99999-9999';
        } else {
          delete newErrors.phone;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setProfileData({
      ...profileData,
      [name]: formattedValue
    });

    validateField(name, formattedValue);
  };

  const handleProfileUpdate = () => {
    if (Object.keys(errors).length === 0) {
      setEditMode(false);
    }
  };

  const getLoyaltyLevel = (points) => {
    if (points >= 1000) return 'Gold';
    if (points >= 500) return 'Silver';
    return 'Bronze';
  };

  const getFieldStatus = (fieldName) => {
    if (errors[fieldName]) return 'error';
    if (profileData[fieldName] && !errors[fieldName]) return 'success';
    return 'default';
  };

  const getFieldIcon = (fieldName) => {
    const status = getFieldStatus(fieldName);
    if (status === 'success') return <Check className="h-4 w-4 text-white" />;
    if (status === 'error') return <X className="h-4 w-4 text-zinc-400" />;
    return null;
  };

  if (loading) {
    return (
      <div className="bg-black text-white font-mono min-h-screen flex items-center justify-center">
        <div className="w-px h-8 bg-white animate-pulse"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const rewards = [
    { id: 1, name: 'Free Executive Cut', points: 500 },
    { id: 2, name: 'Luxury Beard Package', points: 750 },
    { id: 3, name: 'Complete VIP Treatment', points: 1000 }
  ];

  return (
    <div className="bg-black text-white font-mono">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative z-10 min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`mb-12 text-center transition-all duration-1000 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-8">
              <div className="w-px h-8 bg-white mx-auto mb-4"></div>
              <User className="h-8 w-8 text-white mx-auto" />
              <div className="w-px h-8 bg-white mx-auto mt-4"></div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none">
              PRO<span className="text-zinc-400">FILE</span>
            </h1>
            
            <div className="w-32 h-px bg-white mx-auto mb-8"></div>
            
            <p className="text-xs tracking-[0.3em] text-zinc-400 uppercase">
              {profileData.name} • Level {getLoyaltyLevel(userPoints)} • {userPoints} Points
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-px bg-zinc-800">
            {/* Sidebar */}
            <div className="bg-black p-6">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-3 text-xs tracking-[0.2em] uppercase transition-colors ${
                      activeTab === tab.id 
                        ? 'text-white bg-zinc-950 border-l-2 border-white' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-950 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="w-full h-px bg-zinc-800 my-6"></div>

              <button
                onClick={logout}
                className="w-full p-3 text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors flex items-center space-x-3"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 bg-black p-8">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-sm tracking-[0.2em] uppercase font-bold">Profile Information</span>
                    <button 
                      onClick={() => setEditMode(!editMode)}
                      className="text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors"
                    >
                      {editMode ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <div className="w-full h-px bg-zinc-800"></div>

                  {Object.keys(errors).length > 0 && (
                    <div className="bg-zinc-950 border border-zinc-800 p-4 text-center">
                      <p className="text-xs tracking-[0.2em] uppercase text-zinc-400">
                        {Object.values(errors)[0]}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-zinc-400 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          name="name"
                          type="text"
                          value={profileData.name}
                          onChange={handleChange}
                          readOnly={!editMode}
                          className={`w-full bg-black border pr-10 py-3 px-4 text-sm tracking-wide focus:outline-none transition-colors ${
                            getFieldStatus('name') === 'error' ? 'border-zinc-600' : 
                            getFieldStatus('name') === 'success' ? 'border-white' : 'border-zinc-800'
                          } ${getFieldStatus('name') === 'success' ? 'text-white' : 'text-zinc-400'} focus:border-white`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {getFieldIcon('name')}
                        </div>
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-xs tracking-[0.1em] uppercase text-zinc-500">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-zinc-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        readOnly
                        className="w-full bg-black border border-zinc-800 py-3 px-4 text-sm tracking-wide text-zinc-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-zinc-400 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          name="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={handleChange}
                          readOnly={!editMode}
                          placeholder="(11) 99999-9999"
                          className={`w-full bg-black border pr-10 py-3 px-4 text-sm tracking-wide focus:outline-none transition-colors ${
                            getFieldStatus('phone') === 'error' ? 'border-zinc-600' : 
                            getFieldStatus('phone') === 'success' ? 'border-white' : 'border-zinc-800'
                          } ${getFieldStatus('phone') === 'success' ? 'text-white' : 'text-zinc-400'} focus:border-white`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {getFieldIcon('phone')}
                        </div>
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs tracking-[0.1em] uppercase text-zinc-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {editMode && (
                    <>
                      <div className="w-full h-px bg-zinc-800"></div>
                      <button 
                        onClick={handleProfileUpdate}
                        disabled={Object.keys(errors).length > 0}
                        className="w-full border border-white text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                      >
                        Update Profile
                      </button>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'rewards' && (
                <div className="space-y-6">
                  <span className="text-sm tracking-[0.2em] uppercase font-bold">Available Rewards</span>
                  <div className="w-full h-px bg-zinc-800"></div>
                  
                  <div className="space-y-4">
                    {rewards.map((reward) => (
                      <div key={reward.id} className="p-4 border border-zinc-800 hover:border-zinc-600 transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-sm tracking-wide uppercase">{reward.name}</h4>
                            <p className="text-xs text-zinc-400 mt-1">{reward.points} points required</p>
                          </div>
                          <button
                            disabled={reward.points > userPoints}
                            className={`px-4 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
                              reward.points <= userPoints 
                                ? 'border border-white text-white hover:bg-white hover:text-black' 
                                : 'border border-zinc-600 text-zinc-600 cursor-not-allowed'
                            }`}
                          >
                            Redeem
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6">
                  <span className="text-sm tracking-[0.2em] uppercase font-bold">Appointment History</span>
                  <div className="w-full h-px bg-zinc-800"></div>
                  
                  <div className="space-y-4">
                    {userAppointments.length > 0 ? userAppointments.map((appointment, index) => (
                      <div key={appointment.id || index} className="p-4 border border-zinc-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm tracking-wide uppercase">
                              {appointment.servicoNome || 'Service'}
                            </h4>
                            <p className="text-xs text-zinc-400 mt-1">
                              {appointment.barbeiroNome || 'Barber'}
                            </p>
                            <p className="text-xs font-mono text-zinc-400 mt-1">
                              {appointment.dataAgendamento ? 
                                new Date(appointment.dataAgendamento).toLocaleDateString('en-US') : 
                                'Date not available'
                              }
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
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-xs tracking-[0.2em] uppercase text-zinc-400">No History</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <span className="text-sm tracking-[0.2em] uppercase font-bold">Account Security</span>
                  <div className="w-full h-px bg-zinc-800"></div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-zinc-400 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-black border border-zinc-800 py-3 px-4 text-sm tracking-wide focus:outline-none focus:border-white transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-zinc-400 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-black border border-zinc-800 py-3 px-4 text-sm tracking-wide focus:outline-none focus:border-white transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-zinc-400 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-black border border-zinc-800 py-3 px-4 text-sm tracking-wide focus:outline-none focus:border-white transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="w-full h-px bg-zinc-800"></div>

                  <button className="w-full border border-white text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors">
                    Update Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;