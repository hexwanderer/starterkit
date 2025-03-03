import { create } from "zustand";

export type CommandAction = {
  id: string;
  name: string;
  description?: string;
  shortcut?: string[];
  callback: () => void;
  category?: string;
};

interface CommandState {
  open: boolean;
  actions: CommandAction[];
}

interface CommandActions {
  registerAction: (action: CommandAction) => void;
  unregisterAction: (id: string) => void;
  registerActions: (actions: CommandAction[]) => void;
  unregisterActions: (ids: string[]) => void;
  clearActions: () => void;
  openCommand: () => void;
  closeCommand: () => void;
  toggleCommand: () => void;
  executeCommand: (id: string) => void;
}

export const useCommandStore = create<CommandState & CommandActions>(
  (set, get) => ({
    open: false,
    actions: [],

    registerAction: (action) =>
      set((state) => ({
        actions: [...state.actions.filter((a) => a.id !== action.id), action],
      })),

    unregisterAction: (id) =>
      set((state) => ({
        actions: state.actions.filter((a) => a.id !== id),
      })),

    registerActions: (actions) =>
      set((state) => ({
        actions: [
          ...state.actions.filter(
            (a) => !actions.some((newAction) => newAction.id === a.id),
          ),
          ...actions,
        ],
      })),

    unregisterActions: (ids) =>
      set((state) => ({
        actions: state.actions.filter((a) => !ids.includes(a.id)),
      })),

    clearActions: () => set({ actions: [] }),

    openCommand: () => set({ open: true }),

    closeCommand: () => set({ open: false }),

    toggleCommand: () => set((state) => ({ open: !state.open })),

    executeCommand: (id) => {
      const action = get().actions.find((a) => a.id === id);
      if (action) {
        action.callback();
      }
    },
  }),
);
