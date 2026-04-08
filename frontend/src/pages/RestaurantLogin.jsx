import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import { ClipboardList, Lock, User } from 'lucide-react';

const RestaurantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/restaurant/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <div className="bg-blue-600 p-4 rounded-3xl shadow-xl mb-10 text-white">
        <ClipboardList size={48} />
      </div>
      <h1 className="text-3xl font-black text-gray-800 mb-2">Merchant Center</h1>
      <p className="text-sm text-gray-400 mb-10 uppercase tracking-[0.2em] font-bold">Merchant Dashboard</p>

      <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-sm border border-gray-100 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
          Official Login
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-2xl mb-6 text-sm text-center font-bold border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="email" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-2xl transition-all outline-none text-gray-800 font-bold"
              placeholder="Merchant email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="password" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-2xl transition-all outline-none text-gray-800 font-bold"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-300">
          <p>Please sign in with your merchant account</p>
          <p className="mt-1 font-mono uppercase tracking-tighter">Restaurant @ Dishy</p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/customer/login')}
            className="w-full bg-white text-gray-700 py-3 rounded-2xl font-black border-2 border-gray-200 hover:bg-gray-50 active:scale-[0.99] transition-all"
          >
            用户登录
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLogin;
