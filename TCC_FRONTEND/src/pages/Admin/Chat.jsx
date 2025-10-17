import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Search, MessageSquare, ChevronRight, Clock, Trash2 } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

const AdminChat = () => {
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchBarbers();
    // Efeito cinematográfico: animar entrada dos elementos
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  useEffect(() => {
    if (selectedBarber) {
      fetchMessages(selectedBarber.id);
      const interval = setInterval(() => fetchMessages(selectedBarber.id), 2000);
      return () => clearInterval(interval);
    }
  }, [selectedBarber]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchBarbers = async () => {
    try {
      console.log('Buscando barbeiros...');
      const response = await axios.get('https://tcc-upeo.onrender.com/api/chat/barbers');
      console.log('Resposta da API:', response.data);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        setBarbers(response.data);
        
        // Selecionar o primeiro barbeiro automaticamente
        if (!selectedBarber) {
          console.log('Selecionando barbeiro:', response.data[0]);
          setSelectedBarber(response.data[0]);
        }
      } else {
        console.log('Nenhum barbeiro encontrado');
        setError('Nenhum barbeiro encontrado. Verifique se existem barbeiros cadastrados.');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching barbers:', error);
      setError('Falha ao carregar barbeiros: ' + (error.response?.data || error.message));
      setLoading(false);
    }
  };

  const fetchMessages = async (barberId) => {
    try {
      console.log('Buscando mensagens para o barbeiro ID:', barberId);
      const response = await axios.get(`https://tcc-upeo.onrender.com/api/chat/admin-messages/${barberId}`);
      console.log('Mensagens recebidas:', response.data);
      
      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        console.error('Formato de resposta inválido:', response.data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Falha ao carregar mensagens: ' + (error.response?.data || error.message));
      setMessages([]);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedBarber) return;

    // Adicionar mensagem localmente para feedback imediato
    const tempMessage = {
      id: `temp-${Date.now()}`,
      message: newMessage,
      sender_id: 1, // Admin ID
      receiver_id: selectedBarber.id,
      created_at: new Date().toISOString()
    };
    
    setMessages([...messages, tempMessage]);
    const messageCopy = newMessage;
    setNewMessage('');

    try {
      console.log('Enviando mensagem para o barbeiro:', selectedBarber.id);
      const response = await axios.post('https://tcc-upeo.onrender.com/api/chat/send', {
        message: messageCopy,
        receiver_id: selectedBarber.id,
        sender_id: 1 // Admin ID
      });
      
      console.log('Resposta do servidor:', response.data);
      
      // Buscar mensagens atualizadas após enviar
      setTimeout(() => fetchMessages(selectedBarber.id), 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Falha ao enviar mensagem: ' + (error.response?.data || error.message));
    }
  };
  
  const cleanEmptyChats = async () => {
    try {
      if (window.confirm('Deseja remover todas as conversas vazias?')) {
        await axios.post('https://tcc-upeo.onrender.com/api/chat/clean-empty-chats');
        fetchBarbers();
        setError('');
      }
    } catch (error) {
      console.error('Error cleaning empty chats:', error);
      setError('Falha ao limpar conversas vazias');
    }
  };

  // Filtrar barbeiros com base na pesquisa
  const filteredBarbers = barbers.filter(barber => 
    barber.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    barber.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
    <div className="p-8 text-white h-screen overflow-hidden flex flex-col">
      {/* Header com efeito de entrada */}
      <div className="flex justify-between items-center mb-6">
        <div className={`transition-all duration-1000 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#c4a47c] to-[#e9d5b9] bg-clip-text text-transparent">Chat</span> com Barbeiros
          </h1>
          <p className="text-gray-400 mt-2">Gerencie suas conversas com os barbeiros</p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={cleanEmptyChats}
            className="px-4 py-2 bg-amber-700/30 text-amber-400 border border-amber-600/50 rounded-lg hover:bg-amber-700/50 transition-colors flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Conversas Vazias
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja resetar todas as conversas? Esta ação não pode ser desfeita.')) {
                axios.post('https://tcc-upeo.onrender.com/api/chat/reset-chats')
                  .then(response => {
                    alert('Todas as conversas foram resetadas com sucesso!');
                    if (selectedBarber) {
                      fetchMessages(selectedBarber.id);
                    }
                  })
                  .catch(error => {
                    console.error('Erro ao resetar conversas:', error);
                    alert('Erro ao resetar conversas. Verifique o console para mais detalhes.');
                  });
              }
            }}
            className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-600/50 rounded-lg hover:bg-red-900/50 transition-colors"
          >
            Resetar Todas Conversas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 flex-1 overflow-hidden">
        {/* Barber List */}
        <div 
          className={`col-span-1 bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 shadow-xl transition-all duration-1000 ease-out ${
            animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar barbeiros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/50 text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c4a47c] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-64px)]">
            {filteredBarbers.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-400 mb-4">Nenhum barbeiro encontrado</p>
                <button
                  onClick={async () => {
                    try {
                      // Criar um barbeiro de teste
                      const response = await axios.post('https://tcc-upeo.onrender.com/api/usuarios/cadastro', {
                        nome: 'Barbeiro Teste',
                        email: 'barbeiro@teste.com',
                        senha: 'teste123',
                        tipo: 'barbeiro'
                      });
                      
                      alert('Barbeiro de teste criado com sucesso!');
                      fetchBarbers();
                    } catch (error) {
                      console.error('Erro ao criar barbeiro de teste:', error);
                      alert('Erro ao criar barbeiro de teste. Tente novamente.');
                    }
                  }}
                  className="px-4 py-2 bg-amber-700/30 text-amber-400 border border-amber-600/50 rounded-lg hover:bg-amber-700/50 transition-colors"
                >
                  Criar Barbeiro Teste
                </button>
              </div>
            ) : (
              <div>
                {filteredBarbers.map((barber) => (
                  <div
                    key={barber.id}
                    className={`p-4 cursor-pointer transition-all duration-300 ${
                      selectedBarber?.id === barber.id 
                        ? 'bg-[#c4a47c]/20 border-l-4 border-[#c4a47c]' 
                        : 'hover:bg-black/40 border-l-4 border-transparent'
                    }`}
                    onClick={() => setSelectedBarber(barber)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`relative ${selectedBarber?.id === barber.id ? 'animate-pulse' : ''}`}>
                        <div className={`absolute -inset-0.5 rounded-full ${selectedBarber?.id === barber.id ? 'bg-[#c4a47c] blur-sm opacity-60' : 'bg-transparent'}`}></div>
                        <div className="bg-[#c4a47c] rounded-full p-2 relative">
                          <User className="h-5 w-5 text-black" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{barber.name}</p>
                        <p className="text-sm text-gray-400 truncate">{barber.email}</p>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${selectedBarber?.id === barber.id ? 'translate-x-1 text-[#c4a47c]' : ''}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div 
          className={`col-span-3 bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 shadow-xl flex flex-col transition-all duration-1000 ease-out ${
            animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {selectedBarber ? (
            <>
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-[#c4a47c] rounded-full blur-sm opacity-50"></div>
                    <div className="bg-[#c4a47c] rounded-full p-2 relative">
                      <User className="h-5 w-5 text-black" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-white">{selectedBarber.name}</p>
                    <p className="text-sm text-gray-400">{selectedBarber.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-400">Online</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-full text-center">
                    <div className="relative mb-6">
                      <div className="absolute -inset-4 bg-[#c4a47c]/20 rounded-full blur-md"></div>
                      <MessageSquare className="h-16 w-16 text-[#c4a47c] relative" />
                    </div>
                    <p className="text-gray-300 text-xl mb-2">Nenhuma mensagem ainda</p>
                    <p className="text-gray-500 text-sm">Envie uma mensagem para iniciar a conversa!</p>
                  </div>
                ) : (
                  /* No chat do admin: mensagens do admin (sender_id=1) à direita, mensagens do barbeiro à esquerda */
                  messages.map((message, index) => (
                    <div
                      key={message.id || index}
                      className={`flex ${message.sender_id === 1 ? 'justify-end' : 'justify-start'} transition-all duration-500 animate-fadeIn`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-4 ${
                          message.sender_id === 1
                            ? 'bg-gradient-to-br from-[#c4a47c] to-[#a38155] text-white shadow-lg'
                            : 'bg-gradient-to-br from-[#3f3f3f] to-[#1a1a1a] border border-white/10 text-gray-200 shadow-md'
                        }`}
                      >
                        {message.sender_id === 1 && (
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="h-4 w-4 text-white/80" />
                            <span className="font-semibold text-sm">Admin</span>
                          </div>
                        )}
                        {message.sender_id !== 1 && (
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="h-4 w-4 text-white/80" />
                            <span className="font-semibold text-sm">Barbeiro</span>
                          </div>
                        )}
                        <p className="text-sm">{message.message}</p>
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

              <div className="border-t border-white/10 p-4">
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="relative mb-6">
                <div className="absolute -inset-6 bg-[#c4a47c]/20 rounded-full blur-md animate-pulse"></div>
                <MessageSquare className="h-20 w-20 text-[#c4a47c] relative" />
              </div>
              <p className="text-gray-300 text-xl font-medium mb-2">Nenhum barbeiro selecionado</p>
              <p className="text-gray-500">Selecione um barbeiro para iniciar o chat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;