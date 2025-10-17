import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Mail, Lock, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 200);
  }, []);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'Email required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password required';
        } else if (value.length < 3) {
          newErrors.password = 'Password too short';
        } else {
          delete newErrors.password;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    validateField('email', email);
    validateField('password', password);
    
    if (Object.keys(errors).length > 0) return;
    
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  const getFieldStatus = (fieldName) => {
    if (errors[fieldName]) return 'error';
    if ((fieldName === 'email' ? email : password) && !errors[fieldName]) return 'success';
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
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className={`text-center mb-12 transition-all duration-1000 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-8">
              <div className="w-px h-12 bg-white mx-auto mb-6"></div>
              <Scissors className="h-8 w-8 text-white mx-auto rotate-45" />
              <div className="w-px h-12 bg-white mx-auto mt-6"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none">
              LOGIN
            </h1>
            
            <div className="w-16 h-px bg-white mx-auto mb-6"></div>
            
            <p className="text-xs tracking-[0.3em] text-zinc-400 uppercase">
              Access Your Account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="bg-zinc-950 border border-zinc-800 p-4 text-center">
                <p className="text-xs tracking-[0.2em] uppercase text-zinc-400">{errors.submit}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
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
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    value={password}
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
            </div>

            <div className="w-full h-px bg-zinc-800"></div>

            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className="w-full border border-white text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <Link 
              to="/forgot-password" 
              className="block text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors"
            >
              Forgot Password?
            </Link>
            
            <div className="w-8 h-px bg-zinc-600 mx-auto"></div>
            
            <Link 
              to="/register" 
              className="block text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors"
            >
              Create Account
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

export default Login;