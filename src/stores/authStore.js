import { create } from "zustand"
import api from "../api/api"
import toast from "react-hot-toast"
import { notifyMobileIfLoggedIn } from "../utils/mobileBridge"
import generateInitialAvatar from "../utils/generateInitialAvatar"

const useAuthStore = create((set) => ({
    isAuthenticated: false,
    user: null,
    isUserLoaded: false,

    login: (rawUser) => {
        const user = {
            ...rawUser,
            profile_pic:
                rawUser?.profile_pic ?? generateInitialAvatar(rawUser?.name)
        }
        set({ user, isAuthenticated: true, isUserLoaded: true })
    },
    logout: async () => {
        await api.post("/auth/logout")
        set({ user: null, isAuthenticated: false, isUserLoaded: true })
    },
    setRole: (newRole) => {
        set((state) => ({ user: { ...state.user, role: newRole } }))
    },
    fetchMe: async (setIsLoading) => {
        try {
            setIsLoading(true)
            const res = await api.get("/auth/me")

            const user = {
                ...res.data,
                profile_pic:
                    res.data?.profile_pic ??
                    generateInitialAvatar(res.data?.name)
            }

            notifyMobileIfLoggedIn(user.id)

            set({
                user,
                isAuthenticated: true,
                isUserLoaded: true
            })
        } catch (err) {
            set({
                user: null,
                isAuthenticated: false,
                isUserLoaded: true
            })
            toast.error(err?.response?.data?.error || "Something went wrong!", {
                id: "user-fetch-error"
            })
        } finally {
            setIsLoading(false)
        }
    }
}))

export default useAuthStore
