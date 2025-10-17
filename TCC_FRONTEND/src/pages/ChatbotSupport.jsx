import React, { useState, useEffect, useRef } from 'react';
import { Send, HelpCircle, Bot, User, ArrowRight } from 'lucide-react';

const ChatbotSupport = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Olá! Sou o assistente virtual da Barber Club. Como posso ajudar você hoje?', 
      sender: 'bot',
      options: [
        'Quero agendar um serviço',
        'Preciso cancelar um agendamento',
        'Dúvidas sobre o programa de fidelidade',
        'Formas de pagamento',
        'Outro assunto'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const messagesEndRef = useRef(null);

  // Efeito cinematográfico: animar entrada dos elementos
  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  // Scroll para a última mensagem
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simula resposta do bot
  const handleBotResponse = (userMessage) => {
    setIsTyping(true);
    
    // Simula um atraso de digitação do bot
    setTimeout(() => {
      let botResponse = '';
      let options = [];
      
      // Respostas pré-definidas baseadas em palavras-chave
      if (userMessage.toLowerCase().includes('agendar') || userMessage.toLowerCase() === 'quero agendar um serviço') {
        botResponse = 'Para agendar um serviço, você pode usar nosso aplicativo ou site. Selecione o serviço desejado, escolha o barbeiro de sua preferência e um horário disponível. Gostaria de ver os horários disponíveis agora?';
        options = ['Ver horários disponíveis', 'Quais serviços oferecem?', 'Voltar ao menu principal'];
      } 
      else if (userMessage.toLowerCase().includes('cancelar') || userMessage.toLowerCase() === 'preciso cancelar um agendamento') {
        botResponse = 'Para cancelar um agendamento, acesse a seção "Meus Agendamentos" e selecione a opção de cancelamento. Lembre-se que cancelamentos devem ser feitos com pelo menos 2 horas de antecedência para evitar cobranças.';
        options = ['Como acessar meus agendamentos?', 'Política de cancelamento', 'Voltar ao menu principal'];
      }
      else if (userMessage.toLowerCase().includes('fidelidade') || userMessage.toLowerCase() === 'dúvidas sobre o programa de fidelidade') {
        botResponse = 'Nosso programa de fidelidade funciona assim: a cada serviço realizado, você acumula pontos que podem ser trocados por descontos ou serviços gratuitos. Por exemplo, a cada 10 pontos, você ganha um corte de cabelo grátis!';
        options = ['Como consultar meus pontos?', 'Tabela de recompensas', 'Voltar ao menu principal'];
      }
      else if (userMessage.toLowerCase().includes('pagamento') || userMessage.toLowerCase() === 'formas de pagamento') {
        botResponse = 'Aceitamos diversas formas de pagamento: dinheiro, cartões de crédito e débito, PIX e transferências bancárias. Você também pode pagar diretamente pelo aplicativo para maior comodidade.';
        options = ['Como pagar pelo app?', 'Posso parcelar?', 'Voltar ao menu principal'];
      }
      else if (userMessage.toLowerCase() === 'voltar ao menu principal') {
        botResponse = 'Como posso ajudar você hoje?';
        options = [
          'Quero agendar um serviço',
          'Preciso cancelar um agendamento',
          'Dúvidas sobre o programa de fidelidade',
          'Formas de pagamento',
          'Outro assunto'
        ];
      }
      else if (userMessage.toLowerCase() === 'outro assunto') {
        botResponse = 'Para assuntos mais específicos, você pode entrar em contato diretamente com nossa equipe. Gostaria de falar com um atendente humano?';
        options = ['Sim, falar com atendente', 'Não, continuar no chatbot', 'Voltar ao menu principal'];
      }
      else if (userMessage.toLowerCase().includes('atendente') || userMessage.toLowerCase() === 'sim, falar com atendente') {
        botResponse = 'Entendi que você precisa de ajuda com um assunto mais específico. Por favor, informe seu nome e email para que um de nossos atendentes entre em contato o mais breve possível.';
        options = ['Voltar ao menu principal'];
      }
      else {
        botResponse = 'Desculpe, não entendi completamente. Poderia escolher uma das opções abaixo ou reformular sua pergunta?';
        options = [
          'Quero agendar um serviço',
          'Preciso cancelar um agendamento',
          'Dúvidas sobre o programa de fidelidade',
          'Formas de pagamento',
          'Outro assunto'
        ];
      }
      
      setMessages(prev => [...prev, {
        id: prev.length + 2,
        text: botResponse,
        sender: 'bot',
        options: options
      }]);
      
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;
    
    // Adiciona mensagem do usuário
    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    
    // Gera resposta do bot
    handleBotResponse(inputMessage);
  };

  const handleOptionClick = (option) => {
    // Adiciona a opção selecionada como mensagem do usuário
    const newUserMessage = {
      id: messages.length + 1,
      text: option,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Gera resposta do bot
    handleBotResponse(option);
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
      
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header com efeito de entrada */}
        <div className={`mb-8 text-center transition-all duration-1000 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#c4a47c] to-[#e9d5b9] bg-clip-text text-transparent">Suporte</span> Barber Club
          </h1>
          <p className="text-gray-400 mt-2">Assistente virtual para ajudar com suas dúvidas</p>
        </div>

        {/* Chatbot Interface */}
        <div 
          className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(196,164,124,0.15)] transition-all duration-1000 ease-out ${
            animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ transitionDelay: '200ms', height: '70vh', display: 'flex', flexDirection: 'column' }}
        >
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-4 ${msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[80%] rounded-2xl p-4 
                    ${msg.sender === 'user' 
                      ? 'bg-[#c4a47c] text-black ml-auto' 
                      : 'bg-gray-800 text-white'
                    }
                  `}
                >
                  <div className="flex items-start mb-2">
                    {msg.sender === 'bot' ? (
                      <Bot className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                    ) : (
                      <User className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {msg.sender === 'bot' ? 'Assistente Barber Club' : 'Você'}
                      </p>
                      <p className="mt-1">{msg.text}</p>
                    </div>
                  </div>
                  
                  {/* Opções de resposta rápida */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {msg.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="bg-black/30 hover:bg-black/50 text-white text-sm px-3 py-2 rounded-full flex items-center transition-colors"
                        >
                          {option}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Indicador de digitação */}
            {isTyping && (
              <div className="flex items-center mb-4">
                <div className="bg-gray-800 text-white rounded-2xl p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Referência para scroll automático */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <form 
            onSubmit={handleSendMessage}
            className="border-t border-white/10 p-4 bg-black/60"
          >
            <div className="flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-black/50 text-white rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c4a47c] focus:border-transparent"
              />
              <button
                type="submit"
                className="ml-2 bg-gradient-to-r from-[#c4a47c] to-[#a38155] hover:from-[#d5b88d] hover:to-[#b49266] text-black font-medium p-3 rounded-lg transition-colors"
                disabled={inputMessage.trim() === ''}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
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

export default ChatbotSupport;