import React, { useState } from 'react';
import { Send, HelpCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const Support = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  // Efeito cinematográfico: animar entrada dos elementos
  React.useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Simulação de envio - em produção, substituir por chamada real à API
      // await axios.post('http://localhost:8080/api/support/send', {
      //   name,
      //   email,
      //   subject,
      //   message
      // });
      
      // Simulando um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Error submitting support request:', err);
      setError('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      {/* Overlay de fundo com efeito cinematográfico */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop)',
          filter: 'brightness(0.2) contrast(1.2) saturate(0.8)',
        }}
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header com efeito de entrada */}
        <div className={`mb-8 text-center transition-all duration-1000 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#c4a47c] to-[#e9d5b9] bg-clip-text text-transparent">Suporte</span> Barber Club
          </h1>
          <p className="text-gray-400 mt-2">Como podemos ajudar você hoje?</p>
        </div>

        {/* Formulário de suporte */}
        <div 
          className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(196,164,124,0.15)] p-8 transition-all duration-1000 ease-out ${
            animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-md animate-pulse"></div>
                <CheckCircle className="h-20 w-20 text-green-500 relative" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Mensagem Enviada!</h2>
              <p className="text-gray-400 mb-8 max-w-md">
                Obrigado por entrar em contato. Nossa equipe responderá sua mensagem em breve.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-gradient-to-r from-[#c4a47c] to-[#a38155] hover:from-[#d5b88d] hover:to-[#b49266] text-black font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Enviar Nova Mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-400 mb-2">Nome</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-black/50 text-white rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c4a47c] focus:border-transparent"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/50 text-white rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c4a47c] focus:border-transparent"
                    placeholder="seu.email@exemplo.com"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-400 mb-2">Assunto</label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full bg-black/50 text-white rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c4a47c] focus:border-transparent"
                  placeholder="Assunto da sua mensagem"
                />
              </div>
              
              <div className="mb-8">
                <label htmlFor="message" className="block text-gray-400 mb-2">Mensagem</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full bg-black/50 text-white rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c4a47c] focus:border-transparent resize-none"
                  placeholder="Descreva em detalhes como podemos ajudar..."
                />
              </div>
              
              {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-md mb-6">
                  {error}
                </div>
              )}
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#c4a47c] to-[#a38155] hover:from-[#d5b88d] hover:to-[#b49266] text-black font-medium px-8 py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* FAQ Section */}
        <div 
          className={`mt-12 transition-all duration-1000 ease-out ${
            animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            <span className="bg-gradient-to-r from-[#c4a47c] to-[#e9d5b9] bg-clip-text text-transparent">Perguntas</span> Frequentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <HelpCircle className="h-5 w-5 text-[#c4a47c] mr-2" />
                <h3 className="font-semibold">Como posso agendar um serviço?</h3>
              </div>
              <p className="text-gray-400">
                Você pode agendar um serviço através do nosso aplicativo ou site, selecionando o serviço desejado, o barbeiro e o horário disponível.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <HelpCircle className="h-5 w-5 text-[#c4a47c] mr-2" />
                <h3 className="font-semibold">Como cancelar um agendamento?</h3>
              </div>
              <p className="text-gray-400">
                Para cancelar um agendamento, acesse a seção "Meus Agendamentos" e selecione a opção de cancelamento. Lembre-se que cancelamentos devem ser feitos com pelo menos 2 horas de antecedência.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <HelpCircle className="h-5 w-5 text-[#c4a47c] mr-2" />
                <h3 className="font-semibold">Como funciona o programa de fidelidade?</h3>
              </div>
              <p className="text-gray-400">
                A cada serviço realizado, você acumula pontos que podem ser trocados por descontos ou serviços gratuitos. Consulte a tabela de pontos na seção "Fidelidade" do aplicativo.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <HelpCircle className="h-5 w-5 text-[#c4a47c] mr-2" />
                <h3 className="font-semibold">Quais formas de pagamento são aceitas?</h3>
              </div>
              <p className="text-gray-400">
                Aceitamos pagamentos em dinheiro, cartões de crédito e débito, PIX e transferências bancárias. Você também pode pagar diretamente pelo aplicativo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;