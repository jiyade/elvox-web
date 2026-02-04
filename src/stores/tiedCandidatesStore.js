import { create } from "zustand"

const useTiedCandidatesStore = create((set) => ({
    tiedCandidatesData: null,

    setTiedCandidatesData: (data) =>
        set({
            tiedCandidatesData: data
        })
}))

export default useTiedCandidatesStore
