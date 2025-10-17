import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, MessageSquare, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    // Efeito cinematográfico: animar entrada dos elementos
    setTimeout(() => setAnimateIn(true), 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      if (!user || !user.id) {
        console.error('User ID not available');
        setLoading(false);
        return;
      }

      console.log('Buscando mensagens para o barbeiro ID:', user.id);
      
      // Buscar mensagens do barbeiro atual (usando seu ID real)
      const response = await axios.get(`https://tcc-upeo.onrender.com/api/chat/messages/${user.id}`);
      
      console.log('Mensagens recebidas:', response.data);
      
      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        console.error('Formato de resposta inválido:', response.data);
        setMessages([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    if (!user || !user.id) {
      setError('Erro ao enviar mensagem: ID do usuário não disponível');
      return;
    }
    
    // Criar mensagem local para feedback imediato
    const tempMessage = {
      id: `temp-${Date.now()}`,
      message: newMessage,
      sender_id: user.id,
      receiver_id: 1, // Admin ID é sempre 1
      created_at: new Date().toISOString(),
      is_read: false
    };
    
    // Adicionar à lista de mensagens exibidas
    setMessages([...messages, tempMessage]);
    
    // Limpar campo de texto
    setNewMessage('');
    
    try {
      console.log('Enviando mensagem como barbeiro ID:', user.id);
      console.log('Conteúdo da mensagem:', newMessage);
      
      // Enviar para o servidor
      const response = await axios.post('https://tcc-upeo.onrender.com/api/chat/send', {
        message: newMessage,
        sender_id: parseInt(user.id), // Garantir que é um número
        receiver_id: 1 // Admin ID é sempre 1
      });
      
      console.log('Resposta do servidor:', response.data);
      
      // Atualizar mensagens após envio
      setTimeout(fetchMessages, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-[#c4a47c] animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <MessageSquare className="h-8 w-8 text-[#c4a47c]" />
          </div>
        </div>
      </div>
    );
  }

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
        <div className="mb-8 relative">
          <div className={`text-center transition-all duration-1000 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-[#c4a47c] to-[#e9d5b9] bg-clip-text text-transparent">Chat</span> com Administrador
            </h1>
            <p className="text-gray-400 mt-2">Converse com o administrador para tirar dúvidas ou resolver problemas</p>
          </div>
          
          <div className="absolute top-0 right-0">
            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja limpar seu histórico de conversa? Esta ação não pode ser desfeita.')) {
                  axios.post(`https://tcc-upeo.onrender.com/api/chat/reset-user-chats/${user.id}`)
                    .then(response => {
                      alert('Seu histórico de conversa foi limpo com sucesso!');
                      fetchMessages();
                    })
                    .catch(error => {
                      console.error('Erro ao limpar histórico:', error);
                      // Fallback: usar o endpoint geral de resetar chats
                      axios.post('https://tcc-upeo.onrender.com/api/chat/reset-chats')
                        .then(() => {
                          alert('Seu histórico de conversa foi limpo com sucesso!');
                          fetchMessages();
                        })
                        .catch(err => {
                          alert('Erro ao limpar histórico. Tente novamente mais tarde.');
                        });
                    });
                }
              }}
              className="px-3 py-1 bg-amber-700/30 text-amber-400 text-sm border border-amber-600/50 rounded-lg hover:bg-amber-700/50 transition-colors"
            >
              Limpar Conversa
            </button>
          </div>
        </div>

        {/* Chat container */}
        <div 
          className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(196,164,124,0.15)] h-[600px] flex flex-col transition-all duration-1000 ease-out ${
            animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {/* Chat header */}
          <div className="p-4 border-b border-white/10 flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-[#c4a47c] rounded-full blur-sm opacity-50"></div>
              <div className="bg-[#c4a47c] rounded-full p-2 relative">
                <Bot className="h-5 w-5 text-black" />
              </div>
            </div>
            <div>
              <p className="font-medium text-white">Administrador Barber Club</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-400">Online agora</span>
              </div>
            </div>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-black/0 to-black/20">
            {messages.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-4 bg-[#c4a47c]/20 rounded-full blur-md animate-pulse"></div>
                  <MessageSquare className="h-16 w-16 text-[#c4a47c] relative" />
                </div>
                <p className="text-gray-300 text-xl mb-2">Nenhuma mensagem ainda</p>
                <p className="text-gray-500 text-sm">Envie uma mensagem para iniciar a conversa!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'} transition-all duration-500 animate-fadeIn`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.sender_id === user.id
                        ? 'bg-gradient-to-br from-[#c4a47c] to-[#a38155] text-white shadow-lg'
                        : 'bg-gradient-to-br from-[#3f3f3f] to-[#1a1a1a] border border-white/10 text-gray-200 shadow-md'
                    }`}
                  >
                    {message.sender_id === 1 && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="h-5 w-5" />
                        <span className="font-semibold">Administrador</span>
                      </div>
                    )}
                    <p>{message.message}</p>
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <Clock className="h-3 w-3 text-white/70" />
                      <p className="text-xs opacity-70">
                        {message.created_at ? format(new Date(message.created_at), 'h:mm a') : 'Agora'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 mx-4 mb-4 rounded-md">
              {error}
              <button 
                className="ml-2 text-red-300 underline"
                onClick={() => setError('')}
              >
                Fechar
              </button>
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-white/10 p-4 bg-black/40">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-black/50 text-white rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c4a47c] focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-[#c4a47c] to-[#a38155] hover:from-[#d5b88d] hover:to-[#b49266] text-black font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;