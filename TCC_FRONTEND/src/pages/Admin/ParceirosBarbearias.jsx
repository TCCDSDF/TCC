import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Plus, Edit, Trash2, X, Check, AlertCircle, Eye, EyeOff, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../styles/razormap.css';
import axios from 'axios';

const ParceirosBarbearias = () => {
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentBarbearia, setCurrentBarbearia] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    endereco: '',
    telefone: '',
    horarioAbertura: '09:00',
    horarioFechamento: '20:00',
    diasFuncionamento: 'Segunda a Sábado',
    latitude: '',
    longitude: '',
    fotoBarbearia: '',
    screenshot: '',
    ativo: true,
    parceira: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Efeito cinematográfico: animar entrada dos elementos
  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);
  
  // Verificar se o Leaflet está carregado
  useEffect(() => {
    if (window.L) {
      console.log('Leaflet API já está carregada');
      setMapLoaded(true);
    } else {
      console.log('Aguardando carregamento do Leaflet...');
      // Verificar periodicamente se o Leaflet foi carregado
      const checkLeaflet = setInterval(() => {
        if (window.L) {
          console.log('Leaflet API detectada');
          clearInterval(checkLeaflet);
          setMapLoaded(true);
        }
      }, 500);
      
      // Limpar o intervalo se o componente for desmontado
      return () => clearInterval(checkLeaflet);
    }
  }, []);

  // Buscar barbearias
  useEffect(() => {
    fetchBarbearias();
  }, []);

  const fetchBarbearias = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/barbearias');
      setBarbearias(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar barbearias:", err);
      setError('Falha ao carregar barbearias. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpar erro do campo quando o usuário digita
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // Se o endereço for alterado, buscar coordenadas
    if (name === 'endereco' && value.trim().length > 10 && mapLoaded) {
      buscarCoordenadas(value);
    }
  };
  
  // Buscar coordenadas a partir do endereço usando Nominatim (OpenStreetMap)
  const buscarCoordenadas = (endereco) => {
    if (!mapLoaded) return;
    
    // Usar a API de geocodificação do OpenStreetMap (Nominatim)
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const location = data[0];
          const lat = parseFloat(location.lat);
          const lng = parseFloat(location.lon);
          
          setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
          }));
          
          // Atualizar o mapa e o marcador
          if (mapInstanceRef.current) {
            const position = [lat, lng];
            mapInstanceRef.current.setView(position, 15);
            
            // Criar ícone personalizado para o marcador
            const barberIcon = L.divIcon({
              html: `<div style="color: #c4a47c; display: flex; align-items: center; justify-content: center;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M7 20.662V9C7 7.343 8.343 6 10 6h4c1.657 0 3 1.343 3 3v11.662M7 20.662c0 .92.746 1.667 1.667 1.667h6.666c.92 0 1.667-.746 1.667-1.667M7 20.662l-1.829-1.828M17 20.662l1.828-1.828M15 9h2M7 9h2M11 9h2"></path>
                        <path d="M11 13v2"></path>
                        <path d="M14 13v2"></path>
                      </svg>
                    </div>`,
              className: 'barber-marker',
              iconSize: [30, 30]
            });
            
            if (markerRef.current) {
              markerRef.current.setLatLng(position);
            } else {
              markerRef.current = L.marker(position, {
                icon: barberIcon,
                draggable: true
              }).addTo(mapInstanceRef.current);
              
              // Atualizar coordenadas quando o marcador é arrastado
              markerRef.current.on('dragend', () => {
                const newPos = markerRef.current.getLatLng();
                setFormData(prev => ({
                  ...prev,
                  latitude: newPos.lat,
                  longitude: newPos.lng
                }));
              });
            }
          }
        }
      })
      .catch(error => {
        console.error('Erro ao buscar coordenadas:', error);
      });
  };
  
  // Inicializar o mapa quando o modal é aberto
  useEffect(() => {
    // Limpar mapa existente se houver
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    }
    
    if (showModal && mapLoaded && mapRef.current) {
      if (!window.L) return;
      
      // Coordenadas iniciais (São Paulo)
      const initialPosition = [-23.5505, -46.6333];
      
      // Usar coordenadas da barbearia se estiver editando
      const position = formData.latitude && formData.longitude
        ? [parseFloat(formData.latitude), parseFloat(formData.longitude)]
        : initialPosition;
      
      // Criar o mapa com um pequeno timeout para garantir que o DOM está pronto
      setTimeout(() => {
        try {
          // Criar o mapa
          const map = L.map(mapRef.current).setView(position, 13);
          
          // Adicionar camada de mapa escuro
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
          }).addTo(map);
          
          mapInstanceRef.current = map;
          
          // Criar ícone personalizado para o marcador
          const barberIcon = L.divIcon({
            html: `<div style="color: #c4a47c; display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M7 20.662V9C7 7.343 8.343 6 10 6h4c1.657 0 3 1.343 3 3v11.662M7 20.662c0 .92.746 1.667 1.667 1.667h6.666c.92 0 1.667-.746 1.667-1.667M7 20.662l-1.829-1.828M17 20.662l1.828-1.828M15 9h2M7 9h2M11 9h2"></path>
                      <path d="M11 13v2"></path>
                      <path d="M14 13v2"></path>
                    </svg>
                  </div>`,
            className: 'barber-marker',
            iconSize: [30, 30]
          });
          
          // Adicionar marcador se houver coordenadas
          if (formData.latitude && formData.longitude) {
            markerRef.current = L.marker(position, {
              icon: barberIcon,
              draggable: true
            }).addTo(map);
            
            // Atualizar coordenadas quando o marcador é arrastado
            markerRef.current.on('dragend', () => {
              const newPos = markerRef.current.getLatLng();
              setFormData(prev => ({
                ...prev,
                latitude: newPos.lat,
                longitude: newPos.lng
              }));
            });
          }
          
          // Adicionar evento de clique no mapa para adicionar/mover o marcador
          map.on('click', (e) => {
            const newPos = e.latlng;
            
            setFormData(prev => ({
              ...prev,
              latitude: newPos.lat,
              longitude: newPos.lng
            }));
            
            if (markerRef.current) {
              markerRef.current.setLatLng(newPos);
            } else {
              markerRef.current = L.marker(newPos, {
                icon: barberIcon,
                draggable: true
              }).addTo(map);
              
              // Atualizar coordenadas quando o marcador é arrastado
              markerRef.current.on('dragend', () => {
                const pos = markerRef.current.getLatLng();
                setFormData(prev => ({
                  ...prev,
                  latitude: pos.lat,
                  longitude: pos.lng
                }));
              });
            }
          });
        } catch (error) {
          console.error('Erro ao inicializar mapa:', error);
        }
      }, 100);
    }
  }, [showModal, mapLoaded]);
  
  // Limpar referências do mapa quando o modal é fechado
  useEffect(() => {
    if (!showModal && mapInstanceRef.current) {
      mapInstanceRef.current.remove(); // Remover o mapa do Leaflet
      mapInstanceRef.current = null;
      markerRef.current = null;
    }
  }, [showModal]);

  const validateForm = () => {
    const errors = {};
    if (!formData.nome) errors.nome = 'Nome é obrigatório';
    if (!formData.endereco) errors.endereco = 'Endereço é obrigatório';
    if (!formData.telefone) errors.telefone = 'Telefone é obrigatório';
    if (!formData.latitude) errors.latitude = 'Latitude é obrigatória';
    if (!formData.longitude) errors.longitude = 'Longitude é obrigatória';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (currentBarbearia) {
        // Atualizar barbearia existente
        await axios.put(`http://localhost:8080/api/barbearias/${currentBarbearia.id}`, formData);
        
        // Atualizar a lista local
        setBarbearias(barbearias.map(b => 
          b.id === currentBarbearia.id ? { ...formData, id: currentBarbearia.id } : b
        ));
      } else {
        // Criar nova barbearia
        const response = await axios.post('http://localhost:8080/api/barbearias', formData);
        
        // Adicionar à lista local
        setBarbearias([...barbearias, response.data]);
      }
      
      // Fechar modal e limpar formulário
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Erro ao salvar barbearia:", err);
      setError('Falha ao salvar barbearia. Tente novamente.');
      
      // Mostrar mensagem de erro ao usuário
      setError(`Falha ao salvar barbearia: ${err.response?.data?.error || err.message}`);
      return;
      setShowModal(false);
      resetForm();
    }
  };

  const handleEdit = (barbearia) => {
    setCurrentBarbearia(barbearia);
    setFormData({
      nome: barbearia.nome,
      descricao: barbearia.descricao || '',
      endereco: barbearia.endereco,
      telefone: barbearia.telefone || '',
      horarioAbertura: barbearia.horarioAbertura || '09:00',
      horarioFechamento: barbearia.horarioFechamento || '20:00',
      diasFuncionamento: barbearia.diasFuncionamento || 'Segunda a Sábado',
      latitude: barbearia.latitude,
      longitude: barbearia.longitude,
      fotoBarbearia: barbearia.fotoBarbearia || '',
      screenshot: barbearia.screenshot || '',
      ativo: barbearia.ativo,
      parceira: barbearia.parceira
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/barbearias/${id}`);
      setBarbearias(barbearias.filter(b => b.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Erro ao excluir barbearia:", err);
      setError('Falha ao excluir barbearia. Tente novamente.');
      
      // Mostrar mensagem de erro ao usuário
      setError(`Falha ao excluir barbearia: ${err.response?.data?.error || err.message}`);
      setDeleteConfirmId(null);
    }
  };

  const toggleStatus = async (barbearia) => {
    try {
      const updatedBarbearia = { ...barbearia, ativo: !barbearia.ativo };
      await axios.put(`http://localhost:8080/api/barbearias/${barbearia.id}`, updatedBarbearia);
      
      // Atualizar a lista local
      setBarbearias(barbearias.map(b => 
        b.id === barbearia.id ? updatedBarbearia : b
      ));
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      setError('Falha ao atualizar status. Tente novamente.');
      
      // Mostrar mensagem de erro ao usuário
      setError(`Falha ao atualizar status: ${err.response?.data?.error || err.message}`);
    }
  };

  const resetForm = () => {
    setCurrentBarbearia(null);
    setFormData({
      nome: '',
      descricao: '',
      endereco: '',
      telefone: '',
      horarioAbertura: '09:00',
      horarioFechamento: '20:00',
      diasFuncionamento: 'Segunda a Sábado',
      latitude: '',
      longitude: '',
      fotoBarbearia: '',
      screenshot: '',
      ativo: true,
      parceira: true
    });
    setFormErrors({});
  };

  // Filtrar barbearias por termo de busca
  const barbeariasFiltered = barbearias.filter(barbearia => 
    barbearia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barbearia.endereco.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 text-white">
      {/* Header com efeito de entrada */}
      <div className={`mb-8 transition-all duration-1000 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-[#c4a47c] to-[#e9d5b9] bg-clip-text text-transparent">Razor</span>Map
            </h1>
            <p className="text-gray-400 mt-2">Gerencie as barbearias parceiras do sistema</p>
          </div>
          
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-[#c4a47c] to-[#a38155] hover:from-[#d5b88d] hover:to-[#b49266] text-black font-medium px-6 py-3 rounded-lg transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Barbearia
          </button>
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div 
        className={`mb-8 transition-all duration-1000 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transitionDelay: '200ms' }}
      >
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar barbearias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/50 backdrop-blur-md text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c4a47c] focus:border-transparent"
          />
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-200 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Tabela de barbearias */}
      <div 
        className={`bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-hidden transition-all duration-1000 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transitionDelay: '400ms' }}
      >
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-[#c4a47c] animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <MapPin className="h-6 w-6 text-[#c4a47c]" />
              </div>
            </div>
          </div>
        ) : barbeariasFiltered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">Nenhuma barbearia encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black/60">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Barbearia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Endereço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {barbeariasFiltered.map((barbearia) => (
                  <tr 
                    key={barbearia.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                          <img 
                            src={barbearia.fotoBarbearia || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70"} 
                            alt={barbearia.nome}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-white">{barbearia.nome}</div>
                          <div className="text-xs text-gray-400">
                            {barbearia.parceira ? (
                              <span className="text-[#c4a47c]">Parceira</span>
                            ) : (
                              <span className="text-gray-400">Não parceira</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-[#c4a47c]" />
                        {barbearia.endereco}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{barbearia.telefone}</td>
                    <td className="px-6 py-4">
                      <span 
                        className={`px-2 py-1 text-xs rounded-full ${
                          barbearia.ativo 
                            ? 'bg-green-900/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-900/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {barbearia.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleStatus(barbearia)}
                          className={`p-2 rounded-lg ${
                            barbearia.ativo 
                              ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40' 
                              : 'bg-green-900/20 text-green-400 hover:bg-green-900/40'
                          } transition-colors`}
                          title={barbearia.ativo ? 'Desativar' : 'Ativar'}
                        >
                          {barbearia.ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <Link
                          to="/razormap"
                          className="p-2 rounded-lg bg-[#c4a47c]/20 text-[#c4a47c] hover:bg-[#c4a47c]/40 transition-colors"
                          title="Ver no RazorMap"
                        >
                          <MapPin className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(barbearia)}
                          className="p-2 rounded-lg bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {deleteConfirmId === barbearia.id ? (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleDelete(barbearia.id)}
                              className="p-2 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/60 transition-colors"
                              title="Confirmar exclusão"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-2 rounded-lg bg-gray-800/40 text-gray-400 hover:bg-gray-800/60 transition-colors"
                              title="Cancelar"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(barbearia.id)}
                            className="p-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de formulário */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div 
            className="bg-black/90 border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {currentBarbearia ? 'Editar Barbearia' : 'Nova Barbearia'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-3">
                  <label className="block text-gray-400 mb-1 text-sm">Nome da Barbearia</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className={`w-full bg-black/50 text-white rounded-lg px-3 py-2 border ${
                      formErrors.nome ? 'border-red-500' : 'border-white/10'
                    } focus:outline-none focus:ring-1 focus:ring-[#c4a47c] focus:border-transparent`}
                    placeholder="Nome da barbearia"
                  />
                  {formErrors.nome && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.nome}</p>
                  )}
                </div>
                
                <div className="col-span-3">
                  <label className="block text-gray-400 mb-1 text-sm">Descrição</label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-black/50 text-white rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#c4a47c] focus:border-transparent resize-none"
                    placeholder="Descrição da barbearia"
                  />
                </div>
                
                <div className="col-span-3">
                  <label className="block text-gray-400 mb-1 text-sm">Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    className={`w-full bg-black/50 text-white rounded-lg px-3 py-2 border ${
                      formErrors.endereco ? 'border-red-500' : 'border-white/10'
                    } focus:outline-none focus:ring-1 focus:ring-[#c4a47c] focus:border-transparent`}
                    placeholder="Endereço completo"
                  />
                  {formErrors.endereco && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.endereco}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className={`w-full bg-black/50 text-white rounded-lg px-3 py-2 border ${
                      formErrors.telefone ? 'border-red-500' : 'border-white/10'
                    } focus:outline-none focus:ring-1 focus:ring-[#c4a47c] focus:border-transparent`}
                    placeholder="(00) 0000-0000"
                  />
                  {formErrors.telefone && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.telefone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">Dias de Funcionamento</label>
                  <input
                    type="text"
                    name="diasFuncionamento"
                    value={formData.diasFuncionamento}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 text-white rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#c4a47c] focus:border-transparent"
                    placeholder="Segunda a Sábado"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">Horário</label>
                  <div className="flex space-x-2">
                    <input
                      type="time"
                      name="horarioAbertura"
                      value={formData.horarioAbertura}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 text-white rounded-lg px-2 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#c4a47c] focus:border-transparent"
                    />
                    <span className="text-gray-400 self-center">até</span>
                    <input
                      type="time"
                      name="horarioFechamento"
                      value={formData.horarioFechamento}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 text-white rounded-lg px-2 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#c4a47c] focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="col-span-3">
                  <label className="block text-gray-400 mb-1 text-sm">Localização no Mapa</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-gray-400 mb-1 text-xs">Latitude</label>
                          <input
                            type="text"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleInputChange}
                            className={`w-full bg-black/50 text-white rounded-lg px-2 py-1 border ${
                              formErrors.latitude ? 'border-red-500' : 'border-white/10'
                            } focus:outline-none focus:ring-1 focus:ring-[#c4a47c] focus:border-transparent`}
                            placeholder="-23.5505"
                          />
                          {formErrors.latitude && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.latitude}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 mb-1 text-xs">Longitude</label>
                          <input
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleInputChange}
                            className={`w-full bg-black/50 text-white rounded-lg px-2 py-1 border ${
                              formErrors.longitude ? 'border-red-500' : 'border-white/10'
                            } focus:outline-none focus:ring-1 focus:ring-[#c4a47c] focus:border-transparent`}
                            placeholder="-46.6333"
                          />
                          {formErrors.longitude && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.longitude}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        Clique no mapa para definir a localização ou arraste o marcador para ajustar.
                      </p>
                    </div>
                    
                    <div className="md:w-2/3">
                      <div 
                        ref={mapRef} 
                        className="w-full h-[200px] rounded-lg overflow-hidden border border-white/10"
                      >
                        {!mapLoaded && (
                          <div className="w-full h-full flex justify-center items-center bg-gray-900">
                            <div className="relative">
                              <div className="h-10 w-10 rounded-full border-t-2 border-b-2 border-[#c4a47c] animate-spin"></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <MapPin className="h-4 w-4 text-[#c4a47c]" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-1 text-sm">Foto da Barbearia</label>
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          name="fotoBarbearia"
                          value={formData.fotoBarbearia}
                          onChange={handleInputChange}
                          className="flex-1 bg-black/50 text-white rounded-lg px-2 py-1 text-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#c4a47c] focus:border-transparent"
                          placeholder="URL da imagem"
                        />
                        <label className="cursor-pointer bg-black/60 border border-[#c4a47c] text-[#c4a47c] px-2 py-1 text-sm rounded-lg hover:bg-[#c4a47c]/10 transition-colors">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({
                                    ...formData,
                                    fotoBarbearia: reader.result
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                      
                      {formData.fotoBarbearia && (
                        <div className="relative w-full h-32 bg-black/30 rounded-lg overflow-hidden border border-white/10">
                          <img 
                            src={formData.fotoBarbearia} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/400x200?text=Imagem+Inv%C3%A1lida';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, fotoBarbearia: ''})}
                            className="absolute top-1 right-1 p-1 bg-black/70 rounded-full hover:bg-black/90 transition-colors"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-1 text-sm">Screenshot da Barbearia</label>
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          name="screenshot"
                          value={formData.screenshot || ''}
                          onChange={handleInputChange}
                          className="flex-1 bg-black/50 text-white rounded-lg px-2 py-1 text-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#c4a47c] focus:border-transparent"
                          placeholder="URL do screenshot"
                        />
                        <label className="cursor-pointer bg-black/60 border border-[#c4a47c] text-[#c4a47c] px-2 py-1 text-sm rounded-lg hover:bg-[#c4a47c]/10 transition-colors">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({
                                    ...formData,
                                    screenshot: reader.result
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                      
                      {formData.screenshot && (
                        <div className="relative w-full h-32 bg-black/30 rounded-lg overflow-hidden border border-white/10">
                          <img 
                            src={formData.screenshot} 
                            alt="Screenshot Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/400x200?text=Screenshot+Inv%C3%A1lido';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, screenshot: ''})}
                            className="absolute top-1 right-1 p-1 bg-black/70 rounded-full hover:bg-black/90 transition-colors"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="col-span-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="ativo"
                        name="ativo"
                        checked={formData.ativo}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#c4a47c] focus:ring-[#c4a47c] border-white/30 rounded"
                      />
                      <label htmlFor="ativo" className="ml-2 text-gray-300 text-sm">
                        Ativo
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="parceira"
                        name="parceira"
                        checked={formData.parceira}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#c4a47c] focus:ring-[#c4a47c] border-white/30 rounded"
                      />
                      <label htmlFor="parceira" className="ml-2 text-gray-300 text-sm">
                        Parceira
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#c4a47c] to-[#a38155] hover:from-[#d5b88d] hover:to-[#b49266] text-black font-medium px-4 py-2 text-sm rounded-lg transition-colors"
                >
                  {currentBarbearia ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParceirosBarbearias;