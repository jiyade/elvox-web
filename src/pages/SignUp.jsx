import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Logo from "../components/Logo"
import Title from "../components/Title"
import FullScreenLoader from "../components/FullScreenLoader"
import SignUpForm from "../components/SignUpForm"
import SignUpSelectRole from "../components/SignUpSelectRole"
import SignUpEnterPassword from "../components/SignUpEnterPassword"
import SignUpEnterOTP from "../components/SignUpEnterOTP"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores"

const SignUp = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [contactInfo, setContactInfo] = useState("")

    const { isAuthenticated } = useAuthStore()
    const methods = useForm({
        defaultValues: {
            role: ""
        }
    })
    const navigate = useNavigate()
    const widths = {
        1: "w-1/3",
        2: "w-2/3",
        3: "w-full"
    }

    useEffect(() => {
        if (isAuthenticated) navigate("/")
    }, [isAuthenticated, navigate])

    return (
        <>
            <div className='flex flex-col justify-center gap-10 items-center min-h-dvh w-full relative bg-bg-light dark:bg-bg-dark py-10'>
                <title>Sign Up</title>
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
                    <div className='flex flex-col items-center gap-2 w-full'>
                        <p className='text-xs text-secondary-light dark:text-secondary-dark font-sansation'>
                            Step {step} of 3
                        </p>
                        <div className='w-full h-2 rounded-xl bg-field-light dark:bg-field-dark '>
                            <p
                                className={`${widths[step]} bg-accent h-full rounded-xl transition-all duration-300 ease-in-out`}
                            ></p>
                        </div>
                    </div>
                    <Title
                        title='Sign Up'
                        className='text-3xl '
                    />
                    <FormProvider {...methods}>
                        <SignUpForm setIsLoading={setIsLoading}>
                            <>
                                {step === 1 && (
                                    <SignUpSelectRole
                                        setStep={setStep}
                                        setIsLoading={setIsLoading}
                                    />
                                )}
                                {step === 2 && (
                                    <SignUpEnterPassword
                                        setStep={setStep}
                                        setIsLoading={setIsLoading}
                                        setContactInfo={setContactInfo}
                                    />
                                )}
                                {step === 3 && (
                                    <SignUpEnterOTP
                                        setStep={setStep}
                                        contactInfo={contactInfo}
                                    />
                                )}
                            </>
                        </SignUpForm>
                    </FormProvider>
                </div>
            </div>
            {isLoading && <FullScreenLoader />}
        </>
    )
}

export default SignUp
