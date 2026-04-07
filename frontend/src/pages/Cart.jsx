import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ChevronLeft, CreditCard, ShoppingCart, X, ChevronRight } from 'lucide-react';
import useCartStore from '../stores/useCartStore';

const Cart = () => {
  const { items, totalAmount, removeItem, updateQuantity, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div className="bg-blue-50 p-6 rounded-full mb-6">
          <ShoppingCart size={64} className="text-blue-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs">You haven't added anything yet. Head to the menu and pick something tasty.</p>
        <Link 
          to="/customer/menu" 
          className="bg-blue-600 text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      <header className="flex items-center justify-between mb-8">
        <Link to="/customer/menu" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-600" />
        </Link>
        <h2 className="text-xl font-bold text-gray-800">Cart</h2>
        <button 
          onClick={clearCart}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </header>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-50 rounded-xl flex-shrink-0 flex items-center justify-center text-blue-300">
              <CreditCard size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.custom.map((c, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(index)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-orange-600">${item.totalPrice}</span>
                <div className="flex items-center space-x-3 bg-gray-100 rounded-full p-0.5">
                  <button 
                    onClick={() => updateQuantity(index, -1)}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-blue-600 shadow-sm"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(index, 1)}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-blue-600 shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 space-y-4">
        <div className="flex justify-between items-center text-gray-500">
          <span>Items</span>
          <span>${totalAmount}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-2xl font-black text-orange-600">${totalAmount}</span>
        </div>
        <Link 
          to="/customer/checkout"
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
        >
          <span>Checkout</span>
          <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default Cart;
