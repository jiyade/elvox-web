import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions
} from "@headlessui/react"
import { HiCheck, HiChevronDown } from "react-icons/hi"

const SortCandidates = ({ sort, setSort }) => {
    return (
        <Listbox
            value={sort}
            onChange={setSort}
        >
            <ListboxButton className='flex items-center justify-between gap-2 cursor-pointer w-full bg-field-light dark:bg-field-dark rounded-xl p-2 flex-1 focus:outline-none text-primary-light dark:text-primary-dark'>
                <span className='text-sm'>Sort</span>
                <HiChevronDown className='size-5' />
            </ListboxButton>
            <ListboxOptions className='flex flex-col border border-gray-500 rounded-xl focus:outline-none text-sm absolute w-full top-12 z-10 bg-bg-light dark:bg-bg-dark'>
                <ListboxOption
                    value='name'
                    className='group grid grid-cols-[auto_1fr] items-center gap-2 px-3 py-2 cursor-pointer rounded-sm text-primary-light dark:text-primary-dark hover:text-primary-dark hover:bg-accent [word-break:break-word]'
                >
                    <span>Name</span>
                    <HiCheck className='invisible size-4 group-data-selected:visible justify-self-end' />
                </ListboxOption>
                <ListboxOption
                    value='latest'
                    className='group grid grid-cols-[auto_1fr] items-center gap-2 px-3 py-2 cursor-pointer rounded-sm text-primary-light dark:text-primary-dark hover:text-primary-dark hover:bg-accent [word-break:break-word]'
                >
                    <span>Latest</span>
                    <HiCheck className='invisible size-4 group-data-selected:visible justify-self-end' />
                </ListboxOption>
            </ListboxOptions>
        </Listbox>
    )
}

export default SortCandidates
