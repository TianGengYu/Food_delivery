import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Clock, MapPin, Truck, Phone, MessageSquare, CreditCard, ShoppingBag, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('order_id', id)
          .single();
        
        if (error) throw error;
        setOrder({
          ...data,
          orderId: data.order_id,
          userName: data.user_name,
          coinsUsed: data.coins_used,
          finalPrice: data.final_price,
          pickupOrDelivery: data.pickup_or_delivery
        });
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    
    // Polling for status updates
    const timer = setInterval(fetchOrder, 5000);
    return () => clearInterval(timer);
  }, [id]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'processing': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'done': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'In progress';
      case 'done': return 'Done';
      default: return status;
    }
  };

  if (loading) return <div className="text-center p-10 text-gray-400">Loading order...</div>;
  if (!order) return <div className="text-center p-10 text-red-500">Order not found</div>;

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      <header className="flex items-center justify-between mb-8">
        <Link to="/customer/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-600" />
        </Link>
        <h2 className="text-xl font-bold text-gray-800 text-center flex-1 pr-10">Order details</h2>
      </header>

      <section className={`p-6 rounded-3xl border text-center space-y-2 shadow-sm ${getStatusStyle(order.status)}`}>
        <div className="flex justify-center mb-2">
          {order.status === 'pending' && <Clock size={40} className="animate-pulse" />}
          {order.status === 'processing' && <ShoppingBag size={40} className="animate-bounce" />}
          {order.status === 'done' && <CheckCircle size={40} />}
        </div>
        <h3 className="text-2xl font-black uppercase tracking-widest">{getStatusText(order.status)}</h3>
        <p className="text-sm opacity-70">
          {order.status === 'pending' && 'Your order is waiting for the restaurant to accept it.'}
          {order.status === 'processing' && 'Your food is being prepared.'}
          {order.status === 'done' && 'Your order is ready.'}
        </p>
      </section>

      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center space-x-2 text-blue-600 font-bold mb-4">
          <Truck size={20} />
          <span>Delivery info</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1 uppercase">Name</p>
            <p className="text-gray-800 font-bold">{order.userName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1 uppercase">Phone</p>
            <p className="text-gray-800 font-bold">{order.phone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-400 font-semibold mb-1 uppercase">Method</p>
            <p className="text-gray-800 font-bold flex items-center">
              <MapPin size={14} className="mr-1 text-blue-600" />
              {order.pickupOrDelivery}
            </p>
          </div>
          {order.remark && (
            <div className="col-span-2 pt-2 border-t border-gray-50">
              <p className="text-xs text-gray-400 font-semibold mb-1 uppercase">Note</p>
              <p className="text-gray-600 italic">“{order.remark}”</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center space-x-2 text-blue-600 font-bold mb-4">
          <ShoppingBag size={20} />
          <span>Items</span>
        </div>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-600 w-5 h-5 rounded flex items-center justify-center text-xs font-bold mr-2">
                    {item.quantity}
                  </span>
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                </div>
                <div className="flex flex-wrap gap-1 mt-1 ml-7">
                  {item.custom.map((c, i) => (
                    <span key={i} className="text-[10px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <span className="font-bold text-gray-800 ml-4">${item.totalPrice}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center space-x-2 text-blue-600 font-bold mb-4">
          <CreditCard size={20} />
          <span>Summary</span>
        </div>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.total}</span>
          </div>
          <div className="flex justify-between text-orange-500 font-semibold">
            <span>Coins</span>
            <span>-${order.coinsUsed}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <span className="text-lg font-bold text-gray-800">Total</span>
            <span className="text-2xl font-black text-orange-600">${order.finalPrice}</span>
          </div>
        </div>
      </section>

      <div className="flex space-x-4 pt-4">
        <button className="flex-1 bg-white border border-gray-200 text-gray-600 py-4 rounded-2xl font-bold shadow-sm flex items-center justify-center space-x-2">
          <Phone size={18} />
          <span>Contact</span>
        </button>
        <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center space-x-2">
          <MessageSquare size={18} />
          <span>Support</span>
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
