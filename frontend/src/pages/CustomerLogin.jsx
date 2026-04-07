import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

const CustomerLogin = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, guestLogin, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = isRegister ? await register(email, password) : await login(email, password);
    if (success) navigate('/customer/home');
  };

  const handleGuest = async () => {
    const success = await guestLogin();
    if (success) navigate('/customer/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Dishy</h1>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-6 text-center">{isRegister ? 'Create your account' : 'Welcome back'}</h2>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Working...' : (isRegister ? 'Sign up' : 'Sign in')}
          </button>
        </form>

        <div className="mt-4 flex justify-between items-center text-sm">
          <button 
            onClick={() => setIsRegister(!isRegister)} 
            className="text-blue-600 hover:underline"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
          <button 
            onClick={handleGuest} 
            className="text-gray-500 hover:underline"
          >
            Continue as guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
