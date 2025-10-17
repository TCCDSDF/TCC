import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, Scissors, Filter, Search } from 'lucide-react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
    setTimeout(() => setAnimateIn(true), 200);
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://tcc-upeo.onrender.com/api/servicos');
      const servicesWithImages = response.data.map((service, index) => ({
        ...service,
        image_url: service.image_url || [
          "https://images.unsplash.com/photo-1599351431202-1e0f0137899a",
          "https://images.unsplash.com/photo-1621605815971-fbc98d665033",
          "https://images.unsplash.com/photo-1503951914875-452162b0f3f1",
          "https://images.unsplash.com/photo-1622286342621-4bd786c2447c"
        ][index % 4]
      }));
      setServices(servicesWithImages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesFilter = filter === 'all' || 
                         (service.categoria && service.categoria.toLowerCase().includes(filter.toLowerCase()));
    const matchesSearch = (service.nome && service.nome.toLowerCase().includes(searchTerm.toLowerCase())) || 
                         (service.descricao && service.descricao.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="w-px h-16 bg-white animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70')] bg-cover bg-center opacity-5"></div>
      
      <div className="relative z-10 pt-32 pb-16">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-px h-12 bg-white mx-auto mb-8"></div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8">
            SERVICES
          </h1>
          <div className="w-24 h-px bg-white mx-auto mb-8"></div>
          <p className="text-sm tracking-[0.3em] uppercase text-zinc-400">
            Professional Grooming Solutions
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center border border-zinc-800 bg-zinc-950">
              <Filter className="h-4 w-4 text-zinc-400 ml-4" />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-white py-3 px-4 focus:outline-none text-sm tracking-wide"
              >
                <option value="all" className="bg-zinc-900">ALL SERVICES</option>
                <option value="corte" className="bg-zinc-900">HAIRCUTS</option>
                <option value="barba" className="bg-zinc-900">BEARD</option>
                <option value="combo" className="bg-zinc-900">PACKAGES</option>
              </select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="SEARCH SERVICES"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-zinc-600 text-sm tracking-wide w-80"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800">
              {filteredServices.map((service, index) => (
                <div key={service.id} className="bg-black group hover:bg-zinc-950 transition-colors duration-300">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.nome}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold tracking-wide uppercase">{service.nome}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{service.descricao}</p>
                    </div>
                    
                    <div className="w-full h-px bg-zinc-800"></div>
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-bold">R$ {service.preco}</div>
                        <div className="text-xs tracking-[0.2em] uppercase text-zinc-500 flex items-center">
                          <Clock className="h-3 w-3 mr-2" />
                          {service.duracao}min
                        </div>
                      </div>
                      
                      <Link 
                        to="/appointments" 
                        className="border border-zinc-600 px-6 py-2 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <div className="w-px h-16 bg-zinc-600 mx-auto mb-8"></div>
              <h3 className="text-2xl font-bold tracking-wide uppercase mb-4">No Services Found</h3>
              <p className="text-zinc-400 text-sm tracking-wide">Adjust your filters or search terms</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 mt-32 text-center">
          <div className="border border-zinc-800 bg-zinc-950 p-16">
            <div className="w-px h-12 bg-white mx-auto mb-8"></div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">
              READY TO
              <br />
              BOOK?
            </h2>
            
            <div className="w-24 h-px bg-white mx-auto mb-8"></div>
            
            <p className="text-zinc-300 mb-12 text-sm tracking-wide">
              Schedule your appointment and experience professional grooming
            </p>
            
            <Link 
              to="/appointments" 
              className="inline-flex items-center border border-white px-12 py-4 text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300"
            >
              Schedule Now
              <ChevronRight className="ml-3 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;