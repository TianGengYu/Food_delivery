import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import useOrderStore from '../stores/useOrderStore';

const Orders = () => {
  const { orders, fetchUserOrders, loading } = useOrderStore();

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-600';
      case 'processing': return 'bg-blue-100 text-blue-600';
      case 'done': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
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

  if (loading && orders.length === 0) return <div className="text-center p-10 text-gray-400">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div className="bg-blue-50 p-6 rounded-full mb-6">
          <ShoppingBag size={64} className="text-blue-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-8 max-w-xs">You haven't placed any orders. Browse the menu and get started.</p>
        <Link 
          to="/customer/menu" 
          className="bg-blue-600 text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          Start ordering
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">My orders</h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">Order History</p>
      </header>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link 
            key={order.order_id} 
            to={`/customer/order/${order.order_id}`}
            className="block bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Order ID</p>
                <p className="text-sm font-mono font-bold text-gray-800">{order.order_id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <div className="flex items-center space-x-3 text-sm text-gray-600 mb-4">
              <Clock size={14} className="text-gray-400" />
              <span>{new Date(order.created_at).toLocaleString()}</span>
            </div>

            <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
              <div className="flex -space-x-2 overflow-hidden">
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                    {item.name[0]}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Paid</p>
                <p className="text-xl font-black text-orange-600">${order.final_price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;
