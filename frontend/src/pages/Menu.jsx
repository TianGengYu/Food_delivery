import { useState, useEffect } from 'react';
import { Plus, ShoppingCart, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useCartStore from '../stores/useCartStore';
import CustomizationModal from '../components/CustomizationModal';

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [activeDish, setActiveDish] = useState(null);
  const { addItem, items, totalAmount } = useCartStore();

  const categories = ['全部', '盖饭', '面', '粥', '汤', '小食', '饮品'];

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const { data, error } = await supabase
          .from('dishes')
          .select('*');
        
        if (error) throw error;
        // Map custom_options from snake_case if necessary, 
        // but here I used custom_options in SQL to match customOptions in code mostly
        const mappedData = data.map(d => ({
          ...d,
          customOptions: d.custom_options,
          basePrice: Number(d.base_price)
        }));
        setDishes(mappedData);
      } catch (err) {
        console.error('Failed to fetch dishes', err);
      }
    };
    fetchDishes();
  }, []);

  const filteredDishes = selectedCategory === '全部' 
    ? dishes 
    : dishes.filter(d => d.category === selectedCategory);

  return (
    <div className="flex h-[calc(100vh-120px)] sm:h-[calc(100vh-100px)] overflow-hidden">
      {/* Categories Sidebar */}
      <aside className="w-20 sm:w-24 bg-gray-100 overflow-y-auto border-r border-gray-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`w-full py-6 px-2 text-xs font-semibold text-center transition-colors ${
              selectedCategory === cat 
                ? 'bg-white text-blue-600 border-l-4 border-blue-600' 
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </aside>

      {/* Dishes List */}
      <main className="flex-1 overflow-y-auto bg-white p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          {selectedCategory}
          <span className="ml-2 text-xs font-normal text-gray-400">({filteredDishes.length})</span>
        </h2>

        <div className="grid gap-6">
          {filteredDishes.map((dish) => (
            <div 
              key={dish.id} 
              className="flex items-center space-x-4 group cursor-pointer"
              onClick={() => setActiveDish(dish)}
            >
              <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center text-blue-300">
                <ShoppingCart size={32} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                  {dish.name}
                </h4>
                <p className="text-xs text-gray-400 mt-1">基础价格: ￥{dish.basePrice}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-bold text-orange-600">￥{dish.basePrice} <span className="text-xs text-gray-400 font-normal">起</span></span>
                  <button 
                    className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 active:scale-90 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Cart Indicator */}
      {items.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-80 bg-gray-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl z-40">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-2 rounded-lg relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-900">
                {items.length}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400">总计金额</p>
              <p className="text-lg font-bold">￥{totalAmount}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href='/customer/cart'}
            className="bg-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center"
          >
            去结算
            <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      )}

      {/* Customization Modal */}
      {activeDish && (
        <CustomizationModal
          dish={activeDish}
          isOpen={!!activeDish}
          onClose={() => setActiveDish(null)}
          onAddToCart={addItem}
        />
      )}
    </div>
  );
};

export default Menu;
