import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, ChevronRight, History } from 'lucide-react';
import useOrderStore from '../stores/useOrderStore';

const OrderHistory = () => {
  const { orders, fetchDashboardOrders, loading } = useOrderStore();

  useEffect(() => {
    fetchDashboardOrders();
  }, [fetchDashboardOrders]);

  const doneOrders = orders.filter(o => o.status === 'done');



  if (loading && orders.length === 0) return <div className="text-center p-10 text-gray-400">Loading orders...</div>;

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      <header className="flex items-center justify-between mb-8">
        <Link to="/restaurant/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight size={24} className="text-gray-600 rotate-180" />
        </Link>
        <h2 className="text-xl font-bold text-gray-800 text-center flex-1 pr-10">Order History</h2>
        <div className="w-10"></div>
      </header>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
        <div className="bg-blue-50 p-4 rounded-full inline-flex items-center justify-center mb-4">
          <History size={32} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Completed Orders</h3>
        <p className="text-sm text-gray-500 mb-6">All completed orders are listed here</p>
        <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-bold inline-block">
          {doneOrders.length} orders
        </div>
      </div>

      <div className="space-y-4">
        {doneOrders.map((order) => (
          <div key={order.order_id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{order.user_name}</h4>
                  <p className="text-xs text-gray-400">{order.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-300 font-black uppercase tracking-tighter">Order ID</p>
                <p className="text-xs font-mono font-bold text-gray-400">{order.order_id}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-2">
              {order.items.slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-gray-500">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="text-xs text-gray-400 text-center pt-2">
                  +{order.items.length - 3} more items
                </div>
              )}
            </div>

            {order.remark && (
              <div className="flex items-start space-x-2 text-xs bg-yellow-50 text-yellow-700 p-2 rounded-lg border border-yellow-100">
                <span className="font-semibold">Note:</span>
                <p className="italic">"{order.remark}"</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total</p>
                <p className="text-xl font-black text-green-600">${order.final_price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                  order.pickup_or_delivery === 'Delivery' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {order.pickup_or_delivery}
                </span>
                <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full font-black uppercase tracking-widest">
                  Completed
                </span>
              </div>
            </div>
          </div>
        ))}

        {doneOrders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-gray-50 p-6 rounded-full inline-flex items-center justify-center mb-4">
              <Clock size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No completed orders yet</h3>
            <p className="text-sm text-gray-500">Completed orders will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;