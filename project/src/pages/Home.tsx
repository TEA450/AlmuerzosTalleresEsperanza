import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, History, Users, Utensils } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-gray-800 mb-6">
          ¡Bienvenidos al Sistema de Pedidos!
        </h2>
        <p className="text-2xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
          Aquí puedes hacer pedidos de almuerzos para todos los miembros de la comunidad,
          de manera fácil y accesible. 
        </p>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <Link
          to="/make-order"
          className="bg-gradient-to-r from-[#41BAAE] to-[#BADA55] text-white px-12 py-8 rounded-2xl text-3xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-4 min-w-[320px] justify-center"
        >
          <ShoppingCart size={48} />
          <span>Hacer Pedido</span>
        </Link>
        
        <Link
          to="/history"
          className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-12 py-8 rounded-2xl text-3xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-4 min-w-[320px] justify-center"
        >
          <History size={48} />
          <span>Ver Historial</span>
        </Link>
      </div>

      {/* Info Section */}
      <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border-l-4 border-[#BADA55]">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Instrucciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-600">
          <div>
            <p className="mb-4">
              <strong className="text-[#41BAAE]">Paso 1:</strong> Haz clic en "Hacer Pedido" para comenzar
            </p>
            <p className="mb-4">
              <strong className="text-[#41BAAE]">Paso 2:</strong> Selecciona a cada persona de la lista
            </p>
          </div>
          <div>
            <p className="mb-4">
              <strong className="text-[#41BAAE]">Paso 3:</strong> Elige el menú para cada persona
            </p>
            <p className="mb-4">
              <strong className="text-[#41BAAE]">Paso 4:</strong> Confirma el pedido y descarga el reporte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;