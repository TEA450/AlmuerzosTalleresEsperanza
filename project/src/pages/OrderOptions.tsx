import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Apple, Soup, Coffee, Droplets } from 'lucide-react';
import { supabase } from '../config/supabase';
import type { Person, Order } from '../types';

const OrderOptions: React.FC = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<Person | null>(null);
  const [order, setOrder] = useState<Partial<Order>>({
    person_id: personId,
    fruit_or_soup: null,
    juice_or_lemonade: null,
    main_dish: null,
    observations: '',
    payment_method: 'cash'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (personId) {
      loadPerson(personId);
      loadExistingOrder(personId);
    }
  }, [personId]);

  const loadPerson = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        // Use sample data if database is not set up
        const samplePeople = [
          {
            id: '1',
            name: 'Antonieta Medina',
            photo: '/images/People/Students/Women/ANTONIETA MEDINA.jpeg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Catalina Michelsen',
            photo: '/images/People/Students/Women/CATALINA MICHELSEN.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Claudia Arias',
            photo: '/images/People/Students/Women/CLAUDIA ARIAS.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '4',
            name: 'Gloria Romero',
            photo: '/images/People/Students/Women/GLORIA ROMERO.jpeg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '5',
            name: 'Laura Muñoz',
            photo: '/images/People/Students/Women/LAURA MUÑOZ.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '6',
            name: 'Laura Ospina',
            photo: '/images/People/Students/Women/LAURA OSPINA.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '7',
            name: 'Liliana Rodriguez',
            photo: '/images/People/Students/Women/LILIANA RODRIGUEZ.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '8',
            name: 'Liliana Serna',
            photo: '/images/People/Students/Women/LILIANA SERNA.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '9',
            name: 'Lina Plata',
            photo: '/images/People/Students/Women/LINA PLATA.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '10',
            name: 'Monica Gómez',
            photo: '/images/People/Students/Women/MONICA GOMEZ.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '11',
            name: 'Niria Ordosgoitia',
            photo: '/images/People/Students/Women/NIRIA ORDOSGOITIA.jpeg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '12',
            name: 'Olga Herrera',
            photo: '/images/People/Students/Women/OLGA HERRERA.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '13',
            name: 'Paula Torres',
            photo: '/images/People/Students/Women/PAULA TORRES.jpeg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '14',
            name: 'Riva Plotnicoff',
            photo: '/images/People/Students/Women/RIVA PLOTNICOFF.jpeg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '15',
            name: 'Silvia Castro',
            photo: '/images/People/Students/Women/SILVIA CASTRO.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '16',
            name: 'Yuri Moya',
            photo: '/images/People/Students/Women/YURI MOYA.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '17',
            name: 'Adriana Garcia',
            photo: '/images/People/Students/Women/ADRIANA GARCIA.jpeg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '18',
            name: 'Andrea Bayona',
            photo: '/images/People/Students/Women/ANDREA BAYONA.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '19',
            name: 'Angela Acosta',
            photo: '/images/People/Students/Women/ANGELA ACOSTA.jpeg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '20',
            name: 'Alejandro Mora',
            photo: '/images/People/Students/Men/ALEJANDRO MORA.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '21',
            name: 'Alvaro Buritica',
            photo: '/images/People/Students/Men/ALVARO BURITICA.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '22',
            name: 'Angelo Paez',
            photo: '/images/People/Students/Men/ANGELO PAEZ.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '23',
            name: 'Carlos Romero',
            photo: '/images/People/Students/Men/CARLOS ROMERO.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '24',
            name: 'Cesar Jimenez',
            photo: '/images/People/Students/Men/CESAR JIMENEZ.jpeg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '25',
            name: 'David Gómez',
            photo: '/images/People/Students/Men/DAVID GOMEZ.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '26',
            name: 'Eddie Kattan',
            photo: '/images/People/Students/Men/EDDIE KATTAN.jpeg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '27',
            name: 'Francisco Florez',
            photo: '/images/People/Students/Men/FRANCISCO FLOREZ.jpeg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '28',
            name: 'Johan Gómez',
            photo: '/images/People/Students/Men/JOHAN GOMEZ.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '29',
            name: 'Jorge Galvis',
            photo: '/images/People/Students/Men/JORGE GALVIS.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '30',
            name: 'Jorge Vela',
            photo: '/images/People/Students/Men/JORGE VELA.jpeg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '31',
            name: 'Jose Camargo',
            photo: '/images/People/Students/Men/JOSE CAMARGO.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '32',
            name: 'Jose Peña',
            photo: '/images/People/Students/Men/JOSE PEÑA.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '33',
            name: 'Juan Carlos Herrera',
            photo: '/images/People/Students/Men/JUAN CARLOS HERRERA.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '34',
            name: 'Marcelo Torres',
            photo: '/images/People/Students/Men/MARCELO TORRES.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '35',
            name: 'Mauricio Caldeoron',
            photo: '/images/People/Students/Men/MAURICIO CALDEORON.jpeg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '36',
            name: 'Miguel Valencia',
            photo: '/images/People/Students/Men/MIGUEL VALENCIA.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '37',
            name: 'Nicolay Colorado',
            photo: '/images/People/Students/Men/NICOLAY COLORADO.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '38',
            name: 'Pedro Zornoza',
            photo: '/images/People/Students/Men/PEDRO ZORNOZA.png',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '39',
            name: 'Ricardo Jose Gomez',
            photo: '/images/People/Students/Men/RICARDO JOSE GOMEZ.jpg',
            category: 'student' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '40',
            name: 'Prof. Alba Lucia Puentes',
            photo: '/images/People/Workers/ALBA LUCIA PUENTES.jpg',
            category: 'teacher' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '41',
            name: 'Prof. Alexandra Sarmiento',
            photo: '/images/People/Workers/ALEXANDRA SARMIENTO.jpeg',
            category: 'teacher' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '42',
            name: 'Prof. Angela Martinez',
            photo: '/images/People/Workers/ANGELA MARTINEZ.jpg',
            category: 'teacher' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '43',
            name: 'Prof. Felipe Amaya',
            photo: '/images/People/Workers/FELIPE AMAYA.jpeg',
            category: 'teacher' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '44',
            name: 'Prof. Jessica Cardenas',
            photo: '/images/People/Workers/JESSICA CARDENAS.jpg',
            category: 'teacher' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '45',
            name: 'Prof. Nicolle Angel',
            photo: '/images/People/Workers/NICOLLE ANGEL.jpg',
            category: 'teacher' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '46',
            name: 'Prof. Pastor Jimenez',
            photo: '/images/People/Workers/PASTOR JIMENEZ.jpeg',
            category: 'teacher' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '47',
            name: 'Prof. Paula Ortiz',
            photo: '/images/People/Workers/PAULA ORTIZ.jpg',
            category: 'teacher' as const,
            created_at: new Date().toISOString()
          },
          {
            id: '48',
            name: 'Prof. Steven Coy',
            photo: '/images/People/Workers/STEVEN COY.jpeg',
            category: 'teacher' as const,
            created_at: new Date().toISOString()
          }
        ];
        const foundPerson = samplePeople.find(p => p.id === id);
        setPerson(foundPerson || null);
      } else {
        setPerson(data);
      }
    } catch (err) {
      console.error('Error loading person:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingOrder = (personId: string) => {
    const stored = localStorage.getItem('currentOrders');
    if (stored) {
      const orders = JSON.parse(stored);
      const existingOrder = orders.find((o: Partial<Order>) => o.person_id === personId);
      if (existingOrder) {
        setOrder(existingOrder);
      }
    }
  };

  const handleSave = () => {
    const stored = localStorage.getItem('currentOrders');
    const orders = stored ? JSON.parse(stored) : [];

    const updatedOrder = {
      ...order,
      person_name: person?.name,
      person_photo: person?.photo,
      order_date: new Date().toISOString().split('T')[0]
    };

    const existingIndex = orders.findIndex((o: Partial<Order>) => o.person_id === personId);
    if (existingIndex >= 0) {
      orders[existingIndex] = updatedOrder;
    } else {
      orders.push(updatedOrder);
    }

    localStorage.setItem('currentOrders', JSON.stringify(orders));
    navigate('/make-order');
  };

  const handleNoMeal = () => {
    const updatedOrder = {
      ...order,
      fruit_or_soup: null,
      juice_or_lemonade: null,
      main_dish: null,
      observations: 'No almuerza hoy',
      person_name: person?.name,
      person_photo: person?.photo,
      order_date: new Date().toISOString().split('T')[0]
    };

    const stored = localStorage.getItem('currentOrders');
    const orders = stored ? JSON.parse(stored) : [];

    const existingIndex = orders.findIndex((o: Partial<Order>) => o.person_id === personId);
    if (existingIndex >= 0) {
      orders[existingIndex] = updatedOrder;
    } else {
      orders.push(updatedOrder);
    }

    localStorage.setItem('currentOrders', JSON.stringify(orders));
    // Stay on the same page instead of navigating back
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-2xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl text-red-600">Persona no encontrada</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      {/* Header with person info */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <img
            src={person.photo}
            alt={person.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 sm:border-4 border-[#41BAAE]"
          />
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{person.name}</h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 capitalize">{person.category === 'teacher' ? 'Profesor' : 'Estudiante'}</p>
          </div>
        </div>
      </div>

      {/* Meal Options */}
      <div className="space-y-6 sm:space-y-8">
        {/* Fruit or Soup */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
            <Apple size={24} className="mr-2 sm:mr-3 text-[#BADA55] sm:w-8 sm:h-8" />
            Entrada
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => setOrder({...order, fruit_or_soup: 'fruit'})}
              className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                order.fruit_or_soup === 'fruit'
                  ? 'border-[#BADA55] bg-[#BADA55]/10'
                  : 'border-gray-200 hover:border-[#BADA55]'
              }`}
            >
              <img
                src="https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Fruta"
                className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3"
              />
              <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Fruta</div>
            </button>
            <button
              onClick={() => setOrder({...order, fruit_or_soup: 'soup'})}
              className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                order.fruit_or_soup === 'soup'
                  ? 'border-[#BADA55] bg-[#BADA55]/10'
                  : 'border-gray-200 hover:border-[#BADA55]'
              }`}
            >
              <img
                src="https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Sopa"
                className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3"
              />
              <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Sopa</div>
            </button>
          </div>
        </div>

        {/* Juice or Lemonade */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
            <Droplets size={24} className="mr-2 sm:mr-3 text-[#41BAAE] sm:w-8 sm:h-8" />
            Bebida
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => setOrder({...order, juice_or_lemonade: 'juice'})}
              className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                order.juice_or_lemonade === 'juice'
                  ? 'border-[#41BAAE] bg-[#41BAAE]/10'
                  : 'border-gray-200 hover:border-[#41BAAE]'
              }`}
            >
              <img
                src="https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Jugo"
                className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3"
              />
              <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Jugo</div>
            </button>
            <button
              onClick={() => setOrder({...order, juice_or_lemonade: 'lemonade'})}
              className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                order.juice_or_lemonade === 'lemonade'
                  ? 'border-[#41BAAE] bg-[#41BAAE]/10'
                  : 'border-gray-200 hover:border-[#41BAAE]'
              }`}
            >
              <img
                src="https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Limonada"
                className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3"
              />
              <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Limonada</div>
            </button>
          </div>
        </div>

        {/* Main Dish */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
            <Coffee size={24} className="mr-2 sm:mr-3 text-orange-500 sm:w-8 sm:h-8" />
            Plato Principal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <button
              onClick={() => setOrder({...order, main_dish: 'spaghetti'})}
              className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                order.main_dish === 'spaghetti'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-500'
              }`}
            >
              <img
                src="https://images.pexels.com/photos/1460872/pexels-photo-1460872.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Espaguetis"
                className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3"
              />
              <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Espaguetis</div>
            </button>
            <button
              onClick={() => setOrder({...order, main_dish: 'beef'})}
              className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                order.main_dish === 'beef'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-500'
              }`}
            >
              <img
                src="https://mojo.generalmills.com/api/public/content/KIVwKMkmX0mcxyYnGcQSyA_gmi_hi_res_jpeg.jpeg?v=25af9e9b&t=16e3ce250f244648bef28c5949fb99ff"
                alt="Carne"
                className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3"
              />
              <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Carne</div>
            </button>
            <button
              onClick={() => setOrder({...order, main_dish: 'chicken'})}
              className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                order.main_dish === 'chicken'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-500'
              }`}
            >
              <img
                src="https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Pechuga de Pollo"
                className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3"
              />
              <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Pechuga de Pollo</div>
            </button>
          </div>
        </div>

        {/* Observations */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Observaciones</h2>
          <textarea
            value={order.observations}
            onChange={(e) => setOrder({...order, observations: e.target.value})}
            className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg text-sm sm:text-base lg:text-lg focus:border-[#41BAAE] focus:outline-none"
            rows={3}
            placeholder="Escribe aquí cualquier observación especial..."
          />
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Forma de Pago</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => setOrder({...order, payment_method: 'cash'})}
              className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                order.payment_method === 'cash'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-500'
              }`}
            >
              <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">💵 Efectivo</div>
            </button>
            <button
              onClick={() => setOrder({...order, payment_method: 'voucher'})}
              className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                order.payment_method === 'voucher'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">🎫 Voucher</div>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button
          onClick={() => navigate('/make-order')}
          className="flex items-center justify-center space-x-2 sm:space-x-3 bg-gray-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg lg:text-xl font-bold hover:bg-gray-700 transition-colors duration-200"
        >
          <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
          <span>Volver</span>
        </button>
        
        <button
          onClick={handleNoMeal}
          className="flex-1 bg-red-500 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg lg:text-xl font-bold hover:bg-red-600 transition-colors duration-200"
        >
          No Almuerza Hoy
        </button>
        
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-[#41BAAE] to-[#BADA55] text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg lg:text-xl font-bold hover:shadow-lg transition-all duration-200"
        >
          <Save size={20} className="sm:w-6 sm:h-6" />
          <span>Guardar Pedido</span>
        </button>
      </div>
    </div>
  );
};

export default OrderOptions;