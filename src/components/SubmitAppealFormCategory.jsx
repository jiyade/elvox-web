import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions
} from "@headlessui/react"
import { HiCheck, HiChevronDown } from "react-icons/hi"
import { Controller, useFormContext } from "react-hook-form"

const APPEAL_CATEGORIES = [
    { value: "candidate_application", label: "Candidate Application" },
    { value: "election_result", label: "Election Result" },
    { value: "voting_issue", label: "Voting Issue" },
    { value: "account_access", label: "Account / Access" },
    { value: "other", label: "Other" }
]

const SubmitAppealFormCategory = () => {
    const {
        control,
        formState: { errors }
    } = useFormContext()

    return (
        <div className='flex flex-col flex-1 gap-2'>
            <p>
                Appeal Category <span className='text-red-500'>*</span>
            </p>
            <Controller
                name='category'
                control={control}
                rules={{ required: "Appeal category is required" }}
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
                                {APPEAL_CATEGORIES.find(
                                    (c) => c.value === field.value
                                )?.label ?? "Select Category"}
                            </span>
                            <HiChevronDown className='size-5' />
                        </ListboxButton>
                        <ListboxOptions className='flex flex-col border border-gray-500 rounded-md w-full'>
                            {APPEAL_CATEGORIES.map(({ value, label }) => (
                                <ListboxOption
                                    key={value}
                                    value={value}
                                    className='group flex justify-between items-center gap-2 px-3 py-2 cursor-pointer rounded-sm text-primary-light dark:text-primary-dark hover:text-primary-dark hover:bg-accent break-words'
                                >
                                    <span>{label}</span>
                                    <HiCheck className='invisible size-4 group-data-selected:visible' />
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                )}
            />
            {errors?.category && (
                <p className='text-xs text-red-500 mt-1 font-medium'>
                    {errors?.category?.message}
                </p>
            )}
        </div>
    )
}

export default SubmitAppealFormCategory
