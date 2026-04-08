import { useEffect, useState } from 'react';
import { ClipboardList, Clock, CheckCircle, Package, User, Phone, MessageSquare, ShoppingBag, History } from 'lucide-react';
import useOrderStore from '../stores/useOrderStore';

const Dashboard = () => {
  const { orders, fetchDashboardOrders, updateOrderStatus } = useOrderStore();
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchDashboardOrders();
    const timer = setInterval(fetchDashboardOrders, 10000); // Refresh every 10s
    return () => clearInterval(timer);
  }, [fetchDashboardOrders]);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const processingOrders = orders.filter(o => o.status === 'processing');

  const mobileTabs = [
    {
      id: 'pending',
      label: 'Pending',
      count: pendingOrders.length,
      activeClassName: 'bg-orange-600 text-white shadow-lg',
      badgeClassName: 'bg-orange-500 text-white'
    },
    {
      id: 'processing',
      label: 'In progress',
      count: processingOrders.length,
      activeClassName: 'bg-blue-600 text-white shadow-lg',
      badgeClassName: 'bg-blue-500 text-white'
    },
    {
      id: 'history',
      label: 'History',
      count: 0,
      activeClassName: 'bg-gray-600 text-white shadow-lg',
      badgeClassName: 'bg-gray-500 text-white'
    }
  ];

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    fetchDashboardOrders(); // 刷新订单列表
  };

  const OrderCard = ({ order }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
            <User size={24} />
          </div>
          <div>
            <h4 className="font-black text-gray-800 text-lg">{order.user_name}</h4>
            <div className="flex items-center text-xs text-gray-400 font-bold space-x-2">
              <Phone size={12} />
              <span>{order.phone}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-300 font-black uppercase tracking-tighter">Order ID</p>
          <p className="text-xs font-mono font-bold text-gray-400 group-hover:text-blue-600 transition-colors">{order.order_id}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center">
                <span className="bg-blue-600 text-white w-5 h-5 rounded flex items-center justify-center text-[10px] font-black mr-2 shadow-sm">
                  {item.quantity}
                </span>
                <span className="font-bold text-gray-700">{item.name}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1 ml-7">
                {item.custom.map((c, ci) => (
                  <span key={ci} className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md font-bold border border-orange-200 uppercase tracking-tighter">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {order.remark && (
        <div className="flex items-start space-x-2 text-xs bg-yellow-50 text-yellow-700 p-3 rounded-xl border border-yellow-100">
          <MessageSquare size={14} className="mt-0.5 flex-shrink-0" />
          <p className="italic">“{order.remark}”</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Paid</p>
          <p className="text-2xl font-black text-orange-600">${order.final_price}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
            order.pickup_or_delivery === 'Delivery' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
          }`}>
            {order.pickup_or_delivery}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 pt-2">
        {order.status === 'pending' && (
          <button 
            onClick={() => handleStatusUpdate(order.order_id, 'processing')}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <Package size={20} />
            <span>Accept</span>
          </button>
        )}
        {order.status === 'processing' && (
          <button 
            onClick={() => handleStatusUpdate(order.order_id, 'done')}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <CheckCircle size={20} />
            <span>Mark done</span>
          </button>
        )}
        {order.status === 'done' && (
          <div className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl font-black flex items-center justify-center space-x-2 border-2 border-dashed border-gray-200">
            <CheckCircle size={20} />
            <span>Completed</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-24 sm:pb-8 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16"></div>
        <div>
          <h2 className="text-3xl font-black text-gray-800">Order dashboard</h2>
          <p className="text-sm text-gray-400 mt-1 uppercase tracking-[0.3em] font-bold">Real-time Order Management</p>
        </div>
        <div className="flex items-center bg-gray-50 p-2 rounded-2xl space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Online</span>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="flex sm:hidden bg-white p-2 rounded-2xl shadow-sm border border-gray-100 sticky top-4 z-40">
        {mobileTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab.id 
                ? tab.activeClassName
                : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 border-white shadow-sm ${
                activeTab === tab.id ? 'bg-white text-gray-900' : tab.badgeClassName
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Desktop 3-Column Layout */}
      <div className="hidden sm:grid grid-cols-3 gap-8 items-start">
        {/* Column 1: Pending */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-sm font-black text-orange-600 uppercase tracking-[0.2em] flex items-center">
              <Clock size={16} className="mr-2" />
              Pending
            </h3>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black">{pendingOrders.length}</span>
          </div>
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {pendingOrders.map(order => <OrderCard key={order.order_id} order={order} />)}
            {pendingOrders.length === 0 && <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-300 text-xs font-bold uppercase tracking-widest">No pending orders</div>}
          </div>
        </div>

        {/* Column 2: Processing */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] flex items-center">
              <ShoppingBag size={16} className="mr-2" />
              In progress
            </h3>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black">{processingOrders.length}</span>
          </div>
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {processingOrders.map(order => <OrderCard key={order.order_id} order={order} />)}
            {processingOrders.length === 0 && <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-300 text-xs font-bold uppercase tracking-widest">No in-progress orders</div>}
          </div>
        </div>

        {/* Column 3: History Link */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-sm font-black text-gray-600 uppercase tracking-[0.2em] flex items-center">
              <History size={16} className="mr-2" />
              History
            </h3>
          </div>
          <div className="text-center">
            <a 
              href="/restaurant/history"
              className="inline-flex items-center justify-center bg-gray-100 text-gray-600 px-6 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all border-2 border-dashed border-gray-200"
            >
              <History size={16} className="mr-2" />
              View Order History
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Tab View */}
      <div className="sm:hidden space-y-6">
        {activeTab === 'pending' && pendingOrders.map(order => <OrderCard key={order.order_id} order={order} />)}
        {activeTab === 'processing' && processingOrders.map(order => <OrderCard key={order.order_id} order={order} />)}
        {activeTab === 'history' && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <a 
              href="/restaurant/history"
              className="inline-flex items-center justify-center bg-white text-gray-600 px-6 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all border-2 border-gray-200"
            >
              <History size={16} className="mr-2" />
              View Order History
            </a>
          </div>
        )}
        
        {((activeTab === 'pending' && pendingOrders.length === 0) || 
          (activeTab === 'processing' && processingOrders.length === 0)) && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-300 text-xs font-bold uppercase tracking-widest">No records</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
