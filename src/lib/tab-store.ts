
"use client";

import { create } from 'zustand';

type TabStore = {
  mainTab: string;
  setMainTab: (tab: string) => void;
  showStaffTabs: boolean;
  setShowStaffTabs: (show: boolean) => void;
};

export const useTabStore = create<TabStore>((set) => ({
  mainTab: 'home',
  setMainTab: (tab) => set({ mainTab: tab }),
  showStaffTabs: false,
  setShowStaffTabs: (show) => set({ showStaffTabs: show }),
}));
