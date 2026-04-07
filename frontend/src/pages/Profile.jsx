import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, User, LogOut, ChevronRight, Gift, History, CreditCard } from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';

const Profile = () => {
  const { user, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.isGuest) updateProfile();
  }, [user, updateProfile]);

  const handleLogout = () => {
    logout();
    navigate('/customer/login');
  };

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      <header className="flex flex-col items-center py-10 bg-white rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-blue-600/5 -z-10"></div>
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-inner mb-4">
          <User size={48} />
        </div>
        <h2 className="text-2xl font-black text-gray-800">{user?.isGuest ? '游客用户' : user?.email.split('@')[0]}</h2>
        <p className="text-sm text-gray-400 mt-1">{user?.email || '未绑定邮箱'}</p>
        
        <div className="mt-8 grid grid-cols-2 gap-8 w-full px-10">
          <div className="text-center">
            <p className="text-2xl font-black text-blue-600">{user?.coins || 0}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">可用积分</p>
          </div>
          <div className="text-center border-l border-gray-100">
            <p className="text-2xl font-black text-orange-600">0</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">待发放</p>
          </div>
        </div>
      </header>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 flex items-center">
            <CreditCard size={18} className="mr-2 text-blue-600" />
            我的资产
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="bg-orange-50 p-4 rounded-2xl flex flex-col items-center text-center">
            <Gift size={24} className="text-orange-500 mb-2" />
            <span className="text-sm font-bold text-orange-600">领券中心</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl flex flex-col items-center text-center">
            <Star size={24} className="text-blue-500 mb-2" />
            <span className="text-sm font-bold text-blue-600">我的收藏</span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <button 
          onClick={() => navigate('/customer/orders')}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
              <History size={20} />
            </div>
            <span className="font-bold text-gray-700">订单历史</span>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </button>
        <button 
          onClick={handleLogout}
          className="w-full p-5 flex items-center justify-between hover:bg-red-50 transition-colors border-t border-gray-50"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-2 rounded-xl text-red-600">
              <LogOut size={20} />
            </div>
            <span className="font-bold text-red-600">退出登录</span>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </button>
      </section>

      <footer className="text-center pt-4 opacity-20">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Dishy Student Food App v1.0.0</p>
      </footer>
    </div>
  );
};

export default Profile;
