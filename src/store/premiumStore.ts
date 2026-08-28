import { create } from 'zustand';
import { getMyPremiumStatus, getPremiumPrice, type PremiumPrice } from '../services/premiumService';

interface PremiumState {
  isPremium: boolean;
  practiceToday: number;
  practiceLimit: number | null;
  battlesToday: number;
  battlesLimit: number | null;
  loading: boolean;
  price: PremiumPrice | null;
  refresh: () => Promise<void>;
  loadPrice: () => Promise<void>;
}

export const usePremiumStore = create<PremiumState>((set, get) => ({
  isPremium: false,
  practiceToday: 0,
  practiceLimit: null,
  battlesToday: 0,
  battlesLimit: null,
  loading: true,
  price: null,

  refresh: async () => {
    try {
      const status = await getMyPremiumStatus();
      set({ ...status, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  loadPrice: async () => {
    if (get().price) return;
    try {
      const price = await getPremiumPrice();
      set({ price });
    } catch {
      // Leaves price null — the UI just omits the amount if it can't load.
    }
  },
}));
