import React, { useState, useEffect } from 'react';
import { Calendar, Download, Filter, BarChart3, TrendingUp } from 'lucide-react';
import { supabase } from '../config/supabase';
import type { Order, DailyReport } from '../types';
import * as XLSX from 'xlsx';

const History: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, startDate, endDate]);

  const loadData = async () => {
    try {
      // First try to load from localStorage
      const storedOrders = localStorage.getItem('allOrders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        setOrders(parsedOrders);
      } else {
        // Fallback to database or sample data
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error('Error loading data:', ordersError);
          setSampleHistoryData();
        } else {
          setOrders(ordersData || []);
          if ((ordersData || []).length === 0) {
            setSampleHistoryData();
          }
        }
      }

      // Load reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('daily_reports')
        .select('*')
        .order('report_date', { ascending: false });

      if (reportsError) {
        console.error('Error loading reports:', reportsError);
      } else {
        setReports(reportsData || []);
      }
    } catch (err) {
      console.error('Database connection error:', err);
      setSampleHistoryData();
    } finally {
      setLoading(false);
    }
  };

  const setSampleHistoryData = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Use local date to avoid timezone issues
    const formatLocalDate = (date: Date) => {
      const adjustedDate = new Date(date);
      adjustedDate.setDate(adjustedDate.getDate() + 1); // Add 1 day to fix timezone offset
      return adjustedDate.getFullYear() + '-' +
        String(adjustedDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(adjustedDate.getDate()).padStart(2, '0');
    };

    const todayStr = formatLocalDate(today);
    const yesterdayStr = formatLocalDate(yesterday);

    const sampleOrders: Order[] = [
      {
        id: '1',
        person_id: '1',
        person_name: 'Ana María González',
        person_photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
        fruit_or_soup: 'fruit',
        juice_or_lemonade: 'juice',
        main_dish: 'chicken',
        observations: '',
        payment_method: 'cash',
        order_date: todayStr,
        created_at: today.toISOString()
      },
      {
        id: '2',
        person_id: '2',
        person_name: 'Carlos Rodríguez',
        person_photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        fruit_or_soup: 'soup',
        juice_or_lemonade: 'lemonade',
        main_dish: 'beef',
        observations: 'Sin cebolla',
        payment_method: 'voucher',
        order_date: todayStr,
        created_at: today.toISOString()
      },
      {
        id: '3',
        person_id: '4',
        person_name: 'Prof. Roberto Jiménez',
        person_photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
        fruit_or_soup: 'fruit',
        juice_or_lemonade: 'juice',
        main_dish: 'spaghetti',
        observations: '',
        payment_method: 'cash',
        order_date: yesterdayStr,
        created_at: yesterday.toISOString()
      }
    ];

    const sampleReports: DailyReport[] = [
      {
        id: '1',
        report_date: todayStr,
        total_orders: 2,
        cash_orders: 1,
        voucher_orders: 1,
        created_at: today.toISOString()
      },
      {
        id: '2',
        report_date: yesterdayStr,
        total_orders: 1,
        cash_orders: 1,
        voucher_orders: 0,
        created_at: yesterday.toISOString()
      }
    ];

    setOrders(sampleOrders);
    setReports(sampleReports);
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter to only include orders with actual menu items
    filtered = filtered.filter(order =>
      order.fruit_or_soup || order.juice_or_lemonade || order.main_dish
    );

    if (startDate) {
      filtered = filtered.filter(order => order.order_date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(order => order.order_date <= endDate);
    }

    setFilteredOrders(filtered);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const getMenuText = (order: Order) => {
    const parts = [];
    if (order.fruit_or_soup) {
      parts.push(order.fruit_or_soup === 'fruit' ? 'Fruta' : 'Sopa');
    }
    if (order.juice_or_lemonade) {
      parts.push(order.juice_or_lemonade === 'juice' ? 'Jugo' : 'Limonada');
    }
    if (order.main_dish) {
      const dishes = {
        spaghetti: 'Espaguetis',
        beef: 'Carne',
        chicken: 'Pechuga de Pollo'
      };
      parts.push(dishes[order.main_dish]);
    }
    return parts.length > 0 ? parts.join(', ') : 'Sin almuerzo';
  };

  const exportHistory = () => {
    // Filter orders to only include those with actual menu items
    const validOrders = filteredOrders.filter(order =>
      order.fruit_or_soup || order.juice_or_lemonade || order.main_dish
    );

    const data = validOrders.map(order => ({
      'Fecha': order.order_date,
      'Nombre': order.person_name,
      'Menú': getMenuText(order),
      'Observaciones': order.observations || '',
      'Forma de Pago': order.payment_method === 'cash' ? 'Efectivo' : order.payment_method === 'voucher' ? 'Voucher' : 'NA'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historial');

    // Use local date instead of UTC to avoid timezone issues
    const today = new Date();
    const localDate = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

    const fileName = `historial_pedidos_${localDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const getTotalStats = () => {
    const total = filteredOrders.length;
    const cash = filteredOrders.filter(o => o.payment_method === 'cash').length;
    const voucher = filteredOrders.filter(o => o.payment_method === 'voucher').length;
    const vouchersUsed = Math.ceil(voucher / 20); // Max 20 orders per voucher
    
    return { total, cash, voucher, vouchersUsed };
  };

  const getPersonStats = () => {
    const personCounts: Record<string, { count: number; vouchers: number }> = {};
    
    filteredOrders.forEach(order => {
      if (!personCounts[order.person_name]) {
        personCounts[order.person_name] = { count: 0, vouchers: 0 };
      }
      personCounts[order.person_name].count++;
      if (order.payment_method === 'voucher') {
        personCounts[order.person_name].vouchers++;
      }
    });
    
    return Object.entries(personCounts)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.count - a.count);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-2xl text-gray-600">Cargando historial...</div>
      </div>
    );
  }

  const stats = getTotalStats();

  // Group orders by date
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const date = order.order_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Historial de Pedidos</h1>
        <p className="text-xl text-gray-600">
          Reportes y seguimiento de todos los pedidos realizados
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex items-center mb-4">
          <Filter size={24} className="mr-3 text-[#41BAAE]" />
          <h2 className="text-2xl font-bold text-gray-800">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#41BAAE] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#41BAAE] focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#41BAAE]">
          <div className="flex items-center">
            <BarChart3 size={32} className="text-[#41BAAE] mr-4" />
            <div>
              <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-lg text-gray-600">Total Pedidos</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center">
            <span className="text-3xl mr-4">💵</span>
            <div>
              <div className="text-3xl font-bold text-gray-800">{stats.cash}</div>
              <div className="text-lg text-gray-600">Pagos Efectivo</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center">
            <span className="text-3xl mr-4">🎫</span>
            <div>
              <div className="text-3xl font-bold text-gray-800">{stats.voucher}</div>
              <div className="text-lg text-gray-600">Pagos Voucher</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center">
            <TrendingUp size={32} className="text-orange-500 mr-4" />
            <div>
              <div className="text-3xl font-bold text-gray-800">{stats.vouchersUsed}</div>
              <div className="text-lg text-gray-600">Vouchers Usados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders History */}
      <div className="bg-white rounded-2xl shadow-lg mb-8">
        <div className="bg-[#41BAAE] text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Lista de Pedidos</h2>
            <button
              onClick={exportHistory}
              className="flex items-center space-x-2 bg-white text-[#41BAAE] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Download size={20} />
              <span>Exportar</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          {Object.keys(groupedOrders).length > 0 ? (
            <div className="space-y-6">
              {Object.keys(groupedOrders).sort().reverse().map((date) => (
                <div key={date} className="border-b pb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    {new Date(date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  <div className="space-y-3">
                    {groupedOrders[date].map((order) => (
                      <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                        <img
                          src={order.person_photo}
                          alt={order.person_name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#BADA55]"
                        />
                        <div className="flex-grow">
                          <div className="font-bold text-gray-800">{order.person_name}</div>
                          <div className="text-sm text-gray-600">{getMenuText(order)}</div>
                          {order.observations && (
                            <div className="text-xs text-gray-500 italic">Obs: {order.observations}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            order.payment_method === 'cash'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.payment_method === 'cash' ? 'Efectivo' : 'Voucher'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No hay pedidos que mostrar con los filtros seleccionados
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;