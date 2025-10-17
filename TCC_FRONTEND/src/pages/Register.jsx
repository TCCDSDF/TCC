import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Mail, Phone, Lock, User, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 200);
  }, []);

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

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'Email required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Invalid email';
        } else {
          delete newErrors.email;
        }
        break;

      case 'phone':
        if (value) {
          const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
          const numbers = value.replace(/\D/g, '');
          const validAreaCodes = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
          
          if (numbers.length < 10) {
            newErrors.phone = 'Phone too short';
          } else if (numbers.length > 11) {
            newErrors.phone = 'Phone too long';
          } else if (!phoneRegex.test(value)) {
            newErrors.phone = 'Format: (11) 99999-9999';
          } else if (!validAreaCodes.includes(numbers.substring(0, 2))) {
            newErrors.phone = 'Invalid area code';
          } else {
            delete newErrors.phone;
          }
        } else {
          delete newErrors.phone;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password required';
        } else if (value.length < 6) {
          newErrors.password = 'Min 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          newErrors.password = 'Need: A-Z, a-z, 0-9';
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Confirm password';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '').substring(0, 11);
    
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
    if (numbers.length <= 10) return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });

    validateField(name, formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key !== 'phone') { // phone is optional
        validateField(key, formData[key]);
      }
    });

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const user = await register({
        nome: formData.name,
        email: formData.email,
        senha: formData.password,
        tipo: 'cliente',
        telefone: formData.phone || ''
      });
      
      if (user.userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const getFieldStatus = (fieldName) => {
    if (errors[fieldName]) return 'error';
    if (formData[fieldName] && !errors[fieldName]) return 'success';
    return 'default';
  };

  const getFieldIcon = (fieldName) => {
    const status = getFieldStatus(fieldName);
    if (status === 'success') return <Check className="h-4 w-4 text-white" />;
    if (status === 'error') return <X className="h-4 w-4 text-zinc-400" />;
    return null;
  };

  return (
    <div className="bg-black text-white font-mono">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className={`text-center mb-12 transition-all duration-1000 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-8">
              <div className="w-px h-12 bg-white mx-auto mb-6"></div>
              <Scissors className="h-8 w-8 text-white mx-auto rotate-45" />
              <div className="w-px h-12 bg-white mx-auto mt-6"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none">
              REGISTER
            </h1>
            
            <div className="w-16 h-px bg-white mx-auto mb-6"></div>
            
            <p className="text-xs tracking-[0.3em] text-zinc-400 uppercase">
              Create Your Account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="bg-zinc-950 border border-zinc-800 p-4 text-center">
                <p className="text-xs tracking-[0.2em] uppercase text-zinc-400">{errors.submit}</p>
              </div>
            )}

            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-black border pl-10 pr-10 py-3 text-sm tracking-wide focus:outline-none transition-colors ${
                    getFieldStatus('name') === 'error' ? 'border-zinc-600' : 
                    getFieldStatus('name') === 'success' ? 'border-white' : 'border-zinc-800'
                  } ${getFieldStatus('name') === 'success' ? 'text-white' : 'text-zinc-400'} focus:border-white`}
                  placeholder="FULL NAME"
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
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-black border pl-10 pr-10 py-3 text-sm tracking-wide focus:outline-none transition-colors ${
                    getFieldStatus('email') === 'error' ? 'border-zinc-600' : 
                    getFieldStatus('email') === 'success' ? 'border-white' : 'border-zinc-800'
                  } ${getFieldStatus('email') === 'success' ? 'text-white' : 'text-zinc-400'} focus:border-white`}
                  placeholder="EMAIL ADDRESS"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('email')}
                </div>
              </div>
              {errors.email && (
                <p className="mt-1 text-xs tracking-[0.1em] uppercase text-zinc-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={15}
                  className={`w-full bg-black border pl-10 pr-10 py-3 text-sm tracking-wide focus:outline-none transition-colors ${
                    getFieldStatus('phone') === 'error' ? 'border-zinc-600' : 
                    getFieldStatus('phone') === 'success' ? 'border-white' : 'border-zinc-800'
                  } ${getFieldStatus('phone') === 'success' ? 'text-white' : 'text-zinc-400'} focus:border-white`}
                  placeholder="PHONE (OPTIONAL)"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('phone')}
                </div>
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs tracking-[0.1em] uppercase text-zinc-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-black border pl-10 pr-10 py-3 text-sm tracking-wide focus:outline-none transition-colors ${
                    getFieldStatus('password') === 'error' ? 'border-zinc-600' : 
                    getFieldStatus('password') === 'success' ? 'border-white' : 'border-zinc-800'
                  } ${getFieldStatus('password') === 'success' ? 'text-white' : 'text-zinc-400'} focus:border-white`}
                  placeholder="PASSWORD"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('password')}
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs tracking-[0.1em] uppercase text-zinc-500">{errors.password}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-black border pl-10 pr-10 py-3 text-sm tracking-wide focus:outline-none transition-colors ${
                    getFieldStatus('confirmPassword') === 'error' ? 'border-zinc-600' : 
                    getFieldStatus('confirmPassword') === 'success' ? 'border-white' : 'border-zinc-800'
                  } ${getFieldStatus('confirmPassword') === 'success' ? 'text-white' : 'text-zinc-400'} focus:border-white`}
                  placeholder="CONFIRM PASSWORD"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('confirmPassword')}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs tracking-[0.1em] uppercase text-zinc-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="w-full h-px bg-zinc-800 my-6"></div>

            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className="w-full border border-white text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <Link 
              to="/login" 
              className="block text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors"
            >
              Already Have Account?
            </Link>
            
            <div className="w-8 h-px bg-zinc-600 mx-auto"></div>
            
            <Link 
              to="/" 
              className="block text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;