import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Scissors, Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { to: '/', label: 'Home' },
        { to: '/services', label: 'Services' },
        { to: '/razormap', label: 'RazorMap' }
      ];
    }

    if (user?.userType === 'barbeiro') {
      return [
        { to: '/chat', label: 'Chat' },
        { to: '/barber-appointments', label: 'Appointments' }
      ];
    }

    return [
      { to: '/', label: 'Home' },
      { to: '/services', label: 'Services' },
      { to: '/razormap', label: 'RazorMap' },
      { to: '/appointments', label: 'Booking' }
    ];
  };

  const navLinks = getNavLinks();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 font-mono transition-all duration-300 ${
      scrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Scissors className="h-6 w-6 text-white rotate-45" />
            <span className="text-lg font-black tracking-tighter text-white">
              BARBER<span className="text-zinc-400">CLUB</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs tracking-[0.2em] uppercase transition-colors ${
                  isActive(link.to) ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.userType !== 'barbeiro' && (
                  <Link
                    to="/profile"
                    className="text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="border border-white text-white px-4 py-2 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-zinc-400 transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-black">
            <div className="py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
                    isActive(link.to) ? 'text-white bg-zinc-900' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="w-full h-px bg-zinc-800 my-2"></div>

              {isAuthenticated ? (
                <>
                  {user?.userType !== 'barbeiro' && (
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block mx-4 mt-4 border border-white text-white text-center py-2 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;