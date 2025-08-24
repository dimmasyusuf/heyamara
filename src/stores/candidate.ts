"use client";

import { create } from "zustand";

type CandidateState = {
  files: File[];
};

type CandidateAction = {
  setFiles: (files: File[]) => void;
};

type CandidateStore = CandidateState & CandidateAction;

const initialState: CandidateState = {
  files: [],
};

export const useCandidateStore = create<CandidateStore>((set) => ({
  ...initialState,
  setFiles: (files) => set({ files }),
}));
