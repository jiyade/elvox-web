import { useFormContext } from "react-hook-form"
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"
import Button from "./Button"
import Input from "./Input"
import { useState } from "react"
import ChooseOTPMethod from "./ChooseOTPMethod"
import api from "../api/api"
import toast from "react-hot-toast"

const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

const SignUpEnterPassword = ({ setIsLoading, setStep, setContactInfo }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        trigger,
        getValues,
        clearErrors,
        resetField,
        formState: { errors }
    } = useFormContext()

    const handleNext = async () => {
        const valid = await trigger([
            "password",
            "confirmPassword",
            "otpMethod"
        ])
        if (valid) {
            try {
                setIsLoading(true)
                const [otpMethod, role] = getValues(["otpMethod", "role"])
                const identifier =
                    role === "student"
                        ? getValues("admno")
                        : getValues("empcode")

                const res = await api.post("/auth/otp", {
                    otpMethod,
                    purpose: "signup",
                    role,
                    [role === "student" ? "admno" : "empcode"]: identifier
                })

                if (res.status === 200) {
                    toast.success(res.data.message, { id: "otp-send-success" })
                    setContactInfo(res.data.contact)
                }
                setStep((prev) => prev + 1)
            } catch (err) {
                if (err.response)
                    toast.error(err.response?.data?.error, {
                        id: "otp-send-error"
                    })
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handlePrev = () => {
        const fields = ["password", "confirmPassword", "otpMethod"]
        clearErrors(fields)
        fields.forEach((field) => resetField(field))
        setStep((prev) => prev - 1)
    }

    return (
        <div className='flex flex-col gap-6 w-full text-sm'>
            <div className='flex flex-col gap-2'>
                <label
                    htmlFor='password'
                    className='text-primary-light dark:text-primary-dark'
                >
                    Password
                </label>
                <div className='relative w-full'>
                    <Input
                        type={showPassword ? "text" : "password"}
                        id='password'
                        placeholder='Enter your password'
                        className='pr-10 select-none'
                        register={register}
                        errors={errors}
                        rules={{
                            required: "Password is required",
                            pattern: {
                                value: passwordRegex,
                                message:
                                    "Min 8 chars, at least 1 upper, 1 lower, 1 number, 1 special char"
                            }
                        }}
                    />
                    {showPassword ? (
                        <IoEyeOffOutline
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-primary-light dark:text-primary-dark cursor-pointer size-4'
                            onClick={() => setShowPassword(false)}
                        />
                    ) : (
                        <IoEyeOutline
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-primary-light dark:text-primary-dark cursor-pointer size-4'
                            onClick={() => setShowPassword(true)}
                        />
                    )}
                </div>
                {errors.password && (
                    <p className='text-xs text-red-500 mt-1 font-medium'>
                        {errors.password.message}
                    </p>
                )}
            </div>
            <div className='flex flex-col gap-2'>
                <label
                    htmlFor='confirmPassword'
                    className='text-primary-light dark:text-primary-dark'
                >
                    Confirm Password
                </label>
                <div className='relative w-full'>
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        id='confirmPassword'
                        placeholder='Confirm your password'
                        className='pr-10 select-none'
                        register={register}
                        errors={errors}
                        rules={{
                            required: "Confirm your password",
                            validate: (value) =>
                                value === getValues("password") ||
                                "Passwords do not match"
                        }}
                    />
                    {showConfirmPassword ? (
                        <IoEyeOffOutline
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-primary-light dark:text-primary-dark cursor-pointer size-4'
                            onClick={() => setShowConfirmPassword(false)}
                        />
                    ) : (
                        <IoEyeOutline
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-primary-light dark:text-primary-dark cursor-pointer size-4'
                            onClick={() => setShowConfirmPassword(true)}
                        />
                    )}
                </div>
                {errors.confirmPassword && (
                    <p className='text-xs text-red-500 mt-1 font-medium'>
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>
            <ChooseOTPMethod />
            <div className='flex justify-center gap-3 w-full'>
                <Button
                    text='Previous'
                    className='w-1/2 h-11 text-sm bg-secondary-button-light dark:bg-secondary-button-dark hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark'
                    type='button'
                    onClick={handlePrev}
                />
                <Button
                    text='Send OTP'
                    className='w-1/2 h-11 text-sm bg-accent hover:bg-button-hover'
                    type='button'
                    onClick={handleNext}
                />
            </div>
        </div>
    )
}

export default SignUpEnterPassword
