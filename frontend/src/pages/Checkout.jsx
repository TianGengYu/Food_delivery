import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Truck, ShoppingBag, MessageSquare, CreditCard, ChevronRight } from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';
import useCartStore from '../stores/useCartStore';
import useOrderStore from '../stores/useOrderStore';

const Checkout = () => {
  const { user, updateProfile } = useAuthStore();
  const { items, totalAmount, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupOrDelivery, setPickupOrDelivery] = useState('Pickup');
  const [remark, setRemark] = useState('');
  const [coinsToUse, setCoinsToUse] = useState(0);

  const maxCoinsAllowed = Math.floor(totalAmount * 0.3);
  const usableCoins = Math.min(user?.coins || 0, maxCoinsAllowed);
  const finalPrice = totalAmount - coinsToUse;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !phone) return alert('Please enter your name and phone number');

    const orderData = {
      userName,
      phone,
      items,
      total: totalAmount,
      coinsUsed: coinsToUse,
      finalPrice,
      pickupOrDelivery,
      remark
    };

    const res = await createOrder(orderData);
    if (res) {
      await clearCart();
      if (!user.isGuest) await updateProfile();
      navigate(`/customer/order/${res.orderId}`);
    }
  };

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      <header className="flex items-center justify-between mb-8">
        <Link to="/customer/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-600" />
        </Link>
        <h2 className="text-xl font-bold text-gray-800 text-center flex-1 pr-10">Place order</h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center space-x-2 text-blue-600 font-bold mb-4">
            <Truck size={20} />
            <span>Fulfillment</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPickupOrDelivery('Pickup')}
              className={`py-3 rounded-2xl font-bold transition-all border ${
                pickupOrDelivery === 'Pickup' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                  : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-blue-400'
              }`}
            >
              Pickup
            </button>
            <button
              type="button"
              onClick={() => setPickupOrDelivery('Delivery')}
              className={`py-3 rounded-2xl font-bold transition-all border ${
                pickupOrDelivery === 'Delivery' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                  : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-blue-400'
              }`}
            >
              Delivery
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center space-x-2 text-blue-600 font-bold mb-4">
            <MapPin size={20} />
            <span>Contact</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-600 rounded-2xl transition-all outline-none text-gray-800 font-medium"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-600 rounded-2xl transition-all outline-none text-gray-800 font-medium"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Note (optional)</label>
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-600 rounded-2xl transition-all outline-none text-gray-800 font-medium h-24 resize-none"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Any special requests?"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center space-x-2 text-blue-600 font-bold mb-4">
            <CreditCard size={20} />
            <span>Coins</span>
          </div>
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-blue-600">My coins: {user?.coins || 0}</p>
              <p className="text-[10px] text-blue-400 mt-1">Up to 30% of the order total</p>
            </div>
            <div className="flex items-center space-x-3 bg-white rounded-full p-1 shadow-sm">
              <button 
                type="button"
                onClick={() => setCoinsToUse(Math.max(0, coinsToUse - 1))}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-blue-600"
              >
                -
              </button>
              <span className="text-sm font-bold w-6 text-center">{coinsToUse}</span>
              <button 
                type="button"
                onClick={() => setCoinsToUse(Math.min(usableCoins, coinsToUse + 1))}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-blue-600"
              >
                +
              </button>
            </div>
          </div>
        </section>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 space-y-4 sticky bottom-6 z-30">
          <div className="space-y-2 text-sm text-gray-500 pb-2 border-b border-gray-100">
            <div className="flex justify-between">
              <span>Items</span>
              <span>${totalAmount}</span>
            </div>
            <div className="flex justify-between text-orange-500">
              <span>Coins</span>
              <span>-${coinsToUse}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Final</span>
            <span className="text-2xl font-black text-orange-600">${finalPrice}</span>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Place order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
