import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions
} from "@headlessui/react"
import { HiCheck, HiChevronDown } from "react-icons/hi"
import capitalize from "../utils/capitalize"

const SortByTime = ({ sort, setSort, className }) => {
    return (
        <div
            className={`flex flex-col relative flex-1 w-full transition-all duration-200 ease-out ${className}`}
        >
            <Listbox
                value={sort}
                onChange={setSort}
            >
                <ListboxButton className='flex items-center justify-between gap-2 cursor-pointer w-full p-2 flex-1 focus:outline-none text-primary-light dark:text-primary-dark bg-field-light dark:bg-field-dark rounded-md'>
                    <span className='text-sm'>{capitalize(sort)}</span>
                    <HiChevronDown className='size-5' />
                </ListboxButton>
                <ListboxOptions className='flex flex-col border border-gray-500 focus:outline-none text-sm absolute w-full top-10 left-0 z-10 bg-bg-light dark:bg-bg-dark rounded-md'>
                    <ListboxOption
                        value='latest'
                        className='group flex justify-between items-center gap-2 px-3 py-2 cursor-pointer text-primary-light dark:text-primary-dark hover:text-primary-dark hover:bg-accent truncate rounded-sm'
                    >
                        <span>Latest</span>
                        <HiCheck className='invisible size-4 group-data-selected:visible' />
                    </ListboxOption>
                    <ListboxOption
                        value='oldest'
                        className='group flex justify-between items-center gap-2 px-3 py-2 cursor-pointer text-primary-light dark:text-primary-dark hover:text-primary-dark hover:bg-accent truncate rounded-sm'
                    >
                        <span>Oldest</span>
                        <HiCheck className='invisible size-4 group-data-selected:visible' />
                    </ListboxOption>
                </ListboxOptions>
            </Listbox>
        </div>
    )
}

export default SortByTime
