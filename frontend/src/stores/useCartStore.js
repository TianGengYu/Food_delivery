import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useCartStore = create((set, get) => ({
  items: [],
  totalAmount: 0,
  loading: false,

  fetchCart: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows found"

      if (data) {
        set({ items: data.items, totalAmount: data.total_amount, loading: false });
      } else {
        set({ items: [], totalAmount: 0, loading: false });
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
      set({ loading: false });
    }
  },

  addItem: async (item) => {
    const { items } = get();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const existingIndex = items.findIndex(i => 
      i.dishId === item.dishId && 
      JSON.stringify(i.custom.sort()) === JSON.stringify(item.custom.sort())
    );

    let newItems;
    if (existingIndex > -1) {
      newItems = [...items];
      newItems[existingIndex].quantity += item.quantity;
      newItems[existingIndex].totalPrice += item.totalPrice;
    } else {
      newItems = [...items, item];
    }

    const totalAmount = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
    set({ items: newItems, totalAmount });

    await supabase
      .from('carts')
      .upsert({ user_id: user.id, items: newItems, total_amount: totalAmount });
  },

  removeItem: async (index) => {
    const { items } = get();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newItems = items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
    set({ items: newItems, totalAmount });

    await supabase
      .from('carts')
      .upsert({ user_id: user.id, items: newItems, total_amount: totalAmount });
  },

  updateQuantity: async (index, delta) => {
    const { items } = get();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newItems = [...items];
    const item = newItems[index];
    const unitPrice = item.totalPrice / item.quantity;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
      newItems.splice(index, 1);
    } else {
      item.totalPrice = unitPrice * item.quantity;
    }

    const totalAmount = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
    set({ items: newItems, totalAmount });

    await supabase
      .from('carts')
      .upsert({ user_id: user.id, items: newItems, total_amount: totalAmount });
  },

  clearCart: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    set({ items: [], totalAmount: 0 });
    await supabase
      .from('carts')
      .upsert({ user_id: user.id, items: [], total_amount: 0 });
  }
}));

export default useCartStore;
