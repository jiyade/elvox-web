import Button from "./Button"
import { FaPlus, FaMinus } from "react-icons/fa6"

const yearsMap = {
    1: "First Year",
    2: "Second Year",
    3: "Third Year",
    4: "Fourth Year"
}

const EditReservedClassListItem = ({
    data,
    action,
    handleAction,
    showButton
}) => {
    return (
        <div className='flex items-center justify-between gap-3 text-primary-light dark:text-primary-dark hover:bg-[#d4d4d4] dark:hover:bg-[#16171d] px-3 py-2 cursor-default'>
            <div className='flex gap-3'>
                <div className='flex flex-col justify-center gap-1'>
                    <p className='text-sm md:text-base text-primary-light dark:text-primary-dark'>
                        {data?.name}
                    </p>
                    <p className='text-xs text-primary-light dark:text-primary-dark'>
                        {yearsMap[data?.year]}
                    </p>
                </div>
            </div>
            {showButton && (
                <div className='flex items-center'>
                    <Button
                        className='text-sm text-primary-light dark:text-primary-dark py-1 px-2 hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark'
                        onClick={() => handleAction(action, data?.id)}
                    >
                        {action === "add" ? <FaPlus /> : <FaMinus />}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default EditReservedClassListItem
