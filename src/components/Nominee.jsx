import { useState } from "react"
import { MdDelete } from "react-icons/md"
import Button from "./Button"
import { useAuthStore } from "../stores"
import ImageInput from "./ImageInput"
import toast from "react-hot-toast"
import api from "../api/api"
import { useFormContext } from "react-hook-form"

const Nominee = ({ number, setIsLoading }) => {
    const [nomineeInfo, setNomineeInfo] = useState(null)
    const { user } = useAuthStore()
    const { getValues, register, watch, setValue } = useFormContext()

    const admno = watch(`nominee${number}.admno`)

    const fetchData = async () => {
        if (!admno) return

        const otherNomineeAdmno = getValues(
            `nominee${Number(number) === 1 ? 2 : 1}.admno`
        )

        if (admno === otherNomineeAdmno) {
            toast.error("Nominees cannot be the same person", {
                id: "nominee-same-person"
            })
            setValue(`nominee${number}.admno`, "")
            return
        }

        if (admno === user.admno) {
            toast.error("You cannot select yourself as a nominee", {
                id: "nominee-self"
            })
            setValue(`nominee${number}.admno`, "")
            return
        }

        try {
            setIsLoading(true)
            const res = await api.get(`/students/${admno}`)
            if (
                res.data.dept !== user.dept ||
                res.data.class !== user.class ||
                res.data.sem !== user.sem ||
                res.data.batch !== user.batch
            ) {
                toast.error("Nominee must be from the same class", {
                    id: "nominee-different-class"
                })
                setValue(`nominee${number}.admno`, "")
                return
            }
            setValue(`nominee${number}.data`, res.data)
            setNomineeInfo(res.data)
        } catch (err) {
            if (err.response)
                toast.error(err.response?.data?.error, {
                    id: "nominee-fetch-error"
                })
            setValue(`nominee${number}.admno`, "")
        } finally {
            setIsLoading(false)
        }
    }

    const deleteNominee = () => {
        setNomineeInfo(null)
        setValue(`nominee${number}.data`, null)
        setValue(`nominee${number}.admno`, "")
    }

    return (
        <div className='flex flex-col gap-2'>
            {!nomineeInfo && (
                <div className='flex flex-col gap-2'>
                    <label
                        htmlFor={`admno${number}`}
                        className='text-secondary-light dark:text-secondary-dark'
                    >
                        Enter admission number:
                    </label>
                    <div className='flex w-full gap-2'>
                        <input
                            type='text'
                            id={`admno${number}`}
                            className='outline-none border-none bg-field-light dark:bg-field-dark rounded-md w-full h-11 p-3 text-primary-light dark:text-primary-dark placeholder:text-secondary-light dark:placeholder:text-secondary-dark active:bg-field-light dark:active:bg-field-dark  appearance-none'
                            placeholder='Enter admission number'
                            {...register(`nominee${number}.admno`, {
                                required: "Admission number is required"
                            })}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") fetchData()
                            }}
                        />
                        <Button
                            className='bg-accent hover:bg-button-hover text-xs py-2 px-4'
                            onClick={fetchData}
                            disabled={!admno}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            )}
            {nomineeInfo && (
                <div className='flex flex-col gap-3'>
                    <div className='flex max-sm:flex-col w-full gap-3'>
                        <div className='flex flex-col flex-1 gap-2'>
                            <p className='text-xs text-secondary-light dark:text-secondary-dark'>
                                Name
                            </p>

                            <p className='text-sm text-primary-light dark:text-primary-dark bg-field-light dark:bg-field-dark rounded-md w-full p-2'>
                                {nomineeInfo.name}
                            </p>
                        </div>
                        <div className='flex flex-col flex-1 sm:flex-[1.2] gap-2'>
                            <p className='text-xs text-secondary-light dark:text-secondary-dark'>
                                Phone
                            </p>
                            <div className='flex gap-2'>
                                <p className='text-sm text-primary-light dark:text-primary-dark bg-field-light dark:bg-field-dark rounded-md w-full p-2 font-mono'>
                                    +91 {nomineeInfo.phone}
                                </p>
                                <Button
                                    className='bg-secondary-button-light dark:bg-secondary-button-dark hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark px-3 max-sm:hidden'
                                    onClick={deleteNominee}
                                >
                                    <MdDelete className='size-4' />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-xs text-secondary-light dark:text-secondary-dark'>
                            Student ID Proof
                        </p>
                        <ImageInput
                            name={`nominee${number}.proof`}
                            label='Nominee ID proof'
                        />
                    </div>
                    <div className='flex justify-center items-center w-full sm:hidden'>
                        <Button
                            className='bg-secondary-button-light dark:bg-secondary-button-dark hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark w-full flex justify-center items-center p-3'
                            onClick={deleteNominee}
                        >
                            <MdDelete className='size-5' />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Nominee
