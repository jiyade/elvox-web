import { useNavigate } from "react-router-dom"
import { useFormContext } from "react-hook-form"
import toast from "react-hot-toast"
import api from "../api/api"
import { useAuthStore } from "../stores"
import { notifyMobileLogin } from "../utils/mobileBridge.js"

const SignUpForm = ({ children, setIsLoading }) => {
    const { handleSubmit, getValues } = useFormContext()
    const navigate = useNavigate()
    const { login } = useAuthStore()

    const onSubmit = async () => {
        try {
            setIsLoading(true)
            const [role, password, confirmPassword, otpMethod, otp] = getValues(
                ["role", "password", "confirmPassword", "otpMethod", "otp"]
            )

            const idField =
                role.toLowerCase() === "student" ? "admno" : "empcode"

            const id = getValues(idField)

            const otpVerifyData = {
                otpMethod,
                otp,
                role,
                [idField]: id
            }

            const otpVerifyRes = await api.post(
                "/auth/otp/verify/signup",
                otpVerifyData
            )

            if (otpVerifyRes.status === 200 && otpVerifyRes.data.signupToken) {
                const res = await api.post("/auth/signup", {
                    password,
                    confirmPassword,
                    signupToken: otpVerifyRes.data.signupToken
                })

                if (res.status === 201) {
                    login(res.data.user)
                    notifyMobileLogin(res.data.user.id)
                    navigate("/")
                    toast.success(`Welcome ${res.data.name}!`, {
                        id: "signup-success"
                    })
                }
            }
        } catch (err) {
            if (err.response)
                toast.error(err.response?.data?.error, { id: "signup-error" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6 w-full text-sm'
            id='signup-form'
        >
            {children}
        </form>
    )
}

export default SignUpForm
