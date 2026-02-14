import { HiChevronRight } from "react-icons/hi"
import capitalize from "../utils/capitalize"
import generateInitialAvatar from "../utils/generateInitialAvatar"

const getYear = (sem) => {
    const y = Math.ceil(sem / 2)
    return ["First", "Second", "Third", "Fourth"][y - 1] + " year"
}

const readableDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
}

const ApproveApplicationCollapsed = ({
    candidate,
    expand,
    expanded,
    index
}) => {
    return (
        <div className='flex items-center justify-between flex-1'>
            <div className='flex gap-3 max-sm:flex-1'>
                <div className='flex items-center'>
                    <img
                        src={
                            candidate?.profile_pic ??
                            generateInitialAvatar(candidate?.name)
                        }
                        alt={candidate?.name}
                        className='w-12 md:w-16 rounded-full p-1'
                    />
                </div>
                <div className='flex flex-col justify-center gap-1 max-sm:flex-1'>
                    <div className='flex items-center max-sm:justify-between gap-2'>
                        <p className='text-sm md:text-base text-primary-light dark:text-primary-dark text-center'>
                            {candidate?.name}
                        </p>
                        <span className='bg-yellow-400/40 dark:bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 ring-1 ring-yellow-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium sm:hidden'>
                            {capitalize(candidate?.status)}
                        </span>
                    </div>
                    <div className='flex max-sm:flex-col gap-0.5 sm:items-center sm:gap-2'>
                        <p className='text-xs'>
                            {candidate?.class}
                            <span className='max-sm:hidden'>,</span>
                        </p>
                        <p className='text-xs'>
                            {getYear(candidate?.semester)}
                        </p>
                    </div>
                    <div className='sm:flex grid grid-cols-2'>
                        <p className='text-secondary-light dark:text-secondary-dark text-xs sm:text-center flex sm:gap-0.5 max-sm:flex-col'>
                            <span>Submitted on:</span>
                            <span>{readableDate(candidate.created_at)}</span>
                        </p>
                        <button
                            className='p-0 m-0 bg-transparent border-0 text-inherit font-inherit focus:outline-none cursor-pointer justify-self-end sm:hidden'
                            onClick={expand}
                        >
                            <HiChevronRight
                                className={`size-6 text-primary-light dark:text-primary-dark transition-transform duration-300 ${
                                    expanded === index ? "rotate-90" : ""
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex max-sm:flex-col items-end sm:items-center gap-3 max-sm:hidden'>
                <span className='bg-yellow-400/40 dark:bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 ring-1 ring-yellow-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium'>
                    {capitalize(candidate?.status)}
                </span>
                <button
                    className='p-0 m-0 bg-transparent border-0
    text-inherit font-inherit
    focus:outline-none cursor-pointer'
                    onClick={expand}
                >
                    <HiChevronRight
                        className={`size-6.5 text-primary-light dark:text-primary-dark transition-transform duration-300 ${
                            expanded === index ? "rotate-90" : ""
                        }`}
                    />
                </button>
            </div>
        </div>
    )
}

export default ApproveApplicationCollapsed
