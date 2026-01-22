import { IoSearch } from "react-icons/io5"
import { useMediaQuery } from "react-responsive"
import SortCandidates from "./SortCandidates"
import FilterCandidatesByClass from "./FilterCandidatesByClass"
import FilterMenu from "./FilterMenu"
import { useAuthStore } from "../stores"

const ViewCandidatesHeader = ({
    nameInput,
    setNameInput,
    sort,
    setSort,
    className, // not jsx className, but name of the class
    setClassName,
    year,
    setYear,
    status,
    setStatus
}) => {
    const isNotMobile = useMediaQuery({ minWidth: 640 })

    const {
        user: { role }
    } = useAuthStore()

    return (
        <div className='flex flex-col w-full gap-3'>
            <div className='flex gap-3'>
                <div className='w-full flex-3 relative sm:flex-4 md:flex-5 lg:flex-7'>
                    <span className='flex justify-center items-center text-secondary-light dark:text-secondary-dark p-2 inset-y-0 absolute'>
                        <IoSearch />
                    </span>
                    <input
                        type='text'
                        id='candidate-name'
                        className='outline-none border-none bg-field-light dark:bg-field-dark rounded-md w-full h-11 pl-8 p-3 text-primary-light dark:text-primary-dark placeholder:text-secondary-light dark:placeholder:text-secondary-dark active:bg-field-light dark:active:bg-field-dark appearance-none'
                        placeholder='Enter candidate name'
                        onChange={(e) => setNameInput(e.target.value)}
                        value={nameInput}
                    />
                </div>
                <div className='flex flex-col w-full flex-1 relative'>
                    <SortCandidates
                        sort={sort}
                        setSort={setSort}
                    />
                </div>
            </div>
            <div className='flex flex-1 gap-3 w-full'>
                <div className={`flex flex-col w-full relative flex-1`}>
                    <FilterMenu
                        options={[
                            { value: "all", label: "All" },
                            { value: "first", label: "First Year" },
                            { value: "second", label: "Second Year" },
                            { value: "third", label: "Third Year" },
                            { value: "fourth", label: "Fourth Year" }
                        ]}
                        filter={year}
                        setFilter={setYear}
                        label={year === "all" || !isNotMobile ? "Year" : ""}
                        showSelected={isNotMobile}
                    />
                </div>
                <div className={`flex flex-col w-full relative flex-1`}>
                    <FilterCandidatesByClass
                        className={className}
                        setClassName={setClassName}
                        showSelected={isNotMobile}
                        showLabel={className === "all" || !isNotMobile}
                    />
                </div>
                {role === "admin" && (
                    <div className={`flex flex-col w-full relative flex-1`}>
                        <FilterMenu
                            options={[
                                { value: "all", label: "All" },
                                { value: "approved", label: "Approved" },
                                { value: "rejected", label: "Rejected" },
                                { value: "pending", label: "Pending" },
                                { value: "withdrawn", label: "Withdrawn" }
                            ]}
                            filter={status}
                            setFilter={setStatus}
                            label={
                                status === "all" || !isNotMobile ? "Status" : ""
                            }
                            showSelected={isNotMobile}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewCandidatesHeader
