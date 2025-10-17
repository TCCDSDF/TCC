import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Clock, ChevronRight } from 'lucide-react';
import FloatingChatbot from '../components/FloatingChatbot';
import axios from 'axios';

const Home = () => {
  const [services, setServices] = useState([]);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    fetchServices();
    setTimeout(() => setAnimateIn(true), 200);
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://tcc-upeo.onrender.com/api/servicos');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <div className="bg-black text-white font-mono">
      <FloatingChatbot />
      
      {/* Hero */}
      <section className="h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70')] bg-cover bg-center opacity-10"></div>
        
        <div className={`relative z-10 text-center transition-all duration-1000 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mb-12">
            <div className="w-px h-16 bg-white mx-auto mb-8"></div>
            <Scissors className="h-8 w-8 text-white mx-auto rotate-45" />
            <div className="w-px h-16 bg-white mx-auto mt-8"></div>
          </div>
          
          <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter mb-8 leading-none">
            BARBER
          </h1>
          
          <div className="w-32 h-px bg-white mx-auto mb-8"></div>
          
          <p className="text-sm tracking-[0.3em] text-zinc-300 mb-16 uppercase">
            Professional Grooming Services
          </p>
          
          <Link 
            to="/appointments" 
            className="inline-block border border-white px-8 py-3 text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-px h-8 bg-white mx-auto mb-4"></div>
            <h2 className="text-sm tracking-[0.3em] uppercase text-zinc-400 mb-4">Services</h2>
            <div className="w-16 h-px bg-white mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800">
            {services.slice(0, 6).map((service, index) => (
              <div key={service.id} className="bg-black p-8 group hover:bg-zinc-950 transition-colors duration-300">
                <div className="aspect-square mb-6 overflow-hidden">
                  <img
                    src={service.image_url || "https://images.unsplash.com/photo-1599351431202-1e0f0137899a"}
                    alt={service.nome}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold tracking-wide uppercase">{service.nome}</h3>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 flex items-center">
                      <Clock className="h-3 w-3 mr-2" />
                      {service.duracao}min
                    </span>
                    <span className="font-mono">R$ {service.preco}</span>
                  </div>
                  
                  <div className="w-full h-px bg-zinc-800"></div>
                  
                  <Link 
                    to="/appointments" 
                    className="block text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors"
                  >
                    Reserve →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { number: "1000+", label: "Clients" },
              { number: "10+", label: "Years" },
              { number: "4.9", label: "Rating" }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-mono font-bold">{stat.number}</div>
                <div className="text-xs tracking-[0.3em] uppercase text-zinc-400">{stat.label}</div>
                <div className="w-8 h-px bg-zinc-600 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-px h-12 bg-white mx-auto mb-8"></div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">
            PRECISION
          </h2>
          
          <div className="w-24 h-px bg-white mx-auto mb-8"></div>
          
          <p className="text-lg leading-relaxed text-zinc-300 mb-12 font-light">
            Every cut is executed with surgical precision. Every detail matters. 
            We don't just cut hair—we craft your image with uncompromising standards.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            {[
              "TECHNIQUE",
              "PRECISION", 
              "EXCELLENCE"
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="w-px h-4 bg-zinc-600 mx-auto"></div>
                <div className="tracking-[0.3em] uppercase text-zinc-400">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-px h-8 bg-white mx-auto mb-4"></div>
            <h2 className="text-sm tracking-[0.3em] uppercase text-zinc-400">Testimonials</h2>
            <div className="w-16 h-px bg-white mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-zinc-950 p-8 space-y-6">
                <div className="text-sm leading-relaxed text-zinc-300 italic">
                  "{testimonial.comment}"
                </div>
                
                <div className="w-full h-px bg-zinc-800"></div>
                
                <div className="space-y-1">
                  <div className="text-sm font-bold">{testimonial.name}</div>
                  <div className="text-xs tracking-[0.2em] uppercase text-zinc-500">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="max-w-2xl mx-auto text-center px-4">
          <div className="w-px h-16 bg-white mx-auto mb-12"></div>
          
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 leading-none">
            BOOK
            <br />
            NOW
          </h2>
          
          <div className="w-32 h-px bg-white mx-auto mb-12"></div>
          
          <Link 
            to="/appointments" 
            className="inline-flex items-center border border-white px-12 py-4 text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300"
          >
            Schedule
            <ChevronRight className="ml-3 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="w-px h-8 bg-zinc-600 mx-auto mb-6"></div>
          <Scissors className="h-4 w-4 text-zinc-600 mx-auto mb-6 rotate-45" />
          <div className="text-xs tracking-[0.3em] uppercase text-zinc-600">
            &copy; {new Date().getFullYear()} Barber Club
          </div>
        </div>
      </footer>
    </div>
  );
};

const testimonials = [
  {
    name: "Marcus Chen",
    title: "CEO",
    comment: "Unmatched precision and professionalism. Every visit exceeds expectations."
  },
  {
    name: "David Rodriguez", 
    title: "Director",
    comment: "Technical excellence combined with artistic vision. Simply the best."
  },
  {
    name: "James Wilson",
    title: "Partner", 
    comment: "Consistent quality and attention to detail. Professional service."
  }
];

export default Home;