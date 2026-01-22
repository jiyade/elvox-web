import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions
} from "@headlessui/react"
import { HiCheck, HiChevronDown } from "react-icons/hi"
import { useElectionStore } from "../stores"
import { Controller, useFormContext } from "react-hook-form"

const SelectElection = () => {
    const { control } = useFormContext()

    const { election } = useElectionStore()

    return (
        <Controller
            name='election_id'
            control={control}
            rules={{ required: "Election is required" }}
            render={({ field }) => (
                <Listbox
                    value={field.value}
                    onChange={field.onChange}
                    name={field.name}
                >
                    <ListboxButton
                        id='election_id'
                        className='flex items-center justify-between gap-2 cursor-pointer w-full bg-field-light dark:bg-field-dark rounded-md p-2'
                    >
                        <span>
                            {election.id === field.value
                                ? election.name
                                : "Select Election"}
                        </span>
                        <HiChevronDown className='size-5' />
                    </ListboxButton>
                    <ListboxOptions className='flex flex-col border border-gray-500 rounded-md w-full'>
                        <ListboxOption
                            value={election.id}
                            className='group grid grid-cols-[auto_1fr] items-center gap-2 px-3 py-2 cursor-pointer rounded-sm text-primary-light dark:text-primary-dark hover:text-primary-dark hover:bg-accent [word-break:break-word]'
                        >
                            <span>{election.name}</span>
                            <HiCheck className='invisible size-4 group-data-selected:visible justify-self-end' />
                        </ListboxOption>
                    </ListboxOptions>
                </Listbox>
            )}
        />
    )
}

export default SelectElection
