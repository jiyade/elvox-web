import { create } from "zustand"

const useElectionStore = create((set) => ({
    election: {},
    setElection: (data) =>
        set((state) => ({
            election: {
                ...state.election,
                ...data
            }
        })),
    deleteElection: () => set(() => ({ election: {} }))
}))

export default useElectionStore
