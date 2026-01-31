import { useFormContext } from "react-hook-form"

const SubmitAppealFormReadOnly = ({ role }) => {
    const { register } = useFormContext()
    return (
        <div className='flex max-sm:flex-col gap-3'>
            <div className='flex flex-col flex-1 gap-2'>
                <p>Name</p>
                <input
                    type='text'
                    id='name'
                    className='outline-none border-none bg-field-light dark:bg-field-dark  rounded-md w-full h-10 p-3 text-primary-light dark:text-primary-dark active:bg-field-light dark:active:bg-field-dark'
                    readOnly
                    {...register("name")}
                />
            </div>
            <div className='flex flex-col flex-1 gap-2'>
                <p>
                    {role === "student" ? "Admission Number" : "Employee Code"}
                </p>
                <input
                    type='text'
                    id='identifier'
                    className='outline-none border-none bg-field-light dark:bg-field-dark  rounded-md w-full h-10 p-3 text-primary-light dark:text-primary-dark active:bg-field-light dark:active:bg-field-dark'
                    readOnly
                    {...register("identifier")}
                />
            </div>
        </div>
    )
}

export default SubmitAppealFormReadOnly
