import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Mail, ChevronRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Efeito cinematográfico: animar entrada dos elementos
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Aqui você conectaria com o backend para enviar o email de recuperação
      // Simulando uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular sucesso
      setSuccess(true);
    } catch (err) {
      setError('Falha ao enviar email de recuperação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black">
      {/* Overlay de fundo com efeito cinematográfico */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop)',
          filter: 'brightness(0.2) contrast(1.2) saturate(0.8)',
        }}
      />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div 
          className={`text-center transition-all duration-1000 ease-out ${
            animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-[#c4a47c] rounded-full blur-md opacity-70"></div>
              <Scissors className="relative h-16 w-16 text-black bg-[#c4a47c] p-3 rounded-full" />
            </div>
          </div>
          <h2 className="text-4xl font-bold">
            Recuperar <span className="bg-gradient-to-r from-[#c4a47c] to-[#e9d5b9] bg-clip-text text-transparent">Senha</span>
          </h2>
          <p className="mt-2 text-gray-400">
            {success 
              ? 'Enviamos instruções para redefinir sua senha' 
              : 'Informe seu email para receber instruções de recuperação'}
          </p>
        </div>

        <div 
          className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(196,164,124,0.15)] p-8 transition-all duration-1000 ease-out ${
            animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {success ? (
            <div className="text-center">
              <div className="bg-green-900/20 border border-green-500/30 text-green-300 p-4 rounded-lg mb-6">
                <p>Email enviado com sucesso!</p>
                <p className="text-sm mt-2">Verifique sua caixa de entrada para instruções sobre como redefinir sua senha.</p>
              </div>
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-[#c4a47c] to-[#a38155] hover:from-[#d5b88d] hover:to-[#b49266] text-black font-bold w-full py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Voltar para Login</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 text-white rounded-lg px-4 py-3 pl-10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c4a47c] focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#c4a47c] to-[#a38155] hover:from-[#d5b88d] hover:to-[#b49266] text-black font-bold w-full py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </div>
                ) : (
                  <span>Enviar Instruções</span>
                )}
              </button>
            </form>
          )}
        </div>
        
        <div 
          className={`text-center transition-all duration-1000 ease-out ${
            animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <Link 
            to="/login" 
            className="inline-flex items-center text-gray-400 hover:text-[#c4a47c] transition-colors mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Voltar para login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;