import React from "react"
import { useFormContext } from "react-hook-form"

const SubmitAppealFormSubject = () => {
    const {
        register,
        watch,
        formState: { errors }
    } = useFormContext()

    const subject = watch("subject", "")

    return (
        <div className='flex flex-col gap-2'>
            <p>
                Subject <span className='text-red-500'>*</span>
            </p>
            <div className='space-y-1'>
                <input
                    type='text'
                    id='subject'
                    className='outline-none border-none bg-field-light dark:bg-field-dark
                 rounded-md w-full h-10 px-3
                 text-primary-light dark:text-primary-dark
                 placeholder:text-secondary-light dark:placeholder:text-secondary-dark'
                    placeholder='Short summary of your appeal'
                    maxLength={100}
                    {...register("subject", {
                        required: "Subject is required",
                        minLength: {
                            value: 5,
                            message: "Subject is too short"
                        },
                        maxLength: {
                            value: 100,
                            message: "Max 100 characters"
                        }
                    })}
                />
                <div className='flex relative'>
                    {subject?.length > 0 && (
                        <p className='absolute right-0 text-xs text-secondary-light dark:text-secondary-dark'>
                            {subject.length}/100
                        </p>
                    )}
                </div>
            </div>
            {errors?.subject && (
                <p className='text-xs text-red-500 mt-1 font-medium'>
                    {errors?.subject?.message}
                </p>
            )}
        </div>
    )
}

export default SubmitAppealFormSubject
