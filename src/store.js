import { create } from 'zustand';

const useStore = create((set) => ({
  papers: [],
  setPapers: (papers) => set({ papers }),
  addPaper: (paper) => set((state) => ({ papers: [...state.papers, paper] })),
  // Add more state and actions as needed
}));

export default useStore;
