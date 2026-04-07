import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Home, ClipboardList, LogOut } from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';
import useCartStore from '../stores/useCartStore';

const Navbar = ({ isRestaurant = false }) => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(isRestaurant ? '/restaurant/login' : '/customer/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 fixed bottom-0 left-0 right-0 z-50 sm:top-0 sm:bottom-auto">
      <div className="max-w-md mx-auto px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex justify-around items-center sm:max-w-4xl sm:py-2">
        {isRestaurant ? (
          <>
            <div className="text-xl font-bold text-blue-600 hidden sm:block">Dishy Merchant</div>
            <Link to="/restaurant/dashboard" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
              <ClipboardList size={24} />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <button onClick={handleLogout} className="flex flex-col items-center text-gray-600 hover:text-red-600">
              <LogOut size={24} />
              <span className="text-xs mt-1">Sign out</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/customer/home" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
              <Home size={24} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/customer/menu" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
              <ClipboardList size={24} />
              <span className="text-xs mt-1">Menu</span>
            </Link>
            <Link to="/customer/cart" className="flex flex-col items-center text-gray-600 hover:text-blue-600 relative">
              <ShoppingCart size={24} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
              <span className="text-xs mt-1">Cart</span>
            </Link>
            <Link to="/customer/orders" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
              <ClipboardList size={24} />
              <span className="text-xs mt-1">Orders</span>
            </Link>
            <Link to="/customer/profile" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
              <User size={24} />
              <span className="text-xs mt-1">Me</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
