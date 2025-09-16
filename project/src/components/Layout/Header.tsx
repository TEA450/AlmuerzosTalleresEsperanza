import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, History } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg border-b-4 border-[#41BAAE] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img 
                src="/images/logo.gif" 
                alt="Talleres Esperanza Logo" 
                className="h-24 w-auto object-contain"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-4">
            <Link
              to="/"
              className={`flex flex-col items-center px-6 py-3 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-[#41BAAE] text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#41BAAE]'
              }`}
            >
              <Home size={28} />
              <span className="text-lg font-medium mt-1">Inicio</span>
            </Link>
            <Link
              to="/make-order"
              className={`flex flex-col items-center px-6 py-3 rounded-lg transition-all duration-200 ${
                isActive('/make-order') || location.pathname.includes('/order')
                  ? 'bg-[#41BAAE] text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#41BAAE]'
              }`}
            >
              <ShoppingCart size={28} />
              <span className="text-lg font-medium mt-1">Hacer Pedido</span>
            </Link>
            <Link
              to="/history"
              className={`flex flex-col items-center px-6 py-3 rounded-lg transition-all duration-200 ${
                isActive('/history')
                  ? 'bg-[#41BAAE] text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#41BAAE]'
              }`}
            >
              <History size={28} />
              <span className="text-lg font-medium mt-1">Historial</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;