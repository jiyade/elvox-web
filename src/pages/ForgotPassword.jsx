import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Logo from "../components/Logo"
import Title from "../components/Title"
import FullScreenLoader from "../components/FullScreenLoader"
import { useAuthStore } from "../stores"
import { useNavigate } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form"
import Button from "../components/Button"
import ForgotPasswordFormEmailOrPassFIeld from "../components/ForgotPasswordFormEmailOrPassFIeld"
import OTPInput from "../components/OTPInput"
import ChangePassword from "../components/ChangePassword"
import api from "../api/api"
import toast from "react-hot-toast"

const detectInput = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^(\+91)?[0-9]{10}$/

    if (emailRegex.test(value)) return "email"
    if (phoneRegex.test(value)) return "phone"
}

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [showOtpField, setShowOtpField] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)

    const { isAuthenticated } = useAuthStore()
    const navigate = useNavigate()

    const methods = useForm()

    const otpField = methods.watch("otp")

    const handleNext = async () => {
        const valid = await methods.trigger()
        if (!valid) return

        if (!showOtpField) {
            try {
                // GET OTP
                setIsLoading(true)
                const type = detectInput(methods.getValues("eop"))
                const data = {
                    otpMethod: type,
                    [type]: methods.getValues("eop"),
                    purpose: "forgot"
                }
                const res = await api.post("/auth/otp", data)
                if (res.status === 200)
                    toast.success(res.data.message, { id: "otp-send-success" })
                setShowOtpField(true)
            } catch (err) {
                if (err.response)
                    toast.error(err.response?.data?.error, {
                        id: "otp-send-error"
                    })
            } finally {
                setIsLoading(false)
            }
        } else {
            if (!showChangePassword) {
                try {
                    // VERIFY OTP
                    setIsLoading(true)
                    const type = detectInput(methods.getValues("eop"))
                    const data = {
                        otpMethod: type,
                        [type]: methods.getValues("eop"),
                        otp: methods.getValues("otp")
                    }
                    const otpVerifyRes = await api.post(
                        "/auth/otp/verify/forgot-password",
                        data
                    )

                    if (
                        otpVerifyRes.status === 200 &&
                        otpVerifyRes.data.passwordResetToken
                    ) {
                        toast.success(otpVerifyRes.data.message, {
                            id: "otp-verify-success"
                        })
                        methods.setValue(
                            "passwordResetToken",
                            otpVerifyRes.data.passwordResetToken
                        )
                        setShowChangePassword(true)
                    }
                } catch (err) {
                    if (err.response)
                        toast.error(err.response?.data?.error, {
                            id: "otp-verify-error"
                        })
                } finally {
                    setIsLoading(false)
                }
            } else if (showChangePassword) {
                try {
                    // CHANGE PASSWORD
                    setIsLoading(true)
                    const data = {
                        newPassword: methods.getValues("newPassword"),
                        confirmNewPassword:
                            methods.getValues("confirmNewPassword"),
                        passwordResetToken:
                            methods.getValues("passwordResetToken")
                    }

                    const res = await api.patch("/auth/reset-password", data)

                    if (res.status === 200) {
                        toast.success(res.data.message, {
                            id: "password-reset-success"
                        })
                        navigate("/login")
                    }
                } catch (err) {
                    if (err.response)
                        toast.error(err.response?.data?.error, {
                            id: "password-reset-error"
                        })
                } finally {
                    setIsLoading(false)
                }
            }
        }
    }

    useEffect(() => {
        if (isAuthenticated) navigate("/")
    }, [isAuthenticated, navigate])

    return (
        <>
            <div className='flex flex-col justify-center gap-10 items-center min-h-dvh w-full relative bg-bg-light dark:bg-bg-dark py-3'>
                <title>Forgot Password</title>
                <div className='flex flex-col items-center gap-3 px-3'>
                    <Logo
                        width={150}
                        height={150}
                    />
                    <h1 className='text-accent text-base sm:text-xl font-bold text-center'>
                        Digital College Election Management System
                    </h1>
                </div>
                <div className='w-11/12 md:w-9/12 lg:w-7/12 xl:w-5/12 2xl:w-4/12 bg-card-light dark:bg-card-dark rounded-xl shadow-lg flex flex-col items-center gap-10 px-10 py-11'>
                    <Title
                        title='Forgot Password'
                        className='text-2xl '
                    />
                    <FormProvider {...methods}>
                        <form className='flex flex-col gap-6 w-full text-sm'>
                            {!showChangePassword ? (
                                <>
                                    <ForgotPasswordFormEmailOrPassFIeld
                                        handleNext={handleNext}
                                    />
                                    {showOtpField && (
                                        <div className='flex flex-col gap-2'>
                                            <label
                                                htmlFor='eop'
                                                className='text-primary-light dark:text-primary-dark'
                                            >
                                                Enter the OTP
                                            </label>
                                            <OTPInput />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <ChangePassword />
                            )}
                            <div className='pt-2'>
                                <Button
                                    text={
                                        !showChangePassword ? "Next" : "Submit"
                                    }
                                    className='w-full h-11 text-sm bg-accent hover:bg-button-hover'
                                    onClick={handleNext}
                                    disabled={
                                        showOtpField && otpField?.length !== 6
                                    }
                                />
                            </div>
                            <div className='flex items-center justify-between text-link'>
                                <Link
                                    to='/signup'
                                    className='hover:text-link-hover'
                                >
                                    Don't have an account?
                                    <br />
                                    Sign Up
                                </Link>
                                <Link
                                    to='/login'
                                    className='hover:text-link-hover text-right'
                                >
                                    Already have an account?
                                    <br />
                                    Login
                                </Link>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
            {isLoading && <FullScreenLoader />}
        </>
    )
}

export default ForgotPassword
