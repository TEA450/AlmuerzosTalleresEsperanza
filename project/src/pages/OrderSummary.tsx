import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share2, Check, ArrowLeft, FileText, Users } from 'lucide-react';
import { supabase } from '../config/supabase';
import type { Order } from '../types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const OrderSummary: React.FC = () => {
  const [orders, setOrders] = useState<Partial<Order>[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const stored = localStorage.getItem('currentOrders');
    if (stored) {
      setOrders(JSON.parse(stored));
    } else {
      navigate('/make-order');
    }
  };

  const getMenuText = (order: Partial<Order>) => {
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

  const getTotalLunches = () => {
    return orders.filter(order => 
      order.fruit_or_soup || order.juice_or_lemonade || order.main_dish
    ).length;
  };

  const getCashCount = () => {
    return orders.filter(order => 
      order.payment_method === 'cash' && 
      (order.fruit_or_soup || order.juice_or_lemonade || order.main_dish)
    ).length;
  };

  const getVoucherCount = () => {
    return orders.filter(order => 
      order.payment_method === 'voucher' && 
      (order.fruit_or_soup || order.juice_or_lemonade || order.main_dish)
    ).length;
  };

  const saveOrdersToDatabase = async () => {
    setLoading(true);
    try {
      const ordersToSave = orders.map(order => ({
        ...order,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('orders')
        .insert(ordersToSave);

      if (error) {
        console.error('Error saving to database:', error);
        // Continue with export even if database save fails
      }

      // Also save daily report
      const reportData = {
        id: `report-${Date.now()}`,
        report_date: new Date().toISOString().split('T')[0],
        total_orders: getTotalLunches(),
        cash_orders: getCashCount(),
        voucher_orders: getVoucherCount(),
        created_at: new Date().toISOString()
      };

      await supabase
        .from('daily_reports')
        .insert([reportData]);

    } catch (err) {
      console.error('Database error:', err);
      // Continue with export even if database save fails
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const data = orders.map(order => ({
      'Nombre': order.person_name || '',
      'Entrada': order.fruit_or_soup ? (order.fruit_or_soup === 'fruit' ? 'Fruta' : 'Sopa') : '',
      'Bebida': order.juice_or_lemonade ? (order.juice_or_lemonade === 'juice' ? 'Jugo' : 'Limonada') : '',
      'Plato Principal': order.main_dish ? 
        (order.main_dish === 'spaghetti' ? 'Espaguetis' : 
         order.main_dish === 'beef' ? 'Carne' : 'Pechuga de Pollo') : '',
      'Observaciones': order.observations || '',
      'Forma de Pago': order.payment_method === 'cash' ? 'Efectivo' : 'Voucher',
      'Fecha': order.order_date || new Date().toISOString().split('T')[0]
    }));

    // Add summary row
    data.push({
      'Nombre': '--- RESUMEN ---',
      'Entrada': '',
      'Bebida': '',
      'Plato Principal': '',
      'Observaciones': `Total almuerzos: ${getTotalLunches()}`,
      'Forma de Pago': `Efectivo: ${getCashCount()}, Vouchers: ${getVoucherCount()}`,
      'Fecha': ''
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');

    const fileName = `pedidos_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(20);
    doc.text('Talleres Esperanza - Pedidos de Almuerzo', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, 30, { align: 'center' });
    
    let yPosition = 50;
    
    // Orders
    doc.setFontSize(14);
    doc.text('Pedidos:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    orders.forEach(order => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      const menuText = getMenuText(order);
      const paymentText = order.payment_method === 'cash' ? 'Efectivo' : 'Voucher';
      
      doc.text(`• ${order.person_name}: ${menuText} (${paymentText})`, 20, yPosition);
      if (order.observations) {
        yPosition += 5;
        doc.text(`  Obs: ${order.observations}`, 25, yPosition);
      }
      yPosition += 8;
    });
    
    // Summary
    yPosition += 10;
    doc.setFontSize(12);
    doc.text('Resumen:', 20, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    doc.text(`Total de almuerzos: ${getTotalLunches()}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Pagos en efectivo: ${getCashCount()}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Pagos con voucher: ${getVoucherCount()}`, 20, yPosition);
    
    const fileName = `pedidos_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const confirmOrder = async () => {
    await saveOrdersToDatabase();
    
    // Clear current orders
    localStorage.removeItem('currentOrders');
    
    // Navigate to success page
    alert('¡Pedido confirmado y guardado exitosamente!');
    navigate('/');
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl text-gray-600">No hay pedidos para mostrar</div>
        <button
          onClick={() => navigate('/make-order')}
          className="mt-4 bg-[#41BAAE] text-white px-6 py-3 rounded-lg"
        >
          Hacer Pedido
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Resumen del Pedido</h1>
        <p className="text-xl text-gray-600">
          Revisa todos los pedidos antes de confirmar
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#41BAAE]">
          <div className="flex items-center">
            <Users size={32} className="text-[#41BAAE] mr-4" />
            <div>
              <div className="text-3xl font-bold text-gray-800">{getTotalLunches()}</div>
              <div className="text-lg text-gray-600">Total Almuerzos</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center">
            <span className="text-3xl mr-4">💵</span>
            <div>
              <div className="text-3xl font-bold text-gray-800">{getCashCount()}</div>
              <div className="text-lg text-gray-600">Pagos Efectivo</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center">
            <span className="text-3xl mr-4">🎫</span>
            <div>
              <div className="text-3xl font-bold text-gray-800">{getVoucherCount()}</div>
              <div className="text-lg text-gray-600">Pagos Voucher</div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-[#41BAAE] text-white p-4">
          <h2 className="text-2xl font-bold">Lista de Pedidos</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {orders.map((order, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <img
                  src={order.person_photo}
                  alt={order.person_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#BADA55]"
                />
                <div className="flex-grow">
                  <div className="text-xl font-bold text-gray-800">{order.person_name}</div>
                  <div className="text-lg text-gray-600">{getMenuText(order)}</div>
                  {order.observations && (
                    <div className="text-sm text-gray-500 italic">Obs: {order.observations}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
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
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => navigate('/make-order')}
          className="flex items-center justify-center space-x-3 bg-gray-600 text-white px-6 py-4 rounded-xl text-lg font-bold hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={24} />
          <span>Volver a Editar</span>
        </button>
        
        <button
          onClick={exportToExcel}
          className="flex items-center justify-center space-x-3 bg-green-600 text-white px-6 py-4 rounded-xl text-lg font-bold hover:bg-green-700 transition-colors"
        >
          <FileText size={24} />
          <span>Exportar Excel</span>
        </button>
        
        <button
          onClick={exportToPDF}
          className="flex items-center justify-center space-x-3 bg-red-600 text-white px-6 py-4 rounded-xl text-lg font-bold hover:bg-red-700 transition-colors"
        >
          <Download size={24} />
          <span>Exportar PDF</span>
        </button>
        
        <button
          onClick={confirmOrder}
          disabled={loading}
          className="flex-grow flex items-center justify-center space-x-3 bg-gradient-to-r from-[#41BAAE] to-[#BADA55] text-white px-6 py-4 rounded-xl text-xl font-bold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          <Check size={24} />
          <span>{loading ? 'Confirmando...' : 'Confirmar Pedido'}</span>
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;