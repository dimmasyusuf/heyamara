"use client";

import { create } from "zustand";

type WidgetState = {
  open: boolean;
};

type WidgetAction = {
  setOpen: (open: boolean) => void;
};

type WidgetStore = WidgetState & WidgetAction;

const initialState: WidgetState = {
  open: false,
};

export const useWidgetStore = create<WidgetStore>((set) => ({
  ...initialState,
  setOpen: (open) => set({ open }),
}));
