import Button from "./Button"
import { FaPlus, FaMinus } from "react-icons/fa6"

const EditSupervisorListItem = ({ data, action, handleAction }) => {
    return (
        <div className='flex items-center justify-between gap-3 text-primary-light dark:text-primary-dark hover:bg-[#d4d4d4] dark:hover:bg-[#16171d] px-3 py-2 cursor-default'>
            <div className='flex gap-3'>
                <div className='flex items-center'>
                    <img
                        src={data?.profile_pic}
                        alt={data?.name}
                        className='w-12 md:w-16 rounded-full p-1'
                    />
                </div>
                <div className='flex flex-col justify-center gap-1'>
                    <p className='text-sm md:text-base text-primary-light dark:text-primary-dark'>
                        {data?.name}
                    </p>
                    <p className='text-xs text-secondary-light dark:text-secondary-dark'>
                        {data?.department} ({data?.empcode})
                    </p>
                </div>
            </div>
            <div className='flex items-center'>
                <Button
                    className='text-sm text-primary-light dark:text-primary-dark py-1 px-2 hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark'
                    onClick={() => handleAction(action, data?.id)}
                >
                    {action === "add" ? <FaPlus /> : <FaMinus />}
                </Button>
            </div>
        </div>
    )
}

export default EditSupervisorListItem
