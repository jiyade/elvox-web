import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions
} from "@headlessui/react"
import { HiCheck, HiChevronDown } from "react-icons/hi"
import { useAuthStore, useElectionStore } from "../stores"
import { Controller, useFormContext } from "react-hook-form"
import capitalize from "../utils/capitalize"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "../api/api"

const SelectCategory = () => {
    const [isReservedClass, setIsReservedClass] = useState(false)

    const { control } = useFormContext()
    const { user } = useAuthStore()
    const { election } = useElectionStore()

    useEffect(() => {
        const fetchReservedClasses = async () => {
            try {
                const res = await api.get(
                    `/elections/${election?.id}/category-config`
                )

                setIsReservedClass(res.data.includes(Number(user.class_id)))
            } catch (err) {
                toast.error(err.response?.data?.error, {
                    id: "fetch-category-error"
                })
            }
        }

        fetchReservedClasses()
    }, [election?.id, user.class_id])

    return (
        <Controller
            name='category'
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
                <Listbox
                    value={field.value}
                    onChange={field.onChange}
                    name={field.name}
                >
                    <ListboxButton
                        id='category'
                        className='flex items-center justify-between gap-2 cursor-pointer w-full bg-field-light dark:bg-field-dark rounded-md p-2'
                    >
                        <span>
                            {capitalize(field.value) || "Select Category"}
                        </span>
                        <HiChevronDown className='size-5' />
                    </ListboxButton>
                    <ListboxOptions className='flex flex-col border border-gray-500 rounded-md w-full'>
                        <ListboxOption
                            value='general'
                            className='group grid grid-cols-[auto_1fr] items-center gap-2 px-3 py-2 cursor-pointer rounded-sm text-primary-light dark:text-primary-dark hover:text-primary-dark hover:bg-accent break-words'
                        >
                            <span>General</span>
                            <HiCheck className='invisible size-4 group-data-selected:visible' />
                        </ListboxOption>
                        {user?.gender === "female" && isReservedClass && (
                            <ListboxOption
                                value='reserved'
                                className='group grid grid-cols-[auto_1fr] items-center gap-2 px-3 py-2 cursor-pointer rounded-sm hover:bg-accent break-words'
                            >
                                <span>Reserved</span>
                                <HiCheck className='invisible size-4 group-data-selected:visible' />
                            </ListboxOption>
                        )}
                    </ListboxOptions>
                </Listbox>
            )}
        />
    )
}

export default SelectCategory
