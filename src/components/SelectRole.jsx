import { Controller, useFormContext } from "react-hook-form"
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions
} from "@headlessui/react"
import capitalize from "../utils/capitalize"

import { HiCheck, HiChevronDown } from "react-icons/hi"

const SelectRole = () => {
    const {
        control,
        clearErrors,
        resetField,
        formState: { errors }
    } = useFormContext()

    const handleChange = (val, field) => {
        field.onChange(val)
        clearErrors(["role", "admno", "empcode"])
        if (val === "student") {
            resetField("admno")
            resetField("empcode", { defaultValue: "" })
        } else {
            resetField("empcode")
            resetField("admno", { defaultValue: "" })
        }
    }

    return (
        <div className='flex flex-col gap-2 relative'>
            <label
                htmlFor='role'
                className='text-primary-light dark:text-primary-dark'
            >
                Role
            </label>
            <Controller
                name='role'
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                    <Listbox
                        value={field.value}
                        onChange={(val) => handleChange(val, field)}
                    >
                        <ListboxButton
                            id='role'
                            className={`flex items-center justify-between w-full h-11 rounded-md px-3 text-sm outline-none bg-field-light dark:bg-field-dark  text-primary-light dark:text-primary-dark border-none focus:ring-2 focus:ring-accent cursor-pointer ${
                                errors.role ? "ring-2 ring-red-400" : ""
                            }`}
                        >
                            <span>
                                {!field.value
                                    ? "Select role"
                                    : capitalize(field.value)}
                            </span>
                            <HiChevronDown className='size-5' />
                        </ListboxButton>
                        <ListboxOptions className='rounded-md bg-field-light dark:bg-field-dark  text-primary-light dark:text-primary-dark shadow-md border overflow-hidden p-2 absolute w-full top-full'>
                            <ListboxOption
                                value='student'
                                className='cursor-pointer px-2 py-1 rounded grid grid-cols-[auto_1fr] items-center hover:bg-accent hover:text-primary-dark outline-none break-words'
                            >
                                <span>Student</span>
                                <HiCheck className='invisible size-4 group-data-selected:visible justify-self-end' />
                            </ListboxOption>
                            <ListboxOption
                                value='teacher'
                                className='cursor-pointer px-2 py-1 rounded grid grid-cols-[auto_1fr] items-center hover:bg-accent hover:text-primary-dark outline-none break-words'
                            >
                                <span>Teacher</span>
                                <HiCheck className='invisible size-4 group-data-selected:visible justify-self-end' />
                            </ListboxOption>
                        </ListboxOptions>
                    </Listbox>
                )}
            />
            {errors.role && (
                <p className='text-xs text-red-500 mt-1 font-medium'>
                    {errors.role.message}
                </p>
            )}
        </div>
    )
}

export default SelectRole
