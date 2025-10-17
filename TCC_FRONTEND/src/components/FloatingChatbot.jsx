import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, User, ArrowRight, X, Scissors, Clock, Calendar, CreditCard, Award, MapPin, Phone, HelpCircle, Star } from 'lucide-react';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Olá! Sou o assistente virtual da Barber Club. Como posso ajudar você hoje?', 
      sender: 'bot',
      icon: Scissors,
      options: [
        'Quero agendar um serviço',
        'Preciso cancelar um agendamento',
        'Dúvidas sobre o programa de fidelidade',
        'Formas de pagamento',
        'Horário de funcionamento',
        'Localização da barbearia',
        'Produtos à venda',
        'Avaliações e depoimentos'
      ]
    }
  ]);
  const [animateBackground, setAnimateBackground] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll para a última mensagem e efeitos visuais
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Ativa animação de fundo quando o chat é aberto
      setTimeout(() => setAnimateBackground(true), 300);
    } else {
      setAnimateBackground(false);
    }
  }, [messages, isOpen]);

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
      let icon = Bot;
      
      // Respostas pré-definidas baseadas em palavras-chave
      if (userMessage.toLowerCase().includes('agendar') || userMessage.toLowerCase() === 'quero agendar um serviço') {
        botResponse = 'Para agendar um serviço, você pode usar nosso aplicativo ou site. Selecione o serviço desejado, escolha o barbeiro de sua preferência e um horário disponível. Recomendamos agendar com pelo menos 24h de antecedência para garantir o horário de sua preferência.';
        options = ['Ver horários disponíveis', 'Quais serviços oferecem?', 'Quanto tempo dura um serviço?', 'Voltar ao menu principal'];
        icon = Calendar;
      } 
      else if (userMessage.toLowerCase().includes('cancelar') || userMessage.toLowerCase() === 'preciso cancelar um agendamento') {
        botResponse = 'Para cancelar um agendamento, acesse a seção "Meus Agendamentos" e selecione a opção de cancelamento. Lembre-se que cancelamentos devem ser feitos com pelo menos 2 horas de antecedência para evitar a cobrança de taxa. Cancelamentos com menos de 2 horas podem resultar em cobrança de 50% do valor do serviço.';
        options = ['Como acessar meus agendamentos?', 'Política de cancelamento', 'Posso remarcar em vez de cancelar?', 'Voltar ao menu principal'];
        icon = Clock;
      }
      else if (userMessage.toLowerCase().includes('fidelidade') || userMessage.toLowerCase() === 'dúvidas sobre o programa de fidelidade') {
        botResponse = 'Nosso programa de fidelidade funciona assim: a cada serviço realizado, você acumula pontos que podem ser trocados por descontos ou serviços gratuitos. A cada R$1 gasto, você ganha 1 ponto. Ao acumular 100 pontos, você ganha um corte de cabelo grátis. Além disso, clientes VIP (com mais de 500 pontos acumulados) têm acesso a promoções exclusivas.';
        options = ['Como consultar meus pontos?', 'Tabela de recompensas', 'Como me torno VIP?', 'Voltar ao menu principal'];
        icon = Award;
      }
      else if (userMessage.toLowerCase().includes('pagamento') || userMessage.toLowerCase() === 'formas de pagamento') {
        botResponse = 'Aceitamos diversas formas de pagamento: dinheiro, cartões de crédito e débito, PIX e transferências bancárias. Para pagamentos com cartão de crédito, oferecemos parcelamento em até 3x sem juros para compras acima de R$150. Clientes do programa de fidelidade têm 5% de desconto em pagamentos à vista.';
        options = ['Como pagar pelo app?', 'Posso parcelar?', 'Tem desconto para pagamento à vista?', 'Voltar ao menu principal'];
        icon = CreditCard;
      }
      else if (userMessage.toLowerCase().includes('horário') || userMessage.toLowerCase() === 'horário de funcionamento') {
        botResponse = 'Nossa barbearia funciona nos seguintes horários:\n\nSegunda a Sexta: 9h às 20h\nSábados: 9h às 18h\nDomingos e Feriados: 10h às 16h\n\nNos dias 24 e 31 de dezembro, funcionamos das 9h às 14h. Permanecemos fechados nos dias 25 de dezembro e 1º de janeiro.';
        options = ['Preciso agendar ou posso ir sem hora marcada?', 'Qual o melhor horário para evitar filas?', 'Voltar ao menu principal'];
        icon = Clock;
      }
      else if (userMessage.toLowerCase().includes('localização') || userMessage.toLowerCase() === 'localização da barbearia') {
        botResponse = 'Estamos localizados na Av. Paulista, 1000 - Bela Vista, São Paulo - SP, CEP 01310-100. Próximo à estação Trianon-Masp do metrô. Temos estacionamento próprio com manobrista (1h grátis para clientes) e estamos a 5 minutos a pé do Shopping Cidade São Paulo.';
        options = ['Como chegar de transporte público?', 'Tem estacionamento?', 'Ver no mapa', 'Voltar ao menu principal'];
        icon = MapPin;
      }
      else if (userMessage.toLowerCase().includes('produtos') || userMessage.toLowerCase() === 'produtos à venda') {
        botResponse = 'Oferecemos uma linha completa de produtos para cuidados masculinos: pomadas, ceras, óleos para barba, shampoos, condicionadores, perfumes e loções pós-barba das melhores marcas nacionais e importadas. Todos os produtos usados em nossos serviços estão à venda. Clientes do programa de fidelidade têm 10% de desconto na compra de produtos.';
        options = ['Quais marcas vocês trabalham?', 'Posso comprar online?', 'Preço médio dos produtos', 'Voltar ao menu principal'];
        icon = ShoppingBag;
      }
      else if (userMessage.toLowerCase().includes('avalia') || userMessage.toLowerCase() === 'avaliações e depoimentos') {
        botResponse = 'Temos orgulho de manter uma avaliação média de 4.8/5 estrelas com mais de 500 avaliações no Google. Nossos clientes destacam principalmente a qualidade do atendimento, a habilidade dos barbeiros e o ambiente aconchegante. Convidamos você a conferir os depoimentos em nossa página do Google ou Instagram.';
        options = ['Ver avaliações no Google', 'Quem são os barbeiros mais bem avaliados?', 'Como deixar uma avaliação', 'Voltar ao menu principal'];
        icon = Star;
      }
      else if (userMessage.toLowerCase().includes('serviços') || userMessage.toLowerCase() === 'quais serviços oferecem?') {
        botResponse = 'Oferecemos uma variedade de serviços para cuidados masculinos:\n\n• Corte de cabelo (R$60)\n• Barba completa (R$45)\n• Combo cabelo + barba (R$95)\n• Tratamento capilar (a partir de R$80)\n• Coloração (R$90)\n• Hidratação facial (R$70)\n• Design de sobrancelhas (R$30)\n\nTodos os serviços incluem toalha quente, massagem e produtos premium.';
        options = ['Quanto tempo dura cada serviço?', 'Quero agendar um serviço', 'Pacotes promocionais', 'Voltar ao menu principal'];
        icon = Scissors;
      }
      else if (userMessage.toLowerCase().includes('duração') || userMessage.toLowerCase() === 'quanto tempo dura um serviço?') {
        botResponse = 'A duração média dos nossos serviços é:\n\n• Corte de cabelo: 30-45 minutos\n• Barba: 20-30 minutos\n• Combo cabelo + barba: 50-60 minutos\n• Tratamento capilar: 40-60 minutos\n• Coloração: 60-90 minutos\n• Hidratação facial: 30 minutos\n• Design de sobrancelhas: 15 minutos\n\nRecomendamos sempre reservar um pouco mais de tempo para garantir uma experiência sem pressa.';
        options = ['Quero agendar um serviço', 'Preciso chegar antes do horário?', 'Voltar ao menu principal'];
        icon = Clock;
      }
      else if (userMessage.toLowerCase().includes('barbeiros') || userMessage.toLowerCase() === 'quem são os barbeiros?') {
        botResponse = 'Nossa equipe é formada por 8 barbeiros profissionais, todos com mais de 5 anos de experiência e certificações internacionais. Cada um tem sua especialidade, desde cortes clássicos até estilos modernos e técnicas de barbearia tradicional. Você pode ver o perfil de cada um no nosso site ou app, com fotos dos trabalhos realizados para escolher o profissional que melhor atende seu estilo.';
        options = ['Como escolher meu barbeiro?', 'Barbeiros especialistas em barba', 'Voltar ao menu principal'];
        icon = Scissors;
      }
      else if (userMessage.toLowerCase().includes('contato') || userMessage.toLowerCase() === 'como entrar em contato?') {
        botResponse = 'Você pode entrar em contato conosco pelos seguintes canais:\n\n• Telefone: (11) 3456-7890\n• WhatsApp: (11) 98765-4321\n• Email: contato@barberclub.com.br\n• Instagram: @barbercluboficial\n\nNosso horário de atendimento telefônico é de segunda a sábado, das 9h às 19h.';
        options = ['Falar com atendente humano', 'Enviar mensagem no WhatsApp', 'Voltar ao menu principal'];
        icon = Phone;
      }
      else if (userMessage.toLowerCase() === 'voltar ao menu principal') {
        botResponse = 'Como posso ajudar você hoje?';
        options = [
          'Quero agendar um serviço',
          'Preciso cancelar um agendamento',
          'Dúvidas sobre o programa de fidelidade',
          'Formas de pagamento',
          'Horário de funcionamento',
          'Localização da barbearia',
          'Produtos à venda',
          'Avaliações e depoimentos'
        ];
        icon = Scissors;
      }
      else {
        botResponse = 'Desculpe, não entendi completamente. Poderia escolher uma das opções abaixo ou reformular sua pergunta?';
        options = [
          'Quero agendar um serviço',
          'Preciso cancelar um agendamento',
          'Dúvidas sobre o programa de fidelidade',
          'Formas de pagamento',
          'Horário de funcionamento',
          'Localização da barbearia',
          'Produtos à venda',
          'Avaliações e depoimentos',
          'Como entrar em contato?'
        ];
        icon = HelpCircle;
      }
      
      setMessages(prev => [...prev, {
        id: prev.length + 2,
        text: botResponse,
        sender: 'bot',
        options: options,
        icon: icon
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
    <>
      {/* Botão flutuante com efeito de pulso */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-gradient-to-r from-[#c4a47c] to-[#a38155] hover:from-[#d5b88d] hover:to-[#b49266]'
        }`}
      >
        <div className={`absolute -inset-2 rounded-full ${!isOpen ? 'bg-[#c4a47c]/30 animate-ping' : ''}`}></div>
        {isOpen ? (
          <X className="h-6 w-6 text-white relative z-10" />
        ) : (
          <MessageSquare className="h-6 w-6 text-black relative z-10" />
        )}
      </button>

      {/* Chatbot container com efeito cinematográfico */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(196,164,124,0.3)] flex flex-col animate-fadeIn">
          {/* Efeito de fundo animado */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className={`absolute inset-0 opacity-10 transition-opacity duration-1000 ${animateBackground ? 'opacity-20' : 'opacity-0'}`}
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80")',
                backgroundSize: 'cover',
                filter: 'brightness(0.4) contrast(1.2) saturate(0.8)',
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
          </div>
          {/* Header com efeito cinematográfico */}
          <div className="bg-gradient-to-r from-[#c4a47c] to-[#a38155] p-4 flex items-center relative z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-[#c4a47c]/80 to-[#a38155]/80 opacity-80"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <div className="relative flex items-center">
              <div className="relative mr-2">
                <div className="absolute -inset-1 bg-black rounded-full blur-sm opacity-20"></div>
                <Scissors className="h-6 w-6 text-black relative" />
              </div>
              <div>
                <h3 className="font-bold text-black text-shadow">Assistente Barber Club</h3>
                <p className="text-xs text-black/80">Online | Resposta em instantes</p>
              </div>
            </div>
          </div>
          
          {/* Messages area com efeito cinematográfico */}
          <div className="flex-1 overflow-y-auto p-4 max-h-96 space-y-4 relative z-10">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-4 ${msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[80%] rounded-2xl p-3 backdrop-blur-sm shadow-lg
                    ${msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-[#c4a47c] to-[#a38155] text-black ml-auto border border-[#c4a47c]/30' 
                      : 'bg-black/60 text-white border border-white/10'
                    }
                  `}
                >
                  <div className="flex items-start">
                    {msg.sender === 'bot' ? (
                      <div className="relative mr-2 mt-1">
                        <div className="absolute -inset-1 bg-[#c4a47c]/30 rounded-full blur-sm"></div>
                        {msg.icon ? <msg.icon className="h-4 w-4 flex-shrink-0 relative" /> : <Bot className="h-4 w-4 flex-shrink-0 relative" />}
                      </div>
                    ) : (
                      <div className="relative mr-2 mt-1">
                        <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm"></div>
                        <User className="h-4 w-4 flex-shrink-0 relative" />
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  </div>
                  
                  {/* Opções de resposta rápida com efeito cinematográfico */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="bg-black/40 hover:bg-[#c4a47c]/30 text-white text-xs px-3 py-1.5 rounded-full flex items-center transition-all duration-300 border border-white/10 hover:border-[#c4a47c]/30 backdrop-blur-sm hover:scale-105"
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
            
            {/* Indicador de digitação com efeito cinematográfico */}
            {isTyping && (
              <div className="flex items-center mb-4">
                <div className="bg-black/60 border border-white/10 backdrop-blur-sm text-white rounded-2xl p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-[#c4a47c]/30 rounded-full blur-sm"></div>
                      <Scissors className="h-4 w-4 relative" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#c4a47c] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#c4a47c] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#c4a47c] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Referência para scroll automático */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area com efeito cinematográfico */}
          <form 
            onSubmit={handleSendMessage}
            className="border-t border-white/10 p-3 bg-black/60 relative z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#c4a47c]/5 to-transparent opacity-70"></div>
            <div className="flex items-center relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-black/50 text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c4a47c] focus:border-transparent backdrop-blur-sm"
              />
              <button
                type="submit"
                className="ml-2 bg-gradient-to-r from-[#c4a47c] to-[#a38155] hover:from-[#d5b88d] hover:to-[#b49266] text-black p-2 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(196,164,124,0.5)] hover:scale-105"
                disabled={inputMessage.trim() === ''}
              >
                <div className="relative">
                  <div className={`absolute -inset-1 bg-black rounded-full blur-sm opacity-20 ${inputMessage.trim() !== '' ? 'animate-pulse' : ''}`}></div>
                  <Send className="h-4 w-4 relative" />
                </div>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;