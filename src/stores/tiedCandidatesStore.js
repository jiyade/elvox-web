import { create } from "zustand"

const useTiedCandidatesStore = create((set) => ({
    tiedCandidatesData: { hasTie: false },

    setTiedCandidatesData: (data) =>
        set({
            tiedCandidatesData: data
        })
}))

export default useTiedCandidatesStore
