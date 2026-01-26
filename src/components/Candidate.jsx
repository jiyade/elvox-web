import capitalize from "../utils/capitalize"

const statusStyles = {
    pending:
        "bg-yellow-400/40 dark:bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 ring-1 ring-yellow-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium",
    approved:
        "bg-green-400/30 dark:bg-green-400/20 text-green-500 dark:text-green-400 ring-1 ring-green-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium",
    rejected:
        "bg-red-400/40 dark:bg-red-400/20 text-red-600 dark:text-red-400 ring-1 ring-red-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium",
    withdrawn:
        "bg-slate-400/30 dark:bg-slate-400/20 text-slate-600 dark:text-slate-400 ring-1 ring-slate-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium"
}

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

const Candidate = ({ candidate }) => {
    return (
        <div className='flex items-center justify-between gap-3 dark:bg-[#16171d] bg-bg-light text-primary-light dark:text-primary-dark rounded-md px-3 py-2'>
            <div className='flex gap-3 max-sm:flex-1'>
                <div className='flex items-center'>
                    <img
                        src={candidate?.profile_pic}
                        alt={candidate?.name}
                        className='w-12 md:w-16 rounded-full p-1'
                    />
                </div>
                <div className='flex flex-col justify-center gap-1 max-sm:flex-1'>
                    <div className='flex items-center max-sm:justify-between gap-2'>
                        <p className='text-sm md:text-base text-primary-light dark:text-primary-dark text-center'>
                            {candidate?.name}
                        </p>
                        <span
                            className={`${
                                statusStyles[candidate?.status]
                            } sm:hidden`}
                        >
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
                    <div className='flex items-center'>
                        <p className='text-xs'>
                            {capitalize(candidate.category)}
                        </p>
                    </div>
                    <div className='grid grid-cols-2 sm:flex'>
                        <p className='text-secondary-light dark:text-secondary-dark text-xs sm:text-center sm:gap-1 flex max-sm:flex-col'>
                            <span>
                                {candidate?.status === "approved"
                                    ? "Approved"
                                    : candidate?.status === "rejected"
                                      ? "Rejected"
                                      : candidate?.status === "withdrawn"
                                        ? "Withdrew"
                                        : "Submitted"}{" "}
                                on:
                            </span>
                            <span>
                                {readableDate(
                                    candidate?.status === "pending"
                                        ? candidate.created_at
                                        : candidate.updated_at
                                )}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className='flex items-center gap-2 max-sm:hidden'>
                <span className={statusStyles[candidate?.status]}>
                    {capitalize(candidate?.status)}
                </span>
            </div>
        </div>
    )
}

export default Candidate
