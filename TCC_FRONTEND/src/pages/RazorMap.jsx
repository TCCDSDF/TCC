import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Star, Phone, Clock, ChevronRight, Scissors, X, Navigation } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RazorMap = () => {
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedBarbearia, setSelectedBarbearia] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [distanceFilter, setDistanceFilter] = useState(50);
  const [animateIn, setAnimateIn] = useState(false);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 200);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => setUserLocation({ lat: -23.5505, lng: -46.6333 })
      );
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  useEffect(() => {
    const fetchBarbearias = async () => {
      try {
        const response = await axios.get('https://tcc-upeo.onrender.com/api/barbearias/parceiras');
        setBarbearias(response.data);
      } catch (err) {
        setError('Falha ao carregar barbearias parceiras.');
      } finally {
        setLoading(false);
      }
    };
    fetchBarbearias();
  }, []);

  useEffect(() => {
    if (window.L && userLocation && barbearias.length > 0 && mapRef.current && !mapInstanceRef.current) {
      setTimeout(initMap, 100);
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, [userLocation, barbearias]);

  const initMap = () => {
    if (!window.L || !mapRef.current) return;
    
    if (mapRef.current._leaflet_id) {
      mapRef.current.innerHTML = '';
      mapRef.current._leaflet_id = null;
    }
    
    const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    const userIcon = L.divIcon({
      html: '<div style="background:#4285F4;width:16px;height:16px;border-radius:50%;border:2px solid white"></div>',
      className: 'user-marker',
      iconSize: [20, 20]
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindTooltip('Sua localização');

    markersRef.current = barbearias.map(barbearia => {
      const barberIcon = L.divIcon({
        html: '<div style="color:#c4a47c;font-size:24px">✂️</div>',
        className: 'barber-marker',
        iconSize: [30, 30]
      });

      const marker = L.marker([barbearia.latitude, barbearia.longitude], { icon: barberIcon })
        .addTo(map)
        .bindTooltip(barbearia.nome);

      marker.on('click', () => {
        setSelectedBarbearia(barbearia);
        map.setView([barbearia.latitude, barbearia.longitude], 15);
      });

      return marker;
    });
  };

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const barbeariasFiltered = barbearias.filter(barbearia => 
    barbearia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barbearia.endereco.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const barbeariasOrdenadas = userLocation 
    ? barbeariasFiltered
        .map(barbearia => ({
          ...barbearia,
          distancia: parseFloat(calcularDistancia(userLocation.lat, userLocation.lng, barbearia.latitude, barbearia.longitude))
        }))
        .filter(barbearia => barbearia.distancia <= distanceFilter)
        .sort((a, b) => a.distancia - b.distancia)
    : barbeariasFiltered;

  const centralizarMapa = (barbearia) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([barbearia.latitude, barbearia.longitude], 15);
    }
  };

  const renderStars = (rating) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-white fill-white' : 'text-zinc-600'}`} 
        />
      ))}
      <span className="ml-1 text-xs font-mono text-zinc-400">{rating}</span>
    </div>
  );

  return (
    <div className="bg-black text-white font-mono">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative z-10 min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-12 text-center transition-all duration-1000 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-8">
              <div className="w-px h-8 bg-white mx-auto mb-4"></div>
              <MapPin className="h-8 w-8 text-white mx-auto" />
              <div className="w-px h-8 bg-white mx-auto mt-4"></div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none">
              RAZOR<span className="text-zinc-400">MAP</span>
            </h1>
            
            <div className="w-32 h-px bg-white mx-auto mb-8"></div>
            
            <p className="text-sm tracking-[0.3em] text-zinc-300 uppercase max-w-2xl mx-auto">
              Partner Barbershops Near You
            </p>
          </div>

          <div className="mb-12 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search barbershops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 text-white text-sm tracking-wide focus:outline-none focus:border-white transition-colors"
                />
              </div>
              
              {userLocation && (
                <div className="flex items-center space-x-4 bg-black border border-zinc-800 px-4 py-3">
                  <span className="text-xs tracking-[0.2em] uppercase text-zinc-400 whitespace-nowrap">
                    Range: {distanceFilter}km
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={distanceFilter}
                    onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
                    className="w-24 accent-white"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-800">
            <div className="bg-black overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Scissors className="h-4 w-4 text-white" />
                    <span className="text-sm tracking-[0.2em] uppercase font-bold">Partners</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {barbeariasOrdenadas.length}
                  </span>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[500px]">
                {loading ? (
                  <div className="flex justify-center items-center p-12">
                    <div className="w-px h-8 bg-white animate-pulse"></div>
                  </div>
                ) : error ? (
                  <div className="p-6 text-center">
                    <p className="text-xs tracking-[0.2em] uppercase text-zinc-400">{error}</p>
                  </div>
                ) : barbeariasOrdenadas.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-xs tracking-[0.2em] uppercase text-zinc-400">No Results</p>
                  </div>
                ) : (
                  barbeariasOrdenadas.map((barbearia) => (
                    <div 
                      key={barbearia.id}
                      className={`p-6 border-b border-zinc-800 cursor-pointer transition-colors hover:bg-zinc-950 ${
                        selectedBarbearia?.id === barbearia.id ? 'bg-zinc-900' : ''
                      }`}
                      onClick={() => {
                        setSelectedBarbearia(barbearia);
                        centralizarMapa(barbearia);
                      }}
                    >
                      <div className="space-y-3">
                        <h3 className="font-bold tracking-wide uppercase text-sm">{barbearia.nome}</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">{barbearia.endereco}</p>
                        {renderStars(barbearia.mediaAvaliacao)}
                        {userLocation && (
                          <div className="flex items-center">
                            <Navigation className="h-3 w-3 mr-1 text-zinc-400" />
                            <span className="text-xs font-mono text-zinc-400">{barbearia.distancia}km</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-black flex flex-col">
              <div 
                ref={mapRef} 
                className="w-full h-[400px] lg:h-[500px] border border-zinc-800"
              />
              
              {selectedBarbearia && (
                <div className="p-6 border-t border-zinc-800 bg-zinc-950">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold tracking-wide uppercase">{selectedBarbearia.nome}</h3>
                    <button 
                      onClick={() => setSelectedBarbearia(null)}
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-zinc-400">
                      <MapPin className="h-3 w-3 mr-2" />
                      {selectedBarbearia.endereco}
                    </div>
                    <div className="flex items-center text-xs text-zinc-400">
                      <Phone className="h-3 w-3 mr-2" />
                      {selectedBarbearia.telefone}
                    </div>
                    <div className="flex items-center text-xs text-zinc-400">
                      <Clock className="h-3 w-3 mr-2" />
                      {selectedBarbearia.horarioAbertura} - {selectedBarbearia.horarioFechamento}
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-zinc-800 mb-4"></div>
                  
                  <div className="flex justify-between items-center">
                    {renderStars(selectedBarbearia.mediaAvaliacao)}
                    
                    <div className="flex space-x-2">
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedBarbearia.latitude},${selectedBarbearia.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-white text-white px-3 py-1 text-xs tracking-[0.1em] uppercase hover:bg-white hover:text-black transition-colors"
                      >
                        Route
                      </a>
                      
                      <Link 
                        to="/appointments" 
                        state={{ selectedBarbearia: selectedBarbearia }}
                        onClick={() => localStorage.setItem('selectedBarbearia', JSON.stringify(selectedBarbearia))}
                        className="bg-white text-black px-4 py-1 text-xs tracking-[0.1em] uppercase hover:bg-zinc-300 transition-colors flex items-center"
                      >
                        Book
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorMap;