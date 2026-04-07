import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useOrderStore = create((set) => ({
  orders: [],
  loading: false,

  fetchUserOrders: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ orders: data, loading: false });
    } catch (err) {
      console.error('Failed to fetch user orders', err);
      set({ loading: false });
    }
  },

  fetchDashboardOrders: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ orders: data, loading: false });
    } catch (err) {
      console.error('Failed to fetch dashboard orders', err);
      set({ loading: false });
    }
  },

  createOrder: async (orderData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    set({ loading: true });
    try {
      const orderId = `DISHY_${Date.now()}`;
      const payload = {
        order_id: orderId,
        user_id: user.id,
        user_name: orderData.userName,
        phone: orderData.phone,
        items: orderData.items,
        total: orderData.total,
        coins_used: orderData.coinsUsed || 0,
        final_price: orderData.finalPrice,
        status: 'pending',
        pickup_or_delivery: orderData.pickupOrDelivery,
        remark: orderData.remark || ''
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      // Deduct coins if used
      if ((orderData.coinsUsed || 0) > 0) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('coins')
          .eq('id', user.id)
          .single();
        
        await supabase
          .from('profiles')
          .update({ coins: profile.coins - (orderData.coinsUsed || 0) })
          .eq('id', user.id);
      }

      set({ loading: false });
      return { ...data, orderId: data.order_id };
    } catch (err) {
      console.error('Failed to create order', err);
      set({ loading: false });
      return null;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('order_id', orderId)
        .select()
        .single();
      
      if (error) throw error;

      set((state) => ({
        orders: state.orders.map(o => o.order_id === orderId ? data : o)
      }));
      return true;
    } catch (err) {
      console.error('Failed to update status', err);
      return false;
    }
  }
}));

export default useOrderStore;
