import generateInitialAvatar from "../utils/generateInitialAvatar"

const Supervisor = ({ supervisor }) => {
    return (
        <div className='flex items-center justify-between gap-3 dark:bg-[#16171d] bg-bg-light text-primary-light dark:text-primary-dark rounded-md px-3 py-2'>
            <div className='flex gap-3'>
                <div className='flex items-center'>
                    <img
                        src={
                            supervisor?.profile_pic ??
                            generateInitialAvatar(supervisor?.name)
                        }
                        alt={supervisor?.name}
                        className='w-12 md:w-16 rounded-full p-1'
                    />
                </div>
                <div className='flex flex-col justify-center gap-1'>
                    <p className='text-sm md:text-base text-primary-light dark:text-primary-dark'>
                        {supervisor?.name}
                    </p>
                    <p className='text-xs text-secondary-light dark:text-secondary-dark'>
                        {supervisor?.department}
                    </p>
                    <p className='text-xs text-secondary-light dark:text-secondary-dark'>
                        Employee code: {supervisor?.empcode}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Supervisor
