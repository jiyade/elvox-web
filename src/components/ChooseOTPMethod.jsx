import { useFormContext } from "react-hook-form"
import { HiOutlineEnvelope, HiOutlinePhone } from "react-icons/hi2"

const ChooseOTPMethod = () => {
    const {
        register,
        watch,
        formState: { errors }
    } = useFormContext()
    const method = watch("otpMethod")

    return (
        <div className='flex flex-col w-full gap-2 pb-5'>
            <p
                htmlFor='otpMethod'
                className='text-base text-primary-light dark:text-primary-dark'
            >
                Choose where to receive OTP
            </p>
            <div className='flex w-full gap-3 justify-center'>
                <label
                    className={`flex flex-col items-center gap-1 w-1/2 py-7 rounded-md cursor-pointer active:scale-95 fo transition-all duration-200 ${
                        method === "email"
                            ? "bg-accent hover:bg-button-hover text-primary-dark"
                            : "bg-field-light dark:bg-field-dark  hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark text-primary-light dark:text-primary-dark"
                    }`}
                >
                    <input
                        type='radio'
                        value='email'
                        className='hidden'
                        {...register("otpMethod", {
                            required: "Select a method"
                        })}
                    />
                    <HiOutlineEnvelope className='size-6' />
                    <p>Email</p>
                </label>
                <label
                    className={`flex flex-col items-center gap-1 w-1/2 py-7 rounded-md cursor-pointer active:scale-95 transition-all duration-200 ${
                        method === "phone"
                            ? "bg-accent hover:bg-button-hover text-primary-dark"
                            : "bg-field-light dark:bg-field-dark  hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark text-primary-light dark:text-primary-dark"
                    }`}
                >
                    <input
                        type='radio'
                        value='phone'
                        className='hidden'
                        {...register("otpMethod", {
                            required: "Select a method"
                        })}
                    />
                    <HiOutlinePhone className='size-6' />
                    <p>Phone</p>
                </label>
            </div>
            {errors.otpMethod && (
                <p className='text-xs text-red-500 mt-1 font-medium'>
                    {errors.otpMethod.message}
                </p>
            )}
        </div>
    )
}

export default ChooseOTPMethod
