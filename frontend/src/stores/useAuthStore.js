import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Fetch profile data (coins, role)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) throw profileError;

      const userData = { ...data.user, ...profile, isGuest: profile.is_guest };
      set({ user: userData, loading: false });
      return true;
    } catch (err) {
      set({ error: err.message || '登录失败', loading: false });
      return false;
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      
      // The profile is created by the SQL trigger handle_new_user
      set({ loading: false });
      return true;
    } catch (err) {
      set({ error: err.message || '注册失败', loading: false });
      return false;
    }
  },

  guestLogin: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;

      await supabase.from('profiles').update({ is_guest: true }).eq('id', data.user.id);
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      set({
        user: { ...data.user, ...profile, isGuest: true },
        loading: false
      });
      return true;
    } catch {
      try {
        const rand = () => Math.random().toString(36).slice(2);
        const email = `guest_${Date.now()}_${rand()}@dishy.guest`;
        const password = `${rand()}${rand()}${Date.now()}`;

        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;

        await supabase.from('profiles').update({ is_guest: true }).eq('id', signInData.user.id);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signInData.user.id)
          .single();

        set({
          user: { ...signInData.user, ...profile, isGuest: true },
          loading: false
        });
        return true;
      } catch {
        set({
          error:
            '游客登录失败：请在 Supabase 启用 Anonymous 登录，或在 Auth 设置里关闭 Email Confirmations',
          loading: false
        });
        return false;
      }
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  updateProfile: async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error) throw error;
      set({ user: { ...authUser, ...profile, isGuest: profile?.is_guest } });
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  },

  // Initialize auth state
  initAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      set({ user: { ...session.user, ...profile, isGuest: profile.is_guest } });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        set({ user: { ...session.user, ...profile, isGuest: profile?.is_guest } });
      } else {
        set({ user: null });
      }
    });
  }
}));

export default useAuthStore;
