import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, GraduationCap, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../config/supabase';
import type { Person, Order } from '../types';

const MakeOrder: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [orders, setOrders] = useState<Partial<Order>[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPeople();
    loadStoredOrders();
  }, []);

  const loadPeople = async () => {
    try {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading people:', error);
        // Use sample data if database is not set up
        setSampleData();
      } else {
        setPeople(data || []);
        if (data?.length === 0) {
          setSampleData();
        }
      }
    } catch (err) {
      console.error('Database connection error:', err);
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  const setSampleData = () => {
    const samplePeople: Person[] = [
      {
        id: '1',
        name: 'Ana María González',
        photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'student',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Carlos Rodríguez',
        photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'student',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'María José Silva',
        photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'student',
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Prof. Roberto Jiménez',
        photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'teacher',
        created_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Prof. Carmen Vargas',
        photo: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'teacher',
        created_at: new Date().toISOString()
      }
    ];
    setPeople(samplePeople);
  };

  const loadStoredOrders = () => {
    const stored = localStorage.getItem('currentOrders');
    if (stored) {
      setOrders(JSON.parse(stored));
    }
  };

  const getOrderStatus = (personId: string) => {
    const order = orders.find(o => o.person_id === personId);
    if (!order) return 'pending';
    if (order.fruit_or_soup === null && order.juice_or_lemonade === null && order.main_dish === null) {
      return 'no-meal';
    }
    return 'ordered';
  };

  const students = people.filter(p => p.category === 'student');
  const teachers = people.filter(p => p.category === 'teacher');

  const allOrdersComplete = people.length > 0 && people.every(person => 
    orders.some(order => order.person_id === person.id)
  );

  const handleContinueToSummary = () => {
    localStorage.setItem('currentOrders', JSON.stringify(orders));
    navigate('/order-summary');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-2xl text-gray-600">Cargando personas...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Hacer Pedido de Almuerzo</h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600">
          Selecciona cada persona para configurar su pedido
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6 sm:mb-8 bg-white rounded-lg p-3 sm:p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700">
            Progreso: {orders.length} de {people.length} personas
          </span>
          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center space-x-1">
              <CheckCircle size={16} className="sm:w-5 sm:h-5 text-green-500" />
              <span className="text-xs sm:text-sm">Con pedido</span>
            </div>
            <div className="flex items-center space-x-1">
              <XCircle size={16} className="sm:w-5 sm:h-5 text-red-500" />
              <span className="text-xs sm:text-sm">Sin almuerzo</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mt-2">
          <div
            className="bg-gradient-to-r from-[#41BAAE] to-[#BADA55] h-2 sm:h-3 rounded-full transition-all duration-300"
            style={{ width: `${people.length > 0 ? (orders.length / people.length) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Students Section */}
      {students.length > 0 && (
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center mb-4 sm:mb-6">
            <User size={24} className="mr-2 sm:mr-3 text-[#41BAAE] sm:w-8 sm:h-8" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Estudiantes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {students.map((person) => {
              const status = getOrderStatus(person.id);
              return (
                <Link
                  key={person.id}
                  to={`/order-options/${person.id}`}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-[#41BAAE] relative"
                >
                  {status === 'ordered' && (
                    <CheckCircle 
                      size={24} 
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 text-green-500 bg-white rounded-full sm:w-8 sm:h-8" 
                    />
                  )}
                  {status === 'no-meal' && (
                    <XCircle 
                      size={24} 
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 text-red-500 bg-white rounded-full sm:w-8 sm:h-8" 
                    />
                  )}
                  <div className="text-center">
                    <img
                      src={person.photo}
                      alt={person.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full mx-auto mb-3 sm:mb-4 object-cover border-2 sm:border-4 border-[#BADA55]"
                    />
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-1 sm:mb-2">{person.name}</h3>
                    <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Estudiante</div>
                    {status === 'ordered' && (
                      <div className="text-green-600 font-semibold text-xs sm:text-sm">✓ Pedido realizado</div>
                    )}
                    {status === 'no-meal' && (
                      <div className="text-red-600 font-semibold text-xs sm:text-sm">✗ Sin almuerzo</div>
                    )}
                    {status === 'pending' && (
                      <div className="text-gray-500 text-xs sm:text-sm">Pendiente</div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Teachers Section */}
      {teachers.length > 0 && (
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center mb-4 sm:mb-6">
            <GraduationCap size={24} className="mr-2 sm:mr-3 text-[#BADA55] sm:w-8 sm:h-8" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Profesores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {teachers.map((person) => {
              const status = getOrderStatus(person.id);
              return (
                <Link
                  key={person.id}
                  to={`/order-options/${person.id}`}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-[#BADA55] relative"
                >
                  {status === 'ordered' && (
                    <CheckCircle 
                      size={24} 
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 text-green-500 bg-white rounded-full sm:w-8 sm:h-8" 
                    />
                  )}
                  {status === 'no-meal' && (
                    <XCircle 
                      size={24} 
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 text-red-500 bg-white rounded-full sm:w-8 sm:h-8" 
                    />
                  )}
                  <div className="text-center">
                    <img
                      src={person.photo}
                      alt={person.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full mx-auto mb-3 sm:mb-4 object-cover border-2 sm:border-4 border-[#41BAAE]"
                    />
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-1 sm:mb-2">{person.name}</h3>
                    <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Profesor</div>
                    {status === 'ordered' && (
                      <div className="text-green-600 font-semibold text-xs sm:text-sm">✓ Pedido realizado</div>
                    )}
                    {status === 'no-meal' && (
                      <div className="text-red-600 font-semibold text-xs sm:text-sm">✗ Sin almuerzo</div>
                    )}
                    {status === 'pending' && (
                      <div className="text-gray-500 text-xs sm:text-sm">Pendiente</div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {allOrdersComplete && (
        <div className="text-center">
          <button
            onClick={handleContinueToSummary}
            className="bg-gradient-to-r from-[#41BAAE] to-[#BADA55] text-white px-6 sm:px-8 lg:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl text-lg sm:text-xl lg:text-2xl font-bold shadow-xl sm:shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 sm:space-x-4 mx-auto"
          >
            <span>Ver Resumen del Pedido</span>
            <ArrowRight size={20} className="sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MakeOrder;