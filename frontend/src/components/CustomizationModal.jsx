import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const CustomizationModal = ({ dish, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);

  if (!isOpen) return null;

  const handleOptionToggle = (option) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.some(o => o.name === option.name);
      if (isSelected) {
        return prev.filter(o => o.name !== option.name);
      } else {
        return [...prev, option];
      }
    });
  };

  const calculateTotalPrice = () => {
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return (dish.basePrice + optionsPrice) * quantity;
  };

  const handleAdd = () => {
    const item = {
      dishId: dish.id,
      name: dish.name,
      quantity,
      custom: selectedOptions.map(o => `${o.type === 'remove' ? 'No ' : ''}${o.name}`),
      totalPrice: calculateTotalPrice()
    };
    onAddToCart(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">Customize {dish.name}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6">
          <section>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Options</h4>
            <div className="flex flex-wrap gap-2">
              {dish.customOptions.map((opt) => {
                const isSelected = selectedOptions.some(o => o.name === opt.name);
                return (
                  <button
                    key={opt.name}
                    onClick={() => handleOptionToggle(opt)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${
                      isSelected 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    {opt.type === 'remove' ? 'No ' : ''}{opt.name}
                    {opt.price > 0 && ` (+$${opt.price})`}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex items-center justify-between pt-4 border-t">
            <span className="text-gray-600 font-medium">Quantity</span>
            <div className="flex items-center space-x-4 bg-gray-100 rounded-full p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-blue-600 shadow-sm"
              >
                <Minus size={18} />
              </button>
              <span className="text-lg font-bold w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-blue-600 shadow-sm"
              >
                <Plus size={18} />
              </button>
            </div>
          </section>
        </div>

        <div className="p-4 bg-gray-50 flex items-center justify-between border-t">
          <div>
            <p className="text-xs text-gray-500">Estimated total</p>
            <p className="text-2xl font-bold text-orange-600">${calculateTotalPrice()}</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
