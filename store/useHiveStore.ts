import { create } from 'zustand';

export interface HiveUser {
  id: string;
  name: string;
  vote: string | null;
  isHost?: boolean;
  initials?: string;
}

interface HiveState {
  users: HiveUser[];
  consensus: string | null;
  category: string;
  canOthersAdd: boolean;
  phase: 'home' | 'waiting' | 'voting' | 'consensus';
  options: any[];
  vetoedOption: string | null;
  hasVetoed: boolean;
  timeLeft: number;
  setPhase: (phase: 'home' | 'waiting' | 'voting' | 'consensus') => void;
  setOptions: (options: any[]) => void;
  setVetoedOption: (title: string | null) => void;
  setHasVetoed: (val: boolean) => void;
  setTimeLeft: (time: number) => void;
  setUsers: (users: HiveUser[]) => void;
  setConsensus: (choice: string | null) => void;
  setSettings: (settings: { category: string; canOthersAdd: boolean }) => void;
  reset: () => void;
}

export const useHiveStore = create<HiveState>((set) => ({
  users: [],
  consensus: null,
  category: 'Movies',
  canOthersAdd: true,
  phase: 'home',
  options: [],
  vetoedOption: null,
  hasVetoed: false,
  timeLeft: 180,
  setUsers: (users) => set({ users }),
  setConsensus: (choice) => set({ consensus: choice }),
  setSettings: (settings) => set({ category: settings.category, canOthersAdd: settings.canOthersAdd }),
  setPhase: (phase) => set({ phase }),
  setOptions: (options) => set({ options }),
  setVetoedOption: (title) => set({ vetoedOption: title }),
  setHasVetoed: (val) => set({ hasVetoed: val }),
  setTimeLeft: (time) => set({ timeLeft: time }),
  reset: () => set({
    users: [],
    consensus: null,
    category: 'Movies',
    canOthersAdd: true,
    phase: 'home',
    options: [],
    vetoedOption: null,
    hasVetoed: false,
    timeLeft: 180
  }),
}));