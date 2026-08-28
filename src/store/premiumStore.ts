import { create } from 'zustand';
import { getMyPremiumStatus } from '../services/premiumService';

interface PremiumState {
  isPremium: boolean;
  practiceToday: number;
  practiceLimit: number | null;
  battlesToday: number;
  battlesLimit: number | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export const usePremiumStore = create<PremiumState>((set) => ({
  isPremium: false,
  practiceToday: 0,
  practiceLimit: null,
  battlesToday: 0,
  battlesLimit: null,
  loading: true,

  refresh: async () => {
    try {
      const status = await getMyPremiumStatus();
      set({ ...status, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
