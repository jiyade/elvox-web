import Button from "./Button"
import { IoSettingsOutline } from "react-icons/io5"
import { FaRegFileAlt } from "react-icons/fa"
import { FiAward } from "react-icons/fi"
import { LuScroll, LuUsers, LuClipboardList } from "react-icons/lu"
import { RiListOrdered2 } from "react-icons/ri"
import { Link } from "react-router-dom"
import { useAuthStore, useElectionStore } from "../stores"

const DashboardOptionsAdmin = ({ hasTie }) => {
    const {
        user: { tutor_of }
    } = useAuthStore()

    const { election } = useElectionStore()

    return (
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-4 lg:gap-y-3 w-full'>
            {election?.status === "post-voting" && hasTie && (
                <Link to='/tie-break'>
                    <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                        <RiListOrdered2 className='text-primary-dark text-base lg:text-lg' />
                        <span className=''>Tie Breaker</span>
                    </Button>
                </Link>
            )}
            <Link to='/manage-election'>
                <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                    <IoSettingsOutline className='text-primary-dark text-base lg:text-lg' />
                    <span className=''>Manage Election</span>
                </Button>
            </Link>
            <Link to='/choose-supervisors'>
                <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                    <LuUsers className='text-primary-dark text-base lg:text-lg' />
                    <span className=''>Choose Supervisors</span>
                </Button>
            </Link>
            {tutor_of !== null && (
                <Link to='/approve-applications'>
                    <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                        <FaRegFileAlt className='text-primary-dark text-base lg:text-lg' />
                        <span className=''>Approve Applications</span>
                    </Button>
                </Link>
            )}
            <div
                className={
                    tutor_of !== null && !hasTie
                        ? "lg:grid lg:grid-cols-2 lg:col-span-3 lg:gap-x-3 lg:w-full contents"
                        : "contents"
                }
            >
                <Link to='/candidates'>
                    <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                        <LuUsers className='text-primary-dark text-base lg:text-lg' />
                        <span className=''>View Candidates</span>
                    </Button>
                </Link>
                <Link to='/results'>
                    <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                        <FiAward className='text-primary-dark text-base lg:text-lg' />
                        <span className=''>View Results</span>
                    </Button>
                </Link>
            </div>
            <div
                className={
                    tutor_of !== null
                        ? "lg:grid lg:grid-cols-2 lg:col-span-3 lg:gap-x-3 lg:w-full contents"
                        : "contents"
                }
            >
                <Link to='/appeals'>
                    <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                        <LuScroll className='text-primary-dark text-base lg:text-lg' />
                        <span className=''>View Appeals</span>
                    </Button>
                </Link>
                <Link
                    to='/logs'
                    className={
                        tutor_of !== null && !hasTie ? "max-lg:col-span-2" : ""
                    }
                >
                    <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                        <LuClipboardList className='text-primary-dark text-base lg:text-lg' />
                        <span className=''>Audit Logs</span>
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default DashboardOptionsAdmin
