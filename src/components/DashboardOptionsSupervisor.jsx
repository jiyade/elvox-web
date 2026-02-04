import Button from "./Button"
import { TbUserCheck } from "react-icons/tb"
import { FaRegFileAlt } from "react-icons/fa"
import { FiAward } from "react-icons/fi"
import { LuScroll, LuUsers } from "react-icons/lu"
import { RiListOrdered2 } from "react-icons/ri"
import { Link } from "react-router-dom"
import { useAuthStore, useElectionStore } from "../stores"

const DashboardOptionsSupervisor = ({ hasTie }) => {
    const {
        user: { tutor_of }
    } = useAuthStore()

    const { election } = useElectionStore()

    return (
        <div
            className={`grid ${
                tutor_of === null ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"
            } gap-x-3 gap-y-4 lg:gap-y-3 w-full`}
        >
            {election?.status === "post-voting" && hasTie && (
                <Link to='/tie-break'>
                    <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                        <RiListOrdered2 className='text-primary-dark text-base lg:text-lg' />
                        <span className=''>Tie Breaker</span>
                    </Button>
                </Link>
            )}
            <Link to='/verify-voter'>
                <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                    <TbUserCheck className='text-primary-dark text-base lg:text-lg' />
                    <span className=''>Verify Voter</span>
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
            <Link to='/candidates'>
                <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                    <LuUsers className='text-primary-dark text-base lg:text-lg' />
                    <span className=''>View Candidates</span>
                </Button>
            </Link>
            <Link
                to='/results'
                className={`${tutor_of !== null && !hasTie ? "lg:hidden" : ""}`}
            >
                <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                    <FiAward className='text-primary-dark text-base lg:text-lg' />
                    <span className=''>View Results</span>
                </Button>
            </Link>
            <Link
                to='/appeals'
                className={`${
                    tutor_of !== null && !hasTie
                        ? "max-lg:col-span-2 lg:hidden"
                        : ""
                }`}
            >
                <Button className='flex flex-col justify-center items-center py-5 lg:py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                    <LuScroll className='text-primary-dark text-base lg:text-lg' />
                    <span className=''>Submit Appeal</span>
                </Button>
            </Link>
            {tutor_of !== null && !hasTie && (
                <div className='max-lg:hidden grid grid-cols-2 col-span-3 gap-x-3'>
                    <Link
                        to='/results'
                        className=''
                    >
                        <Button className='flex flex-col justify-center items-center py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                            <FiAward className='text-primary-dark text-lg' />
                            <span className=''>View Results</span>
                        </Button>
                    </Link>
                    <Link
                        to='/appeals'
                        className=''
                    >
                        <Button className='flex flex-col justify-center items-center py-7 gap-1 bg-accent hover:bg-button-hover w-full h-full'>
                            <LuScroll className='text-primary-dark text-lg' />
                            <span className=''>Submit Appeal</span>
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default DashboardOptionsSupervisor
