import { Link } from 'react-router-dom';
import { ShoppingBag, Star, MapPin } from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';

const Home = () => {
  const { user } = useAuthStore();

  const restaurants = [
    { id: 1, name: '第一食堂', rating: 4.8, distance: '200m', tag: '中式盖饭', img: 'https://placehold.co/400x200?text=Dining+Hall+1' },
    { id: 2, name: '清真风味', rating: 4.6, distance: '500m', tag: '兰州拉面', img: 'https://placehold.co/400x200?text=Halal+Flavor' },
    { id: 3, name: '港式茶餐厅', rating: 4.5, distance: '800m', tag: '下午茶/正餐', img: 'https://placehold.co/400x200?text=HK+Diner' }
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center py-4 bg-white px-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">你好, {user?.isGuest ? '游客' : user?.email.split('@')[0]}</h2>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">
              {user?.coins || 0} 积分
            </span>
          </p>
        </div>
        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
          <ShoppingBag size={24} />
        </div>
      </header>

      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">推荐商家</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((res) => (
            <Link 
              key={res.id} 
              to="/customer/menu" 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100"
            >
              <img src={res.img} alt={res.name} className="w-full h-32 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-bold text-gray-800">{res.name}</h4>
                  <div className="flex items-center text-orange-500 text-sm font-semibold">
                    <Star size={16} fill="currentColor" className="mr-0.5" />
                    {res.rating}
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-2 space-x-3">
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {res.distance}
                  </span>
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                    {res.tag}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
