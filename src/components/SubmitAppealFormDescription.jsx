import React from "react"
import { useFormContext } from "react-hook-form"

const SubmitAppealFormDescription = () => {
    const {
        register,
        watch,
        formState: { errors }
    } = useFormContext()

    const description = watch("description", "")

    return (
        <div className='flex flex-col gap-2'>
            <p>
                Appeal Description <span className='text-red-500'>*</span>
            </p>
            <div className='space-y-1'>
                <textarea
                    id='description'
                    rows={6}
                    className='outline-none border-none bg-field-light dark:bg-field-dark
             rounded-md w-full px-3 py-2
             text-primary-light dark:text-primary-dark
             placeholder:text-secondary-light dark:placeholder:text-secondary-dark
             resize-none custom-scrollbar'
                    placeholder='Clearly explain the issue, what happened, and what outcome you expect'
                    maxLength={1000}
                    {...register("description", {
                        required: "Appeal description is required",
                        minLength: {
                            value: 20,
                            message: "Description is too short"
                        },
                        maxLength: {
                            value: 1000,
                            message: "Max 1000 characters"
                        }
                    })}
                />

                <div className='flex relative'>
                    {description?.length > 0 && (
                        <p className='absolute right-0 text-xs text-secondary-light dark:text-secondary-dark'>
                            {description.length}/1000
                        </p>
                    )}
                </div>
            </div>
            {errors?.description && (
                <p className='text-xs text-red-500 mt-1 font-medium'>
                    {errors?.description?.message}
                </p>
            )}
        </div>
    )
}

export default SubmitAppealFormDescription
