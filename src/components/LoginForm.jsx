import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import Button from "./Button"
import api from "../api/api"
import Input from "./Input"
import { useAuthStore } from "../stores"
import toast from "react-hot-toast"
import validateEmailOrPhone from "../utils/validateEmailOrPhone"
import { notifyMobileLogin } from "../utils/mobileBridge"

const LoginForm = ({ setIsLoading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const navigate = useNavigate()

    const { login } = useAuthStore()

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            const res = await api.post("/auth/login", data)
            const { user } = await res.data
            if (user) {
                login(user)
                notifyMobileLogin(user.id)
                navigate("/")
                toast.success(`Welcome back ${user.name}`, {
                    id: "login-success"
                })
            }
        } catch (err) {
            if (err.response)
                toast.error(err.response?.data?.error, {
                    id: "login-error"
                })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6 w-full text-sm'
            id='login-form'
        >
            <div className='flex flex-col gap-2'>
                <label
                    htmlFor='eop'
                    className='text-primary-light dark:text-primary-dark'
                >
                    Email or Phone
                </label>
                <Input
                    type='text'
                    id='eop'
                    placeholder='Enter your email or phone'
                    register={register}
                    errors={errors}
                    rules={validateEmailOrPhone}
                />
                {errors.eop && (
                    <p className='text-xs text-red-500 mt-1 font-medium'>
                        {errors.eop.message}
                    </p>
                )}
            </div>
            <div className='flex flex-col gap-2'>
                <label
                    htmlFor='password'
                    className='text-primary-light dark:text-primary-dark'
                >
                    Password
                </label>
                <Input
                    type='password'
                    id='password'
                    placeholder='Enter your password'
                    register={register}
                    errors={errors}
                    rules={{
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "At least 8 characters"
                        }
                    }}
                />

                {errors.password && (
                    <p className='text-xs text-red-500 mt-1 font-medium'>
                        {errors.password.message}
                    </p>
                )}
            </div>
            <div className='pt-2'>
                <Button
                    text='Login'
                    className='w-full h-11 text-sm bg-accent hover:bg-button-hover'
                    type='submit'
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
                    to='/forgot-password'
                    className='hover:text-link-hover'
                >
                    Forgot
                    <br />
                    password?
                </Link>
            </div>
        </form>
    )
}

export default LoginForm
