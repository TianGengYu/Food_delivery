import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import useAuthStore from './stores/useAuthStore';

// Pages
import CustomerLogin from './pages/CustomerLogin';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import RestaurantLogin from './pages/RestaurantLogin';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children, allowedRole = 'customer' }) => {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to={allowedRole === 'restaurant' ? '/restaurant/login' : '/customer/login'} replace />;
  }
  if (allowedRole === 'restaurant' && user.role !== 'restaurant') {
    return <Navigate to="/restaurant/login" replace />;
  }
  return children;
};

function App() {
  const { user, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Router>
      <div className="min-h-[100dvh] bg-gray-50 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-0 sm:pt-16">
        <Navbar isRestaurant={user?.role === 'restaurant'} />
        <main className="max-w-md mx-auto sm:max-w-4xl p-4">
          <Routes>
            {/* Customer Routes */}
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/customer/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
            <Route path="/customer/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/customer/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/customer/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/customer/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/customer/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Restaurant Routes */}
            <Route path="/restaurant/login" element={<RestaurantLogin />} />
            <Route path="/restaurant/dashboard" element={<ProtectedRoute allowedRole="restaurant"><Dashboard /></ProtectedRoute>} />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/customer/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
